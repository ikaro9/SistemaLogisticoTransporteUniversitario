const express = require("express");

const router = express.Router();

const usuarioController =
    require("../controllers/usuarioController");

router.post("/cadastro", usuarioController.cadastrar);
router.post("/login", usuarioController.login);
router.post("/logout", usuarioController.logout);
router.get("/sessao", usuarioController.sessaoAtual);

router.get("/", usuarioController.listarUsuarios);
router.get("/:id", usuarioController.buscarUsuarioPorId);
router.put("/:id", usuarioController.atualizarUsuario);
router.delete("/:id", usuarioController.deletarUsuario);

module.exports = router;