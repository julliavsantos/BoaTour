
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
    const salvarModo = ativo => {
        const valor = ativo ? "ativo" : "desativado";
        localStorage.setItem("boatour-dark-mode", valor);
        document.cookie = "boatour-dark-mode=" + valor + "; path=/; max-age=31536000; SameSite=Lax";
    };
    const modoSalvo = lerCookie() || localStorage.getItem("boatour-dark-mode") || "desativado";
    if (!lerCookie()) salvarModo(modoSalvo === "ativo");
    const atualizarTema = ativo => {
        document.body.classList.toggle("dark-mode", ativo);
        botao.innerHTML = ativo
            ? '<img src="../img/icones/sol.png" alt="Modo claro">'
            : '<img src="../img/icones/lua.png" alt="Modo escuro">';
        if (logo) logo.src = ativo ? "../img/logo/logodarkmode2.png" : "../img/logo/logo2.0.png";
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
        salvarModo(modoEscuro);
        atualizarTema(modoEscuro);
    });

    const sincronizarTemaCompartilhado = () => {
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

});
