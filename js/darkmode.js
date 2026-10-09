document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".nav");

    if (!nav) return;

    const botao = document.createElement("button");

    botao.id = "darkModeBtn";
    botao.className = "dark-mode-btn";
    botao.type = "button";
    botao.setAttribute("aria-label", "Alternar modo escuro");

    const logo = document.getElementById("logoBoatour");

    const modoSalvo = localStorage.getItem("boatour-dark-mode");

    if (modoSalvo === "ativo") {

        document.body.classList.add("dark-mode");
        botao.innerHTML = 
        ` <img src="img/icones/sol.png" alt="Modo claro"> `;

        if (logo) {
            logo.src = "img/logo/logodarkmode.png";
        }

    } else {

        botao.innerHTML = 
        ` <img src="img/icones/lua.png" alt="Modo claro"> `
        ;

    }

    const perfil = nav.querySelector(".perfil-area");

    if (perfil) {
        nav.insertBefore(botao, perfil);
    } else {
        nav.appendChild(botao);
    }

    botao.addEventListener("click", () => {

        const modoEscuro = document.body.classList.toggle("dark-mode");

        if (modoEscuro) {

            botao.innerHTML = 
             ` <img src="img/icones/sol.png" alt="Modo escuro"> `
            ;

            if (logo) {
                logo.src = "img/logo/logodarkmode.png";
            }

            localStorage.setItem("boatour-dark-mode", "ativo");

        } else {

            botao.innerHTML = 
             ` <img src="img/icones/lua.png" alt="Modo escuro"> `
            ;

            if (logo) {
                logo.src = "img/logo/logo.png";
            }

            localStorage.setItem("boatour-dark-mode", "desativado");

        }

    });

});