const rotaModel = require("../models/rotaModel");

async function listarRotas(req, res) {
    try {
        const rotas = await rotaModel.listarRotas();
        return res.status(200).json(rotas);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
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

        return res.status(200).json(rota);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao buscar rota"
        });
    }
}

async function criarRota(req, res) {
    try {
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
        } = req.body;

        if (!nome || !codigo || !vagas_maximas || !placa_veiculo) {
            return res.status(400).json({
                mensagem: "Preencha os campos obrigatórios."
            });
        }

        if (Number(vagas_maximas) <= 0) {
            return res.status(400).json({
                mensagem: "A quantidade de vagas deve ser maior que zero."
            });
        }

        const novaRota = await rotaModel.criarRota({
            nome,
            descricao,
            codigo,
            vagas_maximas,
            nome_veiculo,
            cor_veiculo,
            placa_veiculo,
            criador_id: criador_id || req.session.usuario_id,
            motorista_id: motorista_id || null
        });

        return res.status(201).json({
            mensagem: "Rota criada com sucesso.",
            rota: novaRota
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao criar rota",
            erro: erro.message
        });
    }
}

async function atualizarRota(req, res) {
    try {
        const { id } = req.params;
        const rotaAtualizada = await rotaModel.atualizarRota(id, req.body);

        if (!rotaAtualizada) {
            return res.status(404).json({
                mensagem: "Rota não encontrada"
            });
        }

        return res.status(200).json(rotaAtualizada);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
            mensagem: "Erro ao atualizar rota",
            erro: erro.message
        });
    }
}

async function deletarRota(req, res) {
    try {
        const { id } = req.params;
        const rotaDeletada = await rotaModel.deletarRota(id);

        if (!rotaDeletada) {
            return res.status(404).json({
                mensagem: "Rota não encontrada"
            });
        }

        return res.status(200).json({
            mensagem: "Rota removida com sucesso",
            rota: rotaDeletada
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({
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
