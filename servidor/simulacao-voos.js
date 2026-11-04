// simulacao-voos.js - rastreio dos voos SIMULADOS do BoaTour
// Os códigos que o cliente recebe no pagamento (ex.: BT1001, GOL7890) são
// fictícios: não existem em APIs de voos reais. Aqui a rota e a posição do
// avião são calculadas a partir do que está no nosso banco (viagens / voos).
// Esta parte NÃO acessa o banco (fica fácil de testar).

// Se true, voos que não estão na janela de horário (ex.: viagem em 2027)
// mostram o avião "voando" num ciclo de 6 minutos, para a demonstração ficar viva.
// Mude para false para mostrar "Aguardando embarque" / "Voo concluído" de verdade.
const MODO_DEMONSTRACAO = true;
const CICLO_DEMO_MS = 6 * 60 * 1000;

const VELOCIDADE_KMH = 830;
const ALTITUDE_CRUZEIRO_M = 11000;

// IATA -> dados do aeroporto (coordenadas). Se criar um voo com aeroporto novo, acrescente aqui.
const AEROPORTOS = {
    GRU: ['São Paulo - Guarulhos', 'São Paulo', 'Brasil', -23.4356, -46.4731],
    CGH: ['São Paulo - Congonhas', 'São Paulo', 'Brasil', -23.6261, -46.6564],
    VCP: ['Campinas - Viracopos', 'Campinas', 'Brasil', -23.0074, -47.1345],
    GIG: ['Rio de Janeiro - Galeão', 'Rio de Janeiro', 'Brasil', -22.8100, -43.2506],
    SDU: ['Rio de Janeiro - Santos Dumont', 'Rio de Janeiro', 'Brasil', -22.9105, -43.1631],
    FLN: ['Florianópolis', 'Florianópolis', 'Brasil', -27.6703, -48.5525],
    CWB: ['Curitiba', 'Curitiba', 'Brasil', -25.5285, -49.1758],
    POA: ['Porto Alegre', 'Porto Alegre', 'Brasil', -29.9944, -51.1713],
    BSB: ['Brasília', 'Brasília', 'Brasil', -15.8711, -47.9186],
    CNF: ['Belo Horizonte - Confins', 'Belo Horizonte', 'Brasil', -19.6244, -43.9719],
    SSA: ['Salvador', 'Salvador', 'Brasil', -12.9086, -38.3225],
    REC: ['Recife', 'Recife', 'Brasil', -8.1265, -34.9231],
    FOR: ['Fortaleza', 'Fortaleza', 'Brasil', -3.7763, -38.5326],
    MCZ: ['Maceió - Zumbi dos Palmares', 'Maceió', 'Brasil', -9.5108, -35.7917],
    FEN: ['Fernando de Noronha', 'Fernando de Noronha', 'Brasil', -3.8549, -32.4233],
    BPS: ['Porto Seguro', 'Porto Seguro', 'Brasil', -16.4386, -39.0809],
    IGU: ['Foz do Iguaçu - Cataratas', 'Foz do Iguaçu', 'Brasil', -25.5963, -54.4872],
    MAO: ['Manaus', 'Manaus', 'Brasil', -3.0386, -60.0497],
    GRM: ['Gramado (demonstração)', 'Gramado', 'Brasil', -29.3788, -50.8740],
    EZE: ['Buenos Aires - Ezeiza', 'Buenos Aires', 'Argentina', -34.8222, -58.5358],
    SCL: ['Santiago', 'Santiago', 'Chile', -33.3930, -70.7858],
    LIS: ['Lisboa', 'Lisboa', 'Portugal', 38.7742, -9.1342],
    OPO: ['Porto', 'Porto', 'Portugal', 41.2481, -8.6814],
    MAD: ['Madrid', 'Madrid', 'Espanha', 40.4983, -3.5676],
    CDG: ['Paris - Charles de Gaulle', 'Paris', 'França', 49.0097, 2.5479],
    LHR: ['Londres - Heathrow', 'Londres', 'Reino Unido', 51.4700, -0.4543],
    FRA: ['Frankfurt am Main', 'Frankfurt', 'Alemanha', 50.0379, 8.5622],
    FCO: ['Roma - Fiumicino', 'Roma', 'Itália', 41.8003, 12.2389],
    ATH: ['Atenas', 'Atenas', 'Grécia', 37.9364, 23.9445],
    JTR: ['Santorini', 'Santorini', 'Grécia', 36.3992, 25.4793],
    DXB: ['Dubai', 'Dubai', 'Emirados Árabes Unidos', 25.2532, 55.3657],
    MLE: ['Malé - Velana', 'Malé', 'Maldivas', 4.1918, 73.5291],
    DPS: ['Bali - Ngurah Rai', 'Denpasar', 'Indonésia', -8.7482, 115.1672],
    BKK: ['Bangkok - Suvarnabhumi', 'Bangkok', 'Tailândia', 13.6900, 100.7501],
    HND: ['Tóquio - Haneda', 'Tóquio', 'Japão', 35.5494, 139.7798],
    MIA: ['Miami', 'Miami', 'Estados Unidos', 25.7959, -80.2870],
    MCO: ['Orlando International', 'Orlando', 'Estados Unidos', 28.4312, -81.3081],
    ATL: ['Atlanta', 'Atlanta', 'Estados Unidos', 33.6407, -84.4277],
    JFK: ['Nova York - JFK', 'Nova York', 'Estados Unidos', 40.6413, -73.7781],
    CUN: ['Cancún', 'Cancún', 'México', 21.0365, -86.8771]
};

const RAD = Math.PI / 180;

function semAcento(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// "São Paulo (GRU)" -> GRU | "São Paulo" -> GRU (procura pela cidade) | "GRU" -> GRU
function acharAeroporto(texto) {
    const bruto = String(texto || '').trim();
    if (!bruto) return null;

    const entreParenteses = bruto.match(/\(([A-Za-z]{3})\)/);
    const candidato = entreParenteses ? entreParenteses[1].toUpperCase() : (/^[A-Za-z]{3}$/.test(bruto) ? bruto.toUpperCase() : null);
    if (candidato && AEROPORTOS[candidato]) return montarAeroporto(candidato);

    const nome = semAcento(bruto.replace(/\(.*?\)/g, ''));
    for (const [iata, a] of Object.entries(AEROPORTOS)) {
        if (semAcento(a[1]) === nome || semAcento(a[0]) === nome) return montarAeroporto(iata);
    }
    return null;
}

function montarAeroporto(iata) {
    const [nome, cidade, pais, lat, lon] = AEROPORTOS[iata];
    return { nome, cidade, pais, iata, icao: null, lat, lon };
}

function distanciaKm(a, b) {
    const dLat = (b.lat - a.lat) * RAD;
    const dLon = (b.lon - a.lon) * RAD;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Ponto a uma fração f (0..1) do caminho de menor distância entre a e b
function interpolar(a, b, f) {
    const p1 = a.lat * RAD, l1 = a.lon * RAD, p2 = b.lat * RAD, l2 = b.lon * RAD;
    const v1 = [Math.cos(p1) * Math.cos(l1), Math.cos(p1) * Math.sin(l1), Math.sin(p1)];
    const v2 = [Math.cos(p2) * Math.cos(l2), Math.cos(p2) * Math.sin(l2), Math.sin(p2)];
    const dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
    const omega = Math.acos(dot);
    if (omega < 1e-9) return { lat: a.lat, lon: a.lon };

    const k1 = Math.sin((1 - f) * omega) / Math.sin(omega);
    const k2 = Math.sin(f * omega) / Math.sin(omega);
    const x = k1 * v1[0] + k2 * v2[0];
    const y = k1 * v1[1] + k2 * v2[1];
    const z = k1 * v1[2] + k2 * v2[2];
    return { lat: Math.atan2(z, Math.hypot(x, y)) / RAD, lon: Math.atan2(y, x) / RAD };
}

function rumoEntre(a, b) {
    const p1 = a.lat * RAD, p2 = b.lat * RAD, dl = (b.lon - a.lon) * RAD;
    const y = Math.sin(dl) * Math.cos(p2);
    const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return (Math.atan2(y, x) / RAD + 360) % 360;
}

function limparAviao(codigo) {
    return String(codigo || '').toUpperCase().replace(/[\s-]/g, '');
}

function hash(texto) {
    let h = 2166136261;
    for (const c of String(texto)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    return h;
}

// Modelo "plausível" e sempre o mesmo para o mesmo código de avião
function dadosDoAviao(codigoAviao, companhia, km) {
    const curtos = [['Airbus', 'A320neo'], ['Boeing', '737-800'], ['Embraer', 'E195-E2']];
    const longos = [['Boeing', '787-9 Dreamliner'], ['Airbus', 'A350-900'], ['Boeing', '777-300ER']];
    const lista = km > 5500 ? longos : curtos;
    const [fabricante, modelo] = lista[hash(codigoAviao) % lista.length];
    const icao24 = hash('icao' + codigoAviao).toString(16).toUpperCase().padStart(8, '0').slice(0, 6);
    return { codigo: codigoAviao, matricula: codigoAviao, icao24, modelo, fabricante, dono: companhia || null };
}

function dataHora(data, hora) {
    // data 'YYYY-MM-DD' (ou Date), hora 'HH:MM[:SS]'; horário de Brasília (UTC-3)
    const d = data instanceof Date ? data.toISOString().slice(0, 10) : String(data).slice(0, 10);
    const h = String(hora || '08:00').slice(0, 5);
    const t = new Date(`${d}T${h}:00-03:00`);
    return Number.isNaN(t.getTime()) ? null : t;
}

function dataBR(t) {
    return t.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

// Sem nada salvo no banco, a rota nasce do próprio código: o mesmo código dá sempre a mesma rota.
const ORIGENS_BR = ['GRU', 'GIG', 'FLN', 'CWB', 'BSB', 'SSA', 'REC', 'POA', 'CNF', 'VCP'];

function rotaDoCodigo(codigoVoo) {
    const todos = Object.keys(AEROPORTOS);
    const origem = ORIGENS_BR[hash('origem' + codigoVoo) % ORIGENS_BR.length];
    const possiveis = todos.filter(i => i !== origem);
    const destino = possiveis[hash('destino' + codigoVoo) % possiveis.length];
    return [montarAeroporto(origem), montarAeroporto(destino)];
}

const COMPANHIAS = {
    LA: 'LATAM Airlines', LAT: 'LATAM Airlines', LTM: 'LATAM Airlines',
    G3: 'GOL Linhas Aéreas', GLO: 'GOL Linhas Aéreas', GOL: 'GOL Linhas Aéreas',
    AD: 'Azul Linhas Aéreas', AZU: 'Azul Linhas Aéreas', AZ: 'Azul Linhas Aéreas',
    TP: 'TAP Air Portugal', TAP: 'TAP Air Portugal', AF: 'Air France', EK: 'Emirates',
    AA: 'American Airlines', DL: 'Delta Air Lines', QR: 'Qatar Airways'
};

function companhiaDoCodigo(codigoVoo) {
    const letras = (String(codigoVoo).match(/^[A-Z0-9]*?(?=\d)/) || [''])[0];
    return COMPANHIAS[letras] || COMPANHIAS[letras.slice(0, 2)] || 'BoaTour Viagens (simulação)';
}


// =====================================================================
// VOO DE DEMONSTRAÇÃO (para a apresentação)
// Decola no momento em que alguém o rastreia e cruza o mapa em DURACAO_DEMO_MS
// (tempo acelerado). Os horários mostrados são os do voo, em horário de Brasília.
// >>> TROQUE 'voo' e 'aviao' pelos códigos que aparecem no pagamento dessa viagem. <<<
// Se 'aviao' for null, aceita qualquer código de avião (e mostra o que foi digitado).
// =====================================================================
const DURACAO_DEMO_MS = 4 * 60 * 1000;   // 4 minutos para ir da origem ao destino
const PAUSA_APOS_POUSO_MS = 45 * 1000;   // fica "pousado" 45 s e o voo pode ser refeito

const VOOS_DEMONSTRACAO = [
    {
        voo: 'BT1001',
        aviao: null,                     // ex.: 'PR-XBT'
        companhia: 'LATAM Airlines',
        origem: 'GRU',
        destino: 'FEN',
        saida: '08:30',
        chegada: '12:10',
        modelo: ['Airbus', 'A320neo']
    }
];

const inicioDemo = new Map();            // código do voo -> instante em que "decolou"

function faseDoVoo(f) {
    if (f < 0.04) return 'decolagem';
    if (f < 0.12) return 'subida';
    if (f < 0.88) return 'cruzeiro';
    if (f < 0.97) return 'descida';
    return 'aproximacao';
}

const TEXTO_FASE = {
    embarque: 'Aguardando embarque',
    decolagem: 'Decolando',
    subida: 'Em subida',
    cruzeiro: 'Em cruzeiro',
    descida: 'Em descida',
    aproximacao: 'Em aproximação final',
    pousou: 'Pousou'
};

function minutosParaHora(min) {
    const m = ((Math.round(min) % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

function horaParaMinutos(hora) {
    const [h, m] = String(hora).split(':').map(Number);
    return h * 60 + m;
}

function acharDemonstracao(codigoVoo) {
    return VOOS_DEMONSTRACAO.find(d => d.voo === String(codigoVoo).toUpperCase()) || null;
}

// codigoAviao já limpo (sem hífen). Devolve null se o código não for um voo de demonstração.
function simularDemonstracao({ codigoVoo, codigoAviao, agora = new Date() }) {
    const d = acharDemonstracao(codigoVoo);
    if (!d) return null;

    const esperado = d.aviao ? limparAviao(d.aviao) : null;
    if (esperado && esperado !== codigoAviao) return { erroAviao: true };

    const origem = montarAeroporto(d.origem);
    const destino = montarAeroporto(d.destino);
    const km = distanciaKm(origem, destino);

    let inicio = inicioDemo.get(d.voo);
    const duracaoTotal = DURACAO_DEMO_MS + PAUSA_APOS_POUSO_MS;
    if (inicio === undefined || agora.getTime() - inicio >= duracaoTotal) {
        inicio = agora.getTime();            // nova decolagem
        inicioDemo.set(d.voo, inicio);
    }

    const decorrido = agora.getTime() - inicio;
    const f = Math.max(0, Math.min(1, decorrido / DURACAO_DEMO_MS));
    const pousou = f >= 1;

    const pos = interpolar(origem, destino, f);
    const rumo = rumoEntre(interpolar(origem, destino, Math.max(0, Math.min(0.99, f))), interpolar(origem, destino, Math.min(1, Math.max(0, f) + 0.01)));
    const rampa = pousou ? 0 : Math.max(0.05, Math.min(1, Math.min(f, 1 - f) / 0.1));

    const minSaida = horaParaMinutos(d.saida);
    let minChegada = horaParaMinutos(d.chegada);
    if (minChegada <= minSaida) minChegada += 1440;
    const minAgora = minSaida + f * (minChegada - minSaida);
    const restante = Math.max(0, Math.round((1 - f) * (minChegada - minSaida)));

    const fase = pousou ? 'pousou' : faseDoVoo(f);
    const pct = Math.round(f * 100);
    const [fabricante, modelo] = d.modelo;

    return {
        simulado: true,
        demonstracao: true,
        fase,
        progresso: pct,
        statusTexto: pousou ? `Pousou em ${destino.cidade}` : `${TEXTO_FASE[fase]} · ${pct}% do trajeto`,
        horarios: { saida: d.saida, chegada: d.chegada, agora: minutosParaHora(minAgora), restanteMin: restante },
        voo: { codigo: d.voo, callsign: d.voo, companhia: d.companhia },
        origem,
        destino,
        aviao: {
            codigo: codigoAviao,
            matricula: d.aviao || codigoAviao,
            icao24: hash('icao' + (d.aviao || codigoAviao)).toString(16).toUpperCase().padStart(8, '0').slice(0, 6),
            modelo, fabricante, dono: d.companhia
        },
        distanciaKm: Math.round(km),
        aoVivo: {
            lat: pos.lat,
            lon: pos.lon,
            altitudeM: pousou ? 0 : Math.round(ALTITUDE_CRUZEIRO_M * rampa),
            velocidadeKmh: pousou ? 0 : Math.round(250 + (VELOCIDADE_KMH - 250) * rampa),
            rumo: Math.round(rumo),
            noChao: pousou,
            confirmaVoo: true
        }
    };
}

// viagem = linha da tabela viagens (ou null); voo = linha da tabela voos (ou null)
function montarSimulacao({ codigoVoo, codigoAviao, viagem, voo, agora = new Date() }) {
    let origem = acharAeroporto(viagem && viagem.origem) || acharAeroporto(voo && voo.origem);
    let destino = acharAeroporto(viagem && viagem.destino) || acharAeroporto(voo && voo.destino);
    if (!viagem && !voo) [origem, destino] = rotaDoCodigo(codigoVoo);
    if (!origem || !destino) return { erro: 'aeroporto_desconhecido', origemTexto: (viagem && viagem.origem) || (voo && voo.origem), destinoTexto: (viagem && viagem.destino) || (voo && voo.destino) };

    const km = distanciaKm(origem, destino);
    const dataSaida = (viagem && viagem.data_ida) || (voo && voo.data_saida);
    const saida = dataSaida ? dataHora(dataSaida, voo && voo.horario_saida) : null;

    let chegada = null;
    if (saida && voo && voo.horario_chegada) {
        chegada = dataHora(dataSaida, voo.horario_chegada);
        if (chegada && chegada <= saida) chegada = new Date(chegada.getTime() + 24 * 3600 * 1000);
    }
    if (saida && !chegada) chegada = new Date(saida.getTime() + (km / VELOCIDADE_KMH + 0.5) * 3600 * 1000);

    let fase;      // 'antes' | 'voando' | 'depois'
    let f;         // fração do trajeto
    let demo = false;
    if (saida && agora < saida) { fase = 'antes'; f = 0; }
    else if (saida && agora > chegada) { fase = 'depois'; f = 1; }
    else if (saida) { fase = 'voando'; f = (agora - saida) / (chegada - saida); }
    else { fase = 'antes'; f = 0; }

    if ((MODO_DEMONSTRACAO || !saida) && fase !== 'voando') {
        fase = 'voando';
        demo = true;
        f = 0.05 + 0.9 * (((agora.getTime() + hash('ciclo' + codigoVoo)) % CICLO_DEMO_MS) / CICLO_DEMO_MS);
    }

    f = Math.max(0, Math.min(1, f));
    const pos = interpolar(origem, destino, f);
    const frente = interpolar(origem, destino, Math.min(1, f + 0.01));
    const rumo = f >= 1 ? rumoEntre(interpolar(origem, destino, 0.99), destino) : rumoEntre(pos, frente);
    const noChao = fase !== 'voando';
    const rampa = Math.max(0, Math.min(1, Math.min(f, 1 - f) / 0.1));
    const pct = Math.round(f * 100);

    let statusTexto;
    if (fase === 'antes') statusTexto = saida ? `Aguardando embarque · decolagem prevista ${dataBR(saida)}` : 'Aguardando embarque';
    else if (fase === 'depois') statusTexto = 'Voo concluído (simulação)';
    else statusTexto = demo ? `Em voo (simulação) · ${pct}% do trajeto` : `Em voo · ${pct}% do trajeto`;

    const companhia = (voo && voo.companhia_aerea) || companhiaDoCodigo(String(codigoVoo));
    const codigo = String(codigoVoo);

    return {
        simulado: true,
        fase: noChao ? (f >= 1 ? 'pousou' : 'embarque') : faseDoVoo(f),
        progresso: pct,
        statusTexto,
        voo: { codigo, callsign: codigo, companhia },
        origem,
        destino,
        aviao: dadosDoAviao(codigoAviao, companhia, km),
        aoVivo: {
            lat: pos.lat,
            lon: pos.lon,
            altitudeM: noChao ? 0 : Math.round(ALTITUDE_CRUZEIRO_M * rampa),
            velocidadeKmh: noChao ? 0 : Math.round(300 + (VELOCIDADE_KMH - 300) * rampa),
            rumo: Math.round(rumo),
            noChao,
            confirmaVoo: true
        }
    };
}

module.exports = { simularDemonstracao, VOOS_DEMONSTRACAO, montarSimulacao, acharAeroporto, distanciaKm, interpolar, limparAviao, AEROPORTOS, MODO_DEMONSTRACAO };
