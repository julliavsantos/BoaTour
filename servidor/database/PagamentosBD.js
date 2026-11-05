const mysql = require('mysql');
const crypto = require('crypto');

const criarConexao = () => mysql.createConnection({
    host: 'localhost', user: 'root', password: '', database: 'boatour_bd', charset: 'utf8mb4'
});
const query = (conexao, sql, valores = []) => new Promise((resolve, reject) => {
    conexao.query(sql, valores, (erro, resultado) => erro ? reject(erro) : resolve(resultado));
});
let inicializacao;

function percentualCupomOds8(valorCompra) {
    const valor = Number(valorCompra) || 0;
    if (valor <= 500) return 5;
    if (valor <= 1000) return 10;
    return 15;
}
const percentualCashbackOds12 = () => 5;
const regraCupomOds8 = '5% até R$ 500 · 10% até R$ 1.000 · 15% acima de R$ 1.000';
const dinheiro = valor => Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
const possuiTagOds = (valor, numero) => {
    const valores = Array.isArray(valor) ? valor : [valor];
    return valores.some(tag => String(tag ?? '').match(/\d+/)?.[0] === String(numero));
};
const marcado = valor => valor === true || Number(valor) === 1 || String(valor).toLowerCase() === 'true';
function pedidoTemOds(pedido, numero) {
    return possuiTagOds(pedido?.ods, numero) || (Array.isArray(pedido?.itens) && pedido.itens.some(item =>
        possuiTagOds(item?.ods, numero) || marcado(item?.[`ods${numero}`])));
}
const jsonSeguro = valor => {
    try { return typeof valor === 'string' ? JSON.parse(valor || 'null') : valor; }
    catch { return null; }
};

async function inicializar() {
    if (!inicializacao) inicializacao = new Promise((resolve, reject) => {
        const conexao = criarConexao();
        conexao.connect(async erro => {
            if (erro) { conexao.destroy(); return reject(erro); }
            try {
                await query(conexao, `CREATE TABLE IF NOT EXISTS boatour_pagamentos_simulados (
                    id_pagamento VARCHAR(80) NOT NULL PRIMARY KEY,
                    id_usuario INT NOT NULL,
                    tipo VARCHAR(32) NOT NULL DEFAULT 'compra',
                    descricao VARCHAR(255) NOT NULL,
                    valor DECIMAL(12,2) NOT NULL,
                    metodo VARCHAR(20) NOT NULL,
                    parcelas INT NOT NULL DEFAULT 1,
                    cartao_final VARCHAR(4) NULL,
                    status VARCHAR(24) NOT NULL,
                    motivo TEXT NULL,
                    cupom_codigo VARCHAR(64) NULL,
                    dados_pedido LONGTEXT NULL,
                    criado_em DATETIME NOT NULL,
                    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    KEY idx_pagamentos_usuario_data (id_usuario, criado_em)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
                await query(conexao, `CREATE TABLE IF NOT EXISTS boatour_viagens_simuladas (
                    id_viagem VARCHAR(80) NOT NULL PRIMARY KEY,
                    id_pagamento VARCHAR(80) NOT NULL,
                    id_usuario INT NOT NULL,
                    titulo VARCHAR(255) NOT NULL,
                    imagem TEXT NULL,
                    origem VARCHAR(160) NULL,
                    destino VARCHAR(160) NULL,
                    data_ida VARCHAR(32) NULL,
                    data_volta VARCHAR(32) NULL,
                    codigo_voo VARCHAR(24) NULL,
                    codigo_aviao VARCHAR(24) NULL,
                    status VARCHAR(40) NOT NULL,
                    dados_viagem LONGTEXT NULL,
                    criado_em DATETIME NOT NULL,
                    UNIQUE KEY uq_viagem_pagamento (id_pagamento),
                    KEY idx_viagens_usuario_data (id_usuario, criado_em)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
                await query(conexao, `CREATE TABLE IF NOT EXISTS boatour_cupons (
                    id_cupom BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    codigo VARCHAR(64) NOT NULL UNIQUE,
                    id_usuario INT NOT NULL,
                    id_pagamento_origem VARCHAR(80) NOT NULL,
                    chave_item VARCHAR(120) NOT NULL,
                    ods TINYINT NOT NULL,
                    desconto_percentual DECIMAL(7,3) NULL,
                    status VARCHAR(24) NOT NULL DEFAULT 'ativo',
                    id_pagamento_uso VARCHAR(80) NULL,
                    criado_em DATETIME NOT NULL,
                    UNIQUE KEY uq_cupom_item_ods (id_pagamento_origem, chave_item, ods),
                    KEY idx_cupons_usuario_status (id_usuario, status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
                await query(conexao, `CREATE TABLE IF NOT EXISTS boatour_saldo_movimentos (
                    id_movimento BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    id_usuario INT NOT NULL,
                    referencia VARCHAR(120) NOT NULL UNIQUE,
                    id_pagamento VARCHAR(80) NOT NULL,
                    tipo VARCHAR(32) NOT NULL,
                    valor DECIMAL(12,2) NOT NULL,
                    descricao VARCHAR(255) NOT NULL,
                    criado_em DATETIME NOT NULL,
                    KEY idx_saldo_usuario_data (id_usuario, criado_em)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);

                // Recupera recompensas ODS 12 de compras aprovadas antes desta regra ser corrigida.
                const comprasAprovadas = await query(conexao, `SELECT id_pagamento, id_usuario, valor, dados_pedido, criado_em
                    FROM boatour_pagamentos_simulados WHERE status = 'aprovado' AND tipo <> 'recarga'`);
                for (const compra of comprasAprovadas) {
                    const pedidoSalvo = jsonSeguro(compra.dados_pedido) || {};
                    if (!pedidoTemOds(pedidoSalvo, 12)) continue;
                    const base = dinheiro(pedidoSalvo.valor ?? compra.valor);
                    const credito = dinheiro(base * 0.05);
                    if (credito <= 0) continue;
                    await query(conexao, `INSERT IGNORE INTO boatour_saldo_movimentos
                        (id_usuario, referencia, id_pagamento, tipo, valor, descricao, criado_em)
                        VALUES (?, ?, ?, 'cashback_ods12', ?, 'Crédito de ajuste ODS 12 · 5%', ?)`
                    , [compra.id_usuario, `${compra.id_pagamento}:ods12-cashback`, compra.id_pagamento, credito, compra.criado_em]);
                }

                // Define o percentual nos cupons antigos que foram emitidos sem gravar sua faixa.
                const cuponsSemFaixa = await query(conexao, `SELECT c.id_cupom, p.valor, p.dados_pedido
                    FROM boatour_cupons c LEFT JOIN boatour_pagamentos_simulados p ON p.id_pagamento = c.id_pagamento_origem
                    WHERE c.ods = 8 AND c.desconto_percentual IS NULL`);
                for (const cupom of cuponsSemFaixa) {
                    const pedidoSalvo = jsonSeguro(cupom.dados_pedido) || {};
                    const percentual = percentualCupomOds8(pedidoSalvo.valor ?? cupom.valor);
                    await query(conexao, 'UPDATE boatour_cupons SET desconto_percentual = ? WHERE id_cupom = ? AND desconto_percentual IS NULL',
                        [percentual, cupom.id_cupom]);
                }
                conexao.end(fim => fim ? reject(fim) : resolve());
            } catch (erroCriacao) {
                conexao.end(() => reject(erroCriacao));
            }
        });
    });
    try { return await inicializacao; }
    catch (erro) { inicializacao = null; throw erro; }
}

async function historico(idUsuario) {
    await inicializar();
    const conexao = criarConexao();
    await new Promise((resolve, reject) => conexao.connect(erro => erro ? reject(erro) : resolve()));
    try {
        await query(conexao, `UPDATE boatour_pagamentos_simulados SET status = 'cancelada', motivo = ? WHERE id_usuario = ? AND status = 'pendente' AND criado_em <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)`, ['Prazo de pagamento expirado.', idUsuario]);
        await query(conexao, `UPDATE boatour_viagens_simuladas v INNER JOIN boatour_pagamentos_simulados p ON p.id_pagamento = v.id_pagamento SET v.status = 'cancelada' WHERE p.id_usuario = ? AND p.status = 'cancelada' AND p.motivo = ?`, [idUsuario, 'Prazo de pagamento expirado.']);
        const [pagamentos, viagens, cupons, movimentos] = await Promise.all([
            query(conexao, 'SELECT * FROM boatour_pagamentos_simulados WHERE id_usuario = ? ORDER BY criado_em DESC', [idUsuario]),
            query(conexao, 'SELECT * FROM boatour_viagens_simuladas WHERE id_usuario = ? ORDER BY criado_em DESC', [idUsuario]),
            query(conexao, 'SELECT * FROM boatour_cupons WHERE id_usuario = ? ORDER BY criado_em DESC', [idUsuario]),
            query(conexao, 'SELECT * FROM boatour_saldo_movimentos WHERE id_usuario = ? ORDER BY criado_em DESC', [idUsuario])
        ]);
        return {
            pagamentos: pagamentos.map(p => ({ ...p, id: p.id_pagamento, valor: Number(p.valor), cartaoFinal: p.cartao_final, criadoEm: p.criado_em, pedido: jsonSeguro(p.dados_pedido) })),
            viagens: viagens.map(v => ({ ...v, id: v.id_viagem, idPagamento: v.id_pagamento, ida: v.data_ida, volta: v.data_volta, codigoVoo: v.codigo_voo, codigoAviao: v.codigo_aviao, imagem: v.imagem || '', dados: jsonSeguro(v.dados_viagem) })),
            cupons: cupons.map(c => {
                const percentual = c.desconto_percentual == null ? null : Number(c.desconto_percentual);
                return { ...c, id: c.id_cupom, codigo: c.codigo, descontoPercentual: percentual,
                    regraDesconto: percentual ? `${percentual}% de desconto na próxima compra` : regraCupomOds8,
                    descontoConfigurado: true };
            }),
            movimentos: movimentos.map(m => ({ ...m, valor: Number(m.valor), idPagamento: m.id_pagamento })),
            saldo: dinheiro(movimentos.reduce((soma, movimento) => soma + Number(movimento.valor || 0), 0))
        };
    } finally { conexao.end(); }
}

function obterItensOds(pedido) {
    const itens = Array.isArray(pedido?.itens) ? pedido.itens : [];
    return itens.map((item, indice) => {
        const ods = item.ods || [];
        const participantes = Array.isArray(item.participantesIds) ? item.participantesIds.length : 1;
        const unitario = Number(item.valorPorParticipante ?? item.valor) || 0;
        const nome = String(item.nome || `Item ${indice + 1}`);
        return {
            item,
            indice,
            nome,
            chave: String(item.chave || `${item.tipo || 'item'}:${item.id || indice}:${indice}`).slice(0, 120),
            ods8: possuiTagOds(ods, 8) || marcado(item.ods8),
            ods12: possuiTagOds(ods, 12) || marcado(item.ods12),
            valorElegivel: dinheiro(unitario * Math.max(participantes, 1))
        };
    });
}

async function registrar(idUsuario, dados) {
    await inicializar();
    const pagamento = dados?.pagamento || {};
    const viagem = dados?.viagem || null;
    const pedido = dados?.pedido || pagamento.pedido || {};
    const pagamentoId = String(pagamento.id || pagamento.id_pagamento || '').slice(0, 80);
    const valor = dinheiro(pagamento.valor);
    if (!pagamentoId || !(valor > 0) || !['pix', 'cartao', 'boleto'].includes(pagamento.metodo)
        || !['aprovado', 'pendente', 'recusado', 'cancelada'].includes(pagamento.status)) {
        const erro = new Error('Dados de pagamento inválidos.'); erro.statusCode = 400; throw erro;
    }

    const conexao = criarConexao();
    await new Promise((resolve, reject) => conexao.connect(erro => erro ? reject(erro) : resolve()));
    try {
        await query(conexao, 'START TRANSACTION');
        const existente = await query(conexao, 'SELECT * FROM boatour_pagamentos_simulados WHERE id_pagamento = ? FOR UPDATE', [pagamentoId]);
        if (existente.length && Number(existente[0].id_usuario) !== Number(idUsuario)) {
            const erro = new Error('Este pagamento pertence a outra conta.'); erro.statusCode = 403; throw erro;
        }
        const statusAnterior = existente[0]?.status;
        const criadoEmExistente = existente.length ? new Date(existente[0].criado_em) : null;
        const prazoExpirado = statusAnterior === 'pendente' && criadoEmExistente && !Number.isNaN(criadoEmExistente.getTime())
            && Date.now() >= criadoEmExistente.getTime() + 5 * 60 * 1000;
        if (prazoExpirado) {
            pagamento.status = 'cancelada';
            pagamento.motivo = 'Prazo de pagamento expirado.';
        } else if (['aprovado', 'recusado', 'cancelada'].includes(statusAnterior) && pagamento.status !== statusAnterior) {
            const erro = new Error('Este pagamento já foi finalizado e não pode ser alterado.'); erro.statusCode = 409; throw erro;
        }
        const pedidoSalvo = existente.length ? jsonSeguro(existente[0].dados_pedido) : null;
        const pedidoFinal = { ...(pedidoSalvo || {}), ...(pedido || {}) };
        const subtotal = dinheiro(pagamento.subtotal ?? pedidoFinal.valor ?? valor);
        const descontoSaldo = dinheiro(pagamento.descontoSaldo ?? pedidoFinal.descontoSaldo ?? 0);
        if (descontoSaldo < 0 || (pagamento.tipo === 'recarga' && descontoSaldo > 0)) {
            const erro = new Error('Desconto BoaPay inválido.'); erro.statusCode = 400; throw erro;
        }
        pedidoFinal.descontoSaldo = descontoSaldo;
        let descontoCupom = 0;
        const cupomCodigo = String(pagamento.cupomCodigo || existente[0]?.cupom_codigo || '').trim().toUpperCase() || null;
        let cupom = null;
        if (cupomCodigo) {
            const encontrados = await query(conexao, 'SELECT * FROM boatour_cupons WHERE codigo = ? AND id_usuario = ? FOR UPDATE', [cupomCodigo, idUsuario]);
            cupom = encontrados[0] || null;
            const reutilizadoNestePagamento = cupom?.status === 'utilizado' && cupom.id_pagamento_uso === pagamentoId;
            if (!cupom || (!['ativo', 'utilizado'].includes(cupom.status)) || (cupom.status === 'utilizado' && !reutilizadoNestePagamento)) {
                const erro = new Error('Cupom indisponível ou já utilizado.'); erro.statusCode = 409; throw erro;
            }
            if (cupom.ods !== 8) { const erro = new Error('Este cupom não é um cupom de desconto ODS 8.'); erro.statusCode = 400; throw erro; }
            const percentual = Number(cupom.desconto_percentual) || percentualCupomOds8(subtotal);
            const desconto = dinheiro(subtotal * percentual / 100);
            descontoCupom = desconto;
            pagamento.descontoCupom = desconto;
            pagamento.descontoPercentual = percentual;
            pedidoFinal.cupom = { codigo: cupomCodigo, desconto, percentual };
        }
        if (pagamento.tipo !== 'recarga') {
            const baseComDescontos = Math.max(0, subtotal - descontoCupom - descontoSaldo);
            if (descontoSaldo > Math.max(0, subtotal - descontoCupom - 0.01)) {
                const erro = new Error('O desconto BoaPay não pode zerar o valor da compra.'); erro.statusCode = 409; throw erro;
            }
            const parcelas = Math.max(1, Number(pagamento.parcelas) || 1);
            const calculado = dinheiro(baseComDescontos * (parcelas > 3 ? 1 + 0.02 * (parcelas - 3) : 1));
            if (Math.abs(calculado - valor) > 0.02) {
                const erro = new Error('O valor enviado não corresponde aos descontos aplicados. Atualize o resumo e tente novamente.'); erro.statusCode = 409; throw erro;
            }
            if (descontoSaldo > 0) {
                const referenciaSaldo = pagamentoId + ':saldo';
                const debitoExistente = await query(conexao, 'SELECT id_movimento FROM boatour_saldo_movimentos WHERE referencia = ? FOR UPDATE', [referenciaSaldo]);
                const saldoAtual = await query(conexao, 'SELECT COALESCE(SUM(valor), 0) AS saldo FROM boatour_saldo_movimentos WHERE id_usuario = ?', [idUsuario]);
                if (!debitoExistente.length && Number(saldoAtual[0]?.saldo || 0) < descontoSaldo) {
                    const erro = new Error('Seu saldo BoaPay mudou. Atualize o pagamento e tente novamente.'); erro.statusCode = 409; throw erro;
                }
            }
        }

        const criadoEm = existente.length ? new Date(existente[0].criado_em) : new Date();
        const dataValida = Number.isNaN(criadoEm.getTime()) ? new Date() : criadoEm;
        const dadosPedidoJson = JSON.stringify(pedidoFinal);
        await query(conexao, `INSERT INTO boatour_pagamentos_simulados
            (id_pagamento, id_usuario, tipo, descricao, valor, metodo, parcelas, cartao_final, status, motivo, cupom_codigo, dados_pedido, criado_em)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE descricao = VALUES(descricao), valor = VALUES(valor), metodo = VALUES(metodo), parcelas = VALUES(parcelas), cartao_final = VALUES(cartao_final), status = VALUES(status), motivo = VALUES(motivo), cupom_codigo = VALUES(cupom_codigo), dados_pedido = VALUES(dados_pedido)`,
        [pagamentoId, idUsuario, pagamento.tipo || 'compra', String(pagamento.descricao || 'Pagamento BoaTour').slice(0, 255), valor,
            pagamento.metodo, Math.max(1, Number(pagamento.parcelas) || 1), pagamento.cartaoFinal || null, pagamento.status,
            pagamento.motivo || null, cupomCodigo, dadosPedidoJson, dataValida]);

        if (viagem && pagamento.status !== 'recusado') {
            const viagemId = String(viagem.id || viagem.id_viagem || `VG-${pagamentoId.slice(-24)}`).slice(0, 80);
            const statusViagem = pagamento.status === 'aprovado' ? 'confirmada' : pagamento.status === 'cancelada' ? 'cancelada' : 'aguardando pagamento';
            await query(conexao, `INSERT INTO boatour_viagens_simuladas
                (id_viagem, id_pagamento, id_usuario, titulo, imagem, origem, destino, data_ida, data_volta, codigo_voo, codigo_aviao, status, dados_viagem, criado_em)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), imagem = VALUES(imagem), origem = VALUES(origem), destino = VALUES(destino), data_ida = VALUES(data_ida), data_volta = VALUES(data_volta), codigo_voo = VALUES(codigo_voo), codigo_aviao = VALUES(codigo_aviao), status = VALUES(status), dados_viagem = VALUES(dados_viagem)`,
            [viagemId, pagamentoId, idUsuario, String(viagem.titulo || pedidoFinal.titulo || 'Viagem BoaTour').slice(0, 255), viagem.imagem || pedidoFinal.imagem || null,
                viagem.origem || pedidoFinal.origem || null, viagem.destino || pedidoFinal.destino || null,
                viagem.ida || null, viagem.volta || null, viagem.codigoVoo || null, viagem.codigoAviao || null,
                statusViagem, JSON.stringify({ ...viagem, pedido: pedidoFinal }), dataValida]);
        }

        if (cupomCodigo && pagamento.status === 'aprovado') {
            await query(conexao, 'UPDATE boatour_cupons SET status = ?, id_pagamento_uso = ? WHERE codigo = ? AND id_usuario = ? AND (status = ? OR id_pagamento_uso = ?)',
                ['utilizado', pagamentoId, cupomCodigo, idUsuario, 'ativo', pagamentoId]);
        }

        if (pagamento.status === 'aprovado' && pagamento.tipo === 'recarga') {
            await query(conexao, `INSERT IGNORE INTO boatour_saldo_movimentos
                (id_usuario, referencia, id_pagamento, tipo, valor, descricao, criado_em)
                VALUES (?, ?, ?, 'recarga', ?, ?, ?)`,
            [idUsuario, `${pagamentoId}:recarga`, pagamentoId, valor, 'Recarga BoaPay aprovada', dataValida]);
        }

        if (pagamento.status === 'aprovado' && pagamento.tipo !== 'recarga') {
            const referenciaDebito = pagamentoId + ':saldo';
            if (descontoSaldo > 0) {
                const jaDebitado = await query(conexao, 'SELECT id_movimento FROM boatour_saldo_movimentos WHERE referencia = ? FOR UPDATE', [referenciaDebito]);
                if (!jaDebitado.length) {
                    const totalSaldo = await query(conexao, 'SELECT COALESCE(SUM(valor), 0) AS saldo FROM boatour_saldo_movimentos WHERE id_usuario = ?', [idUsuario]);
                    if (Number(totalSaldo[0]?.saldo || 0) < descontoSaldo) { const erro = new Error('Saldo BoaPay insuficiente para aplicar o desconto.'); erro.statusCode = 409; throw erro; }
                    await query(conexao, 'INSERT INTO boatour_saldo_movimentos (id_usuario, referencia, id_pagamento, tipo, valor, descricao, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [idUsuario, referenciaDebito, pagamentoId, 'uso', -descontoSaldo, ('Desconto BoaPay em ' + (pagamento.descricao || 'compra')).slice(0, 255), dataValida]);
                }
            }

            const itensOds = obterItensOds(pedidoFinal);
            const odsPedido = Array.isArray(pedidoFinal.ods) ? pedidoFinal.ods : [];
            const possuiOdsPedido = possuiTagOds(odsPedido, 8);
            const itensOds8 = itensOds.filter(item => item.ods8);
            if (!itensOds8.length && possuiOdsPedido) itensOds8.push({ chave: 'pedido:ods8' });
            for (const elegivel of itensOds8) {
                const codigo = `ODS8-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
                const percentualOds8 = percentualCupomOds8(pedidoFinal.valor ?? pagamento.subtotal ?? valor);
                await query(conexao, `INSERT IGNORE INTO boatour_cupons
                    (codigo, id_usuario, id_pagamento_origem, chave_item, ods, desconto_percentual, status, criado_em)
                    VALUES (?, ?, ?, ?, 8, ?, 'ativo', ?)`,
                [codigo, idUsuario, pagamentoId, elegivel.chave, percentualOds8, dataValida]);
            }

            const percentualOds12 = percentualCashbackOds12();
            const possuiOds12Pedido = possuiTagOds(odsPedido, 12);
            const cashbackBase = (itensOds.some(item => item.ods12) || possuiOds12Pedido)
                ? dinheiro(pedidoFinal.valor ?? pagamento.subtotal ?? valor)
                : 0;
            const valorCashback = percentualOds12 > 0 ? dinheiro(cashbackBase * percentualOds12 / 100) : 0;
            if (valorCashback > 0) {
                await query(conexao, `INSERT IGNORE INTO boatour_saldo_movimentos
                    (id_usuario, referencia, id_pagamento, tipo, valor, descricao, criado_em)
                    VALUES (?, ?, ?, 'cashback_ods12', ?, ?, ?)`,
                [idUsuario, `${pagamentoId}:ods12-cashback`, pagamentoId, valorCashback, `Cashback ODS 12 · ${percentualOds12}%`, dataValida]);
            }
        }

        await query(conexao, 'COMMIT');
        return { ok: true, saldo: await saldoUsuario(conexao, idUsuario) };
    } catch (erro) {
        try { await query(conexao, 'ROLLBACK'); } catch {}
        throw erro;
    } finally { conexao.end(); }
}

async function expirarPendentes() {
    await inicializar();
    const conexao = criarConexao();
    await new Promise((resolve, reject) => conexao.connect(erro => erro ? reject(erro) : resolve()));
    try {
        await query(conexao, "UPDATE boatour_pagamentos_simulados SET status = 'cancelada', motivo = ? WHERE status = 'pendente' AND criado_em <= DATE_SUB(NOW(), INTERVAL 5 MINUTE)", ['Prazo de pagamento expirado.']);
        await query(conexao, "UPDATE boatour_viagens_simuladas v INNER JOIN boatour_pagamentos_simulados p ON p.id_pagamento = v.id_pagamento SET v.status = 'cancelada' WHERE p.status = 'cancelada' AND p.motivo = ?", ['Prazo de pagamento expirado.']);
    } finally {
        conexao.end();
    }
}
async function saldoUsuario(conexao, idUsuario) {
    const linhas = await query(conexao, 'SELECT COALESCE(SUM(valor), 0) AS saldo FROM boatour_saldo_movimentos WHERE id_usuario = ?', [idUsuario]);
    return Number(linhas[0]?.saldo || 0);
}

async function validarCupom(idUsuario, codigo, subtotal) {
    await inicializar();
    const conexao = criarConexao();
    await new Promise((resolve, reject) => conexao.connect(erro => erro ? reject(erro) : resolve()));
    try {
        const linhas = await query(conexao, 'SELECT * FROM boatour_cupons WHERE codigo = ? AND id_usuario = ? AND status = ? LIMIT 1',
            [String(codigo || '').trim().toUpperCase(), idUsuario, 'ativo']);
        const cupom = linhas[0];
        if (!cupom) { const erro = new Error('Cupom não encontrado, já utilizado ou indisponível.'); erro.statusCode = 404; throw erro; }
        if (cupom.ods !== 8) { const erro = new Error('Este código não é um cupom de desconto ODS 8.'); erro.statusCode = 400; throw erro; }
        const base = dinheiro(subtotal);
        const percentual = Number(cupom.desconto_percentual) || percentualCupomOds8(base);
        return { codigo: cupom.codigo, ods: 8, percentual, desconto: dinheiro(base * percentual / 100), subtotal: base };
    } finally { conexao.end(); }
}

module.exports = { inicializar, historico, registrar, validarCupom, expirarPendentes, percentualCupomOds8, percentualCashbackOds12 };
