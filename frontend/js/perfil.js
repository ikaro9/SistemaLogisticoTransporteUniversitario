document.addEventListener("DOMContentLoaded", async () => {
    setupAppShell("perfil");
    const usuario = await requireAuth();
    if (!usuario) return;

    await carregarPerfil(usuario);
    await carregarMinhasRotas();
});

async function carregarPerfil(usuarioSessao) {
    const loading = document.getElementById("perfilLoading");
    const feedback = document.getElementById("perfilFeedback");

    try {
        setLoading(loading, true);
        clearMessage(feedback);

        const usuario = usuarioSessao || await getSession();
        if (!usuario) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("avatarPerfil").textContent = firstLetter(usuario.nome);
        document.getElementById("nome").textContent = usuario.nome || "Não informado";
        document.getElementById("email").textContent = usuario.email || "Não informado";
        document.getElementById("telefone").textContent = usuario.telefone || "Não informado";
        document.getElementById("cidade").textContent = usuario.cidade || "Não informada";
        document.getElementById("tipo").textContent = usuario.tipo_perfil || "Não informado";
        document.getElementById("instituicao").textContent = usuario.instituicao || "Não informada";
    } catch (error) {
        showMessage(feedback, error.message || "Erro ao carregar perfil.", "error");
    } finally {
        setLoading(loading, false);
    }
}

async function carregarMinhasRotas() {
    const container = document.getElementById("minhasRotas");

    try {
        const data = await apiFetch("/participacao/minhas-rotas");
        const rotas = Array.isArray(data) ? data.map(normalizeRoute) : [];

        if (rotas.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📍</div>
                    <h3>Você ainda não entrou em nenhuma rota</h3>
                    <p>Acesse a tela de rotas e informe o código de uma rota para participar.</p>
                    <a class="button-link" href="rotas.html">Ver rotas</a>
                </div>
            `;
            return;
        }

        container.innerHTML = rotas.map((rota) => `
            <article class="route-card">
                <div class="card-topline">
                    <div>
                        <span class="route-code">${escapeHTML(rota.codigo || "Sem código")}</span>
                        <h3>${escapeHTML(rota.nome || "Rota sem nome")}</h3>
                    </div>
                    <span class="status-badge ${statusClass(rota.status)}">${formatStatus(rota.status)}</span>
                </div>
                <p>${escapeHTML(rota.descricao || "Sem descrição cadastrada.")}</p>
                <div class="progress-wrap">
                    <div class="progress-label"><span>Ocupação</span><strong>${rota.confirmados}/${rota.vagas || 0}</strong></div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${rota.percentage}%"></div></div>
                </div>
                <div class="actions-row">
                    <a class="button-link btn-secondary" href="participantes.html?rota=${rota.id}">Gerenciar participação</a>
                </div>
            </article>
        `).join("");
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Erro ao carregar suas rotas</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}
