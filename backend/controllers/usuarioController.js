const usuarioModel =
    require("../models/usuarioModel");

    async function listarUsuarios(req, res) {

    try {

        const usuarios =
            await usuarioModel.listarUsuarios();

        res.status(200).json(usuarios);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar usuários",
            erro: erro.message
        });
    }
}

async function buscarUsuarioPorId(req, res) {

    try {

        const { id } = req.params;

        const usuario =
            await usuarioModel.buscarUsuarioPorId(id);

        if (!usuario) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        res.status(200).json(usuario);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar usuário",
            erro: erro.message
        });
    }
}

async function criarUsuario(req, res) {

    try {

        const novoUsuario =
            await usuarioModel.criarUsuario(req.body);

        res.status(201).json(novoUsuario);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao criar usuário",
            erro: erro.message
        });
    }
}

async function atualizarUsuario(req, res) {

    try {

        const { id } = req.params;

        const usuarioAtualizado =
            await usuarioModel.atualizarUsuario(
                id,
                req.body
            );

        if (!usuarioAtualizado) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        res.status(200).json(usuarioAtualizado);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar usuário",
            erro: erro.message
        });
    }
}

async function deletarUsuario(req, res) {

    try {

        const { id } = req.params;

        const usuarioDeletado =
            await usuarioModel.deletarUsuario(id);

        if (!usuarioDeletado) {

            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        res.status(200).json({
            mensagem: "Usuário removido com sucesso",
            usuario: usuarioDeletado
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao remover usuário",
            erro: erro.message
        });
    }
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario
};