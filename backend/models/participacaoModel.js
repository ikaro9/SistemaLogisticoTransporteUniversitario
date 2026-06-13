const db = require("../config/db");

// Entrar em uma rota (criar participação)
async function entrarEmRota(usuario_id, rota_id) {
    try {
        // Verificar se o usuário já participa desta rota
        const existente = await db.query(
            "SELECT * FROM participacao WHERE usuario_id = $1 AND rota_id = $2",
            [usuario_id, rota_id]
        );

        if (existente.rows.length > 0) {
            throw new Error("Usuário já está participando desta rota");
        }

        // Verificar se ainda há vagas disponíveis
        const rota = await db.query(
            `SELECT id, vagas_maximas, 
                    (SELECT COUNT(*) FROM confirmacao 
                     WHERE rota_id = $1 AND confirmado = true) as vagas_usadas
             FROM rota WHERE id = $1`,
            [rota_id]
        );

        if (rota.rows.length === 0) {
            throw new Error("Rota não encontrada");
        }

        const { vagas_maximas, vagas_usadas } = rota.rows[0];

        if (parseInt(vagas_usadas) >= parseInt(vagas_maximas)) {
            throw new Error("Rota cheia, não há vagas disponíveis");
        }

        // Criar participação
        const resultado = await db.query(
            `INSERT INTO participacao (usuario_id, rota_id, data_participacao)
             VALUES ($1, $2, NOW())
             RETURNING *`,
            [usuario_id, rota_id]
        );

        return resultado.rows[0];
    } catch (erro) {
        throw erro;
    }
}

// Confirmar presença na rota
async function confirmarPresenca(usuario_id, rota_id) {
    try {
        // Verificar se participa da rota
        const participacao = await db.query(
            "SELECT id FROM participacao WHERE usuario_id = $1 AND rota_id = $2",
            [usuario_id, rota_id]
        );

        if (participacao.rows.length === 0) {
            throw new Error("Usuário não participa desta rota");
        }

        // Verificar se já confirmou
        const jaConfirmou = await db.query(
            "SELECT * FROM confirmacao WHERE usuario_id = $1 AND rota_id = $2",
            [usuario_id, rota_id]
        );

        if (jaConfirmou.rows.length > 0 && jaConfirmou.rows[0].confirmado) {
            throw new Error("Usuário já confirmou presença");
        }

        // Verificar se ainda há vagas
        const vagas = await db.query(
            `SELECT vagas_maximas,
                    (SELECT COUNT(*) FROM confirmacao 
                     WHERE rota_id = $1 AND confirmado = true) as vagas_usadas
             FROM rota WHERE id = $1`,
            [rota_id]
        );

        const { vagas_maximas, vagas_usadas } = vagas.rows[0];

        if (parseInt(vagas_usadas) >= parseInt(vagas_maximas)) {
            throw new Error("Não há mais vagas disponíveis");
        }

        // Inserir ou atualizar confirmação
        let resultado;

        if (jaConfirmou.rows.length > 0) {
            // Atualizar confirmação existente
            resultado = await db.query(
                `UPDATE confirmacao 
                 SET confirmado = true, data_confirmacao = NOW()
                 WHERE usuario_id = $1 AND rota_id = $2
                 RETURNING *`,
                [usuario_id, rota_id]
            );
        } else {
            // Criar nova confirmação
            resultado = await db.query(
                `INSERT INTO confirmacao (usuario_id, rota_id, confirmado, data_confirmacao)
                 VALUES ($1, $2, true, NOW())
                 RETURNING *`,
                [usuario_id, rota_id]
            );
        }

        return resultado.rows[0];
    } catch (erro) {
        throw erro;
    }
}

// Cancelar presença
async function cancelarPresenca(usuario_id, rota_id) {
    try {
        // Remover confirmação
        const resultado = await db.query(
            `UPDATE confirmacao 
             SET confirmado = false, data_confirmacao = NOW()
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

// Listar participantes de uma rota
async function listarParticipantes(rota_id) {
    try {
        const resultado = await db.query(
            `SELECT u.id, u.nome, u.email, u.telefone, c.confirmado, c.data_confirmacao
             FROM usuario u
             INNER JOIN participacao p ON u.id = p.usuario_id
             LEFT JOIN confirmacao c ON u.id = c.usuario_id AND c.rota_id = p.rota_id
             WHERE p.rota_id = $1
             ORDER BY c.confirmado DESC, u.nome`,
            [rota_id]
        );

        return resultado.rows;
    } catch (erro) {
        throw erro;
    }
}

// Verificar status de participação do usuário em uma rota
async function verificarParticipacao(usuario_id, rota_id) {
    try {
        const resultado = await db.query(
            `SELECT p.id as participacao_id, c.id as confirmacao_id, c.confirmado, c.data_confirmacao
             FROM participacao p
             LEFT JOIN confirmacao c ON p.usuario_id = c.usuario_id AND p.rota_id = c.rota_id
             WHERE p.usuario_id = $1 AND p.rota_id = $2`,
            [usuario_id, rota_id]
        );

        return resultado.rows[0] || null;
    } catch (erro) {
        throw erro;
    }
}

// Listar rotas do usuário
async function listarMinhasRotas(usuario_id) {
    try {
        const resultado = await db.query(
            `SELECT r.*, c.confirmado, c.data_confirmacao,
                    (SELECT COUNT(*) FROM confirmacao 
                     WHERE rota_id = r.id AND confirmado = true) as confirmados
             FROM rota r
             INNER JOIN participacao p ON r.id = p.rota_id
             LEFT JOIN confirmacao c ON p.usuario_id = c.usuario_id AND r.id = c.rota_id
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
