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
        botao.innerHTML = "☀️";

        if (logo) {
            logo.src = "/global-img/logo/logodarkmode.png";
        }

    } else {

        botao.innerHTML = "🌙";

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

            botao.innerHTML = "☀️";

            if (logo) {
                logo.src = "/global-img/logo/logodarkmode.png";
            }

            localStorage.setItem("boatour-dark-mode", "ativo");

        } else {

            botao.innerHTML = "🌙";

            if (logo) {
                logo.src = "/global-img/logo/logo.png";
            }

            localStorage.setItem("boatour-dark-mode", "desativado");

        }

    });

});