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


    // --- NAV ---

    if (nav) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 30) {

                nav.classList.add("scrolled");

            } else {

                nav.classList.remove("scrolled");

            }

        });

    }


    // --- MENU LATERAL · CLICAR → ABRE O MENU ---

    if (btnPerfil && perfilMenu && perfilOverlay) {

        btnPerfil.addEventListener("click", (event) => {

            event.stopPropagation();

            perfilMenu.classList.toggle("ativo");

            perfilOverlay.classList.toggle("ativo");

        });

    }


    // --- FOTO DENTRO DO MENU · CLICAR → VAI PARA O PERFIL ---

    if (perfilMenu) {

        const fotoDentroMenu =
            perfilMenu.querySelector(".foto-viajante");

        if (fotoDentroMenu) {
            fotoDentroMenu.style.cursor = "pointer";
            fotoDentroMenu.setAttribute("role", "link");
            fotoDentroMenu.setAttribute("tabindex", "0");
            fotoDentroMenu.setAttribute("aria-label", "Abrir meu perfil");
            const abrirPerfil = event => {
                if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                window.location.href = window.location.port === "3001"
                    ? "http://localhost:3000/PERFIL/index.html"
                    : new URL("/PERFIL/index.html", window.location.origin).href;
            };
            fotoDentroMenu.addEventListener("click", abrirPerfil);
            fotoDentroMenu.addEventListener("keydown", abrirPerfil);
        }

    }


    // --- FECHAR NO X ---

    if (fecharPerfil && perfilMenu && perfilOverlay) {

        fecharPerfil.addEventListener("click", () => {

            perfilMenu.classList.remove("ativo");

            perfilOverlay.classList.remove("ativo");

        });

    }


    // --- FECHAR CLICANDO FORA ---

    if (perfilOverlay && perfilMenu) {

        perfilOverlay.addEventListener("click", () => {

            perfilMenu.classList.remove("ativo");

            perfilOverlay.classList.remove("ativo");

        });

    }


    // --- NÃO FECHAR AO CLICAR DENTRO DO MENU ---

    if (perfilMenu) {

        perfilMenu.addEventListener("click", (event) => {

            event.stopPropagation();

        });

    }


    // --- ATUALIZAR USUÁRIO ---

    atualizarMenuUsuario();
    prepararSaidaMenu(perfilMenu);
    window.addEventListener("boatour:profile-updated", () => atualizarMenuUsuario());

});

function prepararSaidaMenu(perfilMenu) {
    if (!perfilMenu) return;
    const links = perfilMenu.querySelector(".perfil-links");
    if (links && !links.querySelector("#btnSairMenu")) {
        const sair = document.createElement("button");
        sair.type = "button";
        sair.id = "btnSairMenu";
        sair.className = "perfil-link-botao";
        const imagemSair = window.location.port === "3001"
            ? "/global-img/icones/sair.png"
            : new URL("/img/icones/sair.png", window.location.origin).href;
        sair.innerHTML = `<span aria-hidden="true"><img src="${imagemSair}" alt=""></span><div><strong>Sair</strong><small>Encerrar sessão da conta</small></div>`;
        links.appendChild(sair);
    }
    const botaoSairMenu = document.getElementById("btnSairMenu");
    const atualizarVisibilidadeSaida = () => {
        if (botaoSairMenu) botaoSairMenu.style.display = localStorage.getItem("boatourSessionToken") ? "" : "none";
    };
    atualizarVisibilidadeSaida();
    window.addEventListener("boatour:login", atualizarVisibilidadeSaida);
    if (!document.getElementById("modalSairConta")) {
        const modais = document.createElement("div");
        modais.innerHTML = '<div class="modal-login" id="modalSairConta"><div class="login"><button type="button" class="fechar" id="fecharSairConta" aria-label="Fechar">&times;</button><h2>Sair da conta <span>BoaTour</span></h2><p>Tem certeza que deseja sair da sua conta?</p><div class="botoesSair"><button type="button" class="btnCancelar" id="cancelarSairConta">Cancelar</button><button type="button" class="btnLogin" id="continuarSairConta">Sair da conta</button></div></div></div><div class="modal-login" id="modalSenhaSairConta"><div class="login"><button type="button" class="fechar" id="fecharSenhaSairConta" aria-label="Fechar">&times;</button><h2>Confirmar saída <span>BoaTour</span></h2><p>Digite sua senha para confirmar a saída da conta.</p><input type="password" id="senhaSairConta" placeholder="Senha" autocomplete="current-password"><button type="button" class="btnLogin" id="confirmarSairConta">Confirmar saída</button></div></div>';
        while (modais.firstElementChild) document.body.appendChild(modais.firstElementChild);
    }
    const primeiro = document.getElementById("modalSairConta");
    const segundo = document.getElementById("modalSenhaSairConta");
    const senha = document.getElementById("senhaSairConta");
    const abrir = () => primeiro?.classList.add("ativo");
    botaoSairMenu?.addEventListener("click", abrir);
    document.getElementById("btnSairConta")?.addEventListener("click", event => { event.preventDefault(); abrir(); });
    ["fecharSairConta", "cancelarSairConta"].forEach(id => document.getElementById(id)?.addEventListener("click", () => primeiro?.classList.remove("ativo")));
    document.getElementById("continuarSairConta")?.addEventListener("click", () => {
        primeiro?.classList.remove("ativo");
        segundo?.classList.add("ativo");
        if (senha) { senha.value = ""; senha.focus(); }
    });
    document.getElementById("fecharSenhaSairConta")?.addEventListener("click", () => { segundo?.classList.remove("ativo"); if (senha) senha.value = ""; });
    document.getElementById("confirmarSairConta")?.addEventListener("click", async () => {
        const token = localStorage.getItem("boatourSessionToken");
        if (!token) return window.alert("Sua sessão expirou. Faça login novamente.");
        if (!senha?.value) return window.boatourFieldError?.(senha, "Digite sua senha para continuar.");
        try {
            const confirmacao = await fetch("http://localhost:3000/confirmar-senha", { method: "POST", headers: { "Content-Type": "application/json", "X-Session-Token": token }, body: JSON.stringify({ senha: senha.value }) });
            const resultado = await confirmacao.json();
            if (!confirmacao.ok || resultado.error) return window.boatourFieldError?.(senha, resultado.error || "Senha incorreta.");
            await fetch("http://localhost:3000/logout", { method: "POST", headers: { "X-Session-Token": token } });
            localStorage.removeItem("boatourUsuario");
            localStorage.removeItem("boatourSessionToken");
            window.location.href = window.location.port === "3001" ? "http://localhost:3000/index.html?saiu=sucesso" : new URL("/index.html?saiu=sucesso", window.location.origin).href;
        } catch { window.alert("Não foi possível sair da conta."); }
    });
}


// --- USUÁRIO LOGADO ---

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


    // --- FOTOS ---

    const fotosPerfil =
        document.querySelectorAll(
            ".foto-viajante, .foto-perfil-header"
        );

    fotosPerfil.forEach(foto => {
        if (!foto.dataset.avatarPadrao) {
            foto.dataset.avatarPadrao = foto.getAttribute("src") || "../img/icones/perfil.png";
        }
        foto.onerror = () => {
            foto.onerror = null;
            const padrao = foto.dataset.avatarPadrao;
            if (padrao && foto.getAttribute("src") !== padrao) foto.src = padrao;
        };
    });


    // --- USUÁRIO NÃO LOGADO ---

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

        atualizarBannerMenu(null);


        fotosPerfil.forEach(foto => { foto.src = foto.dataset.avatarPadrao; });


        return;

    }


    // --- LER USUÁRIO ---

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


    // --- ESCONDER ENTRAR ---

    if (btnEntrar) {

        btnEntrar.style.display = "none";

    }


    if (perfilLogin) {

        perfilLogin.style.display = "none";

    }


    // --- NOME ---

    if (nomePerfil) {

        nomePerfil.textContent =
            `Olá, ${usuario.nome || "viajante"}!`;

    }


    // --- EMAIL ---

    if (descricaoPerfil) {

        descricaoPerfil.textContent =
            usuario.email ||
            "Sua conta BoaTour";

    }

    atualizarBannerMenu(usuario);


    // --- FOTO DO USUÁRIO ---

    const fotoUsuario = String(usuario.foto_perfil || "").trim();
    if (!fotoUsuario) {
        fotosPerfil.forEach(foto => { foto.src = foto.dataset.avatarPadrao; });
        return;
    }

    let urlFoto;
    if (/^(https?:|data:|blob:)/i.test(fotoUsuario)) {
        urlFoto = fotoUsuario;
    } else {
        const caminho = fotoUsuario.replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
        const origemApi = window.location.port === "3000"
            ? window.location.origin
            : "http://localhost:3000";
        urlFoto = new URL(caminho, `${origemApi}/`).href;
    }

    if (/^https?:/i.test(urlFoto)) {
        const url = new URL(urlFoto);
        url.searchParams.set("t", String(Date.now()));
        urlFoto = url.href;
    }
    fotosPerfil.forEach(foto => { foto.src = urlFoto; });

}

function atualizarBannerMenu(usuario) {
    const topo = document.querySelector("#perfilMenu .perfil-topo");
    const caminho = usuario?.banner_perfil;
    if (!topo) return;
    if (!caminho) {
        topo.style.backgroundImage = "";
        topo.style.backgroundSize = "";
        topo.style.backgroundPosition = "";
        return;
    }

    let url;
    if (/^https?:\/\//i.test(caminho)) {
        url = caminho;
    } else {
        const caminhoRaiz = `/${String(caminho).replace(/^(\.\.\/)+/, "").replace(/^\/+/, "")}`;
        url = window.location.port === "3001"
            ? `http://localhost:3000${caminhoRaiz}`
            : new URL(caminhoRaiz, window.location.origin).href;
    }

    topo.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, .58), rgba(0, 0, 0, .58)), url("${url}")`;
    topo.style.backgroundSize = "cover";
    topo.style.backgroundPosition = "center";
}
