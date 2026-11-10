document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const botao = document.createElement("button");
    botao.id = "darkModeBtn";
    botao.className = "dark-mode-btn";
    botao.type = "button";
    botao.setAttribute("aria-label", "Alternar modo escuro");
    botao.setAttribute("aria-pressed", "false");
    const logo = document.getElementById("logoBoatour");
    const mediaSistema = window.matchMedia("(prefers-color-scheme: dark)");
    const lerCookie = nome => document.cookie.match(new RegExp(`(?:^|;\\s*)${nome}=([^;]+)`))?.[1] || "";
    const preferenciaAtual = () => lerCookie("boatour-theme-preference") || localStorage.getItem("boatour-theme-preference") || ((lerCookie("boatour-dark-mode") || localStorage.getItem("boatour-dark-mode") || "desativado") === "ativo" ? "escuro" : "claro");
    const obterModoAtivo = () => {
        const preferencia = preferenciaAtual();
        return preferencia === "sistema" ? mediaSistema.matches : preferencia === "escuro";
    };
    const salvarPreferencia = preferencia => {
        localStorage.setItem("boatour-theme-preference", preferencia);
        document.cookie = `boatour-theme-preference=${preferencia}; path=/; max-age=31536000; SameSite=Lax`;
        const ativo = preferencia === "sistema" ? mediaSistema.matches : preferencia === "escuro";
        localStorage.setItem("boatour-dark-mode", ativo ? "ativo" : "desativado");
        document.cookie = `boatour-dark-mode=${ativo ? "ativo" : "desativado"}; path=/; max-age=31536000; SameSite=Lax`;
        document.body.classList.toggle("dark-mode", ativo);
        botao.setAttribute("aria-pressed", String(ativo));
        botao.innerHTML = ativo
            ? '<img src="/img/icones/sol.png" alt="Modo claro">'
            : '<img src="/img/icones/lua.png" alt="Modo escuro">';
        if (logo) logo.src = ativo ? "/img/logo/logodarkmode.png" : "/img/logo/logo.png";
    };

    salvarPreferencia(preferenciaAtual());
    const perfil = nav.querySelector(".perfil-area");
    if (perfil) nav.insertBefore(botao, perfil);
    else nav.appendChild(botao);
    botao.addEventListener("click", () => salvarPreferencia(obterModoAtivo() ? "claro" : "escuro"));
    const sincronizar = () => salvarPreferencia(preferenciaAtual());
    window.addEventListener("focus", sincronizar);
    window.addEventListener("pageshow", sincronizar);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) sincronizar(); });
    window.addEventListener("storage", evento => {
        if (["boatour-theme-preference", "boatour-dark-mode"].includes(evento.key)) sincronizar();
    });
    mediaSistema.addEventListener?.("change", () => { if (preferenciaAtual() === "sistema") sincronizar(); });
});
