(() => {
    const API = "";
    const grade = document.getElementById("listaTodasViagens");
    const busca = document.getElementById("buscarViagem");
    const btnVerMais = document.getElementById("btnVerMaisViagens");
    let quantidadeVisivel = 8;
    let viagens = [];
    let filtro = "todos";

    const normalizar = texto => String(texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const pedidoDaViagem = viagem => viagem.dados?.pedido || viagem.pedido || {};
    const itensDaViagem = viagem => {
        const pedido = pedidoDaViagem(viagem);
        return Array.isArray(pedido.itens) ? pedido.itens : Array.isArray(viagem.itens) ? viagem.itens : [];
    };
    const tiposDaViagem = viagem => {
        const tipos = new Set();
        const itens = itensDaViagem(viagem);
        itens.forEach(item => {
            [item.categoria, item.tipo, item.tipo_produto].map(normalizar).filter(Boolean).forEach(categoria => {
                if (/voo|passagem/.test(categoria)) tipos.add("voo");
                else if (/hotel|hospedagem|pousada/.test(categoria)) tipos.add("hotel");
                else if (/atividade|passeio/.test(categoria)) tipos.add("atividade");
                else if (/oferta|pacote|destino/.test(categoria)) tipos.add("pacote");
                else if (categoria !== "produto") tipos.add("outros");
            });
        });
        if (itens.length > 1 && tipos.size > 0) tipos.add("pacote");
        if (!tipos.size && (viagem.codigoVoo || viagem.codigo_voo)) tipos.add("voo");
        if (!tipos.size) tipos.add("outros");
        return tipos;
    };
    const tituloDaViagem = viagem => {
        const pedido = pedidoDaViagem(viagem);
        const primeiro = itensDaViagem(viagem).find(item => item.nome);
        return String(primeiro?.nome || viagem.titulo || pedido.titulo || "Compra BoaTour");
    };
    const imagemDaViagem = viagem => {
        const caminho = String(viagem.imagem || pedidoDaViagem(viagem).imagem || "").trim();
        if (!caminho) return "../img/ofertas/cancun.jpg";
        if (/^(https?:|data:|\/)/i.test(caminho)) return caminho;
        return caminho.startsWith("../") ? caminho : "../" + caminho.replace(/^\.\//, "");
    };
    const dataCurta = valor => {
        if (!valor) return "A confirmar";
        const data = new Date(String(valor).slice(0, 10) + "T12:00:00");
        return Number.isNaN(data.getTime()) ? "A confirmar" : data.toLocaleDateString("pt-BR");
    };
    const adicionarInfo = (container, rotulo, valor) => {
        if (!valor) return;
        const linha = document.createElement("p");
        const label = document.createElement("strong");
        label.textContent = rotulo + ": ";
        linha.append(label, document.createTextNode(String(valor)));
        container.append(linha);
    };

    function criarCard(viagem) {
        const card = document.createElement("article");
        card.className = "card-favorito viagem-card";
        const imagem = document.createElement("div");
        imagem.className = "imagem-favorito";
        const foto = document.createElement("img");
        foto.src = imagemDaViagem(viagem);
        foto.alt = tituloDaViagem(viagem);
        imagem.append(foto);
        const conteudo = document.createElement("div");
        conteudo.className = "info-favorito viagem-card__conteudo";
        const titulo = document.createElement("h2");
        titulo.textContent = viagem.titulo || tituloDaViagem(viagem);
        conteudo.append(titulo);

        const tipos = tiposDaViagem(viagem);
        const etiquetas = document.createElement("div");
        etiquetas.className = "viagem-card__etiquetas";
        const nomes = { voo: "Voo", hotel: "Hotel", atividade: "Atividade", pacote: "Pacote / oferta", outros: "Outro" };
        tipos.forEach(tipo => {
            const etiqueta = document.createElement("span");
            etiqueta.textContent = nomes[tipo] || nomes.outros;
            etiquetas.append(etiqueta);
        });
        conteudo.append(etiquetas);

        const datas = [dataCurta(viagem.ida || viagem.data_ida), dataCurta(viagem.volta || viagem.data_volta)].filter(data => data !== "A confirmar");
        adicionarInfo(conteudo, "Datas", datas.length ? datas.join(" → ") : "A confirmar");
        adicionarInfo(conteudo, "Reserva", viagem.id || viagem.id_viagem || "—");
        adicionarInfo(conteudo, "Rota", [viagem.origem, viagem.destino].filter(Boolean).join(" → "));
        const codigoVoo = viagem.codigoVoo || viagem.codigo_voo;
        const codigoAviao = viagem.codigoAviao || viagem.codigo_aviao;
        adicionarInfo(conteudo, "Voo", codigoVoo ? codigoVoo + (codigoAviao ? " · Avião " + codigoAviao : "") : "");

        const itens = itensDaViagem(viagem).map(item => item.nome).filter(Boolean);
        adicionarInfo(conteudo, "Itens", itens.join(" · "));
        const pedido = pedidoDaViagem(viagem);
        const viajantes = Array.isArray(pedido.viajantes) ? pedido.viajantes : Array.isArray(viagem.viajantes) ? viagem.viajantes : [];
        adicionarInfo(conteudo, "Viajantes", viajantes.map(pessoa => pessoa.nome).filter(Boolean).join(", "));

        const estado = document.createElement("span");
        estado.className = "viagem-card__status";
        estado.textContent = viagem.status === "confirmada" ? "Pagamento aprovado" : viagem.status || "Aguardando pagamento";
        conteudo.append(estado);

        if (codigoVoo && codigoAviao && viagem.status === "confirmada") {
            const rastrear = document.createElement("a");
            rastrear.className = "viagem-card__rastrear";
            rastrear.href = "../RASTREADOR/index.html?" + new URLSearchParams({ voo: codigoVoo, aviao: codigoAviao });
            rastrear.textContent = "Rastrear voo";
            conteudo.append(rastrear);
        }
        card.append(imagem, conteudo);
        return card;
    }

    function renderizar() {
        if (!grade) return;
        const termo = normalizar(busca?.value);
        const filtradas = viagens.filter(viagem => {
            const tipoOk = filtro === "todos" || tiposDaViagem(viagem).has(filtro);
            const texto = normalizar([
                viagem.titulo, viagem.origem, viagem.destino, viagem.id, viagem.id_viagem,
                viagem.codigoVoo, viagem.codigo_voo, ...itensDaViagem(viagem).map(item => item.nome)
            ].join(" "));
            return tipoOk && texto.includes(termo);
        });
        grade.replaceChildren();
        if (!filtradas.length) {
            if (btnVerMais) btnVerMais.hidden = true;
            const aviso = document.createElement("p");
            aviso.className = "estado-viagens";
            aviso.textContent = viagens.length ? "Nenhuma viagem corresponde a esse filtro." : "Suas compras aparecerão aqui depois da primeira simulação de pagamento.";
            grade.append(aviso);
            return;
        }
        filtradas.slice(0, quantidadeVisivel).forEach(viagem => grade.append(criarCard(viagem)));
        if (btnVerMais) btnVerMais.hidden = quantidadeVisivel >= filtradas.length;
    }

    document.querySelectorAll("[data-tipo-viagem]").forEach(botao => botao.addEventListener("click", () => {
        filtro = botao.dataset.tipoViagem || "todos";
        quantidadeVisivel = 8;
        document.querySelectorAll("[data-tipo-viagem]").forEach(item => item.classList.toggle("ativo", item === botao));
        renderizar();
    }));
    busca?.addEventListener("input", () => { quantidadeVisivel = 8; renderizar(); });
    btnVerMais?.addEventListener("click", () => { quantidadeVisivel += 8; renderizar(); });

    async function iniciar() {
        const token = localStorage.getItem("boatourSessionToken");
        if (!token) {
            grade.innerHTML = '<p class="estado-viagens">Entre na sua conta para consultar suas viagens.</p>';
            return;
        }
        try {
            const resposta = await fetch(API + "/pagamentos/historico", { headers: { "X-Session-Token": token } });
            const dados = await resposta.json();
            if (!resposta.ok) throw new Error(dados.error || "Não foi possível carregar suas viagens.");
            viagens = Array.isArray(dados.viagens) ? dados.viagens : [];
            renderizar();
        } catch (erro) {
            grade.innerHTML = "";
            const aviso = document.createElement("p");
            aviso.className = "estado-viagens";
            aviso.textContent = erro.message || "Não foi possível carregar suas viagens.";
            grade.append(aviso);
        }
    }
    iniciar();
})();