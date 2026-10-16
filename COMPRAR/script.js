document.addEventListener("DOMContentLoaded", async () => {
    const parametros = new URLSearchParams(window.location.search);
    const idOferta = Number(parametros.get("oferta"));
    const titulo = document.getElementById("tituloOfertaCompra");
    const botaoContinuar = document.querySelector(".continuar-info");

    if (!Number.isSafeInteger(idOferta) || idOferta <= 0) {
        titulo.textContent = "Nenhuma oferta selecionada";
        botaoContinuar.disabled = true;
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/ofertas");
        const ofertas = await resposta.json();
        if (!resposta.ok) throw new Error(ofertas.error || "Não foi possível carregar as ofertas.");

        const oferta = ofertas.find(item => Number(item.id) === idOferta);
        if (!oferta) throw new Error("Esta oferta não foi encontrada. Volte à página de ofertas e tente novamente.");

        const preco = Number(oferta.preco_atual);
        if (!Number.isFinite(preco) || preco < 0) throw new Error("O preço desta oferta está inválido.");

        titulo.textContent = oferta.titulo || "Oferta de viagem";
        document.getElementById("nomePrecoOfertaCompra").textContent = oferta.titulo || "Oferta de viagem";
        document.getElementById("itensOfertaCompra").textContent = [
            Number(oferta.passagem_aerea) === 1 ? "Passagem aérea" : null,
            Number(oferta.hospedagem) === 1 ? "Hospedagem" : null,
            Number(oferta.passeios) === 1 ? "Passeios" : null
        ].filter(Boolean).join(" · ") || "Consulte os itens incluídos na oferta";
        document.getElementById("descricaoOfertaCompra").textContent = oferta.descricao || "Oferta selecionada";

        const imagem = document.getElementById("imagemOfertaCompra");
        if (oferta.imagem) imagem.src = `../${String(oferta.imagem).replace(/^\/+/, "")}`;
        imagem.alt = oferta.titulo || "Imagem da oferta";

        const precoFormatado = preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        document.getElementById("precoOfertaCompra").textContent = precoFormatado;
        document.getElementById("totalOfertaCompra").textContent = precoFormatado;
        document.querySelectorAll(".dados-compra2 .linha-compra2").forEach((linha, indice) => {
            linha.hidden = indice > 0;
        });

        // Esta etapa apenas revisa a oferta. O próximo passo conectará os dados do comprador ao pagamento.
        botaoContinuar.addEventListener("click", () => {
            alert("Oferta carregada! A próxima etapa será conectar os dados do comprador ao pagamento.");
        });
    } catch (erro) {
        titulo.textContent = "Não foi possível carregar a oferta";
        botaoContinuar.disabled = true;
        console.error("Erro ao carregar oferta para compra:", erro);
        alert(erro.message || "Não foi possível carregar esta oferta.");
    }
});
