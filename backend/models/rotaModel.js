const db = require("../config/db");

async function listarRotas() {
    const resultado = await db.query("SELECT * FROM rota");
    return resultado.rows;
}

async function buscarRotaPorId(id) {
    const resultado = await db.query(
        "SELECT * FROM rota WHERE id = $1",
        [id]
    );

    return resultado.rows[0];
}

async function criarRota(dados) {
    const {
        nome,
        descricao,
        codigo,
        vagas_maximas,
        nome_veiculo,
        cor_veiculo,
        placa_veiculo,
        criador_id,
        motorista_id
    } = dados;

    const resultado = await db.query(
        `INSERT INTO rota
        (
            nome,
            descricao,
            codigo,
            vagas_maximas,
            nome_veiculo,
            cor_veiculo,
            placa_veiculo,
            criador_id,
            motorista_id
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
            nome,
            descricao,
            codigo,
            vagas_maximas,
            nome_veiculo,
            cor_veiculo,
            placa_veiculo,
            criador_id,
            motorista_id
        ]
    );

    return resultado.rows[0];
}

async function atualizarRota(id, dados) {

    const {
        nome,
        descricao,
        codigo,
        vagas_maximas,
        nome_veiculo,
        cor_veiculo,
        placa_veiculo,
        criador_id,
        motorista_id
    } = dados;

    const resultado = await db.query(
        `UPDATE rota
         SET nome = $1,
             descricao = $2,
             codigo = $3,
             vagas_maximas = $4,
             nome_veiculo = $5,
             cor_veiculo = $6,
             placa_veiculo = $7,
             criador_id = $8,
             motorista_id = $9
         WHERE id = $10
         RETURNING *`,
        [
            nome,
            descricao,
            codigo,
            vagas_maximas,
            nome_veiculo,
            cor_veiculo,
            placa_veiculo,
            criador_id,
            motorista_id,
            id
        ]
    );

    return resultado.rows[0];
}

async function deletarRota(id) {

    const resultado = await db.query(
        `DELETE FROM rota
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0];
}
module.exports = {
    listarRotas,
    buscarRotaPorId,
    criarRota,
    atualizarRota,
    deletarRota
};