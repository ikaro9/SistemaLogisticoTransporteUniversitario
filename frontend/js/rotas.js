let usuarioLogado = null;
let rotas = [];
let filtroAtual = "";

document.addEventListener("DOMContentLoaded", async () => {
    setupAppShell("rotas");
    usuarioLogado = await requireAuth();
    if (!usuarioLogado) return;

    bindEventosRotas();
    configurarPainelAdmin();
    await carregarRotas();
});

function bindEventosRotas() {
    const busca = document.getElementById("buscaRotas");
    const codigoForm = document.getElementById("codigoForm");
    const rotaForm = document.getElementById("rotaForm");

    busca.addEventListener("input", (event) => {
        filtroAtual = event.target.value.trim().toLowerCase();
        renderRotas();
    });

    if (codigoForm) {
        codigoForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const codigo = document.getElementById("codigoRota").value.trim();
            await entrarPorCodigo(codigo);
        });
    }

    if (rotaForm) {
        rotaForm.addEventListener("submit", cadastrarRota);
    }
}

function configurarPainelAdmin() {
    const panel = document.getElementById("adminPanel");
    if (!panel) return;
    const tipo = String(usuarioLogado?.tipo_perfil || "").toUpperCase();
    panel.classList.toggle("hidden", tipo !== "ADMIN");
}

async function carregarRotas() {
    const loading = document.getElementById("rotasLoading");
    const feedback = document.getElementById("rotasFeedback");

    try {
        setLoading(loading, true);
        clearMessage(feedback);
        const data = await apiFetch("/rotas");
        rotas = Array.isArray(data) ? data.map(normalizeRoute) : [];
        renderResumo();
        renderRotas();
    } catch (error) {
        showMessage(feedback, error.message || "Erro ao carregar rotas.", "error");
    } finally {
        setLoading(loading, false);
    }
}

function renderResumo() {
    const totalRotas = rotas.length;
    const totalVagas = rotas.reduce((sum, rota) => sum + rota.vagas, 0);
    const totalConfirmados = rotas.reduce((sum, rota) => sum + rota.confirmados, 0);
    const totalDisponiveis = Math.max(totalVagas - totalConfirmados, 0);

    document.getElementById("totalRotas").textContent = totalRotas;
    document.getElementById("totalVagas").textContent = totalVagas;
    document.getElementById("totalConfirmados").textContent = totalConfirmados;
    document.getElementById("totalDisponiveis").textContent = totalDisponiveis;
}

function renderRotas() {
    const grid = document.getElementById("rotasGrid");
    const filtradas = rotas.filter((rota) => {
        const alvo = [rota.nome, rota.codigo, rota.nome_veiculo, rota.placa_veiculo, rota.descricao]
            .join(" ")
            .toLowerCase();
        return alvo.includes(filtroAtual);
    });

    if (filtradas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔎</div>
                <h3>Nenhuma rota encontrada</h3>
                <p>Verifique o termo pesquisado ou cadastre uma nova rota se você for administrador.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtradas.map(renderRotaCard).join("");

    grid.querySelectorAll("[data-entrar]").forEach((button) => {
        button.addEventListener("click", async () => {
            const rota = rotas.find((item) => String(item.id) === button.dataset.entrar);
            if (rota) await entrarPorCodigo(rota.codigo, button);
        });
    });
}

function renderRotaCard(rota) {
    const cheia = rota.vagas > 0 && rota.confirmados >= rota.vagas;
    const status = cheia ? "Lotada" : "Disponível";
    const statusBadge = cheia ? "badge-danger" : "badge-success";

    return `
        <article class="route-card">
            <div class="card-topline">
                <div>
                    <span class="route-code">${escapeHTML(rota.codigo || "Sem código")}</span>
                    <h3>${escapeHTML(rota.nome || "Rota sem nome")}</h3>
                </div>
                <span class="badge ${statusBadge}">${status}</span>
            </div>

            <p>${escapeHTML(rota.descricao || "Sem descrição cadastrada.")}</p>

            <div class="meta-list">
                <div class="meta-item"><span>🚐</span><div><strong>Veículo</strong><br>${escapeHTML(rota.nome_veiculo || "Não informado")} ${rota.cor_veiculo ? `- ${escapeHTML(rota.cor_veiculo)}` : ""}</div></div>
                <div class="meta-item"><span>🔖</span><div><strong>Placa</strong><br>${escapeHTML(rota.placa_veiculo || "Não informada")}</div></div>
                <div class="meta-item"><span>👥</span><div><strong>Vagas</strong><br>${rota.confirmados}/${rota.vagas || 0} ocupadas</div></div>
            </div>

            <div class="progress-wrap">
                <div class="progress-label"><span>Ocupação</span><strong>${rota.percentage}%</strong></div>
                <div class="progress-bar"><div class="progress-fill" style="width: ${rota.percentage}%"></div></div>
            </div>

            <div class="actions-row">
                <button class="btn" type="button" data-entrar="${rota.id}" ${cheia ? "disabled" : ""}>Entrar</button>
                <a class="button-link btn-secondary" href="participantes.html?rota=${rota.id}">Ver detalhes</a>
            </div>
        </article>
    `;
}

async function entrarPorCodigo(codigo, button = null) {
    const feedback = document.getElementById("codigoFeedback") || document.getElementById("rotasFeedback");

    if (!codigo) {
        showMessage(feedback, "Informe o código da rota.", "warning");
        return;
    }

    try {
        if (button) setButtonLoading(button, true, "Entrando...");
        else setButtonLoading(document.getElementById("codigoButton"), true, "Entrando...");

        const resultado = await apiFetch("/participacao/entrar", {
            method: "POST",
            body: JSON.stringify({ codigo })
        });

        showMessage(feedback, resultado.mensagem || "Entrada na rota realizada com sucesso.", "success");
        const codigoInput = document.getElementById("codigoRota");
        if (codigoInput) codigoInput.value = "";
        await carregarRotas();
    } catch (error) {
        showMessage(feedback, error.message || "Erro ao entrar na rota.", "error");
    } finally {
        if (button) setButtonLoading(button, false);
        else setButtonLoading(document.getElementById("codigoButton"), false);
    }
}

async function cadastrarRota(event) {
    event.preventDefault();

    const feedback = document.getElementById("adminFeedback");
    const button = document.getElementById("rotaButton");
    const dados = {
        nome: document.getElementById("nomeRota").value.trim(),
        descricao: document.getElementById("descricaoRota").value.trim(),
        codigo: document.getElementById("codigoNovaRota").value.trim(),
        vagas_maximas: Number(document.getElementById("vagasMaximas").value),
        nome_veiculo: document.getElementById("nomeVeiculo").value.trim(),
        cor_veiculo: document.getElementById("corVeiculo").value.trim(),
        placa_veiculo: document.getElementById("placaVeiculo").value.trim(),
        criador_id: usuarioLogado.id,
        motorista_id: null
    };

    if (!dados.nome || !dados.codigo || !dados.vagas_maximas || !dados.placa_veiculo) {
        showMessage(feedback, "Preencha nome, código, vagas e placa.", "warning");
        return;
    }

    try {
        setButtonLoading(button, true, "Cadastrando...");
        const resultado = await apiFetch("/rotas", {
            method: "POST",
            body: JSON.stringify(dados)
        });

        showMessage(feedback, resultado.mensagem || "Rota cadastrada com sucesso.", "success");
        event.target.reset();
        await carregarRotas();
    } catch (error) {
        showMessage(feedback, error.message || "Erro ao cadastrar rota.", "error");
    } finally {
        setButtonLoading(button, false);
    }
}
