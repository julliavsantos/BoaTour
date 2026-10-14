
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTOS DA PÁGINA
    const destinosGrid = document.getElementById("destinosGrid");
    const campoBusca = document.getElementById("partida");
    const botoesFiltro = document.querySelectorAll(".filtro");
    const btnVerMaisDestinos = document.getElementById("btnVerMaisDestinos");

    // SE A PÁGINA NÃO TIVER O GRID
    if (!destinosGrid) {
        return;
    }
    // VARIÁVEIS
    let todosDestinos = [];
    let destinosFiltrados = [];
    let filtroAtual = "todas";
    let buscaAtual = "";

    // Quantidade de destinos que aparecem
    let quantidadeVisivel = 8;


    // --- BUSCAR DESTINOS DO BANCO ---

    fetch("http://localhost:3000/destinos")
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao buscar destinos.");
        }

        return response.json();
    })
    .then(async destinos => {

        todosDestinos = destinos;

        // CARREGA OS FAVORITOS ANTES DE RENDERIZAR
        await carregarFavoritos();

        aplicarFiltros();
    })
    .catch(error => {

        console.error(
            "Erro ao carregar destinos:",
            error
        );

        destinosGrid.innerHTML = `
            <p class="mensagem-destinos">
                Não foi possível carregar os destinos.
            </p>
        `;

        if (btnVerMaisDestinos) {
            btnVerMaisDestinos.style.display = "none";
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


    // --- APLICAR BUSCA + FILTRO ---

    function aplicarFiltros() {

        const resultados =
            todosDestinos.filter(destino => {

                // ------------------------------------------
                // FILTRO POR CATEGORIA
                // ------------------------------------------

                let passouNoFiltro = true;

                if (filtroAtual !== "todas") {

                    const categoriasDestino =
                        Array.isArray(destino.categorias)
                            ? destino.categorias
                            : [];

                    const categoriasNormalizadas =
                        categoriasDestino.map(categoria =>
                            normalizarTexto(categoria)
                        );

                    passouNoFiltro =
                        categoriasNormalizadas.includes(
                            normalizarTexto(filtroAtual)
                        );

                }


                // ------------------------------------------
                // BUSCA
                // ------------------------------------------

                const textoBusca =
                    normalizarTexto(buscaAtual);

                const categoriasTexto =
                    Array.isArray(destino.categorias)
                        ? destino.categorias.join(" ")
                        : "";

                const textoDestino =
                    normalizarTexto(`
                        ${destino.nome}
                        ${destino.cidade}
                        ${destino.pais}
                        ${destino.descricao}
                        ${destino.tipo}
                        ${categoriasTexto}
                    `);

                const passouNaBusca =
                    textoBusca === "" ||
                    textoDestino.includes(textoBusca);


                // ------------------------------------------
                // RESULTADO FINAL
                // ------------------------------------------

                return passouNoFiltro && passouNaBusca;

            });


        // Guarda os resultados encontrados
        destinosFiltrados = resultados;


        // Sempre que pesquisar ou trocar filtro,
        // volta para os 8 primeiros
        quantidadeVisivel = 8;


        // Renderiza novamente
        renderizarDestinos();

    }


    // --- MOSTRAR OS CARDS ---

    let favoritosUsuario = [];

async function carregarFavoritos() {

    const sessionToken =
        localStorage.getItem("boatourSessionToken");

    if (!sessionToken) {
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

        const resultado =
            await resposta.json();

        if (!resposta.ok) {

            console.error(
                "Erro ao carregar favoritos:",
                resultado
            );

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
    }
}

    function renderizarDestinos() {

        destinosGrid.innerHTML = "";


        // --- NENHUM RESULTADO ---

        if (destinosFiltrados.length === 0) {

            destinosGrid.innerHTML = `
                <div class="sem-destinos">

                    <h3>
                        Nenhum destino encontrado
                    </h3>

                    <p>
                        Tente buscar outro destino
                        ou alterar o filtro.
                    </p>

                </div>
            `;

            atualizarBotaoVerMais();

            return;
        }


        // --- PEGAR SOMENTE OS VISÍVEIS ---

        const destinosVisiveis =
            destinosFiltrados.slice(
                0,
                quantidadeVisivel
            );


        // --- CRIAR CARDS ---

        destinosVisiveis.forEach(destino => {

            const card =
                document.createElement("div");

            card.classList.add("card-oferta");


            // --- IMAGEM ---

            const imagem =
                destino.imagem || "";


            // --- PREÇO ---

            const preco =
                Number(destino.preco_base || 0);


            // --- DESCRIÇÃO ---

            const descricao =
                destino.descricao ||
                "Conheça este incrível destino.";

                const destinoFavoritado =
    favoritosUsuario.some(favorito =>
        favorito.tipo === "destino" &&
        Number(favorito.id_item) === Number(destino.id_destino)
    );

            // --- CARD ---

            card.innerHTML = `
            <button
    class="btn-favorito"
    type="button"
    data-tipo="destino"
    data-id="${destino.id_destino}"
    aria-label="${destinoFavoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
>
    <img
        src="${destinoFavoritado
            ? '/img/icones/favoritado.png'
            : '/img/icones/favoritar.png'}"
        alt="${destinoFavoritado
            ? 'Remover dos favoritos'
            : 'Favoritar'}"
    >
</button>
    <div class="imagem-oferta">
        <img
            src="/img/destinos/${imagem}"
            alt="${destino.nome || "Destino"}"
        >
    </div>

    <div class="info-oferta">

        <h3>
            ${destino.nome || "Destino"}
        </h3>

        <p class="localizacao-destino">
            ${destino.cidade || ""}, ${destino.pais || ""}
        </p>

        <p class="descricao-destino">
            ${destino.descricao || "Conheça este incrível destino."}
        </p>

        <p class="dias-destino">
            ${destino.dias || 0} dias
        </p>

        <div class="precos">

            ${
                Number(destino.ods8) === 1 ||
                Number(destino.ods12) === 1
                    ? `
                        <img
                            class="selinho-ods"
                            src="/img/icones/arvore.png"
                            alt="Destino alinhado às ODS"
                        >
                    `
                    : ""
            }

            <strong>
                R$ ${preco.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}
            </strong>

        </div>

        <button
            class="btn-ver-ofertas"
            type="button"
        >
            Ver ofertas
        </button>

    </div>
`;

// --- BOTÃO DE FAVORITO ---
            // --- BOTÃO VER OFERTAS ---

            const btnVerOfertas =
                card.querySelector(".btn-ver-ofertas");


            if (btnVerOfertas) {

                btnVerOfertas.addEventListener(
                    "click",
                    event => {

                        // Impede o clique de fazer
                        // qualquer outra ação no card
                        event.stopPropagation();

                        console.log(
                            "Ver ofertas:",
                            destino.nome
                        );

                        // Por enquanto leva para
                        // a página de ofertas
                        window.location.href =
                            "/OFERTAS/index.html";

                    }
                );

            }


            // Adiciona o card na página
            destinosGrid.appendChild(card);

        });

document.addEventListener("click", async (event) => {

    const btnFavorito =
        event.target.closest(".btn-favorito");

    if (!btnFavorito) {
        return;
    }

    event.stopPropagation();

    const tipo =
        btnFavorito.dataset.tipo;

    const idItem =
        btnFavorito.dataset.id;

    const imagemBotao =
        btnFavorito.querySelector("img");

    const sessionToken =
        localStorage.getItem("boatourSessionToken");

    if (!sessionToken) {
        console.error("Usuário não está logado.");
        return;
    }

    // Verifica se o coração está atualmente favoritado
    const estaFavoritado =
        imagemBotao.src.includes("favoritado.png");

    const metodo =
        estaFavoritado ? "DELETE" : "POST";

    console.log(
        estaFavoritado
            ? "REMOVENDO FAVORITO:"
            : "ADICIONANDO FAVORITO:",
        {
            tipo: tipo,
            id_item: idItem
        }
    );

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
                    id_item: idItem
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
        JSON.stringify(
            resultado,
            null,
            2
        )
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

    console.log(
        "Favorito adicionado:",
        resultado
    );

} else {

    imagemBotao.src =
        "/img/icones/favoritar.png";

    imagemBotao.alt =
        "Adicionar aos favoritos";

    btnFavorito.setAttribute(
        "aria-label",
        "Adicionar aos favoritos"
    );

    console.log(
        "Favorito removido:",
        resultado
    );
}

    } catch (erro) {

        console.error(
            "Erro ao conectar com o servidor:",
            erro
        );
    }
});


        // Atualiza o botão depois de renderizar
        atualizarBotaoVerMais();

    }


    // --- ATUALIZAR BOTÃO "VER MAIS" ---

    function atualizarBotaoVerMais() {

        if (!btnVerMaisDestinos) {
            return;
        }


        // Se ainda existem destinos para mostrar

        if (
            quantidadeVisivel <
            destinosFiltrados.length
        ) {

            btnVerMaisDestinos.style.display =
                "block";

        } else {

            // Se já mostrou todos

            btnVerMaisDestinos.style.display =
                "none";

        }

    }


    // --- BOTÃO "VER MAIS" ---

    if (btnVerMaisDestinos) {

        btnVerMaisDestinos.addEventListener(
            "click",
            () => {

                // Adiciona mais 8
                quantidadeVisivel += 8;

                // Renderiza novamente
                renderizarDestinos();

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

                // Remove ativo de todos

                botoesFiltro.forEach(btn => {

                    btn.classList.remove(
                        "ativo"
                    );

                });


                // Ativa o botão clicado

                botao.classList.add(
                    "ativo"
                );


                // Guarda o filtro

                filtroAtual =
                    botao.dataset.filtro;


                // Atualiza cards

                aplicarFiltros();

            }
        );

    });

});