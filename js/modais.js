// ==========================================================
// MODAL DE LOGIN / PERFIL
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const btnEntrar = document.getElementById("btnEntrar");
    const abrirLoginCadastro = document.getElementById("abrirLoginCadastro");

    const modalLogin = document.getElementById("modalLogin");
    const fecharLogin = document.getElementById("fecharLogin");

    const btnLogin = document.getElementById("btnLogin");
    const cpfLogin = document.getElementById("cpfLogin");
    const senhaLogin = document.getElementById("senhaLogin");


    // ======================================================
    // MODAL DE LOGIN
    // ======================================================

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


    // ======================================================
    // MENU DE PERFIL
    // ======================================================

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


    // ======================================================
    // LOGIN
    // ======================================================

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

                    alert("Digite seu CPF.");
                    cpfLogin.focus();

                    return;

                }


                // Remove pontos e traço

                const cpfLimpo = cpf.replace(/\D/g, "");


                // Verifica quantidade

                if (cpfLimpo.length !== 11) {

                    alert("Digite um CPF válido.");
                    cpfLogin.focus();

                    return;

                }


                // Verifica senha

                if (!senha) {

                    alert("Digite sua senha.");
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

                        alert(resultado.error);

                        return;

                    }


                    // Login realizado

                    if (resultado.message) {

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


// ==========================================================
// MODAL DAS OFERTAS
// ==========================================================

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


// ==========================================================
// INFORMAÇÕES DO MODAL
// ==========================================================

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


// ==========================================================
// CLIQUE NOS CARDS
// ==========================================================
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


        // ==================================================
        // NÃO ABRIR O MODAL AO CLICAR NO FAVORITO
        // ==================================================

        const botaoFavorito =
            event.target.closest(".btn-favorito");


        if (botaoFavorito) {

    console.log(
        "CLIQUE NO FAVORITO - MODAL BLOQUEADO"
    );

    return;
}


        // ==================================================
        // PROCURA O CARD
        // ==================================================

        const card =
            event.target.closest(".card-oferta");


        // Se não clicou em um card, não faz nada

        if (!card) {

            return;

        }


        // ==================================================
        // PEGA INFORMAÇÕES DO CARD
        // ==================================================

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


        // ==================================================
        // IMAGEM
        // ==================================================

        if (
            imagem &&
            modalImagemOferta
        ) {

            modalImagemOferta.src =
                imagem.src;

            modalImagemOferta.alt =
                imagem.alt;

        }


        // ==================================================
        // DESCONTO
        // ==================================================

        if (
            desconto &&
            modalDesconto
        ) {

            modalDesconto.textContent =
                desconto.textContent;

        }


        // ==================================================
        // TÍTULO
        // ==================================================

        if (
            titulo &&
            modalTitulo
        ) {

            modalTitulo.textContent =
                titulo.textContent;

        }


        // ==================================================
        // RESUMO
        // ==================================================

        if (
            resumo &&
            modalResumo
        ) {

            modalResumo.textContent =
                resumo.textContent;

        }


        // ==================================================
        // PREÇO ANTIGO
        // ==================================================

        if (
            precoAntigo &&
            modalPrecoAntigo
        ) {

            modalPrecoAntigo.textContent =
                precoAntigo.textContent;

        }


        // ==================================================
        // PREÇO ATUAL
        // ==================================================

        if (
            preco &&
            modalPreco
        ) {

            modalPreco.textContent =
                preco.textContent;

        }


        // ==================================================
        // DESCRIÇÃO
        // ==================================================

        const descricao =
            card.dataset.descricao;


        if (
            descricao &&
            modalDescricao
        ) {

            modalDescricao.textContent =
                descricao;

        }


        // ==================================================
        // ODS
        // ==================================================

        const ods8 =
            Number(
                card.dataset.ods8 || 0
            );

        const ods12 =
            Number(
                card.dataset.ods12 || 0
            );


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


        // ==================================================
        // CATEGORIA
        // ==================================================

        const categoria =
            card.dataset.categoria;


        if (modalCategoria) {

            if (
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


        // ==================================================
        // PASSAGEM AÉREA
        // ==================================================

        const passagem =
            card.dataset.passagem;


        if (modalPassagem) {

            if (passagem === "1") {

                modalPassagem.style.display =
                    "";

            }

            else {

                modalPassagem.style.display =
                    "none";

            }

        }


        // ==================================================
        // HOSPEDAGEM
        // ==================================================

        const hospedagem =
            card.dataset.hospedagem;


        if (modalHospedagem) {

            if (hospedagem === "1") {

                modalHospedagem.style.display =
                    "";

            }

            else {

                modalHospedagem.style.display =
                    "none";

            }

        }


        // ==================================================
        // PASSEIOS
        // ==================================================

        const passeios =
            card.dataset.passeios;


        if (modalPasseios) {

            if (passeios === "1") {

                modalPasseios.style.display =
                    "";

            }

            else {

                modalPasseios.style.display =
                    "none";

            }

        }


        // ==================================================
        // QUANTIDADE DE DIAS
        // ==================================================

        const dias =
            card.dataset.dias;


        if (modalDias) {

            const textoDias =
                modalDias.querySelector("p");


            if (textoDias) {

                textoDias.textContent =
                    dias + " dias";

            }

        }


        // ==================================================
        // ABRE O MODAL
        // ==================================================

        if (modalOferta) {

            modalOferta.classList.add(
                "ativo"
            );

            document.body.style.overflow =
                "hidden";

        }

    }
);


// ==========================================================
// FECHAR MODAL PELO X
// ==========================================================

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


// ==========================================================
// FECHAR CLICANDO FORA
// ==========================================================

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


// ==========================================================
// FECHAR COM ESC
// ==========================================================

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


// ==========================================================
// ATUALIZA MENU DO USUÁRIO
// ==========================================================

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
