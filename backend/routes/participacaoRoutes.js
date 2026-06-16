
const express = require("express");
const router = express.Router();

const participacaoController = require("../controllers/participacaoController");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/entrar", participacaoController.entrarEmRota);

router.post("/confirmar", participacaoController.confirmarPresenca);

router.post("/cancelar", participacaoController.cancelarPresenca);

router.get("/rota/:rota_id", participacaoController.listarParticipantes);

router.get("/verificar/:rota_id", participacaoController.verificarParticipacao);

router.get("/minhas-rotas", participacaoController.listarMinhasRotas);

module.exports = router;
