const API_RASTREADOR = "/rastrear-voo";
const ICONE_AVIAO = "../img/icones/aviao2.png";

async function lerRespostaRastreador(resposta) {
    const tipoConteudo = resposta.headers.get("content-type") || "";
    if (!tipoConteudo.includes("application/json")) {
        throw new Error("A API de rastreamento não respondeu em JSON. Inicie o servidor BoaTour na porta 3000.");
    }
    return resposta.json();
}

/* ---------- elementos ---------- */
const modal = document.getElementById("modalRastreador");
const inputVoo = document.getElementById("codigoVoo");
const inputAviao = document.getElementById("codigoAviao");
const parametrosRastreio = new URLSearchParams(window.location.search);
inputVoo.value = parametrosRastreio.get("voo") || "";
inputAviao.value = parametrosRastreio.get("aviao") || "";
const erroVoo = document.getElementById("erroVoo");
const erroAviao = document.getElementById("erroAviao");
const erroGeral = document.getElementById("erroGeral");
const btnConfirmar = document.getElementById("btnConfirmar");
const painel = document.getElementById("painelVoo");

/* ---------- mapa (Leaflet + OpenStreetMap, sem chave de API) ---------- */
const mapa = L.map("mapa", { worldCopyJump: true, minZoom: 2 }).setView([-15, -50], 3);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap"
}).addTo(mapa);

let camadaRota = L.layerGroup().addTo(mapa);
let animacao = null;
let pontosRota = [];
let marcadorAviao = null;
let trechoPercorrido = null;
let timerAtualizacao = null;
let ultimaConsulta = null;

/* ---------- utilidades ---------- */
const rad = g => g * Math.PI / 180;
const grau = r => r * 180 / Math.PI;

// Pontos de um arco de círculo máximo (a rota "curva" real de um voo)
function arco(a, b, passos = 80) {
    const [lat1, lon1, lat2, lon2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])];
    const d = 2 * Math.asin(Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
    ));

    if (d === 0) return [a, b];

    const pontos = [];
    for (let i = 0; i <= passos; i++) {
        const f = i / passos;
        const A = Math.sin((1 - f) * d) / Math.sin(d);
        const B = Math.sin(f * d) / Math.sin(d);
        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);
        pontos.push([grau(Math.atan2(z, Math.sqrt(x * x + y * y))), grau(Math.atan2(y, x))]);
    }

    // evita a linha "pular" pelo mapa inteiro ao cruzar o meridiano 180
    for (let i = 1; i < pontos.length; i++) {
        while (pontos[i][1] - pontos[i - 1][1] > 180) pontos[i][1] -= 360;
        while (pontos[i][1] - pontos[i - 1][1] < -180) pontos[i][1] += 360;
    }

    return pontos;
}

function distanciaKm(a, b) {
    const [lat1, lon1, lat2, lon2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])];
    const h = Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function rumoEntre(a, b) {
    const [lat1, lon1, lat2, lon2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])];
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    return (grau(Math.atan2(y, x)) + 360) % 360;
}

// textos vindos de API externa nunca entram como HTML
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : String(texto);
    return div.innerHTML;
}

function iconeAviao(rumo) {
    // a imagem aponta para nordeste (45°), então giramos (rumo - 45)
    return L.divIcon({
        className: "icone-aviao",
        html: `<img src="${ICONE_AVIAO}" alt="" style="transform:rotate(${rumo - 45}deg)">`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
    });
}

/* ---------- modal ---------- */
function abrirModal() {
    modal.classList.add("ativo");
    inputVoo.focus();
}

function fecharModal() {
    modal.classList.remove("ativo");
}

function limparErros() {
    [erroVoo, erroAviao, erroGeral].forEach(e => (e.textContent = ""));
    [inputVoo, inputAviao].forEach(i => i.classList.remove("invalido"));
}

function mostrarErro(campo, mensagem) {
    if (campo === "voo") {
        erroVoo.textContent = mensagem;
        inputVoo.classList.add("invalido");
        inputVoo.focus();
    } else if (campo === "aviao") {
        erroAviao.textContent = mensagem;
        inputAviao.classList.add("invalido");
        inputAviao.focus();
    } else {
        erroGeral.textContent = mensagem;
    }
}

document.getElementById("btnAbrirModal").addEventListener("click", abrirModal);
document.getElementById("fecharModal").addEventListener("click", fecharModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharModal(); });

[inputVoo, inputAviao].forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.toUpperCase();
        input.classList.remove("invalido");
        (input === inputVoo ? erroVoo : erroAviao).textContent = "";
    });
    input.addEventListener("keydown", e => { if (e.key === "Enter") confirmar(); });
});

btnConfirmar.addEventListener("click", confirmar);

/* ---------- consulta ao servidor ---------- */
async function confirmar() {
    limparErros();

    const voo = inputVoo.value.trim();
    const aviao = inputAviao.value.trim();

    if (!voo) return mostrarErro("voo", "Digite o código do voo.");
    if (!aviao) return mostrarErro("aviao", "Digite o código do avião.");

    btnConfirmar.disabled = true;
    btnConfirmar.textContent = "Verificando...";

    try {
        const resposta = await fetch(
            `${API_RASTREADOR}?voo=${encodeURIComponent(voo)}&aviao=${encodeURIComponent(aviao)}`,
            { signal: AbortSignal.timeout(20000) }
        );
        const dados = await lerRespostaRastreador(resposta);

        if (!resposta.ok) {
            return mostrarErro(dados.campo || "geral", dados.error || "Não foi possível rastrear o voo.");
        }

        ultimaConsulta = { voo, aviao };
        fecharModal();
        mostrarRota(dados);
    } catch (erro) {
        mostrarErro("geral", erro.message || "Não foi possível conectar ao servidor. Verifique se ele está ligado.");
    } finally {
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = "Confirmar";
    }
}

/* ---------- desenho da rota ---------- */
function mostrarRota(dados) {
    if (animacao) cancelAnimationFrame(animacao);
    pararAtualizacao();
    marcadorAviao = null;
    trechoPercorrido = null;
    camadaRota.clearLayers();

    const origem = [dados.origem.lat, dados.origem.lon];
    const destino = [dados.destino.lat, dados.destino.lon];
    const pontos = arco(origem, destino);
    pontosRota = pontos;

    const rotulo = a => `<strong>${escapar(a.iata || a.icao)}</strong><br>${escapar(a.nome)}<br>${escapar(a.cidade)}, ${escapar(a.pais)}`;

    L.circleMarker(origem, { radius: 8, color: "#fff", weight: 3, fillColor: "#0b9995", fillOpacity: 1 })
        .bindPopup(`Origem<br>${rotulo(dados.origem)}`).addTo(camadaRota);
    L.circleMarker(pontos[pontos.length - 1], { radius: 8, color: "#fff", weight: 3, fillColor: "#e63946", fillOpacity: 1 })
        .bindPopup(`Destino<br>${rotulo(dados.destino)}`).addTo(camadaRota);

    const linha = L.polyline([], { color: "#e63946", weight: 3, dashArray: "8 8" }).addTo(camadaRota);
    mapa.fitBounds(L.latLngBounds(pontos), { padding: [90, 90] });

    // a linha vai sendo "traçada" da origem até o destino
    const inicio = performance.now();
    const duracao = 1400;

    function passo(agora) {
        const f = Math.min((agora - inicio) / duracao, 1);
        linha.setLatLngs(pontos.slice(0, Math.max(2, Math.round(f * (pontos.length - 1)) + 1)));

        if (f < 1) {
            animacao = requestAnimationFrame(passo);
        } else {
            colocarAviao(dados, pontos);
        }
    }

    animacao = requestAnimationFrame(passo);
    preencherPainel(dados, distanciaKm(origem, destino));
}

function colocarAviao(dados, pontos) {
    const aoVivo = dados.aoVivo;

    // voo simulado do BoaTour: o servidor calcula a posição do avião sobre a rota
    if (dados.simulado && aoVivo) {
        trechoPercorrido = L.polyline([], { color: "#0b9995", weight: 4 }).addTo(camadaRota);
        marcadorAviao = L.marker([aoVivo.lat, aoVivo.lon], { icon: iconeAviao(aoVivo.rumo != null ? aoVivo.rumo : 0) })
            .bindPopup("Posição do avião (simulação)").addTo(camadaRota);
        aplicarPosicao(dados);
        if (dados.fase !== "pousou") iniciarAtualizacao(dados.demonstracao ? 3000 : 10000);
        return;
    }

    if (aoVivo && aoVivo.confirmaVoo && !aoVivo.noChao) {
        const rumo = aoVivo.rumo != null ? aoVivo.rumo : 0;
        L.marker([aoVivo.lat, aoVivo.lon], { icon: iconeAviao(rumo) })
            .bindPopup("Posição atual do avião").addTo(camadaRota);
        return;
    }

    // sem posição ao vivo: avião no meio da rota prevista
    const meio = Math.floor(pontos.length / 2);
    L.marker(pontos[meio], { icon: iconeAviao(rumoEntre(pontos[meio - 1], pontos[meio + 1])) })
        .bindPopup("Rota prevista do voo").addTo(camadaRota);
}

/* ---------- voo simulado: avião se movendo ---------- */
function posicaoNoMapa(aoVivo) {
    let ref = pontosRota[0];
    let indice = 0;
    let menor = Infinity;
    pontosRota.forEach((p, i) => {
        const d = distanciaKm([aoVivo.lat, aoVivo.lon], p);
        if (d < menor) { menor = d; ref = p; indice = i; }
    });
    const lon = aoVivo.lon + 360 * Math.round((ref[1] - aoVivo.lon) / 360);
    return { pos: [aoVivo.lat, lon], indice };
}

function aplicarPosicao(dados) {
    if (!marcadorAviao || !dados.aoVivo) return;
    const { pos, indice } = posicaoNoMapa(dados.aoVivo);
    marcadorAviao.setLatLng(pos);
    marcadorAviao.setIcon(iconeAviao(dados.aoVivo.rumo != null ? dados.aoVivo.rumo : 0));
    if (trechoPercorrido) trechoPercorrido.setLatLngs([...pontosRota.slice(0, indice + 1), pos]);
}

function iniciarAtualizacao(ms) {
    pararAtualizacao();
    timerAtualizacao = setInterval(atualizarSimulacao, ms);
}

function pararAtualizacao() {
    if (timerAtualizacao) clearInterval(timerAtualizacao);
    timerAtualizacao = null;
}

async function atualizarSimulacao() {
    if (!ultimaConsulta) return;
    try {
        const resposta = await fetch(
            `${API_RASTREADOR}?voo=${encodeURIComponent(ultimaConsulta.voo)}&aviao=${encodeURIComponent(ultimaConsulta.aviao)}`,
            { signal: AbortSignal.timeout(8000) }
        );
        const dados = await lerRespostaRastreador(resposta);
        if (!resposta.ok || !dados.simulado) return;

        aplicarPosicao(dados);
        preencherPainel(dados, distanciaKm([dados.origem.lat, dados.origem.lon], [dados.destino.lat, dados.destino.lon]));
        if (dados.fase === "pousou") pararAtualizacao();
    } catch {
        // sem conexão agora: tenta de novo no próximo ciclo
    }
}

function preencherPainel(dados, km) {
    const definir = (id, texto) => (document.getElementById(id).textContent = texto);
    const modelo = [dados.aviao.fabricante, dados.aviao.modelo].filter(Boolean).join(" ");

    definir("painelTitulo", `Voo ${dados.voo.codigo}`);
    definir("painelCompanhia", dados.voo.companhia || "Companhia não informada");
    definir("rotaOrigemIata", dados.origem.iata || dados.origem.icao || "-");
    definir("rotaOrigemCidade", dados.origem.cidade || dados.origem.nome || "");
    definir("rotaDestinoIata", dados.destino.iata || dados.destino.icao || "-");
    definir("rotaDestinoCidade", dados.destino.cidade || dados.destino.nome || "");
    definir("painelAviao", modelo || "Não informado");
    definir("painelCodigoAviao", dados.aviao.matricula || dados.aviao.icao24 || dados.aviao.codigo);
    definir("painelDistancia", `${Math.round(km).toLocaleString("pt-BR")} km`);

    const v = dados.aoVivo;
    let status = "Rota programada";

    if (dados.simulado && dados.statusTexto) {
        definir("painelStatus", dados.statusTexto);

        const sim = document.querySelectorAll("[data-sim]");
        const caixa = document.getElementById("painelProgressoBox");
        const mostrar = !!dados.horarios;
        sim.forEach(el => (el.hidden = !mostrar));
        caixa.hidden = dados.progresso == null;

        if (dados.progresso != null) {
            document.getElementById("painelProgresso").style.width = `${dados.progresso}%`;
            definir("painelProgressoTexto", `${dados.progresso}% do trajeto percorrido`);
        }

        if (mostrar) {
            const a = dados.aoVivo || {};
            const fmt = n => Math.round(n).toLocaleString("pt-BR");
            definir("painelHorario", `${dados.horarios.saida} → ${dados.horarios.chegada}`);
            definir("painelAgora", dados.fase === "pousou"
                ? "Chegou"
                : `${dados.horarios.agora} (faltam ${Math.floor(dados.horarios.restanteMin / 60)}h${String(dados.horarios.restanteMin % 60).padStart(2, "0")})`);
            definir("painelAltitude", `${fmt(a.altitudeM || 0)} m`);
            definir("painelVelocidade", `${fmt(a.velocidadeKmh || 0)} km/h`);
        }

        painel.hidden = false;
        return;
    }

    document.querySelectorAll("[data-sim]").forEach(el => (el.hidden = true));
    document.getElementById("painelProgressoBox").hidden = true;

    if (v && !v.noChao) {
        const partes = [v.confirmaVoo ? "Ao vivo" : "Avião em outro voo agora"];
        if (v.altitudeM != null) partes.push(`${Math.round(v.altitudeM).toLocaleString("pt-BR")} m`);
        if (v.velocidadeKmh != null) partes.push(`${v.velocidadeKmh} km/h`);
        status = partes.join(" · ");
    } else if (v && v.noChao) {
        status = "Avião em solo";
    }

    definir("painelStatus", status);
    painel.hidden = false;
}

inputVoo.focus();
