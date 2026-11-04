// RastreioBD.js - procura o voo SIMULADO no banco (tabelas viagens e voos)
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
    static buscar(codigoVoo, callback) {
        const c = RastreioBD.connect();
        const fim = (r) => { c.destroy(); callback(r); };

        c.query('SELECT * FROM viagens WHERE UPPER(codigo_voo) = ? ORDER BY data_ida DESC LIMIT 1', [codigoVoo], (e1, viagens) => {
            if (e1) console.log('Rastreio: tabela viagens indisponível:', e1.code || e1.message);
            c.query('SELECT * FROM voos WHERE UPPER(numero_voo) = ? ORDER BY data_saida DESC LIMIT 1', [codigoVoo], (e2, voos) => {
                if (e2) console.log('Rastreio: tabela voos indisponível:', e2.code || e2.message);
                fim({ viagem: (viagens && viagens[0]) || null, voo: (voos && voos[0]) || null });
            });
        });
    }

    static buscarPromessa(codigoVoo) {
        return new Promise(resolve => {
            try {
                RastreioBD.buscar(codigoVoo, resolve);
            } catch (erro) {
                console.log('Rastreio: falha ao consultar o banco:', erro.message);
                resolve({ viagem: null, voo: null });
            }
        });
    }
}

module.exports = RastreioBD;
