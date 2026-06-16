const db = require("../config/db");

async function entrarEmRota(usuario_id, rota_id) {
    try {
        const existente = await db.query(
            "SELECT * FROM participacao WHERE usuario_id = $1 AND rota_id = $2",
            [usuario_id, rota_id]
        );

        if (existente.rows.length > 0) {
            throw new Error("Usuário já está participando desta rota");
        }

        const rota = await db.query(
            `SELECT 
                id, 
                vagas_maximas,
                (
                    SELECT COUNT(*) 
                    FROM confirmacao 
                    WHERE rota_id = $1 
                    AND status != 'CANCELADO'
                ) AS vagas_usadas
             FROM rota 
             WHERE id = $1`,
            [rota_id]
        );

        if (rota.rows.length === 0) {
            throw new Error("Rota não encontrada");
        }

        const { vagas_maximas, vagas_usadas } = rota.rows[0];

        if (parseInt(vagas_usadas) >= parseInt(vagas_maximas)) {
            throw new Error("Rota cheia, não há vagas disponíveis");
        }

     const resultado = await db.query(
    `INSERT INTO participacao
    (
        usuario_id,
        rota_id
    )
    VALUES ($1,$2)
    RETURNING *`,
    [usuario_id, rota_id]
);

        return resultado.rows[0];
    } catch (erro) {
        throw erro;
    }
}

async function confirmarPresenca(usuario_id, rota_id,status) {
    try {
        const participacao = await db.query(
            "SELECT id FROM participacao WHERE usuario_id = $1 AND rota_id = $2",
            [usuario_id, rota_id]
        );

        if (participacao.rows.length === 0) {
            throw new Error("Usuário não participa desta rota");
        }

        const rota = await db.query(
            `SELECT 
                vagas_maximas,
                (
                    SELECT COUNT(*)
                    FROM confirmacao
                    WHERE rota_id = $1
                    AND usuario_id <> $2
                    AND status != 'CANCELADO'
                ) AS vagas_usadas
             FROM rota
             WHERE id = $1`,
            [rota_id, usuario_id]
        );

        if (rota.rows.length === 0) {
            throw new Error("Rota não encontrada");
        }

        const { vagas_maximas, vagas_usadas } = rota.rows[0];

        if (String(status).toUpperCase() !== "CANCELADO" && parseInt(vagas_usadas) >= parseInt(vagas_maximas)) {
            throw new Error("Rota cheia, não há vagas disponíveis");
        }

        const resultado = await db.query(
            `INSERT INTO confirmacao (usuario_id, rota_id, status)
             VALUES ($1, $2, $3)
             ON CONFLICT (usuario_id, rota_id)
             DO UPDATE SET 
                status = EXCLUDED.status,
                data_confirmacao = NOW()
             RETURNING *`,
            [usuario_id, rota_id, status]
        );

        return resultado.rows[0];

    } catch (erro) {
        throw erro;
    }
}

async function cancelarPresenca(usuario_id, rota_id) {
    try {
        const resultado = await db.query(
            `UPDATE confirmacao 
             SET status = 'CANCELADO', data_confirmacao = NOW()
             WHERE usuario_id = $1 AND rota_id = $2
             RETURNING *`,
            [usuario_id, rota_id]
        );

        if (resultado.rows.length === 0) {
            throw new Error("Confirmação não encontrada");
        }

        return resultado.rows[0];
    } catch (erro) {
        throw erro;
    }
}

async function listarParticipantes(rota_id) {
    try {
        const resultado = await db.query(
             `SELECT 
                u.id,
                u.nome,
                u.email,
                u.telefone,
                p.data_entrada,
                c.status,
                c.data_confirmacao
             FROM usuario u
             INNER JOIN participacao p 
                ON u.id = p.usuario_id
             LEFT JOIN confirmacao c 
                ON u.id = c.usuario_id 
                AND p.rota_id = c.rota_id
             WHERE p.rota_id = $1
             ORDER BY c.status NULLS LAST, u.nome`,
            [rota_id]
        );

        return resultado.rows;
    } catch (erro) {
        throw erro;
    }
}

async function verificarParticipacao(usuario_id, rota_id) {
    try {
        const resultado = await db.query(
            `SELECT 
                p.id AS participacao_id,
                c.id AS confirmacao_id,
                c.status,
                c.data_confirmacao
             FROM participacao p
             LEFT JOIN confirmacao c 
                ON p.usuario_id = c.usuario_id 
                AND p.rota_id = c.rota_id
             WHERE p.usuario_id = $1 
             AND p.rota_id = $2`,
            [usuario_id, rota_id]
        );

        return resultado.rows[0] || null;
    } catch (erro) {
        throw erro;
    }
}

async function listarMinhasRotas(usuario_id) {
    try {
        const resultado = await db.query(
            `SELECT 
                r.*,
                c.status,
                c.data_confirmacao,
                (
                    SELECT COUNT(*) 
                    FROM confirmacao 
                    WHERE rota_id = r.id 
                    AND status != 'CANCELADO'
                ) AS confirmados
             FROM rota r
             INNER JOIN participacao p 
                ON r.id = p.rota_id
             LEFT JOIN confirmacao c 
                ON p.usuario_id = c.usuario_id 
                AND r.id = c.rota_id
             WHERE p.usuario_id = $1
             ORDER BY r.id`,
            [usuario_id]
        );

        return resultado.rows;
    } catch (erro) {
        throw erro;
    }
}

module.exports = {
    entrarEmRota,
    confirmarPresenca,
    cancelarPresenca,
    listarParticipantes,
    verificarParticipacao,
    listarMinhasRotas
};
