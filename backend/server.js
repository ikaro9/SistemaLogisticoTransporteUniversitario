const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const rotaRoutes = require("./routes/rotaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const participacaoRoutes = require("./routes/participacaoRoutes");

const app = express();

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
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

app.use("/rotas", rotaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/participacao", participacaoRoutes);

const frontendPath = path.join(__dirname, "../frontend");

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "login.html"));
});

app.use(express.static(frontendPath));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
