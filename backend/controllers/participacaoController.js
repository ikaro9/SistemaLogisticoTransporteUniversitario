const participacaoModel = require("../models/participacaoModel");

// Entrar em uma rota
async function entrarEmRota(req, res) {
    try {
        const { rota_id } = req.body;
        const usuario_id = req.session.usuario_id; // Obtém do session

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        if (!rota_id) {
            return res.status(400).json({
                mensagem: "rota_id é obrigatório"
            });
        }

        const participacao = await participacaoModel.entrarEmRota(usuario_id, rota_id);

       return res.status(201).json({
            mensagem: "Entrada na rota realizada com sucesso",
            participacao
        });
    } catch (erro) {
        console.error(erro);
      return  res.status(500).json({
            mensagem: erro.message || "Erro ao entrar em rota"
        });
    }
}

// Confirmar presença
async function confirmarPresenca(req, res) {
    try {
        const { rota_id, status} = req.body;
        const usuario_id = req.session.usuario_id;

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        if (!rota_id || !status) {
            return res.status(400).json({
                mensagem: "rota_id e status são obrigatórios"
            });
        }

        const confirmacao = await participacaoModel.confirmarPresenca(usuario_id, rota_id,status);

      return res.status(200).json({
            mensagem: "Presença confirmada com sucesso",
            confirmacao
        });
    } catch (erro) {
        console.error(erro);
       return res.status(500).json({
            mensagem: erro.message || "Erro ao confirmar presença"
        });
    }
}

// Cancelar presença
async function cancelarPresenca(req, res) {
    try {
        const { rota_id } = req.body;
        const usuario_id = req.session.usuario_id;

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        if (!rota_id) {
            return res.status(400).json({
                mensagem: "rota_id é obrigatório"
            });
        }

        const resultado = await participacaoModel.cancelarPresenca(usuario_id, rota_id);

      return res.status(200).json({
            mensagem: "Presença cancelada com sucesso",
            confirmacao: resultado
        });
    } catch (erro) {
        console.error(erro);
       return res.status(500).json({
            mensagem: erro.message || "Erro ao cancelar presença"
        });
    }
}

// Listar participantes de uma rota
async function listarParticipantes(req, res) {
    try {
        const { rota_id } = req.params;

        if (!rota_id) {
            return res.status(400).json({
                mensagem: "rota_id é obrigatório"
            });
        }

        const participantes = await participacaoModel.listarParticipantes(rota_id);

         return res.status(200).json(participantes);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao listar participantes"
        });
    }
}

// Verificar status de participação
async function verificarParticipacao(req, res) {
    try {
        const { rota_id } = req.params;
        const usuario_id = req.session.usuario_id;

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        const participacao = await participacaoModel.verificarParticipacao(usuario_id, rota_id);

        return res.status(200).json({
            participando: !!participacao,
            dados: participacao
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao verificar participação"
        });
    }
}

// Listar minhas rotas (rotas em que o usuário participa)
async function listarMinhasRotas(req, res) {
    try {
        const usuario_id = req.session.usuario_id;

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Usuário não autenticado"
            });
        }

        const rotas = await participacaoModel.listarMinhasRotas(usuario_id);

        return res.status(200).json(rotas);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao listar suas rotas"
        });
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
