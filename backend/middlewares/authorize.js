function authorize(perfisPermitidos) {
    return (req, res, next) => {
        const tipo = req.session.usuario_tipo;

        if (!tipo) {
            return res.status(401).json({ mensagem: "Não autenticado" });
        }

        if (!perfisPermitidos.includes(tipo)) {
            return res.status(403).json({ mensagem: "Sem permissão" });
        }

        next();
    };
}

module.exports = authorize;