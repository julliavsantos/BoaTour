document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const botao = document.createElement("button");
    botao.id = "darkModeBtn";
    botao.className = "dark-mode-btn";
    botao.type = "button";
    botao.setAttribute("aria-label", "Alternar modo escuro");
    const logo = document.getElementById("logoBoatour");
    const mediaSistema = window.matchMedia("(prefers-color-scheme: dark)");
    const lerCookie = () => document.cookie.match(/(?:^|;\s*)boatour-dark-mode=(ativo|desativado)(?:;|$)/)?.[1] || "";
    const lerPreferenciaCookie = () => document.cookie.match(/(?:^|;\s*)boatour-theme-preference=(claro|escuro|sistema)(?:;|$)/)?.[1] || "";
    const salvarModo = ativo => {
        const valor = ativo ? "ativo" : "desativado";
        localStorage.setItem("boatour-dark-mode", valor);
        document.cookie = "boatour-dark-mode=" + valor + "; path=/; max-age=31536000; SameSite=Lax";
    };
    const atualizarTema = ativo => {
        document.body.classList.toggle("dark-mode", ativo);
        botao.innerHTML = ativo
            ? '<img src="../img/icones/sol.png" alt="Modo claro">'
            : '<img src="../img/icones/lua.png" alt="Modo escuro">';
        if (logo) logo.src = ativo ? "../img/logo/logodarkmode.png" : "../img/logo/logo.png";
    };
    const obterModoAtivo = () => {
        const preferencia = localStorage.getItem("boatour-theme-preference") || lerPreferenciaCookie();
        if (preferencia === "escuro") return true;
        if (preferencia === "claro") return false;
        if (preferencia === "sistema") return mediaSistema.matches;
        return (lerCookie() || localStorage.getItem("boatour-dark-mode") || "desativado") === "ativo";
    };
    const aplicarModo = ativo => {
        salvarModo(ativo);
        atualizarTema(ativo);
    };
    window.boatourDefinirTema = preferencia => {
        if (!["claro", "escuro", "sistema"].includes(preferencia)) return;
        localStorage.setItem("boatour-theme-preference", preferencia);
        document.cookie = "boatour-theme-preference=" + preferencia + "; path=/; max-age=31536000; SameSite=Lax";
        aplicarModo(preferencia === "sistema" ? mediaSistema.matches : preferencia === "escuro");
    };
    atualizarTema(obterModoAtivo());
    const perfil = nav.querySelector(".perfil-area");
    if (perfil) nav.insertBefore(botao, perfil);
    else nav.appendChild(botao);

    botao.addEventListener("click", () => {
        window.boatourDefinirTema(document.body.classList.contains("dark-mode") ? "claro" : "escuro");
    });
    const sincronizarTemaCompartilhado = () => {
        atualizarTema(obterModoAtivo());
    };
    window.addEventListener("focus", sincronizarTemaCompartilhado);
    window.addEventListener("pageshow", sincronizarTemaCompartilhado);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) sincronizarTemaCompartilhado();
    });
    window.addEventListener("storage", evento => {
        if (["boatour-theme-preference", "boatour-dark-mode"].includes(evento.key)) sincronizarTemaCompartilhado();
    });
    mediaSistema.addEventListener?.("change", () => {
        if ((localStorage.getItem("boatour-theme-preference") || lerPreferenciaCookie()) === "sistema") sincronizarTemaCompartilhado();
    });
});
