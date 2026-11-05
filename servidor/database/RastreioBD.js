// RastreioBD.js - procura voos simulados nas tabelas atuais e legadas.
const mysql = require('mysql');

class RastreioBD {
    static connect() {
        return mysql.createConnection({
            host: 'localhost', user: 'root', password: '',
            database: 'boatour_bd', charset: 'utf8mb4',
            dateStrings: ['DATE']
        });
    }

    // Devolve { viagem, voo } (cada um pode ser null). Nunca derruba o rastreador:
    // se o banco/tabela não existir, devolve vazio e o rastreador tenta a API real.
    static buscar(codigoVoo, codigoAviao, callback) {
        const c = RastreioBD.connect();
        const fim = (r) => { c.destroy(); callback(r); };

        // O SQL oficial salva compras em boatour_viagens_simuladas. A tabela
        // viagens só existe em backups antigos, como o SQL legado recebido.
        c.query(`SELECT * FROM boatour_viagens_simuladas WHERE UPPER(codigo_voo) = ?
            ORDER BY (REPLACE(UPPER(codigo_aviao), '-', '') = ?) DESC, data_ida DESC LIMIT 1`, [codigoVoo, codigoAviao], (novoErro, viagensNovas) => {
            if (novoErro) console.log('Rastreio: tabela boatour_viagens_simuladas indisponível:', novoErro.code || novoErro.message);

            const buscarTabelaLegada = callback => c.query(
                `SELECT * FROM viagens WHERE UPPER(codigo_voo) = ?
                    ORDER BY (REPLACE(UPPER(codigo_aviao), '-', '') = ?) DESC, data_ida DESC LIMIT 1`,
                [codigoVoo, codigoAviao],
                (legadoErro, viagensLegadas) => {
                    if (legadoErro) console.log('Rastreio: tabela viagens indisponível:', legadoErro.code || legadoErro.message);
                    callback((viagensLegadas && viagensLegadas[0]) || null);
                }
            );

            const buscarVoo = viagem => c.query(
                'SELECT * FROM voos WHERE UPPER(numero_voo) = ? ORDER BY data_saida DESC LIMIT 1',
                [codigoVoo],
                (erroVoo, voos) => {
                    if (erroVoo) console.log('Rastreio: tabela voos indisponível:', erroVoo.code || erroVoo.message);
                    fim({ viagem, voo: (voos && voos[0]) || null });
                }
            );

            const viagemNova = (viagensNovas && viagensNovas[0]) || null;
            if (viagemNova) return buscarVoo(viagemNova);
            buscarTabelaLegada(viagemLegada => buscarVoo(viagemLegada));
        });
    }

    static buscarPromessa(codigoVoo, codigoAviao) {
        return new Promise(resolve => {
            try {
                RastreioBD.buscar(codigoVoo, codigoAviao, resolve);
            } catch (erro) {
                console.log('Rastreio: falha ao consultar o banco:', erro.message);
                resolve({ viagem: null, voo: null });
            }
        });
    }
}

module.exports = RastreioBD;
