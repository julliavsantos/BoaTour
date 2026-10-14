document.addEventListener("DOMContentLoaded", async () => {

    const favoritosGrid = document.getElementById("favoritosGrid");
    const campoBusca = document.getElementById("partida");
    const botoesFiltro = document.querySelectorAll(".filtro");
    const btnVerMaisFavoritos = document.getElementById("btnVerMaisFavoritos");

    let filtroAtual = "todos";

    // Dados carregados do servidor
    let favoritosOriginais = [];
    let destinos = [];
    let ofertas = [];
    let hoteis = [];
    let atividades = [];
    let buscaAtual = "";
    let quantidadeVisivel = 8;

    if (!favoritosGrid) {
        return;
    }

    // --- TOKEN ---

    const sessionToken =
        localStorage.getItem("boatourSessionToken");

    if (!sessionToken) {

        favoritosGrid.innerHTML = `
            <div class="sem-favoritos">
                <span>♡</span>

                <h3>
                    Faça login para ver seus favoritos
                </h3>

                <p>
                    Entre na sua conta para acessar
                    os destinos, ofertas, hotéis e atividades salvos.
                </p>
            </div>
        `;

        return;
    }

    // --- FUNÇÃO PARA NORMALIZAR TEXTO ---

    function normalizarTexto(texto) {

        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    }

    // --- BUSCAR FAVORITOS ---

    try {

        const respostaFavoritos = await fetch(
            "http://localhost:3000/favoritos",
            {
                method: "GET",

                headers: {
                    "X-Session-Token": sessionToken
                }
            }
        );

        const dadosFavoritos =
            await respostaFavoritos.json();

        if (!respostaFavoritos.ok) {

            throw new Error(
                dadosFavoritos.error ||
                "Erro ao buscar favoritos."
            );

        }

        favoritosOriginais =
            dadosFavoritos.favoritos || [];

        console.log(
            "FAVORITOS:",
            favoritosOriginais
        );

        // --- NENHUM FAVORITO ---

        // --- BUSCAR DESTINOS E OFERTAS ---

        const [resDestinos, resOfertas, resHoteis, resAtividades] =
            await Promise.all([

                fetch(
                    "http://localhost:3000/destinos"
                ),

                fetch("http://localhost:3000/ofertas"),
                fetch("http://localhost:3000/hoteis"),
                fetch("http://localhost:3000/atividades")

            ]);

        destinos =
            await resDestinos.json();

        ofertas =
            await resOfertas.json();

        hoteis = await resHoteis.json();
        atividades = await resAtividades.json();

        console.log("DESTINOS:", destinos);
        console.log("OFERTAS:", ofertas);

        // --- MOSTRAR FAVORITOS ---

        filtrarFavoritos();

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR FAVORITOS:",
            erro
        );

        favoritosGrid.innerHTML = `
            <div class="erro-favoritos">

                <p>
                    Não foi possível carregar seus favoritos.
                </p>

            </div>
        `;

    }


    // --- FILTRAR FAVORITOS · PESQUISA + TIPO ---

    function filtrarFavoritos() {

    const busca = normalizarTexto(buscaAtual);

    const favoritosFiltrados =
        favoritosOriginais.filter(favorito => {

            // --- FILTRO POR TIPO ---

            if (
                filtroAtual !== "todos" &&
                favorito.tipo !== filtroAtual
            ) {
                return false;
            }

            const id = Number(favorito.id_item);

            // --- DESTINO ---

            if (favorito.tipo === "destino") {

                const destino = destinos.find(
                    item =>
                        Number(item.id_destino) === id
                );

                if (!destino) {
                    return false;
                }

                const textoDestino =
                    normalizarTexto(`
                        ${destino.nome || ""}
                        ${destino.cidade || ""}
                        ${destino.pais || ""}
                        ${destino.descricao || ""}
                    `);

                return textoDestino.includes(busca);
            }

            // --- OFERTA ---

            if (favorito.tipo === "oferta") {

                const oferta = ofertas.find(
                    item =>
                        Number(item.id) === id
                );

                if (!oferta) {
                    return false;
                }

                const textoOferta =
                    normalizarTexto(`
                        ${oferta.titulo || ""}
                        ${oferta.nome || ""}
                        ${oferta.descricao || ""}
                        ${oferta.dias || ""}
                    `);

                return textoOferta.includes(busca);
            }

            if (favorito.tipo === "hotel") {
                const hotel = hoteis.find(item => Number(item.id_hotel) === id);
                if (!hotel) return false;
                return normalizarTexto(`${hotel.nome_hotel} ${hotel.quarto_hotel} ${hotel.descricao_hotel} ${hotel.cidade} ${hotel.pais} ${hotel.endereco}`).includes(busca);
            }

            if (favorito.tipo === "atividade") {
                const atividade = atividades.find(item => Number(item.id_atividade) === id);
                if (!atividade) return false;
                return normalizarTexto(`${atividade.nome_atividade} ${atividade.descricao_atividade} ${atividade.categoria} ${atividade.local_atividade} ${atividade.nome_destino} ${atividade.cidade_destino} ${atividade.pais_destino}`).includes(busca);
            }

            return false;
        });

    // Volta para os 8 quando pesquisar
    // ou mudar o filtro
    quantidadeVisivel = 8;

    renderizarFavoritos(favoritosFiltrados);
}


    // --- RENDERIZAR FAVORITOS ---

    function renderizarFavoritos(lista) {

    favoritosGrid.innerHTML = "";

    // --- NENHUM RESULTADO ---

    if (lista.length === 0) {
        const mensagem = favoritosOriginais.length === 0
            ? "Você ainda não tem favoritos. Explore destinos, ofertas, hotéis e atividades para salvar seus preferidos."
            : "Tente ajustar a busca ou o filtro selecionado.";

        favoritosGrid.innerHTML = `
            <div class="sem-favoritos">

                <span>♡</span>

                <h3>
                    Nenhum favorito encontrado
                </h3>

                    <p>${mensagem}</p>

            </div>
        `;

        atualizarBotaoVerMais();

        return;
    }

    // --- PEGAR SOMENTE OS VISÍVEIS ---

    const favoritosVisiveis =
        lista.slice(0, quantidadeVisivel);

    // --- CRIAR CARDS ---

    favoritosVisiveis.forEach(favorito => {

        const id = Number(favorito.id_item);

        // DESTINO
        if (favorito.tipo === "destino") {

            const destino = destinos.find(
                item =>
                    Number(item.id_destino) === id
            );

            if (destino) {

                criarCardDestino(
                    destino,
                    favoritosGrid
                );

            }
        }

        // OFERTA
        if (favorito.tipo === "oferta") {

            const oferta = ofertas.find(
                item =>
                    Number(item.id) === id
            );

            if (oferta) {

                criarCardOferta(
                    oferta,
                    favoritosGrid
                );

            }
        }

        if (favorito.tipo === "hotel") {
            const hotel = hoteis.find(item => Number(item.id_hotel) === id);
            if (hotel) criarCardHotel(hotel, favoritosGrid);
        }

        if (favorito.tipo === "atividade") {
            const atividade = atividades.find(item => Number(item.id_atividade) === id);
            if (atividade) criarCardAtividade(atividade, favoritosGrid);
        }

    });

    atualizarBotaoVerMais();
}


    // --- PESQUISA ---

    if (campoBusca) {

    campoBusca.addEventListener("input", () => {

        buscaAtual = campoBusca.value;

        filtrarFavoritos();

    });

}


    // --- BOTÕES DE FILTRO ---

    botoesFiltro.forEach(botao => {

        botao.addEventListener(
            "click",
            () => {

                // Remove ativo
                botoesFiltro.forEach(btn => {

                    btn.classList.remove(
                        "ativo"
                    );

                });

                // Ativa botão clicado
                botao.classList.add(
                    "ativo"
                );

                // Pega o filtro
                filtroAtual =
                    botao.dataset.filtro;

                console.log(
                    "FILTRO:",
                    filtroAtual
                );

                // Aplica pesquisa + filtro
                filtrarFavoritos();

            }
        );

    });


    // --- CARD DESTINO ---

    function criarCardDestino(
        destino,
        container
    ) {

        const card =
            document.createElement("div");

        card.classList.add(
            "card-favorito"
        );

        const preco =
            Number(
                destino.preco_base || 0
            );

        card.innerHTML = `

            <button
                class="btn-favorito"
                type="button"
                data-tipo="destino"
                data-id="${destino.id_destino}"
            >

                <img
                    src="/img/icones/favoritado.png"
                    alt="Remover dos favoritos"
                >

            </button>


            <div class="imagem-favorito">

                <img
                    src="/img/destinos/${destino.imagem || ""}"
                    alt="${destino.nome || "Destino"}"
                >

            </div>


            <div class="info-favorito">

                <span class="tipo-favorito">
                    Destino
                </span>

                <h3>
                    ${destino.nome || "Destino"}
                </h3>

                <p>
                    ${destino.cidade || ""},
                    ${destino.pais || ""}
                </p>

                <p>
                    ${
                        destino.descricao ||
                        "Conheça este incrível destino."
                    }
                </p>

                <div class="preco-favorito">

                    <strong>
                        R$
                        ${preco.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                    </strong>

                </div>

            </div>

        `;

        container.appendChild(card);

    }


    // --- CARD OFERTA ---

    function criarCardOferta(
        oferta,
        container
    ) {

        const card =
            document.createElement("div");

        card.classList.add(
            "card-favorito"
        );


        // PREÇO ATUAL

        const precoAtual =
            Number(
                oferta.preco_atual || 0
            );


        // PREÇO ANTERIOR

        const precoAnterior =
            Number(
                oferta.preco_anterior || 0
            );


        card.innerHTML = `

            <button
                class="btn-favorito"
                type="button"
                data-tipo="oferta"
                data-id="${oferta.id}"
            >

                <img
                    src="/img/icones/favoritado.png"
                    alt="Remover dos favoritos"
                >

            </button>


            <div class="imagem-favorito">

                <img
                    src="../${oferta.imagem || ""}"
                    alt="${oferta.titulo || "Oferta"}"
                >

            </div>


            <div class="info-favorito">

                <span class="tipo-favorito">
                    Oferta
                </span>


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


                <div class="precos-favorito">

                    <div class="preco-anterior-favorito">

                        ${
                            precoAnterior > precoAtual
                                ? `

                                    <span>
                                        De
                                    </span>

                                    <del>
                                        R$
                                        ${precoAnterior.toLocaleString(
                                            "pt-BR",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }
                                        )}
                                    </del>

                                `
                                : ""
                        }

                    </div>


                    <div class="preco-atual-favorito">

                        <span>
                            Por
                        </span>

                        <strong>
                            R$
                            ${precoAtual.toLocaleString(
                                "pt-BR",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        `;

        container.appendChild(card);

    }

    function caminhoImagem(caminho) {
        const valor = String(caminho || "").trim();
        if (!valor) return "";
        if (/^(https?:|data:|\/)/i.test(valor)) return valor;
        return `../${valor.replace(/^\.\//, "")}`;
    }

    function criarCardHotel(hotel, container) {
        const preco = Number(hotel.preco_diaria || 0);
        const card = document.createElement("div");
        card.className = "card-favorito";
        const imagem = caminhoImagem(hotel.imagem_principal);
        const localizacao = [hotel.cidade, hotel.pais].filter(Boolean).join(", ");
        card.innerHTML = `
            <button class="btn-favorito" type="button" data-tipo="hotel" data-id="${hotel.id_hotel}" aria-label="Remover dos favoritos">
                <img src="/img/icones/favoritado.png" alt="Remover dos favoritos">
            </button>
            <div class="imagem-favorito">
                ${imagem ? `<img src="${imagem}" alt="${hotel.nome_hotel || "Hotel"}" loading="lazy">` : `<div class="imagem-indisponivel">Imagem indisponível</div>`}
            </div>
            <div class="info-favorito">
                <span class="tipo-favorito">Hotel</span>
                <h3>${hotel.nome_hotel || "Hotel"}</h3>
                <p>${localizacao || hotel.endereco || ""}</p>
                <p>${hotel.descricao_hotel || hotel.quarto_hotel || "Confira os detalhes deste hotel."}</p>
                <div class="preco-favorito"><strong>${preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><span> por diária</span></div>
            </div>`;
        container.appendChild(card);
    }

    function criarCardAtividade(atividade, container) {
        const preco = Number(atividade.preco || 0);
        const card = document.createElement("div");
        card.className = "card-favorito";
        const imagem = caminhoImagem(atividade.imagem_principal);
        const local = atividade.nome_destino || atividade.local_atividade || atividade.cidade_destino || "";
        card.innerHTML = `
            <button class="btn-favorito" type="button" data-tipo="atividade" data-id="${atividade.id_atividade}" aria-label="Remover dos favoritos">
                <img src="/img/icones/favoritado.png" alt="Remover dos favoritos">
            </button>
            <div class="imagem-favorito">
                ${imagem ? `<img src="${imagem}" alt="${atividade.nome_atividade || "Atividade"}" loading="lazy">` : `<div class="imagem-indisponivel">Imagem indisponível</div>`}
            </div>
            <div class="info-favorito">
                <span class="tipo-favorito">${atividade.categoria || "Atividade"}</span>
                <h3>${atividade.nome_atividade || "Atividade"}</h3>
                <p>${local}${atividade.duracao ? ` • ${atividade.duracao}` : ""}</p>
                <p>${atividade.descricao_atividade || "Confira os detalhes desta atividade."}</p>
                <div class="preco-favorito"><strong>${preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong><span> por pessoa</span></div>
            </div>`;
        container.appendChild(card);
    }


    // --- REMOVER FAVORITO ---

    favoritosGrid.addEventListener(
        "click",
        async event => {

            const botao =
                event.target.closest(
                    ".btn-favorito"
                );

            if (!botao) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const tipo =
                botao.dataset.tipo;

            const idItem =
                botao.dataset.id;


            try {

                const resposta =
                    await fetch(
                        "http://localhost:3000/favoritos",
                        {
                            method: "DELETE",

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


                if (!resposta.ok) {

                    console.error(
                        resultado
                    );

                    return;

                }


                // Remove da lista original
                favoritosOriginais =
                    favoritosOriginais.filter(
                        favorito =>
                            !(
                                favorito.tipo === tipo &&
                                Number(
                                    favorito.id_item
                                ) === Number(idItem)
                            )
                    );


                // Atualiza a tela
                filtrarFavoritos();


            } catch (erro) {

                console.error(
                    "Erro ao remover favorito:",
                    erro
                );

            }

        }
    );


    function atualizarBotaoVerMais() {

    if (!btnVerMaisFavoritos) {
        return;
    }

    // Conta quantos favoritos existem
    // depois dos filtros/pesquisa

    const busca =
        normalizarTexto(buscaAtual);

    const listaFiltrada =
        favoritosOriginais.filter(favorito => {

            // FILTRO DE TIPO
            if (
                filtroAtual !== "todos" &&
                favorito.tipo !== filtroAtual
            ) {
                return false;
            }

            const id =
                Number(favorito.id_item);

            // DESTINO
            if (favorito.tipo === "destino") {

                const destino =
                    destinos.find(
                        item =>
                            Number(item.id_destino) === id
                    );

                if (!destino) {
                    return false;
                }

                const texto =
                    normalizarTexto(`
                        ${destino.nome}
                        ${destino.cidade}
                        ${destino.pais}
                        ${destino.descricao}
                    `);

                return texto.includes(busca);
            }

            // OFERTA
            if (favorito.tipo === "oferta") {

                const oferta =
                    ofertas.find(
                        item =>
                            Number(item.id) === id
                    );

                if (!oferta) {
                    return false;
                }

                const texto =
                    normalizarTexto(`
                        ${oferta.titulo}
                        ${oferta.nome}
                        ${oferta.descricao}
                        ${oferta.dias}
                    `);

                return texto.includes(busca);
            }

            if (favorito.tipo === "hotel") {
                const hotel = hoteis.find(item => Number(item.id_hotel) === id);
                return Boolean(hotel) && normalizarTexto(`${hotel.nome_hotel} ${hotel.quarto_hotel} ${hotel.descricao_hotel} ${hotel.cidade} ${hotel.pais} ${hotel.endereco}`).includes(busca);
            }

            if (favorito.tipo === "atividade") {
                const atividade = atividades.find(item => Number(item.id_atividade) === id);
                return Boolean(atividade) && normalizarTexto(`${atividade.nome_atividade} ${atividade.descricao_atividade} ${atividade.categoria} ${atividade.local_atividade} ${atividade.nome_destino} ${atividade.cidade_destino} ${atividade.pais_destino}`).includes(busca);
            }

            return false;
        });

    // --- MOSTRAR / ESCONDER BOTÃO ---

    if (
        quantidadeVisivel <
        listaFiltrada.length
    ) {

        btnVerMaisFavoritos.style.display =
            "block";

    } else {

        btnVerMaisFavoritos.style.display =
            "none";

    }
}
if (btnVerMaisFavoritos) {

    btnVerMaisFavoritos.addEventListener(
        "click",
        () => {

            quantidadeVisivel += 8;

            // Não chama filtrarFavoritos()
            // porque isso resetaria para 8

            const busca = normalizarTexto(buscaAtual);

            const listaFiltrada =
                favoritosOriginais.filter(favorito => {

                    if (
                        filtroAtual !== "todos" &&
                        favorito.tipo !== filtroAtual
                    ) {
                        return false;
                    }

                    const id = Number(favorito.id_item);

                    if (favorito.tipo === "destino") {

                        const destino = destinos.find(
                            item =>
                                Number(item.id_destino) === id
                        );

                        if (!destino) {
                            return false;
                        }

                        const texto =
                            normalizarTexto(`
                                ${destino.nome || ""}
                                ${destino.cidade || ""}
                                ${destino.pais || ""}
                                ${destino.descricao || ""}
                            `);

                        return texto.includes(busca);
                    }

                    if (favorito.tipo === "oferta") {

                        const oferta = ofertas.find(
                            item =>
                                Number(item.id) === id
                        );

                        if (!oferta) {
                            return false;
                        }

                        const texto =
                            normalizarTexto(`
                                ${oferta.titulo || ""}
                                ${oferta.nome || ""}
                                ${oferta.descricao || ""}
                                ${oferta.dias || ""}
                            `);

                        return texto.includes(busca);
                    }

                    if (favorito.tipo === "hotel") {
                        const hotel = hoteis.find(item => Number(item.id_hotel) === id);
                        return Boolean(hotel) && normalizarTexto(`${hotel.nome_hotel} ${hotel.quarto_hotel} ${hotel.descricao_hotel} ${hotel.cidade} ${hotel.pais} ${hotel.endereco}`).includes(busca);
                    }

                    if (favorito.tipo === "atividade") {
                        const atividade = atividades.find(item => Number(item.id_atividade) === id);
                        return Boolean(atividade) && normalizarTexto(`${atividade.nome_atividade} ${atividade.descricao_atividade} ${atividade.categoria} ${atividade.local_atividade} ${atividade.nome_destino} ${atividade.cidade_destino} ${atividade.pais_destino}`).includes(busca);
                    }

                    return false;

                });

            renderizarFavoritos(listaFiltrada);

        }
    );

}

});
