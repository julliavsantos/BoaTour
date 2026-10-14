let favoritosUsuario = [];

async function carregarFavoritos() {

    const sessionToken =
        localStorage.getItem("boatourSessionToken");

    if (!sessionToken) {
        favoritosUsuario = [];
        return;
    }

    try {

        const resposta = await fetch(
            "http://localhost:3000/favoritos",
            {
                method: "GET",
                headers: {
                    "X-Session-Token": sessionToken
                }
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            favoritosUsuario = [];
            return;
        }

        favoritosUsuario =
            resultado.favoritos || [];

    } catch (erro) {

        console.error(
            "Erro ao buscar favoritos:",
            erro
        );

        favoritosUsuario = [];
    }
}
carregarFavoritos().then(() => {

    return fetch('http://localhost:3000/ofertas');

})
.then(response => {

        console.log('Resposta do servidor:', response);

        return response.json();

    })

    .then(ofertas => {

        console.log('OFERTAS RECEBIDAS:', ofertas);

        const lista = document.getElementById('listaOfertas');

        console.log('LISTA ENCONTRADA:', lista);

        if (!lista) {
            console.error('Elemento #listaOfertas não encontrado!');
            return;
        }

        // Limpa os cards antigos
        lista.innerHTML = '';


        // --- CRIA OS CARDS ---

        ofertas.forEach(oferta => {

            const card = document.createElement('div');

            card.classList.add('card-oferta');

            const ofertaFavoritada = favoritosUsuario.some(favorito =>
            favorito.tipo === "oferta" &&
            Number(favorito.id_item) === Number(oferta.id)
        );


            // --- IMAGEM ---

            const imagem = oferta.imagem || "";


            // --- PREÇOS ---

            const precoAnterior =
                Number(oferta.preco_anterior || 0);

            const precoAtual =
                Number(oferta.preco_atual || 0);


            // --- CALCULAR DESCONTO ---

            let desconto = 0;

            if (
                precoAnterior > 0 &&
                precoAtual > 0 &&
                precoAtual < precoAnterior
            ) {

                desconto = Math.round(
                    ((precoAnterior - precoAtual) /
                        precoAnterior) * 100
                );

            }


            // --- CATEGORIA ---

            let categoria = "oferta";

            if (
                Number(oferta.pacote) === 1 ||
                oferta.pacote === true
            ) {

                categoria = "pacote";

            } else if (
                Number(oferta.internacional) === 1 ||
                oferta.internacional === true
            ) {

                categoria = "internacional";

            } else if (
                Number(oferta.nacional) === 1 ||
                oferta.nacional === true
            ) {

                categoria = "nacional";

            }


            // --- DATASET DO CARD ---

            card.dataset.dias =
                oferta.dias || "";

            card.dataset.passagem =
                oferta.passagem_aerea || 0;

            card.dataset.hospedagem =
                oferta.hospedagem || 0;

            card.dataset.passeios =
                oferta.passeios || 0;

            card.dataset.descricao =
                oferta.descricao || "";

            card.dataset.ods8 =
                oferta.ods8 || 0;

            card.dataset.ods12 =
                oferta.ods12 || 0;

            card.dataset.categoria =
                categoria;

            // IMPORTANTE:
            // adiciona o destaque para o filtro "todas"
            card.dataset.destaque =
                Number(oferta.destaque) === 1 ||
                oferta.destaque === true
                    ? "sim"
                    : "nao";


            // --- HTML DO CARD ---

             card.innerHTML = `

                <div class="imagem-oferta">

                    <img
                        src="../${imagem}"
                        alt="${oferta.titulo || "Oferta"}"
                    >

                    <!-- BOTÃO FAVORITO -->

                    <button
                        class="btn-favorito"
                        type="button"
                        data-tipo="oferta"
                        data-id="${oferta.id}"
                        aria-label="${
                            ofertaFavoritada
                                ? "Remover dos favoritos"
                                : "Adicionar aos favoritos"
                        }"
                    >

                        <img
                            src="${
                                ofertaFavoritada
                                    ? "/img/icones/favoritado.png"
                                    : "/img/icones/favoritar.png"
                            }"
                            alt="${
                                ofertaFavoritada
                                    ? "Remover dos favoritos"
                                    : "Favoritar"
                            }"
                        >

                    </button>

                    ${
                        desconto > 0
                            ? `
                                <span class="desconto-oferta">
                                    -${desconto}%
                                </span>

                                <span
                                    class="desconto"
                                    style="display:none;"
                                >
                                    -${desconto}%
                                </span>
                            `
                            : `
                                <span
                                    class="desconto"
                                    style="display:none;"
                                ></span>
                            `
                    }

                </div>

                <div class="info-oferta">

                    <h3>
                        ${oferta.titulo || "Oferta"}
                    </h3>

                    <p>
                        ${
                            oferta.dias
                                ? `${oferta.dias} dias`
                                : ""
                        }

                        ${
                            oferta.passagem_aerea
                                ? " • Voo"
                                : ""
                        }

                        ${
                            oferta.hospedagem
                                ? " • Hotel"
                                : ""
                        }

                        ${
                            oferta.passeios
                                ? " • Passeios"
                                : ""
                        }
                    </p>

                    <div class="precos">

                        ${
                            Number(oferta.ods8) === 1 ||
                            Number(oferta.ods12) === 1
                                ? `
                                    <img
                                        class="selinho-ods"
                                        src="/img/icones/arvore.png"
                                        alt="Oferta alinhada às ODS"
                                    >
                                `
                                : ""
                        }

                        ${
                            oferta.preco_anterior
                                ? `
                                    <span class="preco-antigo">
                                        R$${Number(
                                            oferta.preco_anterior
                                        ).toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits: 2
                                            }
                                        )}
                                    </span>
                                `
                                : ""
                        }

                        <strong>
                            R$${Number(
                                oferta.preco_atual || 0
                            ).toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2
                                }
                            )}
                        </strong>

                    </div>

                </div>
            `;


            // --- ADICIONA O CARD AO GRID ---

            lista.appendChild(card);

        });

        document.addEventListener("click", async event => {

    const btnFavorito =
        event.target.closest(".btn-favorito");

    if (!btnFavorito) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const tipo =
        btnFavorito.dataset.tipo;

    const idItem =
        btnFavorito.dataset.id;

    const imagemBotao =
        btnFavorito.querySelector("img");

    const sessionToken =
        localStorage.getItem("boatourSessionToken");

    if (!sessionToken) {

        console.error(
            "Usuário não está logado."
        );

        return;
    }

    const estaFavoritado =
        imagemBotao.src.includes(
            "favoritado.png"
        );

    const metodo =
        estaFavoritado
            ? "DELETE"
            : "POST";

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/favoritos",
                {
                    method: metodo,

                    headers: {
                        "Content-Type":
                            "application/json",

                        "X-Session-Token":
                            sessionToken
                    },

                    body: JSON.stringify({
                        tipo: tipo,
                        id_item: Number(idItem)
                    })
                }
            );

        const resultado =
            await resposta.json();

        console.log(
            "RESPOSTA DO FAVORITO:",
            resposta.status,
            resultado
        );

        if (!resposta.ok) {

            console.error(
                "ERRO DO FAVORITO:",
                resultado
            );

            return;
        }

        if (metodo === "POST") {

            imagemBotao.src =
                "/img/icones/favoritado.png";

            imagemBotao.alt =
                "Remover dos favoritos";

            btnFavorito.setAttribute(
                "aria-label",
                "Remover dos favoritos"
            );

        } else {

            imagemBotao.src =
                "/img/icones/favoritar.png";

            imagemBotao.alt =
                "Favoritar";

            btnFavorito.setAttribute(
                "aria-label",
                "Adicionar aos favoritos"
            );
        }

    } catch (erro) {

        console.error(
            "Erro ao conectar com o servidor:",
            erro
        );

    }

});

        // --- AGORA OS CARDS JÁ EXISTEM ---

        const filtros =
            document.querySelectorAll('.filtro');

        const cards =
            document.querySelectorAll('.card-oferta');


        // --- FUNÇÃO DE FILTRAR ---

        function filtrarOfertas(filtroSelecionado) {

            let contador = 0;


            cards.forEach(oferta => {

                const categoria =
                    oferta.getAttribute('data-categoria');

                const destaque =
                    oferta.getAttribute('data-destaque');


                // --- TODAS · SOMENTE DESTAQUES · MÁXIMO 8 ---

                if (filtroSelecionado === 'todas') {

                    if (
                        destaque === 'sim' &&
                        contador < 8
                    ) {

                        oferta.style.display = '';

                        contador++;

                    } else {

                        oferta.style.display = 'none';

                    }

                }


                // --- CATEGORIAS · MÁXIMO 8 ---

                else {

                    if (
                        categoria === filtroSelecionado &&
                        contador < 8
                    ) {

                        oferta.style.display = '';

                        contador++;

                    } else {

                        oferta.style.display = 'none';

                    }

                }

            });

        }


        // --- CLIQUE NOS FILTROS ---

        filtros.forEach(filtro => {

            filtro.addEventListener('click', function () {

                filtros.forEach(botao => {

                    botao.classList.remove('ativo');

                });


                this.classList.add('ativo');


                const filtroSelecionado =
                    this.getAttribute('data-filtro');


                filtrarOfertas(filtroSelecionado);

            });

        });


        // --- FILTRO INICIAL ---

        filtrarOfertas('todas');


    })


    // --- ERRO ---

    .catch(error => {

        console.log(
            'Erro ao carregar ofertas:',
            error
        );


        const lista =
            document.getElementById('listaOfertas');


        if (lista) {

            lista.innerHTML = `

                <p class="erro-ofertas">

                    Não foi possível carregar as ofertas.

                </p>

            `;

        }

    });

