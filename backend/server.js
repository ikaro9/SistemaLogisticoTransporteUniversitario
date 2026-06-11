const express = require("express");

const app = express();

const rotaRoutes = require("./routes/rotaRoutes");

app.use(express.json());

app.use("/rotas", rotaRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando");
});