function authMiddleware(req, res, next) {
    try {
        const usuario_id = req.session.usuario_id;

        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Acesso negado. Usuário não autenticado."
            });
        }

        req.session.usuario_id = usuario_id;

        next();

    } catch (error) {
        console.error("Erro no authMiddleware:", error);

        return res.status(500).json({
            mensagem: "Erro interno de autenticação"
        });
    }
}

module.exports = authMiddleware;