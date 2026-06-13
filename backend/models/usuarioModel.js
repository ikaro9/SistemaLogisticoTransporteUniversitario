const db = require('../config/db');

const UsuarioModel = {

  async criar({ nome, email, senhaHash, telefone, cidade, tipo_perfil, instituicao }) {
    const query = `
      INSERT INTO usuario (nome, email, senha, telefone, cidade, tipo_perfil, instituicao)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nome, email, telefone, cidade, tipo_perfil, instituicao
    `;

    const valores = [nome, email, senhaHash, telefone, cidade, tipo_perfil, instituicao];
    const resultado = await db.query(query, valores);
    return resultado.rows[0];
  },

  async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuario WHERE email = $1';
    const resultado = await db.query(query, [email]);
    return resultado.rows[0];
  },

  async buscarPorId(id) {
    const query = `
      SELECT id, nome, email, telefone, cidade, tipo_perfil, instituicao
      FROM usuario WHERE id = $1
    `;
    const resultado = await db.query(query, [id]);
    return resultado.rows[0];
  },

  async listarUsuarios() {
    const query = `
      SELECT id, nome, email, telefone, cidade, tipo_perfil, instituicao
      FROM usuario ORDER BY id
    `;
    const resultado = await db.query(query);
    return resultado.rows;
  },

  async atualizarUsuario(id, dados) {

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
},

async  deletarUsuario(id) {

    const resultado =
        await db.query(
            `DELETE FROM usuario
             WHERE id = $1
             RETURNING *`,
            [id]
        );

    return resultado.rows[0];
}

};

module.exports = UsuarioModel;
