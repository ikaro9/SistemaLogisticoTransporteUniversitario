document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroForm");
    const feedback = document.getElementById("feedback");
    const button = document.getElementById("cadastroButton");
    const tipoPerfil = document.getElementById("tipo_perfil");
    const instituicao = document.getElementById("instituicao");
    const instituicaoField = document.getElementById("instituicaoField");

    function atualizarCampoInstituicao() {
        const motorista = tipoPerfil.value === "MOTORISTA";
        instituicao.required = !motorista;
        instituicao.disabled = motorista;
        instituicaoField.classList.toggle("hidden", motorista);

        if (motorista) {
            instituicao.value = "";
        }
    }

    tipoPerfil.addEventListener("change", atualizarCampoInstituicao);
    atualizarCampoInstituicao();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessage(feedback);

        const dados = {
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            cidade: document.getElementById("cidade").value.trim(),
            senha: document.getElementById("senha").value,
            tipo_perfil: tipoPerfil.value,
            instituicao: tipoPerfil.value === "MOTORISTA" ? null : instituicao.value
        };

        const camposObrigatorios = [
            dados.nome,
            dados.email,
            dados.telefone,
            dados.cidade,
            dados.senha,
            dados.tipo_perfil
        ];

        if (camposObrigatorios.some((valor) => !valor)) {
            showMessage(feedback, "Preencha todos os campos obrigatórios.", "warning");
            return;
        }

        if (dados.tipo_perfil !== "MOTORISTA" && !dados.instituicao) {
            showMessage(feedback, "Informe a instituição para aluno ou administrador.", "warning");
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
