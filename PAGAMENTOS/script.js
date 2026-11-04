
// --- MODAL DE PAGAMENTO ---

const modalPagamento = document.getElementById("modalPagamento");

const modalDestino = document.getElementById("modalDestino");
const modalData = document.getElementById("modalData");
const modalForma = document.getElementById("modalForma");
const modalValor = document.getElementById("modalValor");
const modalReserva = document.getElementById("modalReserva");
const modalStatus = document.getElementById("modalStatus");


// ABRIR MODAL

function abrirModal(destino, data, forma, valor, reserva, status) {

    modalDestino.textContent = destino;
    modalData.textContent = data;
    modalForma.textContent = forma;
    modalValor.textContent = valor;
    modalReserva.textContent = reserva;

    if (status === "aprovado") {

        modalStatus.textContent = "✓ Pago";
        modalStatus.className = "status aprovado";

    } else if (status === "pendente") {

        modalStatus.textContent = "! Pendente";
        modalStatus.className = "status pendente";

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

const API_PAGAMENTOS = "http://localhost:3000";
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
        const estado = pagamento.status === "aprovado" ? "Pago" : pagamento.status === "pendente" ? "Pendente" : "Recusado";
        const article = document.createElement("article");
        article.className = "pagamento-card";
        article.dataset.status = pagamento.status;
        article.innerHTML = `<div class="destino-imagem"><img src="${escaparPagamento(imagem)}" alt=""></div>
            <div class="pagamento-info"><div class="pagamento-destino"><span>${pagamento.tipo === "recarga" ? "Recarga BoaPay" : "Compra"}</span><h3>${escaparPagamento(descricao)}</h3></div>
            <div class="info-item"><span>Data</span><strong>${escaparPagamento(dataPagamento(pagamento.criadoEm))}</strong></div>
            <div class="info-item"><span>Pagamento</span><strong>${escaparPagamento(metodo)}${pagamento.cartaoFinal ? ` •••• ${escaparPagamento(pagamento.cartaoFinal)}` : ""}</strong></div>
            <div class="info-item"><span>Valor</span><strong>${escaparPagamento(brlPagamento(pagamento.valor))}</strong></div>
            <div class="status ${pagamento.status === "recusado" ? "cancelado" : escaparPagamento(pagamento.status)}">${pagamento.status === "aprovado" ? "✓" : pagamento.status === "pendente" ? "!" : "✕"} ${estado}</div>
            <button class="btn-detalhes" type="button">Ver detalhes</button></div>`;
        article.querySelector(".btn-detalhes").addEventListener("click", () => abrirModal(descricao, dataPagamento(pagamento.criadoEm), metodo, brlPagamento(pagamento.valor), pagamento.id, pagamento.status));
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
    if (!token) { grade.innerHTML = '<p class="sem-pagamentos">Entre na sua conta para sincronizar seus pagamentos e recompensas.</p>'; return; }
    try {
        const resposta = await fetch(`${API_PAGAMENTOS}/pagamentos/historico`, { headers: { "X-Session-Token": token } });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.error || "Não foi possível carregar seu histórico.");
        renderizarHistorico(dados);
    } catch (erro) {
        grade.innerHTML = `<p class="sem-pagamentos">${escaparPagamento(erro.message || "Não foi possível carregar seus pagamentos.")}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", carregarPagamentos, { once: true });

