const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

const rotaRoutes = require("./routes/rotaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const participacaoRoutes = require("./routes/participacaoRoutes");

app.use(cors());

app.use(express.json());

app.use(
    session({
        secret: "transporte-universitario",
        resave: false,
        saveUninitialized: false
    })
);

app.use("/rotas", rotaRoutes);

app.use("/usuarios", usuarioRoutes);

app.use("/participacao", participacaoRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});