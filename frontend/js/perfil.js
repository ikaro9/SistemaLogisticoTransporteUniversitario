const API_BASE = "http://localhost:3000";

async function carregarPerfil() {

    try {

        const resposta = await fetch(
            `${API_BASE}/usuarios/sessao`,
            {
                credentials: "include"
            }
        );

        const dados = await resposta.json();

        console.log("Sessão:", dados);

        if (!resposta.ok) {
            console.log("Sem sessão ativa");
            return;
        }

        const usuario = dados.usuario;

        document.getElementById("nome").textContent =
            usuario.nome;

        document.getElementById("email").textContent =
            usuario.email;

        document.getElementById("tipo").textContent =
            usuario.tipo_perfil;

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
    }
}

document.addEventListener(
    "DOMContentLoaded",
    carregarPerfil
);