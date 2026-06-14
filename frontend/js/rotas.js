const API_BASE = "http://localhost:3000";

async function carregarRotas() {

    try {

        const resposta =
            await fetch(`${API_BASE}/rotas`, {
                credentials: "include"
            });

        const rotas =
            await resposta.json();

        console.log("Rotas:", rotas);

        if (rotas.length > 0) {

            const rota = rotas[0];

            document.getElementById("nomeRota").textContent =
                rota.nome || "Sem nome";

            document.getElementById("veiculo").textContent =
                rota.nome_veiculo || "Não informado";

            document.getElementById("cor").textContent =
                rota.cor_veiculo || "Não informada";

            document.getElementById("placa").textContent =
                rota.placa_veiculo || "Não informada";
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar rotas:",
            erro
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    carregarRotas
);