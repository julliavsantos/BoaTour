// --- MODAL DE LOGIN / PERFIL ---

// Solicita login quando alguém tenta adicionar um favorito sem sessão.
(() => {
    const tiposFavorito = {
        destino: { artigo: "um", nome: "destino" },
        oferta: { artigo: "uma", nome: "oferta" },
        hotel: { artigo: "um", nome: "hotel" },
        atividade: { artigo: "uma", nome: "atividade" }
    };

    let modalFavoritoLogin;

    function criarModalFavoritoLogin() {
        if (modalFavoritoLogin) return modalFavoritoLogin;

        modalFavoritoLogin = document.createElement("div");
        modalFavoritoLogin.className = "modal-favorito-login";
        modalFavoritoLogin.hidden = true;
        modalFavoritoLogin.setAttribute("role", "dialog");
        modalFavoritoLogin.setAttribute("aria-modal", "true");
        modalFavoritoLogin.setAttribute("aria-labelledby", "tituloFavoritoLogin");
        modalFavoritoLogin.innerHTML = `
            <section class="modal-favorito-login__painel">
                <button type="button" class="modal-favorito-login__fechar" aria-label="Fechar">&times;</button>
                <div class="modal-favorito-login__icone">
                    <img src="/img/icones/mascote02.png" alt="">
                </div>
                <h2 id="tituloFavoritoLogin">Entre na sua conta</h2>
                <p class="modal-favorito-login__mensagem"></p>
                <div class="modal-favorito-login__acoes">
                    <button type="button" class="modal-favorito-login__abrir-login">Ir para login</button>
                    <a class="modal-favorito-login__cadastro">Ainda não tenho conta cadastrada</a>
                </div>
            </section>
        `;
        document.body.appendChild(modalFavoritoLogin);

        const fechar = () => { modalFavoritoLogin.hidden = true; };
        modalFavoritoLogin.querySelector(".modal-favorito-login__fechar")
            .addEventListener("click", fechar);
        modalFavoritoLogin.addEventListener("click", evento => {
            if (evento.target === modalFavoritoLogin) fechar();
        });
        modalFavoritoLogin.querySelector(".modal-favorito-login__abrir-login")
            .addEventListener("click", () => {
                fechar();
                document.getElementById("modalLogin")?.classList.add("ativo");
                document.getElementById("cpfLogin")?.focus();
            });

        const linkCadastro = document.querySelector(
            '#modalLogin a[href*="CADASTRO/index.html"]'
        );
        modalFavoritoLogin.querySelector(".modal-favorito-login__cadastro").href =
            linkCadastro?.href || new URL("/CADASTRO/index.html", window.location.origin).href;

        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape" && !modalFavoritoLogin.hidden) fechar();
        });

        return modalFavoritoLogin;
    }

    window.addEventListener("click", evento => {
        const alvo = evento.target instanceof Element ? evento.target : null;
        const botao = alvo?.closest(".btn-favorito");
        if (!botao) return;

        const imagem = botao.querySelector("img");
        const estaFavoritado = imagem?.src.includes("favoritado.png");
        if (localStorage.getItem("boatourSessionToken") || estaFavoritado) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();

        const tipo = tiposFavorito[botao.dataset.tipo] || {
            artigo: "um(a)",
            nome: botao.dataset.tipo || "item"
        };
        const modal = criarModalFavoritoLogin();
        modal.querySelector(".modal-favorito-login__mensagem").textContent =
            `Para adicionar ${tipo.artigo} ${tipo.nome} aos favoritos, você precisa estar em uma conta.`;
        modal.hidden = false;
        modal.querySelector(".modal-favorito-login__abrir-login").focus();
    }, true);
})();

// --- RECUPERAÇÃO DE SENHA ---
// O modal é criado aqui para funcionar em todas as páginas que usam o modal de login.
document.addEventListener("DOMContentLoaded", () => {
    const linkRecuperar = document.querySelector("#modalLogin .link-recuperar-senha");

    // A página de cadastro já possui seu próprio modal e tratamento completo.
    if (!linkRecuperar || document.getElementById("modalRecuperarSenha")) return;

    const modalLogin = document.getElementById("modalLogin");
    const modalRecuperar = document.createElement("div");
    modalRecuperar.className = "modal-login";
    modalRecuperar.id = "modalRecuperarSenha";
    modalRecuperar.setAttribute("role", "dialog");
    modalRecuperar.setAttribute("aria-modal", "true");
    modalRecuperar.setAttribute("aria-labelledby", "tituloRecuperarSenha");
    modalRecuperar.innerHTML = `
        <section class="login login-recuperacao">
            <button type="button" class="fechar" aria-label="Fechar">&times;</button>
            <h2 id="tituloRecuperarSenha">Recuperar <span>senha</span></h2>
            <p>Informe o e-mail cadastrado. Enviaremos um código para redefinir sua senha.</p>
            <input type="email" id="emailRecuperar" placeholder="email@gmail.com" autocomplete="email">
            <p class="mensagem-recuperacao" role="alert" aria-live="polite"></p>
            <button type="button" class="btnLogin">Enviar código</button>
            <p><a href="#" class="voltar-login">Voltar ao login</a></p>
        </section>
    `;
    document.body.appendChild(modalRecuperar);

    const email = modalRecuperar.querySelector("#emailRecuperar");
    const mensagem = modalRecuperar.querySelector(".mensagem-recuperacao");
    const botaoEnviar = modalRecuperar.querySelector(".btnLogin");
    const fechar = () => modalRecuperar.classList.remove("ativo");
    const abrir = () => {
        modalLogin?.classList.remove("ativo");
        modalRecuperar.classList.add("ativo");
        setTimeout(() => email.focus(), 150);
    };

    linkRecuperar.addEventListener("click", evento => {
        evento.preventDefault();
        mensagem.textContent = "";
        abrir();
    });

    modalRecuperar.querySelector(".fechar").addEventListener("click", fechar);
    modalRecuperar.addEventListener("click", evento => {
        if (evento.target === modalRecuperar) fechar();
    });
    modalRecuperar.querySelector(".voltar-login").addEventListener("click", evento => {
        evento.preventDefault();
        fechar();
        modalLogin?.classList.add("ativo");
    });
    email.addEventListener("keydown", evento => {
        if (evento.key === "Enter") botaoEnviar.click();
    });

    botaoEnviar.addEventListener("click", async () => {
        const emailNormalizado = email.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
            mensagem.textContent = "Digite um e-mail válido.";
            email.focus();
            return;
        }

        mensagem.textContent = "";
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Enviando...";

        try {
            const resposta = await fetch("http://localhost:3000/enviarEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailNormalizado })
            });
            const resultado = await resposta.json().catch(() => ({}));

            if (!resposta.ok) {
                throw new Error(resultado.error || "Não foi possível enviar o código.");
            }

            sessionStorage.setItem("boatourRecuperacaoEmail", emailNormalizado);
            window.location.href = new URL("/CADASTRO/trocaSenha.html", window.location.origin).href;
        } catch (erro) {
            mensagem.textContent = erro.message || "Não foi possível conectar ao servidor.";
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = "Enviar código";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const btnEntrar = document.getElementById("btnEntrar");
    const abrirLoginCadastro = document.getElementById("abrirLoginCadastro");

    const modalLogin = document.getElementById("modalLogin");
    const fecharLogin = document.getElementById("fecharLogin");

    const btnLogin = document.getElementById("btnLogin");
    const cpfLogin = document.getElementById("cpfLogin");
    const senhaLogin = document.getElementById("senhaLogin");


    // --- MODAL DE LOGIN ---

    if (modalLogin && fecharLogin) {

        function abrirModalLogin(e) {

            if (e) {
                e.preventDefault();
            }

            modalLogin.classList.add("ativo");
        }


        if (btnEntrar) {
            btnEntrar.addEventListener(
                "click",
                abrirModalLogin
            );
        }


        if (abrirLoginCadastro) {
            abrirLoginCadastro.addEventListener(
                "click",
                abrirModalLogin
            );
        }


        fecharLogin.addEventListener(
            "click",
            () => {

                modalLogin.classList.remove("ativo");

            }
        );


        // Fecha clicando fora do modal

        modalLogin.addEventListener(
            "click",
            (e) => {

                if (e.target === modalLogin) {

                    modalLogin.classList.remove("ativo");

                }

            }
        );

    }


    // --- MENU DE PERFIL ---

    const btnPerfil = document.getElementById("btnPerfil");
    const perfilMenu = document.getElementById("perfilMenu");
    const perfilOverlay = document.getElementById("perfilOverlay");
    const fecharPerfil = document.getElementById("fecharPerfil");
    const abrirLoginPerfil = document.getElementById("abrirLoginPerfil");


    if (
        btnPerfil &&
        perfilMenu &&
        perfilOverlay
    ) {

        // Abre menu

        btnPerfil.addEventListener(
            "click",
            () => {

                perfilMenu.classList.add("ativo");
                perfilOverlay.classList.add("ativo");

            }
        );


        // Abre login pelo menu

        if (abrirLoginPerfil) {

            abrirLoginPerfil.addEventListener(
                "click",
                () => {

                    perfilMenu.classList.remove("ativo");
                    perfilOverlay.classList.remove("ativo");

                    if (modalLogin) {

                        modalLogin.classList.add("ativo");

                    }

                }
            );

        }


        // Fecha menu

        if (fecharPerfil) {

            fecharPerfil.addEventListener(
                "click",
                () => {

                    perfilMenu.classList.remove("ativo");
                    perfilOverlay.classList.remove("ativo");

                }
            );

        }


        // Fecha clicando no overlay

        perfilOverlay.addEventListener(
            "click",
            () => {

                perfilMenu.classList.remove("ativo");
                perfilOverlay.classList.remove("ativo");

            }
        );

    }


    // --- LOGIN ---

    if (
        btnLogin &&
        cpfLogin &&
        senhaLogin
    ) {

        btnLogin.addEventListener(
            "click",
            async () => {

                const cpf = cpfLogin.value.trim();
                const senha = senhaLogin.value.trim();


                // Verifica CPF

                if (!cpf) {

                    window.boatourFieldError(cpfLogin, "Informe seu CPF.");
                    cpfLogin.focus();

                    return;

                }


                // Remove pontos e traço

                const cpfLimpo = cpf.replace(/\D/g, "");


                // Verifica quantidade

                if (cpfLimpo.length !== 11) {

                    window.boatourFieldError(cpfLogin, "Digite um CPF válido.");
                    cpfLogin.focus();

                    return;

                }


                // Verifica senha

                if (!senha) {

                    window.boatourFieldError(senhaLogin, "Informe sua senha.");
                    senhaLogin.focus();

                    return;

                }


                try {

                    // Envia para o servidor

                    const resposta = await fetch(
                        "http://localhost:3000/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                cpf: cpfLimpo,
                                senha: senha
                            })
                        }
                    );


                    const resultado = await resposta.json();


                    console.log(
                        "RESPOSTA DO LOGIN:",
                        JSON.stringify(resultado, null, 2)
                    );


                    // Erro

                    if (resultado.error) {
                        if (/cpf|senha|usuário|usuario|cadastrad/i.test(resultado.error)) {
                            window.boatourFieldError(senhaLogin, "CPF ou senha incorretos. Confira os dados e tente novamente.");
                        } else {
                            alert(resultado.error);
                        }

                        return;

                    }


                    // Login realizado

                    if (resultado.message) {

                        window.boatourClearFieldError(cpfLogin);
                        window.boatourClearFieldError(senhaLogin);
                        alert(resultado.message);


                        // Salva usuário

                        localStorage.setItem(
                            "boatourUsuario",
                            JSON.stringify(resultado.usuario)
                        );


                        // Salva token

                        if (resultado.session_token) {

                            localStorage.setItem(
                                "boatourSessionToken",
                                resultado.session_token
                            );

                        }

                        // Notifica páginas que precisam reagir ao login na mesma aba.
                        window.dispatchEvent(new CustomEvent("boatour:login", {
                            detail: { usuario: resultado.usuario }
                        }));


                        console.log(
                            "USUÁRIO SALVO:",
                            JSON.parse(
                                localStorage.getItem(
                                    "boatourUsuario"
                                )
                            )
                        );


                        // Atualiza menu

                        if (typeof atualizarMenuUsuario === "function") {

                            atualizarMenuUsuario();

                        }


                        // Fecha modal

                        if (modalLogin) {

                            modalLogin.classList.remove("ativo");

                        }


                        // Limpa campos

                        cpfLogin.value = "";
                        senhaLogin.value = "";

                    }

                } catch (error) {

                    console.error(
                        "Erro no login:",
                        error
                    );

                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }

            }
        );

    }

});


// --- MODAL DAS OFERTAS ---

const modalOferta =
    document.getElementById("modalOferta");

const fecharOferta =
    document.getElementById("fecharOferta");

const modalImagemOferta =
    document.getElementById("modalImagemOferta");

const modalDesconto =
    document.getElementById("modalDesconto");

const modalTitulo =
    document.getElementById("modalTitulo");

const modalResumo =
    document.getElementById("modalResumo");

const modalDescricao =
    document.getElementById("modalDescricao");

const modalPrecoAntigo =
    document.getElementById("modalPrecoAntigo");

const modalPreco =
    document.getElementById("modalPreco");

const modalCategoria =
    document.getElementById("modalCategoria");

const modalOds =
    document.getElementById("modalOds");


// --- INFORMAÇÕES DO MODAL ---

const modalPassagem =
    document.querySelector(
        ".linha-detalhes div:nth-child(1)"
    );

const modalHospedagem =
    document.querySelector(
        ".linha-detalhes div:nth-child(2)"
    );

const modalPasseios =
    document.querySelector(
        ".linha-detalhes div:nth-child(3)"
    );

const modalDias =
    document.querySelector(
        ".linha-detalhes div:nth-child(4)"
    );


// --- CLIQUE NOS CARDS ---
//
// IMPORTANTE:
// Existe APENAS UM listener aqui.
//
// O favorito é ignorado antes de procurar o card.
// Assim, clicar no coração NÃO abre o modal.
//

document.addEventListener(
    "click",
    function (event) {


        // --- NÃO ABRIR O MODAL AO CLICAR NO FAVORITO ---

        const botaoFavorito =
            event.target.closest(".btn-favorito");


        if (botaoFavorito) {

    console.log(
        "CLIQUE NO FAVORITO - MODAL BLOQUEADO"
    );

    return;
}


        // --- PROCURA O CARD ---

        const card =
            event.target.closest(".card-oferta");


        // Se não clicou em um card, não faz nada

        if (!card) {

            return;

        }

        const tipoModal = card.dataset.modalTipo ||
            document.body.dataset.catalogo || "ofertas";


        // --- PEGA INFORMAÇÕES DO CARD ---

        const imagem =
            card.querySelector(
                ".imagem-oferta img"
            );

        const desconto =
            card.querySelector(
                ".desconto"
            );

        const titulo =
            card.querySelector("h3");

        const resumo =
            card.querySelector(
                ".info-oferta > p"
            );

        const precoAntigo =
            card.querySelector(
                ".preco-antigo"
            );

        const preco =
            card.querySelector(
                ".precos strong"
            );


        // --- IMAGEM ---

        if (
            imagem &&
            modalImagemOferta
        ) {

            modalImagemOferta.src =
                imagem.src;

            modalImagemOferta.alt =
                imagem.alt;

        }


        // --- DESCONTO ---

        if (modalDesconto) {
            const exibirDesconto = tipoModal === "ofertas" && Boolean(desconto);
            modalDesconto.style.display = exibirDesconto ? "" : "none";
            modalDesconto.textContent = exibirDesconto ? desconto.textContent : "";
        }


        // --- TÍTULO ---

        if (modalTitulo) {
            modalTitulo.textContent = card.dataset.nome || titulo?.textContent || "Detalhes";
        }


        // --- RESUMO ---

        if (modalResumo) {
            modalResumo.textContent = card.dataset.resumo || resumo?.textContent || "";
        }


        // --- PREÇO ANTIGO ---

        if (modalPrecoAntigo) {
            const blocoPrecoAntigo = modalPrecoAntigo.parentElement;
            const exibirPrecoAntigo = tipoModal === "ofertas" && Boolean(precoAntigo);
            if (blocoPrecoAntigo) blocoPrecoAntigo.style.display = exibirPrecoAntigo ? "" : "none";
            modalPrecoAntigo.textContent = exibirPrecoAntigo ? precoAntigo.textContent : "";
        }


        // --- PREÇO ATUAL ---

        if (modalPreco) modalPreco.textContent = preco?.textContent || "Preço não informado";


        // --- DESCRIÇÃO ---

        const descricao = card.dataset.descricao || card.dataset.recomendacoes || "";


        if (modalDescricao) modalDescricao.textContent = descricao || "Sem descrição disponível.";

        const tituloDescricao = document.querySelector(".descricao-oferta h3");
        if (tituloDescricao) {
            tituloDescricao.textContent = tipoModal === "hotel" ? "Sobre esta hospedagem" :
                tipoModal === "atividade" ? "Sobre esta atividade" : "Sobre esta oferta";
        }


        // --- ODS ---

        const ods8 = tipoModal === "ofertas" ?
            Number(
                card.dataset.ods8 || 0
            ) : 0;

        const ods12 = tipoModal === "ofertas" ?
            Number(
                card.dataset.ods12 || 0
            ) : 0;


        if (modalOds) {

            modalOds.innerHTML = "";


            if (ods8 === 1) {

                modalOds.innerHTML += `
                    <span class="ods-selo">

                        <img
                            src="/img/icones/arvore.png"
                            alt="ODS 8"
                        >

                        ODS 8

                    </span>
                `;

            }


            if (ods12 === 1) {

                modalOds.innerHTML += `
                    <span class="ods-selo">

                        <img
                            src="/img/icones/arvore.png"
                            alt="ODS 12"
                        >

                        ODS 12

                    </span>
                `;

            }

        }


        // --- CATEGORIA ---

        const categoria = card.dataset.categoria || "";


        if (modalCategoria) {

            if (tipoModal === "hotel") {
                modalCategoria.textContent = "Hospedagem";
            } else if (tipoModal === "atividade") {
                modalCategoria.textContent = categoria || "Atividade";
            } else if (
                categoria === "nacional"
            ) {

                modalCategoria.textContent =
                    "Viagem Nacional";

            }

            else if (
                categoria === "internacional"
            ) {

                modalCategoria.textContent =
                    "Viagem Internacional";

            }

            else if (
                categoria === "pacote"
            ) {

                modalCategoria.textContent =
                    "Pacote de Viagem";

            }

            else {

                modalCategoria.textContent =
                    "Oferta";

            }

        }


        // --- PASSAGEM AÉREA ---

        const linhaDetalhes = document.querySelector(".linha-detalhes");
        if (tipoModal === "ofertas") {
            const passagem = card.dataset.passagem;
            const hospedagem = card.dataset.hospedagem;
            const passeios = card.dataset.passeios;
            const dias = card.dataset.dias;
            if (linhaDetalhes) linhaDetalhes.style.display = "";
            [modalPassagem, modalHospedagem, modalPasseios].forEach((item, index) => {
                if (item) item.style.display = [passagem, hospedagem, passeios][index] === "1" ? "" : "none";
            });
            if (modalDias) {
                const textoDias = modalDias.querySelector("p");
                if (textoDias) textoDias.textContent = `${dias || 0} dias`;
                modalDias.style.display = "";
            }
        } else if (linhaDetalhes) {
            const itens = [...linhaDetalhes.children];
            const detalhes = tipoModal === "hotel"
                ? [
                    ["🖈", card.dataset.resumo],
                    ["🛏", card.dataset.quarto],
                    ["★", card.dataset.classificacao ? `Classificação: ${card.dataset.classificacao}` : ""],
                    ["$", "Valor por diária"]
                ]
                : [
                    ["🖈", card.dataset.local || card.dataset.destino],
                    ["⏱", card.dataset.duracao],
                    ["✓", card.dataset.incluso],
                    ["★", card.dataset.classificacao ? `Classificação: ${card.dataset.classificacao}` : ""]
                ];
            detalhes.forEach(([icone, valor], index) => {
                const item = itens[index];
                if (!item) return;
                const texto = item.querySelector("p");
                const simbolo = item.querySelector("span");
                item.style.display = valor ? "" : "none";
                if (texto) texto.textContent = valor || "";
                if (simbolo) simbolo.textContent = icone;
            });
        }


        // --- ABRE O MODAL ---

        if (modalOferta) {

            modalOferta.classList.add(
                "ativo"
            );

            document.body.style.overflow =
                "hidden";

        }

    }
);


// --- FECHAR MODAL PELO X ---

if (fecharOferta) {

    fecharOferta.addEventListener(
        "click",
        function () {

            if (modalOferta) {

                modalOferta.classList.remove(
                    "ativo"
                );

            }

            document.body.style.overflow =
                "";

        }
    );

}


// --- FECHAR CLICANDO FORA ---

if (modalOferta) {

    modalOferta.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                modalOferta
            ) {

                modalOferta.classList.remove(
                    "ativo"
                );

                document.body.style.overflow =
                    "";

            }

        }
    );

}


// --- FECHAR COM ESC ---

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modalOferta &&
            modalOferta.classList.contains("ativo")
        ) {

            modalOferta.classList.remove(
                "ativo"
            );

            document.body.style.overflow =
                "";

        }

    }
);


// --- ATUALIZA MENU DO USUÁRIO ---

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            typeof atualizarMenuUsuario ===
            "function"
        ) {

            atualizarMenuUsuario();

        }

    }
);
