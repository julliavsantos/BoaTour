const USAR_API = true;
const API = "http://localhost:3000";
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
let CHAVE = "boatourPagamentos:" + (usuario?.id_usuario || "visitante");
let estado = { saldo: 0, pagamentos: [], viagens: [], cupons: [] };
let pedido = null, cupomAplicado = null;

/* ---------- ARMAZÉM: localStorage ou MySQL (mesma interface) ---------- */
const Armazem = {
    async carregar() {
        if (USAR_API) {
            const r = await fetch(API + "/pagamentos/historico", { headers: { "X-Session-Token": token } });
            const d = await r.json();
            if (!r.ok) {
                const erro = new Error(d.error || "Falha ao carregar.");
                erro.status = r.status;
                throw erro;
            }
            // o MySQL devolve snake_case: adapta para o formato usado na tela
            d.pagamentos = (d.pagamentos || []).map(p => ({ ...p, valor: Number(p.valor) }));
            d.viagens = (d.viagens || []).map(v => ({ ...v, dados: typeof v.dados === "string" ? JSON.parse(v.dados) : v.dados }));
            d.cupons = Array.isArray(d.cupons) ? d.cupons : [];
            return d;
        }
        return JSON.parse(localStorage.getItem(CHAVE) || '{"saldo":0,"pagamentos":[],"viagens":[]}');
    },
    // pagamento: obrigatório; viagem: opcional; delta: variação do saldo
    async registrar(pagamento, viagem, pedidoAtual = pedido) {
        if (USAR_API) {
            const r = await fetch(API + "/pagamentos/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Session-Token": token },
                body: JSON.stringify({ pagamento, viagem, pedido: pedidoAtual })
            });
            const resposta = await r.json();
            if (!r.ok) throw new Error(resposta.error || "Falha ao registrar.");
            estado = await this.carregar();
            return resposta;
        }
        const i = estado.pagamentos.findIndex(p => p.id === pagamento.id);
        if (i >= 0) estado.pagamentos[i] = pagamento; else estado.pagamentos.unshift(pagamento);
        if (viagem) estado.viagens.unshift(viagem);
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
    const salvo = sessionStorage.getItem("boatourPedido"); // PASSO 5
    const lista = salvo ? [JSON.parse(salvo), ...(checkoutDaCompra ? [] : PEDIDOS_EXEMPLO)] : PEDIDOS_EXEMPLO;
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
        const dados = await resposta.json();
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
    const base = Math.max(0, Number(pedido.valor) - Number(cupomAplicado?.desconto || 0));
    $("totalPedido").textContent = brl(total(base, p));
    $("btnPagar").textContent = "Pagar " + brl(total(base, p));
    $("campos-cartao").hidden = metodo() !== "cartao";
}

/* ---------- PAGAR ---------- */
async function pagar() {
    limparErros(); erroCampo("geral", "");
    const m = metodo(), parcelas = m === "cartao" ? +$("cParcelas").value : 1;
    const baseDescontada = Math.max(0, Number(pedido.valor) - Number(cupomAplicado?.desconto || 0));
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
    } else if (m === "saldo") {
        if (estado.saldo < valor) { status = "recusado"; motivo = "Saldo insuficiente na carteira BoaPay."; }
    } else status = "pendente"; // pix e boleto aguardam o "pagamento"

    const pag = { id: idPag(), tipo: "compra", descricao: pedido.titulo, valor, subtotal: Number(pedido.valor), descontoCupom: Number(cupomAplicado?.desconto || 0), descontoPercentual: Number(cupomAplicado?.percentual || 0), cupomCodigo: cupomAplicado?.codigo || null, metodo: m, parcelas, cartaoFinal: final, bandeira: final ? bandeira($("cNumero").dataset.b || "") : null, status, motivo, criadoEm: new Date().toISOString() };
    const viagem = status === "recusado" ? null : novaViagem(pag, status);
    $("btnPagar").disabled = true;
    try {
        await Armazem.registrar(pag, viagem, pedido);
        render(); abrirResultado(pag, viagem);
    } catch (e) { erroCampo("geral", e.message || "Não foi possível registrar o pagamento."); }
    $("btnPagar").disabled = false;
}

function novaViagem(pag, status) {
    return { id: "VG-" + pag.id.slice(3), idPagamento: pag.id, titulo: pedido.titulo, origem: pedido.origem, destino: pedido.destino, ida: pedido.ida, volta: pedido.volta,
        imagem: pedido.imagem || "", itens: pedido.itens || [], comprador: pedido.comprador || {}, viajantes: pedido.viajantes || [], ods: pedido.ods || [],
        codigoVoo: "BT" + aleat(4, "0123456789"), codigoAviao: "PR-" + aleat(3, "ABCDEFGHJKLMNPQRSTUVWXYZ"), // fictícios (PASSO 6)
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
async function confirmar(id) {
    const pag = estado.pagamentos.find(p => p.id === id); if (!pag) return;
    pag.status = "aprovado"; pag.motivo = null;
    const viagem = estado.viagens.find(v => v.idPagamento === id);
    if (viagem) viagem.status = "confirmada";
    await Armazem.registrar(pag, viagem || null, pedido);
    window.location.href = "../index.html";
}

/* ---------- RENDER ---------- */
const ROTULO = { pix: "Pix", cartao: "Cartão", boleto: "Boleto", saldo: "Saldo BoaPay" };
function render() {
    $("saldo").textContent = $("saldoMetodo").textContent = brl(estado.saldo);
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
    const titulo = { aprovado: "Pagamento aprovado!", pendente: "Aguardando pagamento", recusado: "Pagamento recusado" }[pag.status];
    const c = $("modalConteudo");
    c.innerHTML = `<h3>${titulo}</h3><p>${pag.motivo || (pag.status === "aprovado" ? "Tudo certo. Este é o seu comprovante." : "Conclua o pagamento abaixo para confirmar.")}</p>`;
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
$("aplicarCupomPagamento").onclick = aplicarCupom;
$("listaCuponsBoaPay")?.addEventListener("click", evento => {
    const botaoCupom = evento.target.closest("[data-cupom]");
    if (!botaoCupom) return;
    $("codigoCupomPagamento").value = botaoCupom.dataset.cupom;
    aplicarCupom();
});
$("cParcelas").onchange = atualizarTotal;
$("btnPagar").onclick = pagar; $("btnRecarga").onclick = recarregarSaldo;
$("modalFechar").onclick = () => $("modal").classList.remove("ativo");
$("modal").onclick = e => { if (e.target === $("modal")) $("modal").classList.remove("ativo"); };
$("cNumero").oninput = e => { const n = e.target.value.replace(/\D/g, "").slice(0, 16); e.target.dataset.b = n; e.target.value = n.replace(/(.{4})/g, "$1 ").trim(); };
$("cValidade").oninput = e => { const n = e.target.value.replace(/\D/g, "").slice(0, 4); e.target.value = n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; };

function mostrarLogin(mensagem = "Entre na sua conta BoaTour para acessar seus pagamentos.") {
    let overlay = document.getElementById("loginObrigatorio");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loginObrigatorio";
        overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(8,18,38,.82);display:grid;place-items:center;padding:20px;";
        overlay.innerHTML = `
          <form id="formLoginObrigatorio" style="box-sizing:border-box;width:min(420px,100%);background:#fff;color:#172033;border-radius:18px;padding:28px;box-shadow:0 20px 60px #0005;font-family:Arial,sans-serif">
            <h2 style="margin:0 0 8px">Entre na BoaTour</h2>
            <p id="mensagemLoginObrigatorio" style="margin:0 0 18px;line-height:1.5"></p>
            <label for="loginCpf" style="display:block;margin:12px 0 6px">CPF</label>
            <input id="loginCpf" inputmode="numeric" autocomplete="username" maxlength="14" required placeholder="Digite seu CPF" style="box-sizing:border-box;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:8px">
            <label for="loginSenha" style="display:block;margin:12px 0 6px">Senha</label>
            <input id="loginSenha" type="password" autocomplete="current-password" required placeholder="Sua senha" style="box-sizing:border-box;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:8px">
            <p id="erroLoginObrigatorio" role="alert" style="color:#b42318;min-height:20px;margin:10px 0"></p>
            <button id="btnLoginObrigatorio" type="submit" style="width:100%;padding:13px;border:0;border-radius:8px;background:#1455c0;color:white;font-weight:bold;cursor:pointer">Entrar e abrir pagamentos</button>
            <p style="font-size:12px;color:#64748b;line-height:1.4;margin-bottom:0">Use o CPF e a senha da sua conta cadastrada. Nenhum dado de cartão é solicitado aqui.</p>
          </form>`;
        document.body.appendChild(overlay);
        const form = document.getElementById("formLoginObrigatorio");
        const cpf = document.getElementById("loginCpf");
        cpf.addEventListener("input", () => {
            const n = cpf.value.replace(/\D/g, "").slice(0, 11);
            cpf.value = n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
        });
        form.addEventListener("submit", async event => {
            event.preventDefault();
            const botao = document.getElementById("btnLoginObrigatorio");
            const erroEl = document.getElementById("erroLoginObrigatorio");
            botao.disabled = true;
            botao.textContent = "Entrando...";
            erroEl.textContent = "";
            try {
                const resposta = await fetch(API + "/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cpf: cpf.value.replace(/\D/g, ""), senha: document.getElementById("loginSenha").value })
                });
                const dados = await resposta.json();
                if (!resposta.ok || !dados.session_token || !dados.usuario) {
                    throw new Error(dados.error || "Não foi possível entrar. Confira o CPF e a senha.");
                }
                usuario = dados.usuario;
                token = dados.session_token;
                localStorage.setItem("boatourUsuario", JSON.stringify(usuario));
                localStorage.setItem("boatourSessionToken", token);
                CHAVE = "boatourPagamentos:" + (usuario.id_usuario || "visitante");
                overlay.remove();
                await iniciarPagamentos();
            } catch (erro) {
                erroEl.textContent = erro.message || "Falha ao conectar à API. Confira se o servidor está rodando.";
            } finally {
                if (document.body.contains(botao)) {
                    botao.disabled = false;
                    botao.textContent = "Entrar e abrir pagamentos";
                }
            }
        });
    }
    document.getElementById("mensagemLoginObrigatorio").textContent = mensagem;
}

async function iniciarPagamentos() {
    try {
        estado = await Armazem.carregar();
        carregarPedido();
        render();
    } catch (e) {
        if (USAR_API && (e.status === 401 || !token)) {
            localStorage.removeItem("boatourSessionToken");
            token = null;
            mostrarLogin("Sua sessão expirou ou você ainda não entrou. Faça login novamente para carregar o histórico.");
            return;
        }
        erroCampo("geral", (e.message || "Erro ao carregar pagamentos.") + " Confira se o MySQL e o servidor estão ativos.");
        carregarPedido();
        render();
    }
}

if (USAR_API && !token) {
    mostrarLogin();
} else {
    iniciarPagamentos();
}

//Temporizador do pagamento, efetuado com 5 minutos
let tempoRestante = 5 * 60;

const 
  timerElement = document.getElementById('contador-pagamento');

function iniciarTemporizador() {
    const intervalo = setInterval(() => {
        let minutos = Math.floor(tempoRestante / 60);
        let segundos = tempoRestante % 60;

        // Formata para o padrão MM:SS (ex: 05:00)
        minutos = minutos < 10 ? '0' + minutos : minutos;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        if (timerElement) {
            timerElement.textContent = `${minutos}:${segundos}`;
        }

        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            alert("O tempo para efetuar o pagamento expirou! O voo foi liberado.");
            window.location.href = "../../VOOS/index.html"; // Redireciona de volta para os voos
        } else {
            tempoRestante--;
        }
    }, 1000);
}

// Inicia a contagem assim que a página carregar
window.onload = iniciarTemporizador;
