const BASE_URL = process.env.AERODATABOX_BASE_URL || 'https://aerodatabox.p.rapidapi.com';
const API_HOST = process.env.AERODATABOX_API_HOST || 'aerodatabox.p.rapidapi.com';
const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;
const INTERVALO_MINIMO_MS = 1100;
let ultimaChamadaEm = 0;

function validarIata(valor) {
    const codigo = String(valor || '').trim().toUpperCase();
    return /^[A-Z]{3}$/.test(codigo) ? codigo : '';
}

function dataValida(valor) {
    const data = String(valor || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const dataParseada = new Date(`${data}T00:00:00Z`);
    return !Number.isNaN(dataParseada.getTime()) && dataParseada.toISOString().slice(0, 10) === data;
}

function lerAeroporto(movimento) {
    return movimento?.airport?.iata || movimento?.airport?.iataCode || movimento?.iata || '';
}

function lerHorario(movimento) {
    return movimento?.scheduledTime?.local || movimento?.scheduledTime?.utc ||
        movimento?.revisedTime?.local || movimento?.revisedTime?.utc || '';
}

function normalizarVoo(voo, origemSolicitada) {
    const partida = voo.departure || voo.movement || {};
    const chegada = voo.arrival || {};
    return {
        numero_voo: voo.number || '',
        companhia_aerea: voo.airline?.name || '',
        codigo_companhia: voo.airline?.iata || '',
        origem: lerAeroporto(partida) || origemSolicitada,
        destino: lerAeroporto(chegada),
        partida_local: lerHorario(partida),
        chegada_local: lerHorario(chegada),
        status: voo.status || 'Scheduled',
        fonte: 'AeroDataBox',
        compravel: false
    };
}

async function aguardarLimiteDeChamada() {
    const espera = INTERVALO_MINIMO_MS - (Date.now() - ultimaChamadaEm);
    if (espera > 0) await new Promise(resolve => setTimeout(resolve, espera));
    ultimaChamadaEm = Date.now();
}

async function consultarPeriodo(iata, inicio, fim) {
    const url = new URL(`${BASE_URL}/flights/airports/iata/${iata}/${inicio}/${fim}`);
    url.searchParams.set('direction', 'Departure');
    url.searchParams.set('withLeg', 'true');
    url.searchParams.set('withCancelled', 'false');
    url.searchParams.set('withCodeshared', 'false');
    url.searchParams.set('withCargo', 'false');
    url.searchParams.set('withPrivate', 'false');

    await aguardarLimiteDeChamada();
    const resposta = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'X-RapidAPI-Key': process.env.AERODATABOX_API_KEY,
            'X-RapidAPI-Host': API_HOST
        },
        signal: AbortSignal.timeout(12000)
    });

    if (!resposta.ok) {
        const erro = new Error(`AeroDataBox respondeu com HTTP ${resposta.status}.`);
        erro.status = resposta.status;
        throw erro;
    }

    return resposta.json();
}

async function buscarVoos({ origem, destino, data }) {
    if (String(process.env.AERODATABOX_ENABLED).toLowerCase() !== 'true') {
        const erro = new Error('A busca AeroDataBox está desligada.');
        erro.code = 'AERODATABOX_DESLIGADA';
        throw erro;
    }
    if (!process.env.AERODATABOX_API_KEY) {
        const erro = new Error('Configure AERODATABOX_API_KEY em servidor/.env.');
        erro.code = 'AERODATABOX_SEM_CHAVE';
        throw erro;
    }

    const origemIata = validarIata(origem);
    const destinoIata = validarIata(destino);
    if (!origemIata || !destinoIata || !dataValida(data)) {
        const erro = new Error('Informe origem e destino por código IATA e uma data válida.');
        erro.code = 'PARAMETROS_INVALIDOS';
        throw erro;
    }

    const chaveCache = `${origemIata}:${destinoIata}:${data}`;
    const cacheado = cache.get(chaveCache);
    if (cacheado && cacheado.expiraEm > Date.now()) return cacheado.voos;

    // O plano Basic limita cada faixa FIDS a 12 horas; consultar o dia em duas faixas.
    const periodos = [
        [`${data}T00:00`, `${data}T12:00`],
        [`${data}T12:00`, `${data}T23:59`]
    ];
    const respostas = [];
    for (const [inicio, fim] of periodos) {
        respostas.push(await consultarPeriodo(origemIata, inicio, fim));
    }

    const voos = respostas.flatMap(resposta => Array.isArray(resposta?.departures) ? resposta.departures : [])
        .map(voo => normalizarVoo(voo, origemIata))
        .filter(voo => voo.destino.toUpperCase() === destinoIata)
        .filter((voo, indice, lista) => lista.findIndex(outro =>
            outro.numero_voo === voo.numero_voo && outro.partida_local === voo.partida_local
        ) === indice);

    cache.set(chaveCache, { voos, expiraEm: Date.now() + CACHE_MS });
    return voos;
}

module.exports = { buscarVoos };
