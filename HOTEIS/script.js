
const API = "http://localhost:3000";

// --- PÁGINA DE HOTÉIS ---

document.addEventListener("DOMContentLoaded", () => {

    const hoteisGrid = document.getElementById("ofertasGrid");
    const campoBusca = document.getElementById("partida");
    const formBusca = document.getElementById("formBuscaHoteis");
    const campoCheckin = document.getElementById("dataPartida");
    const campoCheckout = document.getElementById("dataRetorno");
    const campoHospedes = document.getElementById("passageiros");
    const infoBusca = document.getElementById("infoBuscaHoteis");
    const botoesPreco = document.querySelectorAll(".filtro-preco-hotel");
    const btnVerMais = document.getElementById("btnVerMais");
    const menuHospedes = document.getElementById("passageirosMenu");
    const btnConfirmarHospedes = document.getElementById("confirmarPassageiros");

    if (!hoteisGrid) {
        console.error("Não encontrei o elemento #ofertasGrid no HTML.");
        return;
    }

    let todosHoteis = [];
    let resultadosAtuais = [];
    let favoritosUsuario = [];
    let filtroPrecoAtual = "todos";
    let buscaAtual = "";
    let quantidadeVisivel = 6;

    if (campoHospedes) {
        campoHospedes.dataset.total = "1";
        campoHospedes.value = "";
    }

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
        const numero = Number(valor);

        if (!Number.isFinite(numero) || numero < 0) {
            return "Preço não informado";
        }

        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // --- AJUSTAR CAMINHO DA IMAGEM ---

    function obterImagem(caminho) {
        const imagem = String(caminho || "").trim();

        if (!imagem) {
            return "";
        }

        // Permite URLs completas e caminhos absolutos
        if (/^(https?:\/\/|\/)/i.test(imagem)) {
            return imagem;
        }

        // Caminhos relativos à pasta da página
        return `../${imagem.replace(/^\.\//, "")}`;
    }

    // --- CARREGAR FAVORITOS ---

    async function carregarFavoritos() {
        const sessionToken =
            localStorage.getItem("boatourSessionToken");

        if (!sessionToken) {
            favoritosUsuario = [];
            return;
        }

        try {
            const resposta = await fetch(`${API}/favoritos`, {
                headers: {
                    "X-Session-Token": sessionToken
                }
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                favoritosUsuario = [];
                console.error("Erro ao carregar favoritos:", resultado);
                return;
            }

            favoritosUsuario = resultado.favoritos || [];

        } catch (erro) {
            favoritosUsuario = [];
            console.error("Erro ao buscar favoritos:", erro);
        }
    }

    // --- BUSCAR HOTÉIS NO BANCO DE DADOS ---

    async function carregarHoteis() {
        hoteisGrid.innerHTML = `
            <p class="mensagem-carregamento">
                Carregando hotéis...
            </p>
        `;

        try {
            const resposta = await fetch(`${API}/hoteis`);

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.error || "Não foi possível buscar os hotéis."
                );
            }

            if (!Array.isArray(resultado)) {
                throw new Error("O servidor não retornou uma lista de hotéis.");
            }

            todosHoteis = resultado;

            await carregarFavoritos();

            aplicarFiltros();

        } catch (erro) {
            console.error("Erro ao carregar hotéis:", erro);

            hoteisGrid.innerHTML = `
                <div class="sem-ofertas">
                    <h3>Não foi possível carregar os hotéis</h3>
                    <p>Confira se o servidor está funcionando e tente novamente.</p>
                </div>
            `;

            if (btnVerMais) {
                btnVerMais.style.display = "none";
            }
        }
    }

    // --- FILTRAR HOTÉIS ---

    function hotelPertenceFaixaPreco(hotel, filtro) {
        if (!filtro || filtro === "todos") return true;

        const preco = Number(hotel.preco_diaria);
        if (!Number.isFinite(preco)) return false;

        if (filtro === "300") return preco <= 300;
        if (filtro === "600") return preco > 300 && preco <= 600;
        if (filtro === "1000") return preco > 600 && preco <= 1000;
        if (filtro === "1000+") return preco > 1000;

        return true;
    }

    function aplicarFiltros() {
        const busca = normalizarTexto(buscaAtual);

        resultadosAtuais = todosHoteis.filter(hotel => {
            const textoHotel = normalizarTexto(`
                ${hotel.nome_hotel || ""}
                ${hotel.quarto_hotel || ""}
                ${hotel.descricao_hotel || ""}
                ${hotel.cidade || ""}
                ${hotel.pais || ""}
                ${hotel.endereco || ""}
                ${hotel.classificacao || ""}
            `);

            const correspondeBusca =
                !busca || textoHotel.includes(busca);

            const correspondePreco =
                hotelPertenceFaixaPreco(hotel, filtroPrecoAtual);

            return correspondeBusca && correspondePreco;
        });

        quantidadeVisivel = 6;
        renderizarHoteis();
    }

    // --- RENDERIZAR HOTÉIS ---

    function renderizarHoteis() {
        hoteisGrid.innerHTML = "";

        if (resultadosAtuais.length === 0) {
            hoteisGrid.innerHTML = `
                <div class="sem-ofertas">
                    <h3>Nenhum hotel encontrado</h3>
                    <p>Tente pesquisar outro nome, cidade ou país.</p>
                </div>
            `;

            atualizarBotaoVerMais();
            return;
        }

        const hoteisVisiveis = resultadosAtuais.slice(
            0,
            quantidadeVisivel
        );

        hoteisVisiveis.forEach(hotel => {
            const idHotel = Number(hotel.id_hotel);

            const favoritado = favoritosUsuario.some(favorito =>
                favorito.tipo === "hotel" &&
                Number(favorito.id_item) === idHotel
            );

            const card = document.createElement("div");
            card.classList.add("card-oferta");
            card.dataset.idHotel = String(idHotel);
            card.dataset.compraTipo = "hotel";
            card.dataset.compraId = String(idHotel);

            const imagem = obterImagem(hotel.imagem_principal);

            const nome = hotel.nome_hotel || "Hotel";
            const descricao =
                hotel.descricao_hotel || "Confira os detalhes deste hotel.";

            const localizacao = [
                hotel.cidade,
                hotel.pais
            ].filter(Boolean).join(", ");

            const classificacao = hotel.classificacao;

            const preco = hotel.preco_diaria;

            card.dataset.modalTipo = "hotel";
            card.dataset.nome = nome;
            card.dataset.descricao = descricao;
            card.dataset.categoria = "Hospedagem";
            card.dataset.resumo = localizacao || "Localização não informada";
            card.dataset.classificacao = classificacao || "";
            card.dataset.quarto = hotel.quarto_hotel || "";
            card.dataset.preco = preco || "0";
            card.dataset.ods8 = hotel.ods8 || 0;
            card.dataset.ods12 = hotel.ods12 || 0;

            card.innerHTML = `
                <div class="imagem-oferta">
                    ${
                        imagem
                            ? `<img
                                src="${imagem}"
                                alt="${nome}"
                                loading="lazy"
                            >`
                            : `<div class="imagem-indisponivel">
                                Imagem indisponível
                            </div>`
                    }
                </div>

                <div class="info-oferta">
                    <span class="categoria-oferta">Hospedagem</span>

                    <h3>${nome}</h3>

                    ${Number(hotel.ods8) === 1 || Number(hotel.ods12) === 1 ? `
                        <div class="ods-card-tags" aria-label="Hotel alinhado ao programa Turismo Consciente">
                            ${Number(hotel.ods8) === 1 ? `<span class="ods-card-tag">ODS 8</span>` : ""}
                            ${Number(hotel.ods12) === 1 ? `<span class="ods-card-tag">ODS 12</span>` : ""}
                        </div>
                    ` : ""}

                    ${localizacao
                        ? `<p>${localizacao}</p>`
                        : ""
                    }

                    ${classificacao
                        ? `<p>Classificação: ${classificacao}</p>`
                        : ""
                    }

                    <p class="descricao-card">${descricao}</p>
                </div>

                <div class="precos">
                    <button
                        class="btn-favorito"
                        type="button"
                        data-tipo="hotel"
                        data-id="${idHotel}"
                        aria-label="${
                            favoritado
                                ? "Remover dos favoritos"
                                : "Adicionar aos favoritos"
                        }"
                    >
                        <img
                            src="${
                                favoritado
                                    ? "/img/icones/favoritado.png"
                                    : "/img/icones/favoritar.png"
                            }"
                            alt="${
                                favoritado
                                    ? "Remover dos favoritos"
                                    : "Favoritar"
                            }"
                        >
                    </button>

                    <strong>${formatarMoeda(preco)}</strong>

                    <span class="preco-legenda">Por diária</span>
                </div>
            `;

            const img = card.querySelector(".imagem-oferta img");

            if (img) {
                img.addEventListener("error", () => {
                    img.style.display = "none";

                    const aviso = document.createElement("div");
                    aviso.className = "imagem-indisponivel";
                    aviso.textContent = "Imagem indisponível";

                    img.parentElement.appendChild(aviso);
                }, { once: true });
            }

            hoteisGrid.appendChild(card);
        });

        atualizarBotaoVerMais();
    }

    // --- FAVORITAR / DESFAVORITAR HOTÉIS ---

    document.addEventListener("click", async event => {
        const btnFavorito = event.target.closest(".btn-favorito");

        if (!btnFavorito || !hoteisGrid.contains(btnFavorito)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const sessionToken =
            localStorage.getItem("boatourSessionToken");

        if (!sessionToken) {
            return;
        }

        const idHotel = Number(btnFavorito.dataset.id);

        const imagemBotao = btnFavorito.querySelector("img");

        const estaFavoritado =
            imagemBotao.src.includes("favoritado.png");

        const metodo = estaFavoritado ? "DELETE" : "POST";

        btnFavorito.disabled = true;

        try {
            const resposta = await fetch(`${API}/favoritos`, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Token": sessionToken
                },
                body: JSON.stringify({
                    tipo: "hotel",
                    id_item: idHotel
                })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.error || "Não foi possível atualizar o favorito."
                );
            }

            if (metodo === "POST") {
                favoritosUsuario.push({
                    tipo: "hotel",
                    id_item: idHotel
                });
            } else {
                favoritosUsuario = favoritosUsuario.filter(favorito =>
                    !(
                        favorito.tipo === "hotel" &&
                        Number(favorito.id_item) === idHotel
                    )
                );
            }

            renderizarHoteis();

        } catch (erro) {
            console.error("Erro ao atualizar favorito:", erro);
            alert(erro.message || "Erro ao atualizar favorito.");
        } finally {
            btnFavorito.disabled = false;
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
            renderizarHoteis();
        });
    }

    // --- BUSCA DE DESTINO / NOME DO HOTEL ---

    if (campoBusca) {
        campoBusca.addEventListener("input", () => {
            buscaAtual = campoBusca.value;
            aplicarFiltros();
        });
    }

    if (campoHospedes && menuHospedes) {
        campoHospedes.addEventListener("click", () => {
            menuHospedes.classList.toggle("aberto");
        });

        menuHospedes.querySelectorAll(".contador button").forEach(botao => {
            botao.addEventListener("click", () => {
                const tipo = botao.dataset.tipo;
                const contador = document.getElementById(`${tipo}Qtd`);
                if (!contador) return;

                const minimo = tipo === "adultos" ? 1 : 0;
                const incremento = botao.classList.contains("mais") ? 1 : -1;
                contador.textContent = String(Math.max(
                    minimo,
                    Number(contador.textContent || minimo) + incremento
                ));

                const total = ["adultos", "criancas", "bebes"].reduce(
                    (soma, categoria) => soma + Number(
                        document.getElementById(`${categoria}Qtd`)?.textContent || 0
                    ),
                    0
                );
                campoHospedes.dataset.total = String(total);
            });
        });

        btnConfirmarHospedes?.addEventListener("click", () => {
            const total = Number(campoHospedes.dataset.total || 1);
            campoHospedes.value = `${total} ${total === 1 ? "hóspede" : "hóspedes"}`;
            menuHospedes.classList.remove("aberto");
        });

        document.addEventListener("click", evento => {
            if (!menuHospedes.contains(evento.target) && evento.target !== campoHospedes) {
                menuHospedes.classList.remove("aberto");
            }
        });
    }

    // --- DATAS DA HOSPEDAGEM E ENVIO DA BUSCA ---

    if (campoCheckin && campoCheckout) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const calendarioPartida = document.getElementById("calendarioPartida");
        const calendarioRetorno = document.getElementById("calendarioRetorno");
        const abrirPartida = document.getElementById("abrirPartida");
        const abrirRetorno = document.getElementById("abrirRetorno");
        const errosData = {
            checkin: document.getElementById("erroCheckinHotel"),
            checkout: document.getElementById("erroCheckoutHotel")
        };
        const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        const calendarios = {
            checkin: { input: campoCheckin, elemento: calendarioPartida, botao: abrirPartida, mes: new Date(hoje.getFullYear(), hoje.getMonth(), 1) },
            checkout: { input: campoCheckout, elemento: calendarioRetorno, botao: abrirRetorno, mes: new Date(hoje.getFullYear(), hoje.getMonth(), 1) }
        };

        const formatarData = data => `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
        const converterData = valor => {
            const partes = valor.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (!partes) return null;
            const data = new Date(Number(partes[3]), Number(partes[2]) - 1, Number(partes[1]));
            return data.getFullYear() === Number(partes[3]) && data.getMonth() === Number(partes[2]) - 1 && data.getDate() === Number(partes[1]) ? data : null;
        };
        const mesmoDia = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
        const dataValidaPara = (tipo, data) => data >= hoje && (tipo !== "checkout" || !converterData(campoCheckin.value) || data > converterData(campoCheckin.value));
        const mostrarErroData = (tipo, mensagem = "") => {
            const config = calendarios[tipo];
            const erro = errosData[tipo];
            if (erro) erro.textContent = mensagem;
            config.input.classList.toggle("com-erro", Boolean(mensagem));
            config.input.setAttribute("aria-invalid", mensagem ? "true" : "false");
        };

        const renderizarCalendario = tipo => {
            const config = calendarios[tipo];
            const calendario = config.elemento;
            if (!calendario) return;
            const ano = config.mes.getFullYear();
            const mes = config.mes.getMonth();
            calendario.replaceChildren();

            const cabecalho = document.createElement("div");
            cabecalho.className = "cabecalho-calendario";
            const titulo = document.createElement("div");
            titulo.className = "mes-ano";
            titulo.textContent = `${meses[mes]} de ${ano}`;
            const navegacao = document.createElement("div");
            navegacao.className = "navegacao-calendario";
            [["‹", -1], ["›", 1]].forEach(([texto, passo]) => {
                const botao = document.createElement("button");
                botao.type = "button";
                botao.textContent = texto;
                botao.addEventListener("click", evento => {
                    evento.stopPropagation();
                    config.mes.setMonth(config.mes.getMonth() + passo);
                    renderizarCalendario(tipo);
                    calendario.classList.add("aberto");
                });
                navegacao.appendChild(botao);
            });
            cabecalho.append(titulo, navegacao);
            calendario.appendChild(cabecalho);

            const semana = document.createElement("div");
            semana.className = "dias-semana";
            ["D", "S", "T", "Q", "Q", "S", "S"].forEach(dia => {
                const item = document.createElement("span");
                item.textContent = dia;
                semana.appendChild(item);
            });
            calendario.appendChild(semana);

            const dias = document.createElement("div");
            dias.className = "dias";
            const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
            const totalDias = new Date(ano, mes + 1, 0).getDate();
            for (let i = 0; i < primeiroDiaSemana; i++) {
                const vazio = document.createElement("span");
                vazio.className = "dia outro-mes";
                dias.appendChild(vazio);
            }
            for (let dia = 1; dia <= totalDias; dia++) {
                const data = new Date(ano, mes, dia);
                const botao = document.createElement("button");
                botao.type = "button";
                botao.className = "dia";
                botao.textContent = dia;
                const selecionada = converterData(config.input.value);
                if (mesmoDia(data, hoje)) botao.classList.add("hoje");
                if (selecionada && mesmoDia(data, selecionada)) botao.classList.add("selecionado");
                if (!dataValidaPara(tipo, data)) {
                    botao.classList.add("bloqueado");
                    botao.disabled = true;
                }
                botao.addEventListener("click", evento => {
                    evento.stopPropagation();
                    config.input.value = formatarData(data);
                    mostrarErroData(tipo);
                    if (tipo === "checkin") {
                        const checkout = converterData(campoCheckout.value);
                        if (checkout && checkout <= data) {
                            campoCheckout.value = "";
                            mostrarErroData("checkout");
                        }
                    }
                    calendario.classList.remove("aberto");
                });
                dias.appendChild(botao);
            }
            while (dias.children.length < 42) {
                const vazio = document.createElement("span");
                vazio.className = "dia outro-mes";
                dias.appendChild(vazio);
            }
            calendario.appendChild(dias);

            const rodape = document.createElement("div");
            rodape.className = "rodape-calendario";
            const limpar = document.createElement("button");
            limpar.type = "button";
            limpar.textContent = "Limpar";
            limpar.addEventListener("click", evento => {
                evento.stopPropagation();
                config.input.value = "";
                mostrarErroData(tipo);
                if (tipo === "checkin") {
                    campoCheckout.value = "";
                    mostrarErroData("checkout");
                }
                renderizarCalendario(tipo);
                calendario.classList.add("aberto");
            });
            const hojeBotao = document.createElement("button");
            hojeBotao.type = "button";
            hojeBotao.textContent = "Hoje";
            hojeBotao.disabled = tipo === "checkout" && (!converterData(campoCheckin.value) || converterData(campoCheckin.value) >= hoje);
            hojeBotao.addEventListener("click", evento => {
                evento.stopPropagation();
                if (!dataValidaPara(tipo, hoje)) return;
                config.input.value = formatarData(hoje);
                mostrarErroData(tipo);
                calendario.classList.remove("aberto");
            });
            rodape.append(limpar, hojeBotao);
            calendario.appendChild(rodape);
        };

        const abrirCalendario = tipo => {
            Object.entries(calendarios).forEach(([outroTipo, config]) => {
                if (outroTipo !== tipo) config.elemento?.classList.remove("aberto");
            });
            const config = calendarios[tipo];
            const dataAtual = converterData(config.input.value);
            config.mes = dataAtual ? new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1) : new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            renderizarCalendario(tipo);
            config.elemento?.classList.add("aberto");
        };

        Object.entries(calendarios).forEach(([tipo, config]) => {
            config.botao?.addEventListener("click", evento => {
                evento.stopPropagation();
                abrirCalendario(tipo);
            });
            config.input.addEventListener("click", evento => {
                evento.stopPropagation();
                abrirCalendario(tipo);
            });
            config.input.addEventListener("input", () => {
                const numeros = config.input.value.replace(/\D/g, "").slice(0, 8);
                config.input.value = numeros.replace(/^(\d{2})(\d)/, "$1/$2").replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
                if (config.input.value.length === 10 && !converterData(config.input.value)) {
                    mostrarErroData(tipo, "Informe uma data válida no formato dd/mm/aaaa.");
                } else {
                    mostrarErroData(tipo);
                }
            });
            config.input.addEventListener("blur", () => {
                if (config.input.value && !converterData(config.input.value)) {
                    mostrarErroData(tipo, "Informe uma data válida no formato dd/mm/aaaa.");
                } else {
                    mostrarErroData(tipo);
                }
            });
        });

        document.addEventListener("click", evento => {
            Object.values(calendarios).forEach(config => {
                if (!config.elemento?.contains(evento.target) && evento.target !== config.input && !config.botao?.contains(evento.target)) {
                    config.elemento?.classList.remove("aberto");
                }
            });
        });
    }

    if (formBusca) {
        formBusca.addEventListener("submit", event => {
            event.preventDefault();

            const dataCheckin = campoCheckin.value ? converterData(campoCheckin.value) : null;
            const dataCheckout = campoCheckout.value ? converterData(campoCheckout.value) : null;
            if ((campoCheckin.value && !dataCheckin) || (campoCheckout.value && !dataCheckout)) {
                if (campoCheckin.value && !dataCheckin) mostrarErroData("checkin", "Informe uma data válida no formato dd/mm/aaaa.");
                if (campoCheckout.value && !dataCheckout) mostrarErroData("checkout", "Informe uma data válida no formato dd/mm/aaaa.");
                return;
            }
            if (dataCheckin && dataCheckin < hoje) {
                mostrarErroData("checkin", "O check-in não pode ser anterior a hoje.");
                return;
            }
            if (dataCheckout && dataCheckin && dataCheckout <= dataCheckin) {
                mostrarErroData("checkout", "O check-out deve ser depois do check-in.");
                return;
            }

            mostrarErroData("checkin");
            mostrarErroData("checkout");

            const periodo = campoCheckin.value && campoCheckout.value
                ? `, de ${campoCheckin.value} a ${campoCheckout.value}`
                : "";

            if (infoBusca) {
                const hospedes = Number(campoHospedes?.dataset.total || 1);
                infoBusca.textContent = `Busca para ${hospedes} ${hospedes === 1 ? "hóspede" : "hóspedes"}${periodo}.`;
            }

            buscaAtual = campoBusca?.value || "";
            aplicarFiltros();
            document.getElementById("titulo-ofertas")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    // --- FILTROS DE PREÇO ---

    botoesPreco.forEach(botao => {
        botao.addEventListener("click", () => {
            botoesPreco.forEach(btn => btn.classList.remove("ativo"));
            botao.classList.add("ativo");
            filtroPrecoAtual = botao.dataset.preco || "todos";
            aplicarFiltros();
        });
    });

    // --- INICIAR PÁGINA ---

    carregarHoteis();
});
