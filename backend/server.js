const express = require("express");

const app = express();

const rotaRoutes = require("./routes/rotaRoutes");

const usuarioRoutes = require("./routes/usuarioRoutes");

app.use(express.json());

app.use("/rotas", rotaRoutes);

app.use("/usuarios", usuarioRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando");
});