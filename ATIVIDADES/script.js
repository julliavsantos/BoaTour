

document.addEventListener("DOMContentLoaded", () => {

    // --- ELEMENTOS DA PÁGINA ---

    const atividadesGrid = document.getElementById("ofertasGrid");
    const campoBusca = document.getElementById("partida");
    const botoesFiltro = document.querySelectorAll(".filtro");
    const btnVerMais = document.getElementById("btnVerMais");

    // --- VERIFICAR SE EXISTE O GRID ---

    if (!atividadesGrid) {
        return;
    }

    // --- VARIÁVEIS ---

    let todasAtividades = [];
    let filtroAtual = "todos";
    let buscaAtual = "";
    let quantidadeVisivel = 6;
    let resultadosAtuais = [];
    let favoritosUsuario = [];

    // --- NORMALIZAR TEXTO ---

    function normalizarTexto(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // --- FORMATAR PREÇO ---

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // --- CARREGAR FAVORITOS DO USUÁRIO ---

    async function carregarFavoritos() {
        const sessionToken = localStorage.getItem("boatourSessionToken");

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
                console.error("Erro ao carregar favoritos:", resultado);
                favoritosUsuario = [];
                return;
            }

            favoritosUsuario = resultado.favoritos || [];

        } catch (erro) {
            console.error("Erro ao buscar favoritos:", erro);
            favoritosUsuario = [];
        }
    }

    // --- BUSCAR ATIVIDADES DO SERVIDOR ---

    async function buscarAtividades() {
        try {
            const resposta = await fetch(
                "http://localhost:3000/atividades"
            );

            if (!resposta.ok) {
                throw new Error("Erro ao buscar atividades.");
            }

            todasAtividades = await resposta.json();

            await carregarFavoritos();

            aplicarFiltros();

        } catch (erro) {
            console.error("Erro ao carregar atividades:", erro);

            atividadesGrid.innerHTML = `
                <div class="sem-ofertas">
                    <h3>Não foi possível carregar as atividades</h3>
                    <p>Verifique se o servidor está funcionando.</p>
                </div>
            `;

            if (btnVerMais) {
                btnVerMais.style.display = "none";
            }
        }
    }

    // --- FILTRAR ATIVIDADES POR FAIXA DE PREÇO ---

    function atividadeDentroDaFaixaDePreco(atividade, filtro) {
        if (filtro === "todos") return true;

        const preco = Number(atividade.preco);
        if (!Number.isFinite(preco)) return false;

        switch (filtro) {
            case "100": return preco <= 100;
            case "300": return preco > 100 && preco <= 300;
            case "600": return preco > 300 && preco <= 600;
            case "600+": return preco > 600;
            default: return true;
        }
    }

    // --- APLICAR BUSCA + FILTRO ---

    function aplicarFiltros() {
        const textoBusca = normalizarTexto(buscaAtual);

        resultadosAtuais = todasAtividades.filter(atividade => {

            const passouNoFiltro = atividadeDentroDaFaixaDePreco(
                atividade,
                filtroAtual
            );

            const textoAtividade = normalizarTexto([
                atividade.nome_atividade,
                atividade.descricao_atividade,
                atividade.local_atividade,
                atividade.categoria,
                atividade.duracao,
                atividade.nome_destino,
                atividade.cidade_destino,
                atividade.pais_destino,
                atividade.incluso,
                atividade.recomendacoes
            ].join(" "));

            const passouNaBusca =
                textoBusca === "" ||
                textoAtividade.includes(textoBusca);

            return passouNoFiltro && passouNaBusca;
        });

        quantidadeVisivel = 6;

        renderizarAtividades();
    }

    // --- RENDERIZAR ATIVIDADES ---

    function renderizarAtividades() {
        atividadesGrid.innerHTML = "";

        if (resultadosAtuais.length === 0) {
            atividadesGrid.innerHTML = `
                <div class="sem-ofertas">
                    <h3>Nenhuma atividade encontrada</h3>
                    <p>Tente pesquisar outro termo ou alterar o filtro.</p>
                </div>
            `;

            atualizarBotaoVerMais();
            return;
        }

        const atividadesVisiveis = resultadosAtuais.slice(
            0,
            quantidadeVisivel
        );

        atividadesVisiveis.forEach(atividade => {

            // --- VERIFICAR SE É FAVORITA ---

            const atividadeFavoritada = favoritosUsuario.some(favorito =>
                favorito.tipo === "atividade" &&
                Number(favorito.id_item) === Number(atividade.id_atividade)
            );

            // --- CRIAR CARD ---

            const card = document.createElement("div");
            card.classList.add("card-oferta");

            // --- IMAGEM ---

            const imagem = String(
                atividade.imagem_principal || ""
            ).trim();

            const imagemUrl = imagem
                ? (/^(https?:|data:|\/)/i.test(imagem)
                    ? imagem
                    : `../${imagem.replace(/^\.\//, "")}`)
                : "";

            // --- INFORMAÇÕES ---

            const nome = atividade.nome_atividade || "Atividade";
            const descricao = atividade.descricao_atividade || "";
            const categoria = atividade.categoria || "Atividade";
            const destino = atividade.nome_destino ||
                atividade.local_atividade ||
                "Destino não informado";

            const preco = Number(atividade.preco || 0);
            const duracao = atividade.duracao || "";
            const classificacao = atividade.classificacao;

            // --- DADOS PARA EVENTUAIS MODAIS ---

            card.dataset.id = atividade.id_atividade || "";
            card.dataset.modalTipo = "atividade";
            card.dataset.nome = nome;
            card.dataset.descricao = descricao;
            card.dataset.categoria = categoria;
            card.dataset.local = atividade.local_atividade || "";
            card.dataset.destino = destino;
            card.dataset.duracao = duracao;
            card.dataset.preco = preco;
            card.dataset.classificacao = classificacao || "";
            card.dataset.incluso = atividade.incluso || "";
            card.dataset.recomendacoes = atividade.recomendacoes || "";

            // --- RESUMO DO CARD ---

            const informacoes = [
                destino,
                duracao
            ].filter(Boolean).join(" • ");

            // --- HTML DO CARD ---

            card.innerHTML = `
                <div class="imagem-oferta">
                    ${imagemUrl ? `
                        <img
                            src="${imagemUrl}"
                            alt="${nome}"
                            loading="lazy"
                        >
                    ` : `
                        <div class="imagem-indisponivel">Imagem indisponível</div>
                    `}
                </div>

                <div class="info-oferta">
                    <span class="categoria-oferta">
                        ${categoria}
                    </span>

                    <h3>${nome}</h3>

                    <p>${informacoes}</p>

                    <p class="descricao-card">
                        ${descricao || "Confira os detalhes desta atividade."}
                    </p>

                    ${classificacao ? `
                        <p class="classificacao-atividade">
                            ★ ${Number(classificacao).toLocaleString("pt-BR")}
                        </p>
                    ` : ""}
                </div>

                <div class="precos">
                    <button
                        class="btn-favorito"
                        type="button"
                        data-tipo="atividade"
                        data-id="${atividade.id_atividade}"
                        aria-label="${atividadeFavoritada
                            ? "Remover dos favoritos"
                            : "Adicionar aos favoritos"}"
                    >
                        <img
                            src="${atividadeFavoritada
                                ? "/img/icones/favoritado.png"
                                : "/img/icones/favoritar.png"}"
                            alt="${atividadeFavoritada
                                ? "Remover dos favoritos"
                                : "Favoritar"}"
                        >
                    </button>

                    <strong>${formatarMoeda(preco)}</strong>

                    <span class="preco-legenda">
                        Por pessoa
                    </span>
                </div>
            `;

            const imagemCard = card.querySelector(".imagem-oferta img");
            if (imagemCard) {
                imagemCard.addEventListener("error", () => {
                    imagemCard.style.display = "none";

                    const avisoImagem = document.createElement("div");
                    avisoImagem.className = "imagem-indisponivel";
                    avisoImagem.textContent = "Imagem indisponível";
                    imagemCard.parentElement.appendChild(avisoImagem);
                }, { once: true });
            }

            atividadesGrid.appendChild(card);
        });

        atualizarBotaoVerMais();
    }

    // --- FAVORITOS ---

    document.addEventListener("click", async event => {
        const btnFavorito = event.target.closest(".btn-favorito");

        if (!btnFavorito) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const idItem = Number(btnFavorito.dataset.id);
        const imagemBotao = btnFavorito.querySelector("img");

        const sessionToken = localStorage.getItem(
            "boatourSessionToken"
        );

        if (!sessionToken) {
            return;
        }

        const estaFavoritado = favoritosUsuario.some(favorito =>
            favorito.tipo === "atividade" &&
            Number(favorito.id_item) === idItem
        );

        const metodo = estaFavoritado ? "DELETE" : "POST";

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
                        tipo: "atividade",
                        id_item: idItem
                    })
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                console.error("Erro ao atualizar favorito:", resultado);
                alert("Não foi possível atualizar seus favoritos.");
                return;
            }

            if (metodo === "POST") {
                favoritosUsuario.push({
                    tipo: "atividade",
                    id_item: idItem
                });

                imagemBotao.src = "/img/icones/favoritado.png";
                imagemBotao.alt = "Remover dos favoritos";

                btnFavorito.setAttribute(
                    "aria-label",
                    "Remover dos favoritos"
                );

            } else {
                favoritosUsuario = favoritosUsuario.filter(favorito =>
                    !(
                        favorito.tipo === "atividade" &&
                        Number(favorito.id_item) === idItem
                    )
                );

                imagemBotao.src = "/img/icones/favoritar.png";
                imagemBotao.alt = "Favoritar";

                btnFavorito.setAttribute(
                    "aria-label",
                    "Adicionar aos favoritos"
                );
            }

        } catch (erro) {
            console.error("Erro ao conectar com o servidor:", erro);
        }
    });

    // --- BOTÃO VER MAIS ---

    function atualizarBotaoVerMais() {
        if (!btnVerMais) {
            return;
        }

        btnVerMais.style.display =
            quantidadeVisivel < resultadosAtuais.length
                ? "block"
                : "none";
    }

    if (btnVerMais) {
        btnVerMais.addEventListener("click", () => {
            quantidadeVisivel += 6;
            renderizarAtividades();
        });
    }

    // --- CAMPO DE BUSCA ---

    if (campoBusca) {
        campoBusca.addEventListener("input", () => {
            buscaAtual = campoBusca.value;
            aplicarFiltros();
        });
    }

    // --- BOTÕES DE FILTRO ---

    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {

            botoesFiltro.forEach(btn => {
                btn.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            filtroAtual = botao.dataset.preco || "todos";

            aplicarFiltros();
        });
    });

    // --- INICIAR PÁGINA ---

    buscarAtividades();

});
