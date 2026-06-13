// URL base da API
const API_BASE = "http://localhost:3000";

// Estado global
let rotaAtual = null;
let usuarioAtual = null;
let rotas = [];

// Elementos DOM
const rotaSelect = document.getElementById("rotaSelect");
const rotaInfo = document.getElementById("rotaInfo");
const emptyState = document.getElementById("emptyState");
const loading = document.getElementById("loading");
const mensagem = document.getElementById("mensagem");

const btnEntrar = document.getElementById("btnEntrar");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnCancelar = document.getElementById("btnCancelar");

const participantesList = document.getElementById("participantesList");
const suaParticipacao = document.getElementById("suaParticipacao");
const seuStatus = document.getElementById("seuStatus");

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
    await carregarRotas();
});

rotaSelect.addEventListener("change", (e) => {
    if (e.target.value) {
        const rotaId = parseInt(e.target.value);
        const rota = rotas.find(r => r.id === rotaId);
        if (rota) {
            carregarDetalhesRota(rota);
        }
    } else {
        rotaInfo.style.display = "none";
        emptyState.style.display = "none";
    }
});

btnEntrar.addEventListener("click", () => entrarEmRota());
btnConfirmar.addEventListener("click", () => confirmarPresenca());
btnCancelar.addEventListener("click", () => cancelarPresenca());

// Funções Principais
async function carregarRotas() {
    try {
        mostrarLoading(true);

        const response = await fetch(`${API_BASE}/participacao/minhas-rotas`);

        if (!response.ok) {
            if (response.status === 401) {
                exibirMensagem("Você precisa estar autenticado", "error");
                setTimeout(() => window.location.href = "login.html", 2000);
                return;
            }
            throw new Error("Erro ao carregar rotas");
        }

        rotas = await response.json();
        atualizarSelectorRotas();

        if (rotas.length === 0) {
            emptyState.style.display = "block";
            rotaInfo.style.display = "none";
            exibirMensagem("Você não participa de nenhuma rota ainda", "info");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagem("Erro ao carregar rotas: " + erro.message, "error");
    } finally {
        mostrarLoading(false);
    }
}

async function carregarDetalhesRota(rota) {
    try {
        mostrarLoading(true);
        rotaAtual = rota;

        // Atualizar informações da rota
        document.getElementById("rotaNome").textContent = rota.nome;
        document.getElementById("rotaDescricao").textContent = rota.descricao;
        document.getElementById("rotaCodigo").textContent = rota.codigo;
        document.getElementById("rotaVeiculo").textContent = `${rota.nome_veiculo} - ${rota.cor_veiculo}`;
        document.getElementById("rotaPlaca").textContent = rota.placa_veiculo;

        // Atualizar vagas
        const confirmados = rota.confirmados || 0;
        const total = rota.vagas_maximas;
        const percentual = Math.min((confirmados / total) * 100, 100);

        document.getElementById("vagasTexto").textContent = `${confirmados} / ${total} vagas preenchidas`;
        const vagasPreenchidas = document.getElementById("vagasPreenchidas");
        vagasPreenchidas.style.width = percentual + "%";
        vagasPreenchidas.textContent = percentual > 10 ? Math.round(percentual) + "%" : "";

        // Verificar status de participação do usuário
        await verificarParticipacaoUsuario();

        // Carregar participantes
        await carregarParticipantes();

        rotaInfo.style.display = "block";
        emptyState.style.display = "none";
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagem("Erro ao carregar detalhes da rota", "error");
    } finally {
        mostrarLoading(false);
    }
}

async function verificarParticipacaoUsuario() {
    try {
        const response = await fetch(`${API_BASE}/participacao/verificar/${rotaAtual.id}`);

        if (!response.ok) throw new Error("Erro ao verificar participação");

        const participacao = await response.json();

        // Atualizar botões
        if (participacao.participacao_id) {
            // Usuário já entrou na rota
            btnEntrar.style.display = "none";

            if (participacao.confirmado) {
                // Confirmado
                btnConfirmar.style.display = "none";
                btnCancelar.style.display = "block";
                suaParticipacao.style.display = "block";
                seuStatus.innerHTML = '<span class="status-badge status-confirmado">✓ Confirmado</span>';
                seuStatus.innerHTML += ` em ${new Date(participacao.data_confirmacao).toLocaleDateString('pt-BR')}`;
            } else {
                // Não confirmado ainda
                btnConfirmar.style.display = "block";
                btnCancelar.style.display = "none";
                suaParticipacao.style.display = "block";
                seuStatus.innerHTML = '<span class="status-badge status-nao-confirmado">⏳ Aguardando Confirmação</span>';
            }
        } else {
            // Usuário ainda não entrou
            btnEntrar.style.display = "block";
            btnConfirmar.style.display = "none";
            btnCancelar.style.display = "none";
            suaParticipacao.style.display = "none";
        }
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

async function carregarParticipantes() {
    try {
        const response = await fetch(`${API_BASE}/participacao/rota/${rotaAtual.id}`);

        if (!response.ok) throw new Error("Erro ao carregar participantes");

        const participantes = await response.json();

        if (participantes.length === 0) {
            participantesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>Nenhum participante ainda</p>
                </div>
            `;
            return;
        }

        participantesList.innerHTML = participantes.map(p => `
            <div class="participante-item">
                <div class="participante-info">
                    <div class="participante-nome">${p.nome}</div>
                    <div class="participante-contato">📧 ${p.email}</div>
                    <div class="participante-contato">📱 ${p.telefone || "Não informado"}</div>
                </div>
                <div class="participante-status">
                    ${p.confirmado
                ? `<span class="status-badge status-confirmado">✓ Confirmado</span>`
                : `<span class="status-badge status-nao-confirmado">⏳ Não Confirmado</span>`
            }
                </div>
            </div>
        `).join("");
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagem("Erro ao carregar participantes", "error");
    }
}

// Ações de Participação
async function entrarEmRota() {
    try {
        mostrarLoading(true);

        const response = await fetch(`${API_BASE}/participacao/entrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rota_id: rotaAtual.id
            }),
            credentials: "include"
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || "Erro ao entrar na rota");
        }

        exibirMensagem("✓ Você entrou na rota com sucesso!", "success");

        // Atualizar informações
        await verificarParticipacaoUsuario();
        await carregarParticipantes();
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagem("Erro: " + erro.message, "error");
    } finally {
        mostrarLoading(false);
    }
}

async function confirmarPresenca() {
    try {
        mostrarLoading(true);

        const response = await fetch(`${API_BASE}/participacao/confirmar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rota_id: rotaAtual.id
            }),
            credentials: "include"
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || "Erro ao confirmar presença");
        }

        exibirMensagem("✓ Presença confirmada com sucesso!", "success");

        // Atualizar informações
        await verificarParticipacaoUsuario();
        await carregarParticipantes();
        await carregarRotas();
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagem("Erro: " + erro.message, "error");
    } finally {
        mostrarLoading(false);
    }
}

async function cancelarPresenca() {
    if (!confirm("Tem certeza que deseja cancelar sua presença? Isso liberará a vaga que você ocupava.")) {
        return;
    }

    try {
        mostrarLoading(true);

        const response = await fetch(`${API_BASE}/participacao/cancelar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rota_id: rotaAtual.id
            }),
            credentials: "include"
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.mensagem || "Erro ao cancelar presença");
        }

        exibirMensagem("✓ Presença cancelada com sucesso! A vaga foi liberada.", "success");

        // Atualizar informações
        await verificarParticipacaoUsuario();
        await carregarParticipantes();
        await carregarRotas();
    } catch (erro) {
        console.error("Erro:", erro);
        exibirMensagem("Erro: " + erro.message, "error");
    } finally {
        mostrarLoading(false);
    }
}

// Utilitários
function atualizarSelectorRotas() {
    rotaSelect.innerHTML = '<option value="">Selecione uma rota...</option>' +
        rotas.map(r => `
            <option value="${r.id}">
                ${r.nome} - ${r.confirmados || 0}/${r.vagas_maximas} vagas
            </option>
        `).join("");
}

function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `message ${tipo}`;

    // Auto-fechar mensagens após 5 segundos
    if (tipo !== "error") {
        setTimeout(() => {
            mensagem.className = "message";
        }, 5000);
    }
}

function mostrarLoading(ativo) {
    loading.style.display = ativo ? "block" : "none";
}
