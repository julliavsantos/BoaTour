
// --- MODAL DE PAGAMENTO ---

const modalPagamento = document.getElementById("modalPagamento");

const modalDestino = document.getElementById("modalDestino");
const modalData = document.getElementById("modalData");
const modalForma = document.getElementById("modalForma");
const modalValor = document.getElementById("modalValor");
const modalReserva = document.getElementById("modalReserva");
const modalStatus = document.getElementById("modalStatus");
const linhaDataViagem = document.getElementById("linhaDataViagem");
const modalDataViagem = document.getElementById("modalDataViagem");
const linhaRotaVoo = document.getElementById("linhaRotaVoo");
const modalRotaVoo = document.getElementById("modalRotaVoo");
const linhaCodigoVoo = document.getElementById("linhaCodigoVoo");
const modalCodigoVoo = document.getElementById("modalCodigoVoo");
const linhaCodigoAviao = document.getElementById("linhaCodigoAviao");
const modalCodigoAviao = document.getElementById("modalCodigoAviao");
const btnRastrearVoo = document.getElementById("btnRastrearVoo");


// ABRIR MODAL

function abrirModal(destino, data, forma, valor, reserva, status, viagem) {

    modalDestino.textContent = destino;
    modalData.textContent = data;
    modalForma.textContent = forma;
    modalValor.textContent = valor;
    modalReserva.textContent = viagem?.id || viagem?.id_viagem || reserva;

    const dataVoo = viagem?.ida ? new Date(`${String(viagem.ida).slice(0, 10)}T12:00:00`) : null;
    const temDataVoo = dataVoo && !Number.isNaN(dataVoo.getTime());
    const codigoVoo = String(viagem?.codigoVoo || viagem?.codigo_voo || "").trim();
    const codigoAviao = String(viagem?.codigoAviao || viagem?.codigo_aviao || "").trim();
    const origemDestino = [viagem?.origem, viagem?.destino].filter(Boolean).join(" → ");
    linhaDataViagem.hidden = !temDataVoo;
    modalDataViagem.textContent = temDataVoo ? dataVoo.toLocaleDateString("pt-BR") : "";
    linhaRotaVoo.hidden = !origemDestino;
    modalRotaVoo.textContent = origemDestino;
    linhaCodigoVoo.hidden = !codigoVoo;
    modalCodigoVoo.textContent = codigoVoo;
    linhaCodigoAviao.hidden = !codigoAviao;
    modalCodigoAviao.textContent = codigoAviao;
    btnRastrearVoo.hidden = !(status === "aprovado" && codigoVoo && codigoAviao);
    if (!btnRastrearVoo.hidden) {
        const parametros = new URLSearchParams({ voo: codigoVoo, aviao: codigoAviao });
        btnRastrearVoo.href = `../RASTREADOR/index.html?${parametros.toString()}`;
    } else {
        btnRastrearVoo.removeAttribute("href");
    }

    if (status === "aprovado") {
        modalStatus.textContent = "✓ Pago";
        modalStatus.className = "status aprovado";
    } else if (status === "pendente") {
        modalStatus.textContent = "! Pendente";
        modalStatus.className = "status pendente";
    } else if (status === "cancelada") {
        modalStatus.textContent = "✕ Cancelado";
        modalStatus.className = "status cancelado";
    } else {
        modalStatus.textContent = "✕ Recusado";
        modalStatus.className = "status cancelado";
    }
    modalPagamento.classList.add("ativo");
}


// FECHAR MODAL

function fecharModal() {

    modalPagamento.classList.remove("ativo");

}


// FECHAR CLICANDO FORA

modalPagamento?.addEventListener("click", function(event) {

    if (event.target === modalPagamento) {
        fecharModal();
    }

});


// --- FILTRO DOS PAGAMENTOS ---

const filtroPagamento = document.getElementById("filtroPagamento");

filtroPagamento?.addEventListener("change", function() {
    document.querySelectorAll(".pagamento-card").forEach(card => {
        card.style.display = this.value === "todos" || card.dataset.status === this.value ? "flex" : "none";
    });
});

const API_PAGAMENTOS = "";
const brlPagamento = valor => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const escaparPagamento = valor => String(valor ?? "").replace(/[&<>"']/g, caractere => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caractere]);
const dataPagamento = valor => {
    if (!valor) return "—";
    const data = new Date(valor);
    return Number.isNaN(data.getTime()) ? String(valor) : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

function renderizarHistorico(dados) {
    const pagamentos = dados.pagamentos || [];
    const viagens = dados.viagens || [];
    const aprovados = pagamentos.filter(p => p.status === "aprovado" && p.tipo !== "recarga");
    document.getElementById("totalPagoResumo").textContent = brlPagamento(aprovados.reduce((soma, p) => soma + Number(p.valor || 0), 0));
    document.getElementById("pagamentosAprovadosResumo").textContent = String(aprovados.length);
    const contadorPendentes = document.getElementById("pagamentosPendentesResumo");
    const quantidadePendentes = pagamentos.filter(p => p.status === "pendente").length;
    contadorPendentes.textContent = quantidadePendentes + (quantidadePendentes === 1 ? " pendente" : " pendentes");
    contadorPendentes.hidden = quantidadePendentes === 0;
    document.getElementById("saldoBoaPayResumo").textContent = brlPagamento(dados.saldo);

    const grade = document.getElementById("historicoPagamentosDados");
    grade.replaceChildren();
    if (!pagamentos.length) grade.innerHTML = '<p class="sem-pagamentos">Seus pagamentos aparecerão aqui depois da primeira simulação.</p>';
    else pagamentos.forEach(pagamento => {
        const viagem = viagens.find(item => String(item.idPagamento || item.id_pagamento) === String(pagamento.id));
        const pedido = pagamento.pedido || {};
        const imagem = viagem?.imagem || pedido.imagem || "../img/ofertas/cancun.jpg";
        const descricao = viagem?.titulo || pagamento.descricao || "Compra BoaTour";
        const metodo = ({ pix: "Pix", cartao: "Cartão de crédito", boleto: "Boleto", saldo: "Saldo BoaPay" })[pagamento.metodo] || pagamento.metodo;
        const estado = pagamento.status === "aprovado" ? "Pago" : pagamento.status === "pendente" ? "Pendente" : pagamento.status === "cancelada" ? "Cancelado" : "Recusado";
        const article = document.createElement("article");
        article.className = "pagamento-card";
        article.dataset.status = pagamento.status;
        article.innerHTML = `<div class="destino-imagem"><img src="${escaparPagamento(imagem)}" alt=""></div>
            <div class="pagamento-info"><div class="pagamento-destino"><span>${pagamento.tipo === "recarga" ? "Recarga BoaPay" : "Compra"}</span><h3>${escaparPagamento(descricao)}</h3></div>
            <div class="info-item"><span>Data</span><strong>${escaparPagamento(dataPagamento(pagamento.criadoEm))}</strong></div>
            <div class="info-item"><span>Pagamento</span><strong>${escaparPagamento(metodo)}${pagamento.cartaoFinal ? ` •••• ${escaparPagamento(pagamento.cartaoFinal)}` : ""}</strong></div>
            <div class="info-item"><span>Valor</span><strong>${escaparPagamento(brlPagamento(pagamento.valor))}</strong></div>
            <div class="status ${pagamento.status === "recusado" || pagamento.status === "cancelada" ? "cancelado" : escaparPagamento(pagamento.status)}">${pagamento.status === "aprovado" ? "✓" : pagamento.status === "pendente" ? "!" : "✕"} ${estado}</div>
            <button class="btn-detalhes" type="button">Ver detalhes</button></div>`;
        article.querySelector(".btn-detalhes").addEventListener("click", () => abrirModal(descricao, dataPagamento(pagamento.criadoEm), metodo, brlPagamento(pagamento.valor), pagamento.id, pagamento.status, viagem));
        grade.append(article);
    });

    const listaCupons = document.getElementById("cuponsRecompensaDados");
    listaCupons.replaceChildren();
    const cupons = (dados.cupons || []).filter(cupom => cupom.status === "ativo");
    if (!cupons.length) listaCupons.innerHTML = '<p class="sem-pagamentos">Cupons ODS 8 ganhos nas compras aprovadas aparecerão aqui.</p>';
    else cupons.forEach(cupom => {
        const card = document.createElement("article");
        card.className = "cupom-recompensa-card";
        const regra = cupom.regraDesconto || (cupom.descontoPercentual ? `${Number(cupom.descontoPercentual)}% de desconto` : "Desconto ODS 8 por faixa de valor da compra");
        card.innerHTML = `<strong>${escaparPagamento(cupom.codigo)}</strong><span>ODS ${Number(cupom.ods)} · ${escaparPagamento(regra)}</span>`;
        listaCupons.append(card);
    });
    const cashback = (dados.movimentos || []).filter(movimento => movimento.tipo === "cashback_ods12").reduce((soma, movimento) => soma + Number(movimento.valor || 0), 0);
    document.getElementById("saldoBoaPayResumo").title = `Inclui ${brlPagamento(cashback)} de cashback ODS 12.`;
}

async function carregarPagamentos() {
    const grade = document.getElementById("historicoPagamentosDados");
    const token = localStorage.getItem("boatourSessionToken");
    if (!token) {
        const usuario = JSON.parse(localStorage.getItem("boatourUsuario") || "null");
        const chave = "boatourPagamentos:" + (usuario?.id_usuario || "visitante");
        try {
            const local = JSON.parse(localStorage.getItem(chave) || "{}");
            local.pagamentos ||= [];
            local.viagens ||= [];
            let alterado = false;
            local.pagamentos.forEach(pagamento => {
                const criadoEm = new Date(pagamento.criadoEm).getTime();
                if (pagamento.status === "pendente" && Number.isFinite(criadoEm) && Date.now() >= criadoEm + 5 * 60 * 1000) {
                    pagamento.status = "cancelada";
                    pagamento.motivo = "Prazo de pagamento expirado após cinco minutos.";
                    local.viagens.filter(viagem => viagem.idPagamento === pagamento.id).forEach(viagem => { viagem.status = "cancelada"; });
                    alterado = true;
                }
            });
            if (alterado) localStorage.setItem(chave, JSON.stringify(local));
            renderizarHistorico({ saldo: 0, pagamentos: [], viagens: [], cupons: [], movimentos: [], ...local });
        } catch {
            renderizarHistorico({ saldo: 0, pagamentos: [], viagens: [], cupons: [], movimentos: [] });
        }
        return;
    }
    try {
        const resposta = await fetch(`${API_PAGAMENTOS}/pagamentos/historico`, { headers: { "X-Session-Token": token } });
        const tipoConteudo = resposta.headers.get("content-type") || "";
        if (!tipoConteudo.includes("application/json")) {
            throw new Error("A API BoaTour não respondeu em JSON. Confira se o servidor da API está ativo na porta 3000.");
        }
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.error || "Não foi possível carregar seu histórico.");
        renderizarHistorico(dados);
    } catch (erro) {
        grade.innerHTML = `<p class="sem-pagamentos">${escaparPagamento(erro.message || "Não foi possível carregar seus pagamentos.")}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", carregarPagamentos, { once: true });

