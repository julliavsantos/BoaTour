
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav");
    if (!nav) return;

    const botao = document.createElement("button");
    botao.id = "darkModeBtn";
    botao.className = "dark-mode-btn";
    botao.type = "button";
    botao.setAttribute("aria-label", "Alternar modo escuro");

    const logo = document.getElementById("logoBoatour");
    const fundo = document.querySelector(".fundo");

    const lerCookie = () => document.cookie.match(/(?:^|;\s*)boatour-dark-mode=(ativo|desativado)(?:;|$)/)?.[1] || "";
    function salvarModo(modoEscuro) {
        const valor = modoEscuro ? "ativo" : "desativado";
        localStorage.setItem("boatour-dark-mode", valor);
        document.cookie = "boatour-dark-mode=" + valor + "; path=/; max-age=31536000; SameSite=Lax";
    }

    // Atualiza os elementos conforme o tema
    function atualizarTema(modoEscuro, salvar = true) {
        document.body.classList.toggle("dark-mode", modoEscuro);

        // Ícone do botão
        botao.innerHTML = modoEscuro
            ? '<img src="../img/icones/sol.png" alt="Modo claro">'
            : '<img src="../img/icones/lua.png" alt="Modo escuro">';

        // Logo
        if (logo) {
            logo.src = modoEscuro
                ? "../img/logo/logodarkmode.png"
                : "../img/logo/logo.png";
        }

        // Banner
        if (fundo) {
            fundo.style.backgroundImage = modoEscuro
                ? 'url("../img/banners/fundo04dark.png")'
                : 'url("../img/banners/fundo04.png")';
        }

        // Salva a preferência
        if (salvar) salvarModo(modoEscuro);
    }

    // Recupera o tema salvo
    const modoSalvo = lerCookie() || localStorage.getItem("boatour-dark-mode") || "desativado";
    const modoEscuroInicial = modoSalvo === "ativo";
    if (!lerCookie()) salvarModo(modoEscuroInicial);

    // Insere o botão na navegação
    const perfil = nav.querySelector(".perfil-area");

    if (perfil) {
        nav.insertBefore(botao, perfil);
    } else {
        nav.appendChild(botao);
    }

    // Aplica o tema inicial sem esperar um clique
    atualizarTema(modoEscuroInicial, false);

    // Alterna o tema ao clicar
    botao.addEventListener("click", () => {
        const modoEscuro =
            !document.body.classList.contains("dark-mode");

        atualizarTema(modoEscuro);
    });
    const sincronizarTemaCompartilhado = () => {
        const modoAtual = lerCookie();
        if (!modoAtual) return;
        localStorage.setItem("boatour-dark-mode", modoAtual);
        atualizarTema(modoAtual === "ativo", false);
    };
    window.addEventListener("focus", sincronizarTemaCompartilhado);
    window.addEventListener("pageshow", sincronizarTemaCompartilhado);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) sincronizarTemaCompartilhado();
    });
});
