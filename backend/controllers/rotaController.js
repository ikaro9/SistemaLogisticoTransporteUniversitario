const rotaModel = require("../models/rotaModel");

async function listarRotas(req, res) {
    try {
        const rotas = await rotaModel.listarRotas();

        res.status(200).json(rotas);
    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao listar rotas"
        });
    }
}

async function buscarRotaPorId(req, res) {
    try {
        const { id } = req.params;

        const rota = await rotaModel.buscarRotaPorId(id);

        if (!rota) {
            return res.status(404).json({
                mensagem: "Rota não encontrada"
            });
        }

        res.status(200).json(rota);

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao buscar rota"
        });
    }
}

async function criarRota(req, res) {
    try {
        const novaRota = await rotaModel.criarRota(req.body);

        res.status(201).json(novaRota);

    } catch (erro) {
      console.error(erro);

    res.status(500).json({
        mensagem: "Erro ao criar rota",
        erro: erro.message
    });
    }
}
async function atualizarRota(req, res) {

    try {

        const { id } = req.params;

        const rotaAtualizada =
            await rotaModel.atualizarRota(
                id,
                req.body
            );

        if (!rotaAtualizada) {
            return res.status(404).json({
                mensagem: "Rota não encontrada"
            });
        }

        res.status(200).json(rotaAtualizada);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar rota",
            erro: erro.message
        });
    }
}

async function deletarRota(req, res) {

    try {

        const { id } = req.params;

        const rotaDeletada =
            await rotaModel.deletarRota(id);

        if (!rotaDeletada) {
            return res.status(404).json({
                mensagem: "Rota não encontrada"
            });
        }

        res.status(200).json({
            mensagem: "Rota removida com sucesso",
            rota: rotaDeletada
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao remover rota",
            erro: erro.message
        });
    }
}

module.exports = {
    listarRotas,
    buscarRotaPorId,
    criarRota,
    atualizarRota,
    deletarRota
};