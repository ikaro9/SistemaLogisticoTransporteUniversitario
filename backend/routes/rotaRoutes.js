const express = require("express");
const router = express.Router();

const rotaController = require("../controllers/rotaController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorize");


router.get("/", rotaController.listarRotas);

router.get("/:id", rotaController.buscarRotaPorId);


router.post(
    "/",
    authMiddleware,
    authorize(["ADMIN"]),
    rotaController.criarRota
);

router.put(
    "/:id",
    authMiddleware,
    authorize(["ADMIN"]),
    rotaController.atualizarRota
);

router.delete(
    "/:id",
    authMiddleware,
    authorize(["ADMIN"]),
    rotaController.deletarRota
);

module.exports = router;