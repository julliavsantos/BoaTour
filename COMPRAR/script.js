document.addEventListener("DOMContentLoaded", async () => {
    const parametros = new URLSearchParams(window.location.search);
    const tipo = parametros.get("tipo") || (parametros.has("oferta") ? "oferta" : "");
    const idItem = Number(parametros.get("id") || parametros.get("oferta"));
    const titulo = document.getElementById("tituloOfertaCompra");
    const botaoContinuar = document.querySelector(".continuar-info");
    const formatarMoeda = valor => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const formatarData = data => {
        if (!data) return "";
        if (data instanceof Date && !Number.isNaN(data.getTime())) {
            return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`;
        }
        const partes = String(data).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : String(data);
    };
    const verdade = valor => valor === true || Number(valor) === 1;

    const configuracoes = {
        oferta: {
            endpoint: "/ofertas", campoId: "id",
            nome: item => item.titulo || "Oferta de viagem", preco: item => item.preco_atual,
            itens: item => [item.dias ? `${item.dias} dias` : null, item.quantidade_paises > 1 ? `${item.quantidade_paises} países` : null, item.destinos_inclusos].filter(Boolean).join(" · ") || "Oferta selecionada",
            imagem: item => item.imagem_resumo || item.imagem
        },
        atividade: {
            endpoint: "/atividades", campoId: "id_atividade",
            nome: item => item.nome_atividade || "Atividade", preco: item => item.preco,
            itens: item => [item.categoria, item.duracao, item.nome_destino || item.local_atividade].filter(Boolean).join(" · ") || "Atividade selecionada",
            imagem: item => item.imagem_principal
        },
        hotel: {
            endpoint: "/hoteis", campoId: "id_hotel",
            nome: item => item.nome_hotel || "Hotel", preco: item => item.preco_diaria,
            itens: item => [item.quarto_hotel, item.cidade, item.pais].filter(Boolean).join(" · ") || "Hospedagem selecionada",
            imagem: item => item.imagem_principal
        },
        destino: {
            endpoint: "/destinos", campoId: "id_destino",
            nome: item => item.nome || "Destino", preco: item => item.preco_base,
            itens: item => [item.cidade, item.pais, item.dias ? `${item.dias} dias` : null].filter(Boolean).join(" · ") || "Destino selecionado",
            imagem: item => item.imagem ? `img/destinos/${item.imagem}` : ""
        },
        voo: {
            endpoint: "/voos", campoId: "id_voo",
            nome: item => `${item.companhia_nome || item.companhia_aerea || "Voo"}${item.numero_voo ? ` · ${item.numero_voo}` : ""}`,
            preco: item => item.preco,
            itens: item => `${item.cidade_origem || item.origem || "Origem"} → ${item.cidade_destino || item.destino || "Destino"}`,
            descricao: item => `${formatarData(item.data_saida)} · ${String(item.horario_saida || "").slice(0, 5)}${item.horario_chegada ? ` – ${String(item.horario_chegada).slice(0, 5)}` : ""}`,
            imagem: item => item.logo_companhia || ""
        }
    };

    const configuracao = configuracoes[tipo];
    const linhaItem = document.getElementById("linhaItemSelecionadoCompra");
    const linhaVoo = document.getElementById("linhaVooCompra");
    const linhaHotel = document.getElementById("linhaHotelCompra");
    const paraISO = valor => {
        if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
            return `${valor.getFullYear()}-${String(valor.getMonth() + 1).padStart(2, "0")}-${String(valor.getDate()).padStart(2, "0")}`;
        }
        const texto = String(valor || "");
        const br = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (br) return `${br[3]}-${br[2]}-${br[1]}`;
        return /^\d{4}-\d{2}-\d{2}$/.test(texto) ? texto : "";
    };
    const checkin = paraISO(parametros.get("checkin"));
    const checkout = paraISO(parametros.get("checkout"));
    const inicioCompra = document.getElementById("dataInicioCompra");
    const fimCompra = document.getElementById("dataFimCompra");
    const campoCheckout = document.getElementById("campoCheckoutCompra");
    const exibicaoInicioCompra = document.getElementById("dataInicioCompraDisplay");
    const exibicaoFimCompra = document.getElementById("dataFimCompraDisplay");
    const calendariosCompra = {
        inicio: { painel: document.getElementById("calendarioInicioCompra"), input: inicioCompra, exibicao: exibicaoInicioCompra, mes: new Date() },
        fim: { painel: document.getElementById("calendarioFimCompra"), input: fimCompra, exibicao: exibicaoFimCompra, mes: new Date() }
    };
    const nomesMesesCompra = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const dataLocalCompra = valor => {
        const [ano, mes, dia] = String(valor || "").split("-").map(Number);
        return ano && mes && dia ? new Date(ano, mes - 1, dia) : null;
    };
    const isoLocalCompra = data => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
    const diaSeguinteIsoCompra = valor => {
        const data = dataLocalCompra(valor);
        if (!data) return "";
        data.setDate(data.getDate() + 1);
        return isoLocalCompra(data);
    };
    const fecharCalendariosCompra = () => Object.values(calendariosCompra).forEach(calendario => calendario.painel?.classList.remove("aberto"));
    const posicionarCalendarioCompra = (painel, ancora) => {
        const caixa = ancora.getBoundingClientRect();
        const altura = painel.offsetHeight;
        const abaixo = caixa.bottom + altura + 8 <= window.innerHeight;
        const topo = abaixo ? caixa.bottom + 8 : Math.max(8, caixa.top - altura - 8);
        painel.style.top = `${topo}px`;
        painel.style.left = `${Math.max(8, Math.min(caixa.left, window.innerWidth - painel.offsetWidth - 8))}px`;
    };
    const renderizarCalendarioCompra = tipoCalendario => {
        const calendario = calendariosCompra[tipoCalendario];
        const painel = calendario?.painel;
        if (!painel) return;
        const ano = calendario.mes.getFullYear();
        const mes = calendario.mes.getMonth();
        const hoje = new Date();
        const selecionada = calendario.input.value;
        const minimo = calendario.input.min || "";
        const primeiroDia = new Date(ano, mes, 1);
        const deslocamento = primeiroDia.getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const diasMesAnterior = new Date(ano, mes, 0).getDate();
        painel.innerHTML = `
            <div class="cabecalho-calendario"><span class="mes-ano">${nomesMesesCompra[mes]} de ${ano}</span>
                <div class="navegacao-calendario"><button type="button" data-mover="-1" aria-label="Mês anterior">‹</button><button type="button" data-mover="1" aria-label="Próximo mês">›</button></div>
            </div>
            <div class="dias-semana">${["D", "S", "T", "Q", "Q", "S", "S"].map(dia => `<span>${dia}</span>`).join("")}</div>
            <div class="dias">${Array.from({ length: 42 }, (_, indice) => {
                if (indice < deslocamento) {
                    const diaAnterior = diasMesAnterior - deslocamento + indice + 1;
                    return `<button type="button" class="dia outro-mes" disabled>${diaAnterior}</button>`;
                }
                if (indice >= deslocamento + totalDias) {
                    const diaProximo = indice - deslocamento - totalDias + 1;
                    return `<button type="button" class="dia outro-mes" disabled>${diaProximo}</button>`;
                }
                const dia = indice - deslocamento + 1;
                const data = new Date(ano, mes, dia);
                const iso = isoLocalCompra(data);
                const classes = ["dia", data.toDateString() === hoje.toDateString() ? "hoje" : "", iso === selecionada ? "selecionado" : "", minimo && iso < minimo ? "bloqueado" : ""].filter(Boolean).join(" ");
                return `<button type="button" class="${classes}" data-data="${iso}" ${minimo && iso < minimo ? "disabled" : ""}>${dia}</button>`;
            }).join("")}</div>
            <div class="rodape-calendario"><button type="button" data-limpar>Limpar</button><button type="button" data-hoje>Hoje</button></div>`;
        painel.querySelectorAll("[data-mover]").forEach(botao => botao.addEventListener("click", evento => {
            evento.stopPropagation();
            calendario.mes = new Date(ano, mes + Number(botao.dataset.mover), 1);
            renderizarCalendarioCompra(tipoCalendario);
        }));
        painel.querySelectorAll("[data-data]").forEach(botao => botao.addEventListener("click", () => {
            calendario.input.value = botao.dataset.data;
            calendario.input.dispatchEvent(new Event("change", { bubbles: true }));
            fecharCalendariosCompra();
        }));
        painel.querySelector("[data-limpar]")?.addEventListener("click", () => {
            calendario.input.value = "";
            calendario.input.dispatchEvent(new Event("change", { bubbles: true }));
            fecharCalendariosCompra();
        });
        painel.querySelector("[data-hoje]")?.addEventListener("click", () => {
            const hojeIso = isoLocalCompra(hoje);
            if (!minimo || hojeIso >= minimo) {
                calendario.input.value = hojeIso;
                calendario.input.dispatchEvent(new Event("change", { bubbles: true }));
            }
            fecharCalendariosCompra();
        });
    };
    document.querySelectorAll(".abrir-calendario-compra").forEach(botao => botao.addEventListener("click", () => {
        const calendario = calendariosCompra[botao.dataset.calendario];
        if (!calendario?.painel) return;
        const abrir = !calendario.painel.classList.contains("aberto");
        fecharCalendariosCompra();
        if (!abrir) return;
        calendario.mes = dataLocalCompra(calendario.input.value) || new Date();
        renderizarCalendarioCompra(botao.dataset.calendario);
        calendario.painel.classList.add("aberto");
        posicionarCalendarioCompra(calendario.painel, botao);
    }));
    Object.values(calendariosCompra).forEach(calendario => calendario.input?.addEventListener("change", () => {
        calendario.exibicao.value = formatarData(calendario.input.value);
        fimCompra.min = diaSeguinteIsoCompra(inicioCompra.value) || fimCompra.min;
        exibicaoFimCompra.value = formatarData(fimCompra.value);
    }));
    document.addEventListener("click", evento => {
        if (!evento.target.closest(".calendario-compra, .abrir-calendario-compra")) fecharCalendariosCompra();
    });
    window.addEventListener("resize", fecharCalendariosCompra);
    window.addEventListener("scroll", fecharCalendariosCompra, true);
    let itemCarregado;
    let precoBaseCompra = 0;
    let precoDiariaHotel = 0;
    let ofertaIncluiPasseios = false;
    let ehHospedagem = false;

    function atualizarDataResumo() {
        const linhaData = document.getElementById("linhaDataResumoCompra");
        const resumo = document.getElementById("dataResumoCompra");
        const linhaHotelResumo = document.getElementById("linhaHotelResumoCompra");
        const hotelResumo = document.getElementById("hotelResumoCompra");
        const linhaDetalheVoo = document.getElementById("linhaDetalheVooCompra");
        const linhaAtividadesResumo = document.getElementById("linhaAtividadesResumoCompra");

        if (tipo === "voo" && itemCarregado) {
            resumo.textContent = `Voo em ${formatarData(itemCarregado.data_saida) || "data não informada"}`;
            linhaData.hidden = false;
            linhaDetalheVoo.hidden = false;
            document.getElementById("detalheVooCompra").textContent = `${itemCarregado.cidade_origem || itemCarregado.origem || "Origem"} → ${itemCarregado.cidade_destino || itemCarregado.destino || "Destino"} · ${String(itemCarregado.horario_saida || "").slice(0, 5)}`;
            return;
        }

        if (tipo === "oferta" && itemCarregado?.tipo_produto === "voo" && itemCarregado.data_voo) {
            resumo.textContent = `Voo em ${formatarData(itemCarregado.data_voo)}`;
            linhaData.hidden = false;
            linhaDetalheVoo.hidden = false;
            document.getElementById("detalheVooCompra").textContent = itemCarregado.voos_inclusos || `${itemCarregado.nome_produto || "Voo selecionado"} · ${String(itemCarregado.horario_voo || "").slice(0, 5)}`;
            return;
        }

        if (ehHospedagem && inicioCompra?.value && fimCompra?.value) {
            const noites = calcularNoites(inicioCompra.value, fimCompra.value);
            resumo.textContent = `Hospedagem de ${formatarData(inicioCompra.value)} a ${formatarData(fimCompra.value)} · ${noites} ${noites === 1 ? "noite" : "noites"}`;
            linhaData.hidden = false;
            linhaHotelResumo.hidden = false;
            hotelResumo.textContent = itemCarregado?.nome_hotel || "Hotel selecionado";
            return;
        }

        linhaData.hidden = true;
        linhaDetalheVoo.hidden = true;
        linhaAtividadesResumo.hidden = true;
        linhaHotelResumo.hidden = !(tipo === "oferta" && verdade(itemCarregado?.hospedagem));
        if (tipo === "oferta") {
            const hotel = itemCarregado.hoteis_inclusos;
            const voo = itemCarregado.voos_inclusos;
            const atividades = itemCarregado.atividades_inclusas;
            hotelResumo.textContent = hotel || "Hospedagem incluída no pacote";
            if (verdade(itemCarregado.passagem_aerea)) {
                linhaDetalheVoo.hidden = false;
                document.getElementById("detalheVooCompra").textContent = voo || "Passagem aérea incluída no pacote";
            }
            if (atividades) {
                linhaAtividadesResumo.hidden = false;
                document.getElementById("atividadesResumoCompra").textContent = atividades;
            }
        }
    }

    function calcularNoites(entrada, saida) {
        if (!entrada || !saida) return 0;
        const inicio = new Date(`${entrada}T00:00:00`);
        const fim = new Date(`${saida}T00:00:00`);
        return Math.max(0, Math.round((fim - inicio) / 86400000));
    }

    function atualizarValores() {
        if (!itemCarregado) return;
        const noites = ehHospedagem ? calcularNoites(inicioCompra?.value, fimCompra?.value) : 0;
        if (ehHospedagem && noites <= 0) {
            linhaItem.hidden = true;
            linhaHotel.hidden = true;
            document.getElementById("linhaAlimentacaoCompra").hidden = true;
            document.getElementById("linhaAtividadesCompra").hidden = true;
            document.getElementById("linhaTransporteCompra").hidden = true;
            document.getElementById("linhaSeguroCompra").hidden = true;
            document.getElementById("totalOfertaCompra").textContent = "Selecione as datas";
            atualizarDataResumo();
            return;
        }
        document.getElementById("linhaSeguroCompra").hidden = false;
        const precoHotel = ehHospedagem ? precoDiariaHotel * noites : 0;
        const base = ehHospedagem ? precoHotel : precoBaseCompra;
        const vooValor = tipo === "voo" ? precoBaseCompra : 0;
        const baseExtras = ehHospedagem ? precoHotel : precoBaseCompra;
        const valorAlimentacao = baseExtras * 0.15;
        const valorAtividades = tipo === "atividade" || ofertaIncluiPasseios ? 0 : baseExtras * 0.08;
        const valorTransporte = baseExtras * 0.05;
        const subtotal = base + valorAlimentacao + valorAtividades + valorTransporte;
        const seguro = subtotal * 0.10;
        const total = subtotal + seguro;

        const ofertaHotelComercial = tipo === "oferta" && itemCarregado.tipo_alvo === "produto" && itemCarregado.tipo_produto === "hotel";
        const ofertaVooComercial = tipo === "oferta" && itemCarregado.tipo_alvo === "produto" && itemCarregado.tipo_produto === "voo";
        if (ehHospedagem) {
            linhaItem.hidden = true;
            linhaHotel.hidden = true;
            if (noites > 0) {
                linhaHotel.hidden = false;
                document.getElementById("nomeHotelCompra").textContent = `${itemCarregado.nome_hotel || itemCarregado.nome_produto || "Hotel"} · ${noites} ${noites === 1 ? "noite" : "noites"} · ${formatarMoeda(precoDiariaHotel)}/noite`;
                document.getElementById("precoHotelCompra").textContent = formatarMoeda(precoHotel);
            }
        } else if (ofertaHotelComercial) {
            linhaItem.hidden = true;
            linhaHotel.hidden = false;
            document.getElementById("nomeHotelCompra").textContent = itemCarregado.nome_produto || "Hotel";
            document.getElementById("precoHotelCompra").textContent = formatarMoeda(base);
        } else if (ofertaVooComercial) {
            linhaItem.hidden = true;
            linhaVoo.hidden = false;
            document.getElementById("nomeVooCompra").textContent = itemCarregado.voos_inclusos || itemCarregado.nome_produto || "Voo";
            document.getElementById("precoVooCompra").textContent = formatarMoeda(base);
        } else if (tipo === "voo") {
            linhaItem.hidden = true;
            linhaVoo.hidden = false;
            document.getElementById("nomeVooCompra").textContent = `Voo · ${itemCarregado.companhia_nome || itemCarregado.companhia_aerea || "Companhia aérea"}`;
            document.getElementById("precoVooCompra").textContent = formatarMoeda(vooValor);
        } else {
            linhaItem.hidden = false;
            document.getElementById("nomePrecoOfertaCompra").textContent = `${tipo === "oferta" ? "Oferta" : tipo === "destino" ? "Destino" : "Atividade"} · ${configuracao.nome(itemCarregado)}`;
            document.getElementById("precoOfertaCompra").textContent = formatarMoeda(base);
        }

        const linhaInclusaoVoo = document.getElementById("linhaVooCompra");
        if (tipo === "oferta" && verdade(itemCarregado.passagem_aerea) && !ofertaVooComercial) {
            linhaInclusaoVoo.hidden = false;
            document.getElementById("nomeVooCompra").textContent = itemCarregado.voos_inclusos || "Passagem aérea · inclusa no pacote";
            document.getElementById("precoVooCompra").textContent = "Incluso";
        }
        if (tipo === "oferta" && verdade(itemCarregado.hospedagem) && !ofertaHotelComercial) {
            linhaHotel.hidden = false;
            document.getElementById("nomeHotelCompra").textContent = itemCarregado.hoteis_inclusos || "Hospedagem inclusa no pacote";
            document.getElementById("precoHotelCompra").textContent = "Incluso";
        }

        document.getElementById("linhaAlimentacaoCompra").hidden = baseExtras <= 0;
        document.getElementById("linhaAtividadesCompra").hidden = baseExtras <= 0 || tipo === "atividade";
        const labelAtividades = document.querySelector("#linhaAtividadesCompra p");
        if (labelAtividades) {
            labelAtividades.innerHTML = ofertaIncluiPasseios
                ? "Atividades inclusas"
                : 'Atividades <small>8%</small>';
        }
        document.getElementById("linhaTransporteCompra").hidden = baseExtras <= 0;
        document.getElementById("precoAlimentacaoCompra").textContent = formatarMoeda(valorAlimentacao);
        document.getElementById("precoAtividadesCompra").textContent = ofertaIncluiPasseios ? "Inclusas" : formatarMoeda(valorAtividades);
        document.getElementById("precoTransporteCompra").textContent = formatarMoeda(valorTransporte);
        document.getElementById("precoSeguroCompra").textContent = formatarMoeda(seguro);
        document.getElementById("totalOfertaCompra").textContent = formatarMoeda(total);
        atualizarDataResumo();
    }

    if (!configuracao || !Number.isSafeInteger(idItem) || idItem <= 0) {
        titulo.textContent = "Nenhum item selecionado";
        botaoContinuar.disabled = true;
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000${configuracao.endpoint}`);
        const itens = await resposta.json();
        if (!resposta.ok) throw new Error(itens.error || "Não foi possível carregar o item selecionado.");

        itemCarregado = itens.find(item => Number(item[configuracao.campoId]) === idItem);
        if (!itemCarregado) throw new Error("Este item não foi encontrado. Volte ao catálogo e tente novamente.");

        precoBaseCompra = Number(configuracao.preco(itemCarregado));
        if (!Number.isFinite(precoBaseCompra) || precoBaseCompra < 0) throw new Error("O preço deste item está inválido.");
        ehHospedagem = tipo === "hotel" || (tipo === "oferta" && itemCarregado.tipo_alvo === "produto" && itemCarregado.tipo_produto === "hotel");
        precoDiariaHotel = ehHospedagem ? precoBaseCompra : 0;
        ofertaIncluiPasseios = tipo === "oferta" && verdade(itemCarregado.passeios);

        titulo.textContent = configuracao.nome(itemCarregado);
        const tipoResumo = document.getElementById("tipoResumoCompra");
        const etiquetaImagem = document.getElementById("etiquetaImagemCompra");
        const subtituloResumo = document.getElementById("subtituloResumoCompra");
        const rotulosResumo = {
            oferta: ["PACOTE SELECIONADO", "Sua viagem"],
            atividade: ["ATIVIDADE SELECIONADA", "Experiência"],
            hotel: ["HOSPEDAGEM SELECIONADA", "Hospedagem"],
            destino: ["DESTINO SELECIONADO", "Destino"],
            voo: ["VOO SELECIONADO", "Voo"]
        }[tipo] || ["SUA COMPRA", "Selecionado"];
        if (tipoResumo) tipoResumo.textContent = rotulosResumo[0];
        if (etiquetaImagem) etiquetaImagem.textContent = rotulosResumo[1];
        if (subtituloResumo) {
            const contexto = tipo === "voo"
                ? [itemCarregado.cidade_destino || itemCarregado.destino, itemCarregado.classe_nome || itemCarregado.classe, itemCarregado.duracao].filter(Boolean)
                : tipo === "oferta"
                    ? [itemCarregado.dias ? `${itemCarregado.dias} dias` : "", itemCarregado.destinos_inclusos, itemCarregado.quantidade_paises > 1 ? `${itemCarregado.quantidade_paises} países` : ""].filter(Boolean)
                    : tipo === "hotel"
                        ? [itemCarregado.cidade, itemCarregado.pais, itemCarregado.quarto_hotel].filter(Boolean)
                        : tipo === "atividade"
                            ? [itemCarregado.categoria, itemCarregado.duracao, itemCarregado.local_atividade].filter(Boolean)
                            : [itemCarregado.cidade, itemCarregado.pais].filter(Boolean);
            subtituloResumo.textContent = contexto.join(" · ");
            subtituloResumo.hidden = !contexto.length;
        }
        document.getElementById("nomePrecoOfertaCompra").textContent = configuracao.nome(itemCarregado);
        document.getElementById("itensOfertaCompra").textContent = configuracao.itens(itemCarregado);
        let caminhoImagem = tipo === "voo"
            ? (parametros.get("imagemDestino") || configuracao.imagem(itemCarregado))
            : configuracao.imagem(itemCarregado);
        if (tipo === "oferta" && itemCarregado.tipo_produto === "destino" && caminhoImagem && !String(caminhoImagem).includes("/")) {
            caminhoImagem = `img/destinos/${caminhoImagem}`;
        }
        if (caminhoImagem) {
            const imagem = document.getElementById("imagemOfertaCompra");
            imagem.src = /^(https?:|data:|\/)/i.test(caminhoImagem) ? caminhoImagem : `../${String(caminhoImagem).replace(/^\.\.\//, "").replace(/^\/+/, "")}`;
            imagem.alt = configuracao.nome(itemCarregado);
        }

        const seloTC = document.getElementById("seloTurismoConsciente");
        const odsAlinhadas = [
            verdade(itemCarregado.ods8) ? "ODS 8" : null,
            verdade(itemCarregado.ods12) ? "ODS 12" : null
        ].filter(Boolean);
        const tipoEntidadeTC = tipo === "oferta" && itemCarregado.tipo_alvo === "produto"
            ? itemCarregado.tipo_produto
            : tipo;
        const explicacaoTC = ({
            destino: "Isso significa que esse destino é alinhado com o programa Turismo Consciente.",
            atividade: "Isso significa que essa atividade é alinhada com o programa Turismo Consciente.",
            hotel: "Isso significa que esse hotel é alinhado com o programa Turismo Consciente.",
            voo: "Isso significa que esse voo é alinhado com o programa Turismo Consciente.",
            oferta: "Isso significa que essa oferta é alinhada com o programa Turismo Consciente."
        }[tipoEntidadeTC] || "Isso significa que essa oferta é alinhada com o programa Turismo Consciente.");
        seloTC.replaceChildren();
        odsAlinhadas.forEach(ods => {
            const selo = document.createElement("span");
            selo.className = "ods-selo";
            selo.title = explicacaoTC;
            selo.setAttribute("aria-label", explicacaoTC);
            const arvore = document.createElement("img");
            arvore.src = "../img/icones/arvore.png";
            arvore.alt = "";
            selo.append(arvore, document.createTextNode(ods));
            seloTC.appendChild(selo);
        });
        seloTC.hidden = odsAlinhadas.length === 0;
        seloTC.title = odsAlinhadas.length ? explicacaoTC : "";

        const textoItensOferta = configuracao.itens(itemCarregado);
        const linhaItensOferta = document.getElementById("linhaItensOfertaCompra");
        linhaItensOferta.hidden = tipo !== "oferta" || !textoItensOferta || textoItensOferta === "Oferta selecionada";
        document.getElementById("itensOfertaCompra").textContent = textoItensOferta;
        document.getElementById("linhaDetalheVooCompra").hidden = tipo !== "voo";
        document.getElementById("linhaAtividadesResumoCompra").hidden = true;
        ehHospedagem = tipo === "hotel" || (tipo === "oferta" && itemCarregado.tipo_alvo === "produto" && itemCarregado.tipo_produto === "hotel");
        const tipoProdutoCompra = tipo === "oferta" && itemCarregado.tipo_alvo === "produto"
            ? itemCarregado.tipo_produto
            : tipo;
        const rotuloViajante = tipoProdutoCompra === "hotel" ? "Hóspede" : tipoProdutoCompra === "atividade" ? "Participante" : "Passageiro";
        const tituloDadosViajante = document.getElementById("tituloDadosViajante");
        const descricaoDadosViajante = document.getElementById("descricaoDadosViajante");
        const tituloViajante = document.getElementById("tituloViajante");
        const adicionarViajante = document.getElementById("adicionarViajante");
        if (tituloDadosViajante) tituloDadosViajante.textContent = `Dados ${rotuloViajante === "Hóspede" ? "do hóspede" : rotuloViajante === "Participante" ? "do participante" : "dos passageiros"}`;
        if (descricaoDadosViajante) descricaoDadosViajante.textContent = `Confirme as informações ${rotuloViajante === "Hóspede" ? "do hóspede" : rotuloViajante === "Participante" ? "do participante" : "dos passageiros"} da viagem.`;
        if (tituloViajante) tituloViajante.textContent = `${rotuloViajante} 1`;
        if (adicionarViajante) adicionarViajante.textContent = `+ Adicionar ${rotuloViajante.toLocaleLowerCase("pt-BR")}`;
        document.getElementById("linhaHotelResumoCompra").hidden = !(tipo === "oferta" && verdade(itemCarregado.hospedagem));
        document.getElementById("linhaVooCompra").hidden = tipo !== "voo" && !(tipo === "oferta" && verdade(itemCarregado.passagem_aerea));
        document.getElementById("linhaHotelCompra").hidden = true;
        document.getElementById("campoCheckoutCompra").hidden = !ehHospedagem;
        document.getElementById("dataInicioCompra").type = "date";
        document.querySelector("label[for='dataInicioCompraDisplay']").hidden = !ehHospedagem;
        document.getElementById("datasCompra").hidden = !ehHospedagem;
        document.getElementById("linhaItensOfertaCompra").hidden = linhaItensOferta.hidden;

        if (tipo === "voo") {
            // O voo traz data e preço exatos do catálogo; não se pede outra data.
            inicioCompra.value = paraISO(itemCarregado.data_saida);
            document.getElementById("datasCompra").hidden = true;
        }
        if (ehHospedagem) {
            inicioCompra.value = checkin;
            fimCompra.value = checkout;
            const hoje = new Date();
            const hojeIso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
            inicioCompra.min = hojeIso;
            fimCompra.min = diaSeguinteIsoCompra(checkin) || hojeIso;
            exibicaoInicioCompra.value = formatarData(checkin);
            exibicaoFimCompra.value = formatarData(checkout);
        }

        inicioCompra?.addEventListener("change", () => {
            if (ehHospedagem) {
                const hoje = new Date();
                const hojeIso = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
                fimCompra.min = diaSeguinteIsoCompra(inicioCompra.value) || hojeIso;
                if (fimCompra.value && fimCompra.value <= inicioCompra.value) {
                    fimCompra.value = "";
                    exibicaoFimCompra.value = "";
                }
            }
            atualizarValores();
        });
        fimCompra?.addEventListener("change", atualizarValores);

        atualizarValores();
        botaoContinuar.addEventListener("click", event => {
            if (ehHospedagem && calcularNoites(inicioCompra.value, fimCompra.value) <= 0) {
                event.preventDefault();
                alert("Informe as datas de check-in e check-out para calcular a hospedagem.");
                return;
            }
            if (tipo === "voo" && !itemCarregado.data_saida) {
                event.preventDefault();
                alert("Este voo não possui uma data de saída cadastrada.");
                return;
            }
            alert("Resumo atualizado. A próxima etapa será conectar os dados do comprador ao pagamento.");
        });
    } catch (erro) {
        titulo.textContent = "Não foi possível carregar o item";
        botaoContinuar.disabled = true;
        console.error("Erro ao carregar item para compra:", erro);
        alert(erro.message || "Não foi possível carregar este item.");
    }
});
