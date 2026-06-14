const API_BASE = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
    };

    try {

        const response = await fetch(
            `${API_BASE}/usuarios/login`,
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

            alert(resultado.mensagem);

            window.location.href = "perfil.html";

        } else {

            alert(resultado.erro || "Erro ao fazer login");
        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao conectar com o servidor");
    }
});