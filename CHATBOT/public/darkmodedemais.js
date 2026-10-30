document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".nav");

    if (!nav) return;

    const botao = document.createElement("button");

    botao.id = "darkModeBtn";
    botao.className = "dark-mode-btn";
    botao.type = "button";
    botao.setAttribute("aria-label", "Alternar modo escuro");

    const logo = document.getElementById("logoBoatour");

    const lerCookie = () => document.cookie.match(/(?:^|;\s*)boatour-dark-mode=(ativo|desativado)(?:;|$)/)?.[1] || "";
    const lerPreferenciaCookie = () => document.cookie.match(/(?:^|;\s*)boatour-theme-preference=(claro|escuro|sistema)(?:;|$)/)?.[1] || "";
    const mediaSistema = window.matchMedia("(prefers-color-scheme: dark)");
    const salvarModo = ativo => {
        const valor = ativo ? "ativo" : "desativado";
        localStorage.setItem("boatour-dark-mode", valor);
        document.cookie = "boatour-dark-mode=" + valor + "; path=/; max-age=31536000; SameSite=Lax";
    };
    const modoDaUrl = new URLSearchParams(window.location.search).get("tema");
    const preferenciaTema = lerPreferenciaCookie() || localStorage.getItem("boatour-theme-preference");
    const modoSalvo = preferenciaTema === "escuro" ? "ativo"
        : preferenciaTema === "claro" ? "desativado"
            : preferenciaTema === "sistema" ? (mediaSistema.matches ? "ativo" : "desativado")
                : ["ativo", "desativado"].includes(modoDaUrl) ? modoDaUrl
                    : lerCookie() || localStorage.getItem("boatour-dark-mode") || "desativado";
    if (!lerCookie() || preferenciaTema || ["ativo", "desativado"].includes(modoDaUrl)) salvarModo(modoSalvo === "ativo");
    const atualizarTema = ativo => {
        document.body.classList.toggle("dark-mode", ativo);
        botao.innerHTML = ativo
            ? '<img src="/img/icones/sol.png" alt="Modo claro">'
            : '<img src="/img/icones/lua.png" alt="Modo escuro">';
        if (logo) logo.src = ativo ? "/img/logo/logodarkmode.png" : "/img/logo/logo.png";
    };

    const perfil = nav.querySelector(".perfil-area");

    if (perfil) {
        nav.insertBefore(botao, perfil);
    } else {
        nav.appendChild(botao);
    }

    atualizarTema(modoSalvo === "ativo");

    botao.addEventListener("click", () => {
        const modoEscuro = !document.body.classList.contains("dark-mode");
        const preferencia = modoEscuro ? "escuro" : "claro";
        localStorage.setItem("boatour-theme-preference", preferencia);
        document.cookie = "boatour-theme-preference=" + preferencia + "; path=/; max-age=31536000; SameSite=Lax";
        salvarModo(modoEscuro);
        atualizarTema(modoEscuro);
    });

    const sincronizarTemaCompartilhado = () => {
        const preferencia = lerPreferenciaCookie() || localStorage.getItem("boatour-theme-preference");
        if (preferencia) {
            const escuro = preferencia === "escuro" || (preferencia === "sistema" && mediaSistema.matches);
            salvarModo(escuro);
            atualizarTema(escuro);
            return;
        }
        const modoAtual = lerCookie();
        if (!modoAtual) return;
        localStorage.setItem("boatour-dark-mode", modoAtual);
        atualizarTema(modoAtual === "ativo");
    };
    window.addEventListener("focus", sincronizarTemaCompartilhado);
    window.addEventListener("pageshow", sincronizarTemaCompartilhado);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) sincronizarTemaCompartilhado();
    });
    mediaSistema.addEventListener?.("change", () => {
        if ((lerPreferenciaCookie() || localStorage.getItem("boatour-theme-preference")) === "sistema") sincronizarTemaCompartilhado();
    });

});
