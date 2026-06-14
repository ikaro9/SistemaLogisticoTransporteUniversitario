document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const feedback = document.getElementById("feedback");
    const button = document.getElementById("loginButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage(feedback);

        const dados = {
            email: document.getElementById("email").value.trim(),
            senha: document.getElementById("senha").value
        };

        if (!dados.email || !dados.senha) {
            showMessage(feedback, "Informe e-mail e senha para continuar.", "warning");
            return;
        }

        try {
            setButtonLoading(button, true, "Entrando...");
            const resultado = await apiFetch("/usuarios/login", {
                method: "POST",
                body: JSON.stringify(dados)
            });

            showMessage(feedback, resultado.mensagem || "Login realizado com sucesso.", "success");
            setTimeout(() => {
                window.location.href = "rotas.html";
            }, 550);
        } catch (error) {
            showMessage(feedback, error.message || "Erro ao fazer login.", "error");
        } finally {
            setButtonLoading(button, false);
        }
    });
});
