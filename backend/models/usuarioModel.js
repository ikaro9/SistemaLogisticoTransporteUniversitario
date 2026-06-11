const db = require("../config/db");

async function listarUsuarios() {

    const resultado =
        await db.query(
            "SELECT * FROM usuario"
        );

    return resultado.rows;
}

async function buscarUsuarioPorId(id) {

    const resultado =
        await db.query(
            "SELECT * FROM usuario WHERE id = $1",
            [id]
        );

    return resultado.rows[0];
}

async function criarUsuario(dados) {

    const {
        nome,
        email,
        senha,
        telefone,
        cidade,
        tipo_perfil,
        instituicao
    } = dados;

    const resultado =
        await db.query(
            `INSERT INTO usuario
            (
                nome,
                email,
                senha,
                telefone,
                cidade,
                tipo_perfil,
                instituicao
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [
                nome,
                email,
                senha,
                telefone,
                cidade,
                tipo_perfil,
                instituicao
            ]
        );

    return resultado.rows[0];
}

async function atualizarUsuario(id, dados) {

    const {
        nome,
        email,
        senha,
        telefone,
        cidade,
        tipo_perfil,
        instituicao
    } = dados;

    const resultado =
        await db.query(
            `UPDATE usuario
             SET nome = $1,
                 email = $2,
                 senha = $3,
                 telefone = $4,
                 cidade = $5,
                 tipo_perfil = $6,
                 instituicao = $7
             WHERE id = $8
             RETURNING *`,
            [
                nome,
                email,
                senha,
                telefone,
                cidade,
                tipo_perfil,
                instituicao,
                id
            ]
        );

    return resultado.rows[0];
}

async function deletarUsuario(id) {

    const resultado =
        await db.query(
            `DELETE FROM usuario
             WHERE id = $1
             RETURNING *`,
            [id]
        );

    return resultado.rows[0];
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};