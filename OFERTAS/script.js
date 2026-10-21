
document.addEventListener("DOMContentLoaded", () => {

    // --- ELEMENTOS DA PÁGINA ---

    const ofertasGrid = document.getElementById("ofertasGrid");
    const campoBusca = document.getElementById("partida");
    const botoesFiltro = document.querySelectorAll(".filtro");
    const btnVerMais = document.getElementById("btnVerMais");

    // --- VERIFICA SE EXISTE O GRID ---

    if (!ofertasGrid) {
        return;
    }

    // --- VARIÁVEIS ---

    let todasOfertas = [];
    let filtroAtual = "todas";
    let buscaAtual = "";
    let quantidadeVisivel = 8;
    let resultadosAtuais = [];
    let favoritosUsuario = [];
    let ofertaSelecionadaParaCompra = null;

    // --- CARREGAR FAVORITOS DO USUÁRIO ---

    async function carregarFavoritos() {

        const sessionToken =
            localStorage.getItem("boatourSessionToken");

        // Se não estiver logado, não há favoritos
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

                console.error(
                    "Erro ao carregar favoritos:",
                    resultado
                );

                favoritosUsuario = [];
                return;
            }

            favoritosUsuario =
                resultado.favoritos || [];

            console.log(
                "FAVORITOS DO USUÁRIO:",
                favoritosUsuario
            );

        } catch (erro) {

            console.error(
                "Erro ao buscar favoritos:",
                erro
            );

            favoritosUsuario = [];
        }
    }

    // --- BUSCAR OFERTAS DO SERVIDOR ---

    fetch("http://localhost:3000/ofertas")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Erro ao buscar ofertas."
                );
            }

            return response.json();
        })

        .then(async ofertas => {

            // Guarda todas as ofertas
            todasOfertas = ofertas;

            // Carrega favoritos antes de criar os cards
            await carregarFavoritos();

            // Aplica filtros
            aplicarFiltros();

        })

        .catch(error => {

            console.error(
                "Erro ao carregar ofertas:",
                error
            );

            ofertasGrid.innerHTML = `
                <div class="sem-ofertas">
                    <h3>
                        Não foi possível carregar as ofertas
                    </h3>

                    <p>
                        Verifique se o servidor está funcionando.
                    </p>
                </div>
            `;

            if (btnVerMais) {
                btnVerMais.style.display = "none";
            }
        });

    // --- NORMALIZAR TEXTO ---

    function normalizarTexto(texto) {

        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // --- IDENTIFICAR CATEGORIA DA OFERTA ---

    function ofertaPertenceCategoria(
        oferta,
        filtro
    ) {

        switch (normalizarTexto(filtro)) {

            case "nacionais":
            case "nacional":

                return normalizarTexto(oferta.abrangencia) === "nacional" ||
                    normalizarTexto(oferta.abrangencia) === "mista";

            case "internacionais":
            case "internacional":

                return normalizarTexto(oferta.abrangencia) === "internacional" ||
                    normalizarTexto(oferta.abrangencia) === "mista";

            case "pacotes":
            case "pacote":

                return normalizarTexto(oferta.tipo_alvo) === "pacote";

            case "destino":
            case "hotel":
            case "atividade":

                return normalizarTexto(oferta.tipo_alvo) === "produto" &&
                    normalizarTexto(oferta.tipo_produto) === normalizarTexto(filtro);

            case "turismo-consciente":
                return Number(oferta.ods8) === 1 || oferta.ods8 === true ||
                    Number(oferta.ods12) === 1 || oferta.ods12 === true;

            default:
                return true;
        }
    }

    // --- APLICAR BUSCA + FILTRO ---

    function aplicarFiltros() {

        const resultados =
            todasOfertas.filter(oferta => {

                // Filtro por categoria
                const passouNoFiltro =
                    ofertaPertenceCategoria(
                        oferta,
                        filtroAtual
                    );

                // Busca
                const textoBusca =
                    normalizarTexto(buscaAtual);

                const textoOferta =
                    normalizarTexto(`
                        ${oferta.titulo || ""}
                        ${oferta.descricao || ""}
                        ${oferta.abrangencia || ""}
                        ${oferta.tipo_alvo || ""}
                        ${oferta.tipo_produto || ""}
                    `);

                const passouNaBusca =
                    textoBusca === "" ||
                    textoOferta.includes(textoBusca);

                return (
                    passouNoFiltro &&
                    passouNaBusca
                );
            });

        // Guarda os resultados
        resultadosAtuais = resultados;

        // Volta para os primeiros 8
        quantidadeVisivel = 8;

        // Renderiza
        renderizarOfertas();
    }

    // --- RENDERIZAR OFERTAS ---

    function renderizarOfertas() {

        // Limpa o grid
        ofertasGrid.innerHTML = "";

        // Nenhuma oferta
        if (resultadosAtuais.length === 0) {

            ofertasGrid.innerHTML = `
                <div class="sem-ofertas">

                    <h3>
                        Nenhuma oferta encontrada
                    </h3>

                    <p>
                        Tente buscar outra oferta
                        ou alterar o filtro.
                    </p>

                </div>
            `;

            atualizarBotaoVerMais();
            return;
        }

        // Pega somente os cards visíveis
        const ofertasVisiveis =
            resultadosAtuais.slice(
                0,
                quantidadeVisivel
            );

        // Cria os cards
        ofertasVisiveis.forEach(oferta => {

            // --- VERIFICAR SE A OFERTA É FAVORITA ---

            const ofertaFavoritada =
                favoritosUsuario.some(favorito =>

                    favorito.tipo === "oferta" &&

                    Number(favorito.id_item) ===
                    Number(oferta.id)
                );

            // --- CRIAR CARD ---

            const card =
                document.createElement("div");

            card.classList.add(
                "card-oferta"
            );

            card.dataset.id = oferta.id;
            card.dataset.compraTipo = "oferta";
            card.dataset.compraId = oferta.id;

            // --- IMAGEM ---

            const imagem =
                oferta.imagem || "";

            console.log("IMAGEM DA OFERTA:", oferta.imagem);
            // --- PREÇOS ---

            const precoAnterior =
                Number(
                    oferta.preco_anterior || 0
                );

            const precoAtual =
                Number(
                    oferta.preco_atual || 0
                );

            // --- CALCULAR DESCONTO ---

            let desconto = 0;

            if (
                precoAnterior > 0 &&
                precoAtual > 0 &&
                precoAtual < precoAnterior
            ) {

                desconto =
                    Math.round(
                        (
                            (precoAnterior - precoAtual) /
                            precoAnterior
                        ) * 100
                    );
            }

            // --- CATEGORIA ---

            const tipoAlvo = normalizarTexto(oferta.tipo_alvo);
            const abrangencia = normalizarTexto(oferta.abrangencia);
            const categoria = tipoAlvo === "pacote"
                ? "Pacote"
                : abrangencia === "mista"
                    ? "Mista"
                    : abrangencia === "internacional"
                        ? "Internacional"
                        : abrangencia === "nacional"
                            ? "Nacional"
                            : "Oferta";
            const tipoExplicacaoOds = tipoAlvo === "produto"
                ? ({
                    destino: "esse destino é alinhado",
                    atividade: "essa atividade é alinhada",
                    hotel: "esse hotel é alinhado",
                    voo: "esse voo é alinhado"
                }[oferta.tipo_produto] || "essa oferta é alinhada")
                : "essa oferta é alinhada";

            // --- DATASET PARA O MODAL ---

            card.dataset.tipoAlvo = oferta.tipo_alvo || "";
            card.dataset.abrangencia = oferta.abrangencia || "";
            card.dataset.tipoProduto = oferta.tipo_produto || "";

            card.dataset.descricao =
                oferta.descricao || "";

            card.dataset.ods8 =
                oferta.ods8 || 0;

            card.dataset.ods12 =
                oferta.ods12 || 0;

            card.dataset.categoria = categoria.toLowerCase();

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
                                        title="Isso significa que ${tipoExplicacaoOds} com o programa Turismo Consciente."
                                        aria-label="Isso significa que ${tipoExplicacaoOds} com o programa Turismo Consciente."
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

            // Adiciona ao grid
            ofertasGrid.appendChild(card);
        });

        // Atualiza botão
        atualizarBotaoVerMais();
    }

    // --- FAVORITOS ---

   document.addEventListener("click", async event => {

    const cardOferta = event.target.closest(".card-oferta");
    if (cardOferta && !event.target.closest(".btn-favorito")) {
        ofertaSelecionadaParaCompra = cardOferta.dataset.id;
    }

    const btnComprar = event.target.closest("#btnComprar");
    if (btnComprar) {
        event.preventDefault();
        const idOferta = btnComprar.dataset.compraId ||
            btnComprar.dataset.id || ofertaSelecionadaParaCompra;

        if (!idOferta) {
            alert("Selecione uma oferta antes de continuar.");
            return;
        }

        window.location.href = `../COMPRAR/index.html?tipo=oferta&id=${encodeURIComponent(idOferta)}`;
        return;
    }

    const btnFavorito = event.target.closest(".btn-favorito");

    if (!btnFavorito) {
        return;
    }

    // IMPEDE O CLIQUE DE CHEGAR NO CARD E ABRIR O MODAL
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const tipo = btnFavorito.dataset.tipo;
    const idItem = btnFavorito.dataset.id;

    // resto do seu código...
    const imagemBotao = btnFavorito.querySelector("img");

    const sessionToken =
        localStorage.getItem("boatourSessionToken");

    console.log("ID:", idItem);
    console.log("TOKEN:", sessionToken);

    if (!sessionToken) {
        console.error("Usuário não está logado.");
        return;
    }

    const estaFavoritado =
        imagemBotao.src.includes("favoritado.png");

    const metodo =
        estaFavoritado ? "DELETE" : "POST";

    try {

        const resposta = await fetch(
            "http://localhost:3000/favoritos",
            {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Token": sessionToken
                },
                body: JSON.stringify({
                    tipo: tipo,
                    id_item: Number(idItem)
                })
            }
        );

        const resultado = await resposta.json();

        console.log(
            "RESPOSTA DO FAVORITO:",
            resposta.status,
            resultado
        );

        if (!resposta.ok) {
            console.error("ERRO DO FAVORITO:", resultado);
            return;
        }

        if (metodo === "POST") {

            favoritosUsuario.push({
                tipo: tipo,
                id_item: Number(idItem)
            });

            imagemBotao.src =
                "/img/icones/favoritado.png";

            imagemBotao.alt =
                "Remover dos favoritos";

            btnFavorito.setAttribute(
                "aria-label",
                "Remover dos favoritos"
            );

        } else {

            favoritosUsuario =
                favoritosUsuario.filter(favorito =>
                    !(
                        favorito.tipo === tipo &&
                        Number(favorito.id_item) === Number(idItem)
                    )
                );

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

    // --- VERIFICAR SE EXISTEM MAIS OFERTAS ---

    function atualizarBotaoVerMais() {

        if (!btnVerMais) {
            return;
        }

        if (
            quantidadeVisivel <
            resultadosAtuais.length
        ) {

            btnVerMais.style.display =
                "block";

        } else {

            btnVerMais.style.display =
                "none";
        }
    }

    // --- BOTÃO VER MAIS ---

    if (btnVerMais) {

        btnVerMais.addEventListener(
            "click",
            () => {

                quantidadeVisivel += 8;

                renderizarOfertas();
            }
        );
    }

    // --- CAMPO DE BUSCA ---

    if (campoBusca) {

        campoBusca.addEventListener(
            "input",
            () => {

                buscaAtual =
                    campoBusca.value;

                aplicarFiltros();
            }
        );
    }

    // --- BOTÕES DE FILTRO ---

    botoesFiltro.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                // Remove ativo dos outros
                botoesFiltro.forEach(btn => {

                    btn.classList.remove(
                        "ativo"
                    );

                });

                // Ativa o botão clicado
                botao.classList.add(
                    "ativo"
                );

                // Guarda filtro
                filtroAtual =
                    botao.dataset.filtro;

                // Atualiza cards
                aplicarFiltros();
            }
        );
    });

});
