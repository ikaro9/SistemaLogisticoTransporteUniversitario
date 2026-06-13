function authMiddleware(req, res, next) {
    try {
        const usuario_id = req.session.usuario_id;

        // Verifica se existe usuário logado na sessão
        if (!usuario_id) {
            return res.status(401).json({
                mensagem: "Acesso negado. Usuário não autenticado."
            });
        }

        // (opcional) expõe o usuário para outras rotas
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