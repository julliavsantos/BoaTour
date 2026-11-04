const RastreioBD = require('./database/RastreioBD');
const { montarSimulacao, simularDemonstracao, limparAviao } = require('./simulacao-voos');

//                         false = tudo simulado (qualquer código válido funciona).          true = códigos desconhecidos vão para a API de voos reais.
const USAR_API_REAL = false;

const ADSBDB = 'https://api.adsbdb.com/v0';
const OPENSKY = 'https://opensky-network.org/api/states/all';

const TEMPO_LIMITE_MS = 8000;
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map();

class ErroRastreador extends Error {
    constructor(status, mensagem, campo) {
        super(mensagem);
        this.status = status;
        this.campo = campo;
    }
}

function limpar(valor) {
    return String(valor || '').toUpperCase().replace(/[\s]/g, '');
}

async function buscarJson(urlApi) {
    const resposta = await fetch(urlApi, {
        signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
        headers: { Accept: 'application/json' }
    });

    if (resposta.status === 404) return null;
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    return resposta.json();
}

function formatarAeroporto(a) {
    return {
        nome: a.name,
        cidade: a.municipality,
        pais: a.country_name,
        iata: a.iata_code,
        icao: a.icao_code,
        lat: Number(a.latitude),
        lon: Number(a.longitude)
    };
}

async function buscarRota(codigoVoo) {
    const dados = await buscarJson(`${ADSBDB}/callsign/${encodeURIComponent(codigoVoo)}`);
    const rota = dados && dados.response && dados.response.flightroute;

    if (!rota || !rota.origin || !rota.destination) {
        throw new ErroRastreador(404, 'Voo não encontrado. Confira o código (ex.: LAT8084).', 'voo');
    }

    return rota;
}

async function buscarAviao(codigoAviao) {
    const dados = await buscarJson(`${ADSBDB}/aircraft/${encodeURIComponent(codigoAviao)}`);
    const aviao = dados && dados.response && dados.response.aircraft;

    if (!aviao) {
        throw new ErroRastreador(404, 'Avião não encontrado. Use a matrícula (ex.: PR-XYZ) ou o código ICAO24.', 'aviao');
    }

    return aviao;
}

// Posição ao vivo: não pode derrubar o rastreamento se falhar.
async function buscarPosicaoAoVivo(icao24, callsignDoVoo) {
    try {
        const dados = await buscarJson(`${OPENSKY}?icao24=${encodeURIComponent(icao24.toLowerCase())}`);
        const estado = dados && dados.states && dados.states[0];

        if (!estado || estado[5] == null || estado[6] == null) return null;

        const callsignAoVivo = String(estado[1] || '').trim().toUpperCase();

        return {
            lat: estado[6],
            lon: estado[5],
            altitudeM: estado[7] ?? estado[13] ?? null,
            velocidadeKmh: estado[9] != null ? Math.round(estado[9] * 3.6) : null,
            rumo: estado[10] ?? null,
            noChao: Boolean(estado[8]),
            // true se o avião está de fato operando esse voo agora
            confirmaVoo: callsignAoVivo === callsignDoVoo
        };
    } catch (erro) {
        console.log('Posição ao vivo indisponível:', erro.message);
        return null;
    }
}

async function rastrearVoo(vooBruto, aviaoBruto) {
    const codigoVoo = limpar(vooBruto);
    const codigoAviao = limpar(aviaoBruto);

    if (!/^[A-Z0-9]{3,8}$/.test(codigoVoo)) {
        throw new ErroRastreador(400, 'Digite um código de voo válido (ex.: LAT8084).', 'voo');
    }

    if (!/^[A-Z0-9-]{4,10}$/.test(codigoAviao)) {
        throw new ErroRastreador(400, 'Digite a matrícula (ex.: PR-XYZ) ou o código ICAO24 do avião.', 'aviao');
    }

    // 0) Voo de demonstração (apresentação): tem andamento próprio e não depende do banco
    const demo = simularDemonstracao({ codigoVoo, codigoAviao: limparAviao(codigoAviao) });
    if (demo) {
        if (demo.erroAviao) {
            throw new ErroRastreador(404, 'O código do avião não confere com esse voo. Veja o código no comprovante da compra.', 'aviao');
        }
        return demo;
    }

    // 1) Voos SIMULADOS do BoaTour (os códigos que o cliente recebe no pagamento)
    const local = await RastreioBD.buscarPromessa(codigoVoo);
    if (local.viagem || local.voo) {
        const esperado = limparAviao(local.viagem && local.viagem.codigo_aviao);
        if (esperado && esperado !== limparAviao(codigoAviao)) {
            throw new ErroRastreador(404, 'O código do avião não confere com esse voo. Veja o código no comprovante da compra.', 'aviao');
        }

        const sim = montarSimulacao({ codigoVoo, codigoAviao: limparAviao(codigoAviao), viagem: local.viagem, voo: local.voo });
        if (sim.erro) {
            console.log(`RASTREIO: aeroporto sem coordenadas (${sim.origemTexto} -> ${sim.destinoTexto}). Acrescente em servidor/simulacao-voos.js.`);
            throw new ErroRastreador(422, 'Esse voo existe, mas ainda não temos o mapa de um dos aeroportos da rota.', 'geral');
        }
        return sim;
    }

    // 2) Nada salvo no banco: a rota e o avião são simulados a partir dos próprios códigos
    if (!USAR_API_REAL) {
        return montarSimulacao({ codigoVoo, codigoAviao: limparAviao(codigoAviao), viagem: null, voo: null });
    }

    // 3) (opcional) tenta nos dados de voos reais
    const chave = `${codigoVoo}|${codigoAviao}`;
    const guardado = cache.get(chave);
    if (guardado && Date.now() - guardado.quando < CACHE_MS) return guardado.dados;

    let rota;
    let aviao;

    try {
        // o voo é validado primeiro, para o erro aparecer no campo certo
        rota = await buscarRota(codigoVoo);
        aviao = await buscarAviao(codigoAviao);
    } catch (erro) {
        if (erro instanceof ErroRastreador) throw erro;
        console.log('ERRO AO CONSULTAR API DE VOOS:', erro.message);
        throw new ErroRastreador(502, 'Serviço de voos indisponível no momento. Tente novamente.', 'geral');
    }

    const callsign = (rota.callsign || codigoVoo).toUpperCase();
    const aoVivo = aviao.mode_s ? await buscarPosicaoAoVivo(aviao.mode_s, callsign) : null;

    const dados = {
        voo: {
            codigo: codigoVoo,
            callsign,
            companhia: rota.airline ? rota.airline.name : null
        },
        origem: formatarAeroporto(rota.origin),
        destino: formatarAeroporto(rota.destination),
        aviao: {
            codigo: codigoAviao,
            matricula: aviao.registration || null,
            icao24: aviao.mode_s || null,
            modelo: aviao.type || null,
            fabricante: aviao.manufacturer || null,
            dono: aviao.registered_owner || null
        },
        aoVivo
    };

    cache.set(chave, { quando: Date.now(), dados });
    return dados;
}

module.exports = { rastrearVoo, ErroRastreador };
