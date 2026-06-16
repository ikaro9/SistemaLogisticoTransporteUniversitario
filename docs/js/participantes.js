let usuarioLogado = null;
let rotas = [];
let rotaAtual = null;
let participacaoAtual = null;

document.addEventListener("DOMContentLoaded", async () => {
    setupAppShell("participantes");
    usuarioLogado = await requireAuth();
    if (!usuarioLogado) return;

    bindEventosParticipacao();
    await carregarRotas();
});

function bindEventosParticipacao() {
    document.getElementById("rotaSelect").addEventListener("change", async (event) => {
        const rota = rotas.find((item) => String(item.id) === event.target.value);
        if (rota) await carregarDetalhesRota(rota);
        else mostrarEstadoVazio();
    });

    document.getElementById("btnEntrar").addEventListener("click", entrarNaRotaAtual);
    document.getElementById("btnConfirmar").addEventListener("click", confirmarPresenca);
    document.getElementById("btnCancelar").addEventListener("click", cancelarPresenca);
}

async function carregarRotas() {
    const loading = document.getElementById("loading");
    const mensagem = document.getElementById("mensagem");

    try {
        setLoading(loading, true);
        clearMessage(mensagem);

        const data = await apiFetch("/rotas");
        rotas = Array.isArray(data) ? data.map(normalizeRoute) : [];
        atualizarSelectRotas();

        const rotaParam = getQueryParam("rota");
        const rotaInicial = rotas.find((rota) => String(rota.id) === String(rotaParam)) || rotas[0];

        if (rotaInicial) {
            document.getElementById("rotaSelect").value = rotaInicial.id;
            await carregarDetalhesRota(rotaInicial);
        } else {
            mostrarEstadoVazio("Nenhuma rota cadastrada", "Ainda não há rotas disponíveis no sistema.");
        }
    } catch (error) {
        showMessage(mensagem, error.message || "Erro ao carregar rotas.", "error");
        mostrarEstadoVazio("Erro ao carregar", "Não foi possível consultar as rotas no momento.");
    } finally {
        setLoading(loading, false);
    }
}

function atualizarSelectRotas() {
    const select = document.getElementById("rotaSelect");

    if (rotas.length === 0) {
        select.innerHTML = '<option value="">Nenhuma rota disponível</option>';
        return;
    }

    select.innerHTML = '<option value="">Selecione uma rota...</option>' +
        rotas.map((rota) => `
            <option value="${rota.id}">${escapeHTML(rota.nome || "Rota")} — ${escapeHTML(rota.codigo || "sem código")} (${rota.confirmados}/${rota.vagas || 0})</option>
        `).join("");
}

async function carregarDetalhesRota(rota) {
    const loading = document.getElementById("loading");
    const mensagem = document.getElementById("mensagem");

    try {
        setLoading(loading, true);
        clearMessage(mensagem);
        rotaAtual = normalizeRoute(rota);

        preencherCardRota(rotaAtual);
        await verificarParticipacaoUsuario();
        await carregarParticipantes();

        document.getElementById("rotaInfo").classList.remove("hidden");
        document.getElementById("emptyState").classList.add("hidden");
    } catch (error) {
        showMessage(mensagem, error.message || "Erro ao carregar detalhes da rota.", "error");
    } finally {
        setLoading(loading, false);
    }
}

function preencherCardRota(rota) {
    const cheia = rota.vagas > 0 && rota.confirmados >= rota.vagas;

    document.getElementById("rotaCodigo").textContent = rota.codigo || "Sem código";
    document.getElementById("rotaNome").textContent = rota.nome || "Rota sem nome";
    document.getElementById("rotaDescricao").textContent = rota.descricao || "Sem descrição cadastrada.";
    document.getElementById("rotaVeiculo").textContent = `${rota.nome_veiculo || "Não informado"}${rota.cor_veiculo ? ` - ${rota.cor_veiculo}` : ""}`;
    document.getElementById("rotaPlaca").textContent = rota.placa_veiculo || "Não informada";
    document.getElementById("vagasTexto").textContent = `${rota.confirmados} / ${rota.vagas || 0} vagas preenchidas`;
    document.getElementById("vagasPercentual").textContent = `${rota.percentage}%`;
    document.getElementById("vagasPreenchidas").style.width = `${rota.percentage}%`;

    const statusRota = document.getElementById("statusRota");
    statusRota.textContent = cheia ? "Lotada" : "Disponível";
    statusRota.className = `badge ${cheia ? "badge-danger" : "badge-success"}`;
}

async function verificarParticipacaoUsuario() {
    participacaoAtual = null;

    try {
        const response = await apiFetch(`/participacao/verificar/${rotaAtual.id}`);
        participacaoAtual = response?.dados || null;
        atualizarBotoesParticipacao();
    } catch (error) {
        if (error.status === 401) {
            window.location.href = "login.html";
            return;
        }
        atualizarBotoesParticipacao();
    }
}

function atualizarBotoesParticipacao() {
    const btnEntrar = document.getElementById("btnEntrar");
    const btnConfirmar = document.getElementById("btnConfirmar");
    const btnCancelar = document.getElementById("btnCancelar");
    const seuStatus = document.getElementById("seuStatus");
    const confirmacaoControle = document.getElementById("confirmacaoControle");
    const cheia = rotaAtual.vagas > 0 && rotaAtual.confirmados >= rotaAtual.vagas;

    btnEntrar.classList.add("hidden");
    btnConfirmar.classList.add("hidden");
    btnCancelar.classList.add("hidden");
    confirmacaoControle.classList.add("hidden");

    if (!participacaoAtual?.participacao_id) {
        seuStatus.innerHTML = `<span class="status-badge status-pendente">Você ainda não entrou nesta rota</span>`;
        btnEntrar.classList.remove("hidden");
        btnEntrar.disabled = cheia;
        btnEntrar.textContent = cheia ? "Rota lotada" : "Entrar nesta rota";
        return;
    }

    const status = participacaoAtual.status;
    const confirmado = isConfirmed(status);

    if (confirmado) {
        seuStatus.innerHTML = `<span class="status-badge ${statusClass(status)}">${formatStatus(status)}</span>`;
        btnCancelar.classList.remove("hidden");
        return;
    }

    seuStatus.innerHTML = `<span class="status-badge ${statusClass(status)}">${formatStatus(status)}</span>`;
    confirmacaoControle.classList.remove("hidden");
    btnConfirmar.classList.remove("hidden");
}

async function carregarParticipantes() {
    const participantesList = document.getElementById("participantesList");
    const totalParticipantes = document.getElementById("totalParticipantes");

    try {
        const participantes = await apiFetch(`/participacao/rota/${rotaAtual.id}`);
        const lista = Array.isArray(participantes) ? participantes : [];
        totalParticipantes.textContent = lista.length;

        if (lista.length === 0) {
            participantesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <h3>Nenhum participante ainda</h3>
                    <p>Entre na rota para aparecer nesta lista.</p>
                </div>
            `;
            return;
        }

        participantesList.innerHTML = lista.map((participante) => {
            const status = participante.status;
            return `
                <div class="participant-item">
                    <div>
                        <strong>${escapeHTML(participante.nome)}</strong>
                        <small>📧 ${escapeHTML(participante.email)}</small>
                        <small>📱 ${escapeHTML(participante.telefone || "Não informado")}</small>
                    </div>
                    <span class="status-badge ${statusClass(status)}">${formatStatus(status)}</span>
                </div>
            `;
        }).join("");
    } catch (error) {
        participantesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Erro ao carregar participantes</h3>
                <p>${escapeHTML(error.message)}</p>
            </div>
        `;
    }
}

async function entrarNaRotaAtual() {
    const mensagem = document.getElementById("mensagem");
    const button = document.getElementById("btnEntrar");

    try {
        setButtonLoading(button, true, "Entrando...");
        const resultado = await apiFetch("/participacao/entrar", {
            method: "POST",
            body: JSON.stringify({ codigo: rotaAtual.codigo, rota_id: rotaAtual.id })
        });

        showMessage(mensagem, resultado.mensagem || "Entrada na rota realizada com sucesso.", "success");
        await recarregarRotaAtual();
    } catch (error) {
        showMessage(mensagem, error.message || "Erro ao entrar na rota.", "error");
    } finally {
        setButtonLoading(button, false);
    }
}

async function confirmarPresenca() {
    const mensagem = document.getElementById("mensagem");
    const button = document.getElementById("btnConfirmar");

    try {
        setButtonLoading(button, true, "Confirmando...");
        const status = document.getElementById("statusConfirmacao")?.value || "IDA_VOLTA";
        const resultado = await apiFetch("/participacao/confirmar", {
            method: "POST",
            body: JSON.stringify({ rota_id: rotaAtual.id, status })
        });

        showMessage(mensagem, resultado.mensagem || "Presença confirmada com sucesso.", "success");
        await recarregarRotaAtual();
    } catch (error) {
        showMessage(mensagem, error.message || "Erro ao confirmar presença.", "error");
    } finally {
        setButtonLoading(button, false);
    }
}

async function cancelarPresenca() {
    const mensagem = document.getElementById("mensagem");
    const button = document.getElementById("btnCancelar");

    const confirma = window.confirm("Deseja realmente cancelar sua confirmação nesta rota?");
    if (!confirma) return;

    try {
        setButtonLoading(button, true, "Cancelando...");
        const resultado = await apiFetch("/participacao/cancelar", {
            method: "POST",
            body: JSON.stringify({ rota_id: rotaAtual.id })
        });

        showMessage(mensagem, resultado.mensagem || "Presença cancelada com sucesso.", "success");
        await recarregarRotaAtual();
    } catch (error) {
        showMessage(mensagem, error.message || "Erro ao cancelar presença.", "error");
    } finally {
        setButtonLoading(button, false);
    }
}

async function recarregarRotaAtual() {
    const data = await apiFetch("/rotas");
    rotas = Array.isArray(data) ? data.map(normalizeRoute) : [];
    atualizarSelectRotas();
    const atualizada = rotas.find((rota) => String(rota.id) === String(rotaAtual.id));
    if (atualizada) {
        document.getElementById("rotaSelect").value = atualizada.id;
        await carregarDetalhesRota(atualizada);
    }
}

function mostrarEstadoVazio(titulo = "Nenhuma rota selecionada", texto = "Selecione uma rota acima para visualizar informações de vagas e participantes.") {
    document.getElementById("rotaInfo").classList.add("hidden");
    const empty = document.getElementById("emptyState");
    empty.classList.remove("hidden");
    empty.innerHTML = `
        <div class="empty-state-icon">🚌</div>
        <h3>${escapeHTML(titulo)}</h3>
        <p>${escapeHTML(texto)}</p>
    `;
}
