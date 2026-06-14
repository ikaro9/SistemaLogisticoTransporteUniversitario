const API_BASE = window.location.port === "3000" ? "" : "http://localhost:3000";

async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    let data = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        data = await response.json();
    }

    if (!response.ok) {
        const message = data?.mensagem || data?.erro || "Não foi possível concluir a operação.";
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function firstLetter(name) {
    return (name || "U").trim().charAt(0).toUpperCase() || "U";
}

function formatStatus(status) {
    if (!status) return "Aguardando confirmação";
    const normalized = String(status).toUpperCase();
    if (normalized === "CANCELADO") return "Cancelado";
    if (normalized === "CONFIRMADO") return "Confirmado";
    return normalized.charAt(0) + normalized.slice(1).toLowerCase();
}

function isConfirmed(status) {
    return Boolean(status) && String(status).toUpperCase() !== "CANCELADO";
}

function statusClass(status) {
    if (!status) return "status-pendente";
    if (String(status).toUpperCase() === "CANCELADO") return "status-cancelado";
    return "status-confirmado";
}

function setLoading(element, active) {
    if (!element) return;
    element.classList.toggle("show", active);
}

function showMessage(element, message, type = "info") {
    if (!element) return;
    element.textContent = message;
    element.className = `message ${type}`;
}

function clearMessage(element) {
    if (!element) return;
    element.textContent = "";
    element.className = "message";
}

function setButtonLoading(button, active, textWhenLoading = "Processando...") {
    if (!button) return;
    if (active) {
        button.dataset.originalText = button.textContent;
        button.textContent = textWhenLoading;
        button.disabled = true;
        return;
    }
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
}

async function getSession() {
    try {
        const data = await apiFetch("/usuarios/sessao");
        return data.usuario;
    } catch (error) {
        return null;
    }
}

async function requireAuth() {
    const usuario = await getSession();
    if (!usuario) {
        window.location.href = "login.html";
        return null;
    }
    renderUserSummary(usuario);
    return usuario;
}

function renderUserSummary(usuario) {
    const userName = document.querySelector("[data-user-name]");
    const userRole = document.querySelector("[data-user-role]");
    if (userName) userName.textContent = usuario?.nome || "Usuário";
    if (userRole) userRole.textContent = usuario?.tipo_perfil || "Perfil";
}

function markActiveNav(page) {
    document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.dataset.page === page);
    });
}

async function logout() {
    try {
        await apiFetch("/usuarios/logout", { method: "POST" });
    } finally {
        window.location.href = "login.html";
    }
}

function bindLogout() {
    const button = document.getElementById("logoutButton");
    if (button) button.addEventListener("click", logout);
}

function setupAppShell(page) {
    markActiveNav(page);
    bindLogout();
}

function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function normalizeRoute(rota) {
    const confirmados = Number(rota?.confirmados || 0);
    const vagas = Number(rota?.vagas_maximas || 0);
    const percentage = vagas > 0 ? Math.min(100, Math.round((confirmados / vagas) * 100)) : 0;
    return { ...rota, confirmados, vagas, percentage };
}
