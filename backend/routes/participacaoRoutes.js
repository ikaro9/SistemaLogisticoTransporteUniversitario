
const express = require("express");
const router = express.Router();

const participacaoController = require("../controllers/participacaoController");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

// Entrar em uma rota
router.post("/entrar", participacaoController.entrarEmRota);

// Confirmar presença
router.post("/confirmar", participacaoController.confirmarPresenca);

// Cancelar presença
router.post("/cancelar", participacaoController.cancelarPresenca);

// Listar participantes de uma rota
router.get("/rota/:rota_id", participacaoController.listarParticipantes);
// Verificar status de participação do usuário em uma rota
router.get("/verificar/:rota_id", participacaoController.verificarParticipacao);

// Listar rotas do usuário
router.get("/minhas-rotas", participacaoController.listarMinhasRotas);

module.exports = router;
