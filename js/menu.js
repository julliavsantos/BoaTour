document.addEventListener("DOMContentLoaded", () => {

    const nav = document.querySelector(".nav");

    const btnPerfil =
        document.getElementById("btnPerfil");

    const perfilMenu =
        document.getElementById("perfilMenu");

    const perfilOverlay =
        document.getElementById("perfilOverlay");

    const fecharPerfil =
        document.getElementById("fecharPerfil");


    // ==========================================
    // NAV
    // ==========================================

    if (nav) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 30) {

                nav.classList.add("scrolled");

            } else {

                nav.classList.remove("scrolled");

            }

        });

    }


    // ==========================================
    // MENU LATERAL
    // CLICAR → ABRE O MENU
    // ==========================================

    if (btnPerfil && perfilMenu && perfilOverlay) {

        btnPerfil.addEventListener("click", (event) => {

            event.stopPropagation();

            perfilMenu.classList.toggle("ativo");

            perfilOverlay.classList.toggle("ativo");

        });

    }


    // ==========================================
    // FOTO DENTRO DO MENU
    // CLICAR → VAI PARA O PERFIL
    // ==========================================

    if (perfilMenu) {

        const fotoDentroMenu =
            perfilMenu.querySelector(".foto-viajante");

        if (fotoDentroMenu) {

            fotoDentroMenu.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    window.location.href =
                        window.location.pathname.includes("/PERFIL/")
                            ? "index.html"
                            : "PERFIL/index.html";

                }
            );

        }

    }


    // ==========================================
    // FECHAR NO X
    // ==========================================

    if (fecharPerfil && perfilMenu && perfilOverlay) {

        fecharPerfil.addEventListener("click", () => {

            perfilMenu.classList.remove("ativo");

            perfilOverlay.classList.remove("ativo");

        });

    }


    // ==========================================
    // FECHAR CLICANDO FORA
    // ==========================================

    if (perfilOverlay && perfilMenu) {

        perfilOverlay.addEventListener("click", () => {

            perfilMenu.classList.remove("ativo");

            perfilOverlay.classList.remove("ativo");

        });

    }


    // ==========================================
    // NÃO FECHAR AO CLICAR DENTRO DO MENU
    // ==========================================

    if (perfilMenu) {

        perfilMenu.addEventListener("click", (event) => {

            event.stopPropagation();

        });

    }


    // ==========================================
    // ATUALIZAR USUÁRIO
    // ==========================================

    atualizarMenuUsuario();

});


// ==========================================
// USUÁRIO LOGADO
// ==========================================

function atualizarMenuUsuario() {

    const usuarioSalvo =
        localStorage.getItem("boatourUsuario");


    const btnEntrar =
        document.getElementById("btnEntrar");


    const perfilLogin =
        document.querySelector(".perfil-login");


    const nomePerfil =
        document.getElementById("nomePerfil");


    const descricaoPerfil =
        document.getElementById("descricaoPerfil");


    // ==========================================
    // FOTOS
    // ==========================================

    const fotosPerfil =
        document.querySelectorAll(
            ".foto-viajante, .foto-perfil-header"
        );


    // ==========================================
    // USUÁRIO NÃO LOGADO
    // ==========================================

    if (!usuarioSalvo) {

        if (btnEntrar) {

            btnEntrar.style.display = "";

        }


        if (perfilLogin) {

            perfilLogin.style.display = "";

        }


        if (nomePerfil) {

            nomePerfil.textContent =
                "Olá, viajante!";

        }


        if (descricaoPerfil) {

            descricaoPerfil.textContent =
                "Acesse sua conta";

        }


        fotosPerfil.forEach((foto) => {

            foto.src =
                "http://localhost:3000/img/icones/perfil.png";

        });


        return;

    }


    // ==========================================
    // LER USUÁRIO
    // ==========================================

    let usuario;

    try {

        usuario =
            JSON.parse(usuarioSalvo);

    } catch (erro) {

        console.error(
            "ERRO AO LER boatourUsuario:",
            erro
        );

        localStorage.removeItem(
            "boatourUsuario"
        );

        return;

    }


    // ==========================================
    // ESCONDER ENTRAR
    // ==========================================

    if (btnEntrar) {

        btnEntrar.style.display = "none";

    }


    if (perfilLogin) {

        perfilLogin.style.display = "none";

    }


    // ==========================================
    // NOME
    // ==========================================

    if (nomePerfil) {

        nomePerfil.textContent =
            `Olá, ${usuario.nome || "viajante"}!`;

    }


    // ==========================================
    // EMAIL
    // ==========================================

    if (descricaoPerfil) {

        descricaoPerfil.textContent =
            usuario.email ||
            "Sua conta BoaTour";

    }


    // ==========================================
    // FOTO DO USUÁRIO
    // ==========================================

    let fotoUsuario =
        usuario.foto_perfil;


    // Se existir uma foto salva no banco/localStorage
    if (fotoUsuario) {

        if (!fotoUsuario.startsWith("http")) {

            fotoUsuario =
                `http://localhost:3000/${fotoUsuario}`;

        }


        // Evita cache da foto antiga

        fotoUsuario =
            `${fotoUsuario}?t=${Date.now()}`;


        fotosPerfil.forEach((foto) => {

            foto.src = fotoUsuario;

        });

    } else {

        // ======================================
        // FOTO PADRÃO
        // ======================================

        fotosPerfil.forEach((foto) => {

            foto.src =
                "http://localhost:3000/img/icones/perfil.png";

        });

    }

}
