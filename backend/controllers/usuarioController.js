const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');

const UsuarioController = {

  async cadastrar(req, res) {
    try {
      const { nome, email, senha, telefone, cidade, tipo_perfil } = req.body;

      if (!nome || !email || !senha || !telefone || !cidade || !tipo_perfil) {
        return res.status(400).json({ erro: 'Todos os campos sao obrigatorios.' });
      }

      const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ erro: 'Email já cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await UsuarioModel.criar({
        nome, email, senhaHash, telefone, cidade, tipo_perfil
      });

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: novoUsuario
      });

    } catch (erro) {
      if (erro.code === '23505') {
        return res.status(409).json({ erro: 'Email já cadastrado.' });
      }
      console.error('Erro ao cadastrar:', erro);
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Email ou senha inválidos.' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Email ou senha inválidos.' });
      }

      req.session.usuarioId = usuario.id;
      req.session.usuarioNome = usuario.nome;
      req.session.usuarioTipo = usuario.tipo_perfil;

      return res.status(200).json({
        mensagem: `Bem-vindo, ${usuario.nome}!`,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo_perfil: usuario.tipo_perfil
        }
      });

    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  },

  async logout(req, res) {
    req.session.destroy((erro) => {
      if (erro) {
        return res.status(500).json({ erro: 'Erro ao encerrar sessão.' });
      }
      return res.status(200).json({ mensagem: 'Sessão encerrada com sucesso.' });
    });
  },

  async sessaoAtual(req, res) {
    if (!req.session.usuarioId) {
      return res.status(401).json({ erro: 'Nenhuma sessão ativa.' });
    }

    try {
      const usuario = await UsuarioModel.buscarPorId(req.session.usuarioId);
      if (!usuario) {
        req.session.destroy();
        return res.status(401).json({ erro: 'Usuário não encontrado.' });
      }

      return res.status(200).json({
        mensagem: 'Sessão ativa',
        usuario
      });
    } catch (erro) {
      console.error('Erro ao buscar sessão:', erro);
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
};

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
UsuarioController
module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    UsuarioController,
    deletarUsuario
};