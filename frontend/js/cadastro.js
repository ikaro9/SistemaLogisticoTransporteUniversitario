document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroForm");
    const feedback = document.getElementById("feedback");
    const button = document.getElementById("cadastroButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage(feedback);

        const dados = {
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            cidade: document.getElementById("cidade").value.trim(),
            senha: document.getElementById("senha").value,
            tipo_perfil: document.getElementById("tipo_perfil").value,
            instituicao: document.getElementById("instituicao").value
        };

        const camposVazios = Object.values(dados).some((valor) => !valor);
        if (camposVazios) {
            showMessage(feedback, "Preencha todos os campos obrigatórios.", "warning");
            return;
        }

        if (dados.senha.length < 6) {
            showMessage(feedback, "A senha deve ter pelo menos 6 caracteres.", "warning");
            return;
        }

        try {
            setButtonLoading(button, true, "Cadastrando...");
            const resultado = await apiFetch("/usuarios/cadastro", {
                method: "POST",
                body: JSON.stringify(dados)
            });

            showMessage(feedback, resultado.mensagem || "Cadastro realizado com sucesso.", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 750);
        } catch (error) {
            showMessage(feedback, error.message || "Erro ao cadastrar usuário.", "error");
        } finally {
            setButtonLoading(button, false);
        }
    });
});
