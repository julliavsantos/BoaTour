document.addEventListener("DOMContentLoaded", () => {

    const btnEntrar = document.getElementById("btnEntrar");
    const abrirLoginCadastro = document.getElementById("abrirLoginCadastro");
    const modalLogin = document.getElementById("modalLogin");
    const fecharLogin = document.getElementById("fecharLogin");
    const btnLogin = document.getElementById("btnLogin");
    const cpfLogin = document.getElementById("cpfLogin");
    const senhaLogin = document.getElementById("senhaLogin");


    if (modalLogin && fecharLogin) {
        function abrirModalLogin(e) {
            if (e) {
                e.preventDefault();
            }
            modalLogin.classList.add("ativo");
        }

        if (btnEntrar) {
            btnEntrar.addEventListener("click", abrirModalLogin);
        }

        if (abrirLoginCadastro) {
            abrirLoginCadastro.addEventListener("click", abrirModalLogin);
        }

        fecharLogin.addEventListener("click", () => {
            modalLogin.classList.remove("ativo");
        });

        modalLogin.addEventListener("click", (e) => {
            if (e.target === modalLogin) {
                modalLogin.classList.remove("ativo");
            }
        });
    }

    const btnPerfil = document.getElementById("btnPerfil");
    const perfilMenu = document.getElementById("perfilMenu");
    const perfilOverlay = document.getElementById("perfilOverlay");
    const fecharPerfil = document.getElementById("fecharPerfil");
    const abrirLoginPerfil = document.getElementById("abrirLoginPerfil");

    if (btnPerfil && perfilMenu && perfilOverlay) {
        btnPerfil.addEventListener("click", () => {
            perfilMenu.classList.add("ativo");
            perfilOverlay.classList.add("ativo");

        });

        if (abrirLoginPerfil) {
    abrirLoginPerfil.addEventListener("click", () => {

        perfilMenu.classList.remove("ativo");
        perfilOverlay.classList.remove("ativo");

        modalLogin.classList.add("ativo");
    });
}
        
        if (fecharPerfil) {
            fecharPerfil.addEventListener("click", () => {
                perfilMenu.classList.remove("ativo");
                perfilOverlay.classList.remove("ativo");

            });
        }

        perfilOverlay.addEventListener("click", () => {
            perfilMenu.classList.remove("ativo");
            perfilOverlay.classList.remove("ativo");
        });
    }

    if (btnLogin && cpfLogin && senhaLogin) {

        btnLogin.addEventListener("click", () => {
            const cpf = cpfLogin.value.trim();
            const senha = senhaLogin.value.trim();

            if (!cpf) {
                alert("Digite seu CPF.");
                cpfLogin.focus();
                return;
            }

            if (cpf.length < 11) {
                alert("Digite um CPF válido.");
                cpfLogin.focus();
                return;
            }

            if (!senha) {
                alert("Digite sua senha.");
                senhaLogin.focus();
                return;
            }

            alert("Login realizado com sucesso!");
            modalLogin.classList.remove("ativo");
            cpfLogin.value = "";
            senhaLogin.value = "";
        });
    }
});



const cardsOferta = document.querySelectorAll(".card-oferta");

const modalOferta = document.getElementById("modalOferta");

const fecharOferta = document.getElementById("fecharOferta");

const modalImagemOferta = document.getElementById("modalImagemOferta");
const modalDesconto = document.getElementById("modalDesconto");
const modalTitulo = document.getElementById("modalTitulo");
const modalResumo = document.getElementById("modalResumo");
const modalPrecoAntigo = document.getElementById("modalPrecoAntigo");
const modalPreco = document.getElementById("modalPreco");
const modalCategoria = document.getElementById("modalCategoria");

cardsOferta.forEach(card => {

    card.addEventListener("click", () => {

        const imagem = card.querySelector(".imagem-oferta img");
        const desconto = card.querySelector(".desconto");
        const titulo = card.querySelector("h3");
        const resumo = card.querySelector(".info-oferta > p");
        const precoAntigo = card.querySelector(".preco-antigo");
        const preco = card.querySelector(".precos strong");

        // Imagem
        modalImagemOferta.src = imagem.src;
        modalImagemOferta.alt = imagem.alt;

        // Desconto
        modalDesconto.textContent = desconto.textContent;

        // Título
        modalTitulo.textContent = titulo.textContent;

        // Resumo
        modalResumo.textContent = resumo.textContent;

        // Preços
        modalPrecoAntigo.textContent = precoAntigo.textContent;
        modalPreco.textContent = preco.textContent;

        // Categoria
        const categoria = card.dataset.categoria;

        if (categoria === "nacional") {
            modalCategoria.textContent = "Viagem Nacional";
        }

        else if (categoria === "internacional") {
            modalCategoria.textContent = "Viagem Internacional";
        }

        else if (categoria === "pacote") {
            modalCategoria.textContent = "Pacote de Viagem";
        }

        else {
            modalCategoria.textContent = "Oferta";
        }

        // Abre modal
        modalOferta.classList.add("ativo");

        // Impede rolagem da página
        document.body.style.overflow = "hidden";

    });

});

fecharOferta.addEventListener("click", () => {

    modalOferta.classList.remove("ativo");

    document.body.style.overflow = "";

});


modalOferta.addEventListener("click", (event) => {

    if (event.target === modalOferta) {

        modalOferta.classList.remove("ativo");

        document.body.style.overflow = "";

    }

});

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        modalOferta.classList.remove("ativo");

        document.body.style.overflow = "";

    }

});

