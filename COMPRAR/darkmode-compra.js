
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

    // Atualiza os elementos conforme o tema
    function atualizarTema(modoEscuro) {
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
        localStorage.setItem(
            "boatour-dark-mode",
            modoEscuro ? "ativo" : "desativado"
        );
    }

    // Recupera o tema salvo
    const modoSalvo = localStorage.getItem("boatour-dark-mode");
    const modoEscuroInicial = modoSalvo === "ativo";

    // Insere o botão na navegação
    const perfil = nav.querySelector(".perfil-area");

    if (perfil) {
        nav.insertBefore(botao, perfil);
    } else {
        nav.appendChild(botao);
    }

    // Aplica o tema inicial sem esperar um clique
    atualizarTema(modoEscuroInicial);

    // Alterna o tema ao clicar
    botao.addEventListener("click", () => {
        const modoEscuro =
            !document.body.classList.contains("dark-mode");

        atualizarTema(modoEscuro);
    });
});
