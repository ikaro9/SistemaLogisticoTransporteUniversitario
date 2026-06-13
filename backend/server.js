const express = require("express");

const app = express();

const rotaRoutes = require("./routes/rotaRoutes");

const usuarioRoutes = require("./routes/usuarioRoutes");

const participacaoRoutes = require("./routes/participacaoRoutes");

app.use(express.json());

app.use("/rotas", rotaRoutes);

app.use("/usuarios", usuarioRoutes);

app.use("/participacao", participacaoRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando");
});