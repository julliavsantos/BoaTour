document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".nav");

    const btnPerfil = document.getElementById("btnPerfil");
    const perfilMenu = document.getElementById("perfilMenu");
    const perfilOverlay = document.getElementById("perfilOverlay");
    const fecharPerfil = document.getElementById("fecharPerfil");

    // NAV COM FUNDO AO ROLAR
    if (nav) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 30) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }

        });

    }

    // ABRIR PERFIL
    if (btnPerfil && perfilMenu && perfilOverlay) {

        btnPerfil.addEventListener("click", (event) => {

            event.stopPropagation();

            perfilMenu.classList.toggle("ativo");
            perfilOverlay.classList.toggle("ativo");

        });

    }

    // FECHAR PERFIL
    if (fecharPerfil && perfilMenu && perfilOverlay) {

        fecharPerfil.addEventListener("click", () => {

            perfilMenu.classList.remove("ativo");
            perfilOverlay.classList.remove("ativo");

        });

    }

    // FECHAR CLICANDO FORA
    if (perfilOverlay && perfilMenu) {

        perfilOverlay.addEventListener("click", () => {

            perfilMenu.classList.remove("ativo");
            perfilOverlay.classList.remove("ativo");

        });

    }

    // IMPEDIR QUE CLIQUE DENTRO FECHE
    if (perfilMenu) {

        perfilMenu.addEventListener("click", (event) => {
            event.stopPropagation();
        });

    }

});