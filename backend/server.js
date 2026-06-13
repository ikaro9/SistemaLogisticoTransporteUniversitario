const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

const rotaRoutes = require("./routes/rotaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const participacaoRoutes = require("./routes/participacaoRoutes");

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // true em produção com HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 1 dia
        }
    })
);

app.use("/rotas", rotaRoutes);

app.use("/usuarios", usuarioRoutes);

app.use("/participacao", participacaoRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});