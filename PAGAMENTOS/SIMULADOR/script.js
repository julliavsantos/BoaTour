const API = "";

async function lerRespostaApi(resposta) {
    const tipoConteudo = resposta.headers.get("content-type") || "";
    if (!tipoConteudo.includes("application/json")) {
        throw new Error("A API BoaTour não respondeu em JSON. Confira se o servidor da API está ativo na porta 3000.");
    }
    return resposta.json();
}
const PEDIDOS_EXEMPLO = [ // PASSO 5: remover quando a COMPRAR enviar o pedido real
    { titulo: "Voo Porto Alegre → Lisboa", valor: 3890.5, origem: "Porto Alegre", destino: "Lisboa", ida: "2027-03-10", volta: "2027-03-24" },
    { titulo: "Pacote Gramado (hotel + voo)", valor: 2150, origem: "São Paulo", destino: "Gramado", ida: "2027-01-15", volta: "2027-01-20" },
    { titulo: "Voo Florianópolis → Paris", valor: 5420.9, origem: "Florianópolis", destino: "Paris", ida: "2027-05-02", volta: "2027-05-16" }
];
const checkoutDaCompra = new URLSearchParams(window.location.search).get("checkout") === "1";

const $ = id => document.getElementById(id);
const brl = n => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataBr = d => new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
let usuario = JSON.parse(localStorage.getItem("boatourUsuario") || "null");
let token = localStorage.getItem("boatourSessionToken");
let USAR_API = Boolean(token);
let CHAVE = "boatourPagamentos:" + (usuario?.id_usuario || "visitante");
let estado = { saldo: 0, pagamentos: [], viagens: [], cupons: [] };
let pedido = null, cupomAplicado = null;
let erroSessao = "";
const DURACAO_PAGAMENTO_MS = 5 * 60 * 1000;
let pagamentoAtivoId = null;
let pedidoCheckoutInvalido = false;
const pagamentosExpirando = new Set();

/* ---------- ARMAZÉM: localStorage ou MySQL (mesma interface) ---------- */
const Armazem = {
    async carregar() {
        if (USAR_API) {
            const r = await fetch(API + "/pagamentos/historico", { headers: { "X-Session-Token": token } });
            const d = await lerRespostaApi(r);
            if (!r.ok) {
                const erro = new Error(d.error || "Falha ao carregar.");
                erro.status = r.status;
                throw erro;
            }
            // o MySQL devolve snake_case: adapta para o formato usado na tela
            d.pagamentos = (d.pagamentos || []).map(p => ({ ...p, valor: Number(p.valor), descontoSaldo: Number(p.pedido?.descontoSaldo || 0) }));
            d.viagens = (d.viagens || []).map(v => ({ ...v, dados: typeof v.dados === "string" ? JSON.parse(v.dados) : v.dados }));
            d.cupons = Array.isArray(d.cupons) ? d.cupons : [];
            return d;
        }
        const local = JSON.parse(localStorage.getItem(CHAVE) || '{"saldo":0,"pagamentos":[],"viagens":[]}' );
        local.pagamentos ||= []; local.viagens ||= []; local.cupons ||= []; local.movimentos ||= [];
        return local;
    },
    // pagamento: obrigatório; viagem: opcional; delta: variação do saldo
    async registrar(pagamento, viagem, pedidoAtual = pedido) {
        if (USAR_API) {
            const r = await fetch(API + "/pagamentos/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Session-Token": token },
                body: JSON.stringify({ pagamento, viagem, pedido: pedidoAtual })
            });
            const resposta = await lerRespostaApi(r);
            if (!r.ok) throw new Error(resposta.error || "Falha ao registrar.");
            estado = await this.carregar();
            const pagamentoSalvo = estado.pagamentos.find(item => item.id === pagamento.id);
            if (pagamentoSalvo) Object.assign(pagamento, pagamentoSalvo);
            if (viagem) {
                const viagemSalva = estado.viagens.find(item => item.idPagamento === viagem.idPagamento);
                if (viagemSalva) Object.assign(viagem, viagemSalva);
            }
            return resposta;
        }
        const i = estado.pagamentos.findIndex(p => p.id === pagamento.id);
        const pagamentoAnterior = i >= 0 ? estado.pagamentos[i] : null;
        const descontoAnteriorAplicado = pagamentoAnterior?.status === "aprovado" ? Number(pagamentoAnterior.descontoSaldo || 0) : 0;
        const descontoAtualAplicado = pagamento.status === "aprovado" ? Number(pagamento.descontoSaldo || 0) : 0;
        estado.saldo = Math.max(0, Number(estado.saldo || 0) - Math.max(0, descontoAtualAplicado - descontoAnteriorAplicado));
        if (i >= 0) estado.pagamentos[i] = pagamento; else estado.pagamentos.unshift(pagamento);
        if (viagem) {
            const indiceViagem = estado.viagens.findIndex(item => item.idPagamento === viagem.idPagamento);
            if (indiceViagem >= 0) estado.viagens[indiceViagem] = viagem;
            else estado.viagens.unshift(viagem);
        }
        localStorage.setItem(CHAVE, JSON.stringify(estado));
    }
};

/* ---------- utilidades ---------- */
const aleat = (t, s) => Array.from({ length: t }, () => s[Math.floor(Math.random() * s.length)]).join("");
const idPag = () => `BP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${aleat(6, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789")}`;
const luhn = n => { let s = 0, d = false; for (let i = n.length - 1; i >= 0; i--) { let x = +n[i]; if (d && (x *= 2) > 9) x -= 9; s += x; d = !d; } return s % 10 === 0; };
const bandeira = n => /^4/.test(n) ? "Visa" : /^(5[1-5]|2[2-7])/.test(n) ? "Mastercard" : /^3[47]/.test(n) ? "Amex" : "Cartão";
const total = (valor, parcelas) => parcelas > 3 ? valor * (1 + 0.02 * (parcelas - 3)) : valor; // juros de MENTIRA: 2% por parcela acima de 3x

function erroCampo(id, msg) {
    const el = $("erro-" + id); if (el) el.textContent = msg || "";
    $(id)?.classList.toggle("invalido", !!msg);
    return !msg;
}
const limparErros = () => document.querySelectorAll(".erro-campo").forEach(e => e.textContent = "") || document.querySelectorAll(".invalido").forEach(e => e.classList.remove("invalido"));

/* QR de mentira: desenho determinístico a partir do texto (NÃO é um Pix pagável) */
function qrFalso(texto) {
    const N = 25, c = document.createElement("canvas"); c.width = c.height = N * 8; c.className = "qr";
    const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, 200, 200); g.fillStyle = "#111";
    let h = 0; for (const ch of texto) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const finder = (x, y) => x < 8 && y < 8 || x > N - 9 && y < 8 || x < 8 && y > N - 9;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        let on;
        if (finder(x, y)) { const ax = x < 8 ? x : x - (N - 7), ay = y < 8 ? y : y - (N - 7); on = ax === 0 || ax === 6 || ay === 0 || ay === 6 || (ax > 1 && ax < 5 && ay > 1 && ay < 5); if (ax === 7 || ay === 7) on = false; }
        else { h = (h * 1103515245 + 12345) >>> 0; on = (h >> 16) & 1; }
        if (on) g.fillRect(x * 8, y * 8, 8, 8);
    }
    return c;
}

/* ---------- PEDIDO ---------- */
function carregarPedido() {
    const salvo = sessionStorage.getItem("boatourPedido");
    let pedidoSalvo = null;
    try { pedidoSalvo = salvo ? JSON.parse(salvo) : null; } catch { pedidoSalvo = null; }
    if (checkoutDaCompra && (!pedidoSalvo || !Number.isFinite(Number(pedidoSalvo.valor)) || Number(pedidoSalvo.valor) <= 0)) {
        pedidoCheckoutInvalido = true;
        $("pedido").innerHTML = '<p class="erro-checkout">Não recebemos os dados da compra. Volte à confirmação e tente novamente.</p>';
        $("btnPagar").disabled = true;
        erroCampo("geral", "Dados da compra ausentes. Nenhum pagamento pode ser realizado.");
        return;
    }
    const lista = pedidoSalvo ? [pedidoSalvo, ...(checkoutDaCompra ? [] : PEDIDOS_EXEMPLO)] : PEDIDOS_EXEMPLO;
    $("pedido").innerHTML = `<select id="selPedido">${lista.map((p, i) => `<option value="${i}">${p.titulo} - ${brl(p.valor)}</option>`).join("")}</select>
        <div class="total"><span>Total</span><span id="totalPedido"></span></div>`;
    if (checkoutDaCompra) {
        const metodoCheckout = sessionStorage.getItem("boatourCheckoutMetodo");
        const opcao = document.querySelector(`input[name="metodo"][value="${metodoCheckout}"]`);
        if (opcao) opcao.checked = true;
        $("selPedido").disabled = true;
    }
    const atualizar = () => { pedido = lista[$("selPedido").value]; montarParcelas(); atualizarTotal(); };
    $("selPedido").onchange = atualizar; atualizar();
}
async function aplicarCupom() {
    const codigo = $("codigoCupomPagamento").value.trim();
    const status = $("estadoCupomPagamento");
    if (!codigo) { status.textContent = "Digite um código de cupom."; return; }
    try {
        const resposta = await fetch(API + "/pagamentos/validar-cupom", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Session-Token": token },
            body: JSON.stringify({ codigo, subtotal: pedido.valor })
        });
        const dados = await lerRespostaApi(resposta);
        if (!resposta.ok) throw new Error(dados.error || "Cupom indisponível.");
        cupomAplicado = dados;
        status.textContent = `Cupom aplicado: −${brl(dados.desconto)} (${dados.percentual}% de desconto).`;
        atualizarTotal();
    } catch (erro) {
        cupomAplicado = null;
        status.textContent = erro.message;
        atualizarTotal();
    }
}
const metodo = () => document.querySelector('input[name="metodo"]:checked').value;
function montarParcelas() {
    $("cParcelas").innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}x de ${brl(total(pedido.valor, i + 1) / (i + 1))}${i + 1 > 3 ? " (com juros)" : " sem juros"}</option>`).join("");
}
function atualizarTotal() {
    const p = metodo() === "cartao" ? +$("cParcelas").value : 1;
    const subtotalComCupom = Math.max(0, Number(pedido.valor) - Number(cupomAplicado?.desconto || 0));
    const saldoDisponivel = Math.max(0, Number(estado.saldo) || 0);
    const limiteDescontoSaldo = Math.max(0, subtotalComCupom - 0.01);
    const descontoSaldo = $("usarSaldoBoaPay").checked ? Math.min(saldoDisponivel, limiteDescontoSaldo) : 0;
    const base = Math.max(0, subtotalComCupom - descontoSaldo);
    $("saldoDescontoDisponivel").textContent = "Saldo disponível: " + brl(saldoDisponivel);
    $("saldoDescontoResumo").textContent = descontoSaldo > 0
        ? "Desconto aplicado: " + brl(descontoSaldo) + " · falta pagar " + brl(total(base, p)) + "."
        : saldoDisponivel > 0 ? "Marque para abater seu saldo do valor da compra." : "Você ainda não tem saldo disponível para usar como desconto.";
    $("saldoDescontoResumo").classList.toggle("saldo-desconto__ativo", descontoSaldo > 0);
    $("totalPedido").textContent = brl(total(base, p));
    $("btnPagar").textContent = "Pagar " + brl(total(base, p));
    $("campos-cartao").hidden = metodo() !== "cartao";
}

/* ---------- PAGAR ---------- */
async function pagar() {
    if (pedidoCheckoutInvalido || !pedido) return;
    limparErros(); erroCampo("geral", "");
    const m = metodo(), parcelas = m === "cartao" ? +$("cParcelas").value : 1;
    const subtotalComCupom = Math.max(0, Number(pedido.valor) - Number(cupomAplicado?.desconto || 0));
    const descontoSaldo = $("usarSaldoBoaPay").checked
        ? Math.min(Math.max(0, Number(estado.saldo) || 0), Math.max(0, subtotalComCupom - 0.01))
        : 0;
    const baseDescontada = Math.max(0, subtotalComCupom - descontoSaldo);
    const valor = Math.round(total(baseDescontada, parcelas) * 100) / 100;
    let final = null, status = "aprovado", motivo = null;

    if (m === "cartao") {
        const num = $("cNumero").value.replace(/\D/g, ""), val = $("cValidade").value, cvv = $("cCvv").value;
        const [mm, aa] = val.split("/").map(Number);
        const ok = [
            erroCampo("cNumero", num.length >= 13 && luhn(num) ? "" : "Número de cartão inválido."),
            erroCampo("cNome", $("cNome").value.trim().split(" ").length >= 2 ? "" : "Digite o nome como está no cartão."),
            erroCampo("cValidade", mm >= 1 && mm <= 12 && aa >= 26 ? "" : "Validade inválida."),
            erroCampo("cCvv", /^\d{3,4}$/.test(cvv) ? "" : "CVV inválido.")
        ];
        if (ok.includes(false)) return;
        final = num.slice(-4);
        if (final === "0000") { status = "recusado"; motivo = "Cartão recusado pelo banco emissor (simulação)."; }
        else if (final === "2222") { status = "pendente"; motivo = "Em análise de segurança (simulação)."; }
        $("cNumero").value = $("cCvv").value = ""; // nunca guardamos número completo nem CVV
    } else status = "pendente"; // pix e boleto aguardam o "pagamento"

    const pag = { id: idPag(), tipo: "compra", descricao: pedido.titulo, valor, subtotal: Number(pedido.valor), descontoCupom: Number(cupomAplicado?.desconto || 0), descontoSaldo, descontoPercentual: Number(cupomAplicado?.percentual || 0), cupomCodigo: cupomAplicado?.codigo || null, metodo: m, parcelas, cartaoFinal: final, bandeira: final ? bandeira($("cNumero").dataset.b || "") : null, status, motivo, criadoEm: new Date().toISOString() };
    const viagem = status === "recusado" ? null : novaViagem(pag, status);
    $("btnPagar").disabled = true;
    try {
        await Armazem.registrar(pag, viagem, { ...pedido, descontoSaldo, descontoCupom: Number(cupomAplicado?.desconto || 0) });
        render(); abrirResultado(pag, viagem);
    } catch (e) { erroCampo("geral", e.message || "Não foi possível registrar o pagamento."); }
    $("btnPagar").disabled = false;
}

function novaViagem(pag, status) {
    const vooSelecionado = (Array.isArray(pedido.itens) ? pedido.itens : []).find(item => item.tipo === "voo" || item.categoria === "voo");
    return { id: "VG-" + pag.id.slice(3), idPagamento: pag.id, titulo: pedido.titulo,
        origem: vooSelecionado?.origem || pedido.origem || "", destino: vooSelecionado?.destino || pedido.destino || "",
        ida: vooSelecionado?.dataSaida || pedido.ida || "", volta: pedido.volta || "",
        imagem: pedido.imagem || "", itens: pedido.itens || [], comprador: pedido.comprador || {}, viajantes: pedido.viajantes || [], ods: pedido.ods || [],
        codigoVoo: vooSelecionado?.numeroVoo || vooSelecionado?.codigoVoo || ("BT" + aleat(4, "0123456789")),
        codigoAviao: "PR-" + aleat(3, "ABCDEFGHJKLMNPQRSTUVWXYZ"),
        status: status === "aprovado" ? "confirmada" : "aguardando pagamento" };
}

async function recarregarSaldo() {
    const v = parseFloat($("valorRecarga").value.replace(/\./g, "").replace(",", "."));
    if (!erroCampo("valorRecarga", v >= 10 && v <= 10000 ? "" : "Digite um valor entre R$ 10,00 e R$ 10.000,00.")) return;
    const pag = { id: idPag(), tipo: "recarga", descricao: "Adicionar saldo via Pix", valor: v, metodo: "pix", parcelas: 1, status: "pendente", criadoEm: new Date().toISOString() };
    await Armazem.registrar(pag, null, pedido);
    $("valorRecarga").value = ""; render(); abrirResultado(pag, null);
}

// confirma um Pix/boleto pendente (o "cliente pagou")
function prazoPagamento(pag) {
    const criadoEm = new Date(pag.criadoEm).getTime();
    return (Number.isFinite(criadoEm) ? criadoEm : Date.now()) + DURACAO_PAGAMENTO_MS;
}

function textoContagem(ms) {
    const totalSegundos = Math.max(0, Math.ceil(ms / 1000));
    const minutos = String(Math.floor(totalSegundos / 60)).padStart(2, "0");
    const segundos = String(totalSegundos % 60).padStart(2, "0");
    return minutos + ":" + segundos;
}

async function expirarPagamento(pag) {
    if (!pag || pag.status !== "pendente" || pagamentosExpirando.has(pag.id)) return;
    pagamentosExpirando.add(pag.id);
    pag.status = "cancelada";
    pag.motivo = "Prazo de pagamento expirado após cinco minutos.";
    const viagem = estado.viagens.find(item => item.idPagamento === pag.id);
    if (viagem) viagem.status = "cancelada";
    try {
        await Armazem.registrar(pag, viagem || null, {});
    } catch (erro) {
        console.error("Não foi possível sincronizar o cancelamento do pagamento:", erro);
    }
    render();
    if (pagamentoAtivoId === pag.id && $("modal").classList.contains("ativo")) abrirResultado(pag, viagem || null);
    pagamentosExpirando.delete(pag.id);
}

function atualizarContagemPagamento(pag) {
    const relogio = $("prazoPagamento");
    if (!relogio || pag.status !== "pendente") return;
    const restante = prazoPagamento(pag) - Date.now();
    relogio.textContent = "Este pagamento será cancelado em " + textoContagem(restante) + ".";
    if (restante <= 0) expirarPagamento(pag);
}

function iniciarMonitorVencimentos() {
    const verificar = async () => {
        const agora = Date.now();
        for (const pag of [...estado.pagamentos]) {
            if (pag.status === "pendente" && prazoPagamento(pag) <= agora) await expirarPagamento(pag);
        }
        const pagamentoAtivo = estado.pagamentos.find(item => item.id === pagamentoAtivoId);
        if (pagamentoAtivo?.status === "pendente") atualizarContagemPagamento(pagamentoAtivo);
    };
    verificar();
    window.setInterval(verificar, 1000);
}

async function confirmar(id) {
    const pag = estado.pagamentos.find(p => p.id === id);
    if (!pag || pag.status !== "pendente") return;
    if (Date.now() >= prazoPagamento(pag)) {
        await expirarPagamento(pag);
        return;
    }
    pag.status = "aprovado"; pag.motivo = null;
    const viagem = estado.viagens.find(v => v.idPagamento === id);
    if (viagem) viagem.status = "confirmada";
    await Armazem.registrar(pag, viagem || null, pedido);
    if (pag.status === "cancelada") {
        render(); abrirResultado(pag, viagem || null);
        return;
    }
    window.location.href = "../index.html";
}

/* ---------- RENDER ---------- */
const ROTULO = { pix: "Pix", cartao: "Cartão", boleto: "Boleto" };
function render() {
    $("saldo").textContent = brl(estado.saldo);
    $("usarSaldoBoaPay").disabled = Number(estado.saldo) <= 0;
    if ($("usarSaldoBoaPay").disabled) $("usarSaldoBoaPay").checked = false;
    $("resumo").innerHTML = `<div><dt>Pedido atual</dt><dd>${pedido?.titulo || "Compra BoaTour"}</dd></div>
        <div><dt>Valor do pedido</dt><dd>${brl(pedido?.valor || 0)}</dd></div>`;
    const cupons = $("listaCuponsBoaPay");
    if (cupons) {
        const disponiveis = estado.cupons.filter(c => c.status === "ativo");
        cupons.innerHTML = disponiveis.length
            ? disponiveis.map(c => `<li><button type="button" data-cupom="${c.codigo}">${c.codigo}</button><small>${c.regraDesconto || (c.descontoPercentual ? `${Number(c.descontoPercentual)}% de desconto · ODS ${c.ods}` : `Cupom ODS ${c.ods}`)}</small></li>`).join("")
            : `<li class="vazio">Seus cupons ODS 8 aparecerão aqui.</li>`;
    }
}

/* ---------- MODAL (resultado / comprovante) ---------- */
function abrirResultado(pag, viagem) {
    pagamentoAtivoId = pag.id;
    const titulo = { aprovado: "Pagamento aprovado!", pendente: "Aguardando pagamento", recusado: "Pagamento recusado", cancelada: "Pagamento cancelado" }[pag.status];
    const c = $("modalConteudo");
    const mensagemPadrao = pag.status === "aprovado" ? "Tudo certo. Este é o seu comprovante." : pag.status === "cancelada" ? "O prazo de cinco minutos terminou. A compra foi cancelada." : "Conclua o pagamento antes do fim do prazo.";
    c.innerHTML = "<h3>" + titulo + "</h3><p>" + (pag.motivo || mensagemPadrao) + "</p>";
    if (pag.status === "pendente") {
        const prazo = document.createElement("p");
        prazo.id = "prazoPagamento";
        prazo.className = "prazo-pagamento";
        c.appendChild(prazo);
        atualizarContagemPagamento(pag);
    }
    if (pag.status === "pendente" && pag.metodo === "pix") {
        const cod = `00020126BOATOUR-SIMULACAO-${pag.id}-${pag.valor.toFixed(2)}`;
        c.appendChild(qrFalso(cod));
        c.insertAdjacentHTML("beforeend", `<p class="dica">QR de simulação, não é um Pix real.</p><div class="codigo">${cod}</div>`);
    }
    if (pag.status === "pendente" && pag.metodo === "boleto")
        c.insertAdjacentHTML("beforeend", `<div class="codigo">34191.79001 01043.510047 91020.150008 1 ${aleat(14, "0123456789")}</div><p class="dica">Linha digitável de simulação.</p>`);
    const cuponsGerados = estado.cupons.filter(item => item.id_pagamento_origem === pag.id);
    if (cuponsGerados.length) c.insertAdjacentHTML("beforeend", `<p class="dica">Cupom ODS 8 gerado: ${cuponsGerados.map(item => item.codigo).join(", ")}</p>`);
    const cashback = (estado.movimentos || []).filter(item => item.idPagamento === pag.id && item.tipo === "cashback_ods12").reduce((soma, item) => soma + Number(item.valor || 0), 0);
    if (cashback > 0) c.insertAdjacentHTML("beforeend", `<p class="dica">Cashback ODS 12 adicionado ao saldo BoaPay: ${brl(cashback)}.</p>`);
    c.insertAdjacentHTML("beforeend", `<dl>
        <div><dt>Código</dt><dd>${pag.id}</dd></div><div><dt>Descrição</dt><dd>${pag.descricao}</dd></div>
        <div><dt>Forma</dt><dd>${ROTULO[pag.metodo]}${pag.cartaoFinal ? " •••• " + pag.cartaoFinal : ""}${pag.parcelas > 1 ? ` (${pag.parcelas}x)` : ""}</dd></div>
        <div><dt>Valor</dt><dd>${brl(pag.valor)}</dd></div><div><dt>Data</dt><dd>${dataBr(pag.criadoEm)}</dd></div>
        <div><dt>Status</dt><dd><span class="status s-${pag.status}">${pag.status}</span></dd></div>
        ${viagem ? `<div><dt>Voo / Avião</dt><dd>${viagem.codigoVoo} / ${viagem.codigoAviao}</dd></div>` : ""}</dl><div class="acoes"></div>`);
    const a = c.querySelector(".acoes");
    const btn = (t, f, p = false) => { const b = document.createElement("button"); b.className = p ? "btn-principal" : "btn-sec"; b.style.marginTop = 0; b.textContent = t; b.onclick = f; a.appendChild(b); };
    if (pag.status === "pendente") btn("Simular pagamento " + (pag.metodo === "boleto" ? "do boleto" : "do Pix"), () => confirmar(pag.id), true);
    btn("Imprimir comprovante", () => window.print());
    $("modal").classList.add("ativo");
}

/* ---------- INICIAR ---------- */
document.querySelectorAll('input[name="metodo"]').forEach(r => r.onchange = atualizarTotal);
$("usarSaldoBoaPay").onchange = atualizarTotal;
$("aplicarCupomPagamento").onclick = aplicarCupom;
$("listaCuponsBoaPay")?.addEventListener("click", evento => {
    const botaoCupom = evento.target.closest("[data-cupom]");
    if (!botaoCupom) return;
    $("codigoCupomPagamento").value = botaoCupom.dataset.cupom;
    aplicarCupom();
});
$("cParcelas").onchange = atualizarTotal;
$("btnPagar").onclick = pagar; $("btnRecarga").onclick = recarregarSaldo;
$("modalFechar").onclick = () => { $("modal").classList.remove("ativo"); pagamentoAtivoId = null; };
$("modal").onclick = e => { if (e.target === $("modal")) { $("modal").classList.remove("ativo"); pagamentoAtivoId = null; } };
$("cNumero").oninput = e => { const n = e.target.value.replace(/\D/g, "").slice(0, 16); e.target.dataset.b = n; e.target.value = n.replace(/(.{4})/g, "$1 ").trim(); };
$("cValidade").oninput = e => { const n = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; };

async function iniciarPagamentos() {
    try {
        estado = await Armazem.carregar();
        carregarPedido();
        render();
    } catch (e) {
        if (USAR_API && e.status === 401) {
            localStorage.removeItem("boatourSessionToken");
            token = null;
            USAR_API = false;
            erroSessao = "Sua sessão expirou. Esta simulação será salva neste navegador.";
            try { estado = await Armazem.carregar(); }
            catch { estado = { saldo: 0, pagamentos: [], viagens: [], cupons: [] }; }
        } else {
            erroCampo("geral", (e.message || "Erro ao carregar pagamentos.") + " Confira se o MySQL e o servidor estão ativos.");
        }
    }
    carregarPedido();
    render();
    if (erroSessao) erroCampo("geral", erroSessao);
}

iniciarPagamentos().then(iniciarMonitorVencimentos);
