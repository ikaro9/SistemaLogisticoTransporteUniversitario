const API_BASE = "http://localhost:3000";

const cadastroForm = document.getElementById("cadastroForm");

cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value,
        cidade: document.getElementById("cidade").value,
        senha: document.getElementById("senha").value,
        tipo_perfil: document.getElementById("tipo_perfil").value,
        instituicao: document.getElementById("instituicao").value
    };

    try {

        const response = await fetch(
            `${API_BASE}/usuarios/cadastro`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(dados)
            }
        );

        const resultado = await response.json();

        if (response.ok) {

            alert("Usuário cadastrado com sucesso!");

            window.location.href = "login.html";

        } else {

            alert(resultado.erro || "Erro ao cadastrar");
        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o servidor");
    }
});