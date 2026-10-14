const mysql = require('mysql');

class AtividadesBD {

    static connect() {

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'boatour_bd'
        });

        return connection;
    }

    static getAtividades(callback) {

        const connection = AtividadesBD.connect();

        const sql = `
            SELECT
                a.*,
                d.nome AS nome_destino,
                d.cidade AS cidade_destino,
                d.pais AS pais_destino

            FROM atividades a

            LEFT JOIN destinos d
                ON a.id_destino = d.id_destino

            WHERE a.ativo = 1

            ORDER BY a.id_atividade ASC
        `;

        connection.query(sql, function(erro, resultados) {

            connection.end();

            if (erro) {
                console.error(
                    'ERRO AO BUSCAR ATIVIDADES:',
                    erro
                );

                return callback(erro, null);
            }

            callback(null, resultados);
        });
    }


    // --- BUSCAR UMA ATIVIDADE PELO ID ---

    static getAtividadeById(id, callback) {

        const connection = AtividadesBD.connect();

        const sql = `
            SELECT
                a.*,
                d.nome AS nome_destino,
                d.cidade AS cidade_destino,
                d.pais AS pais_destino

            FROM atividades a

            LEFT JOIN destinos d
                ON a.id_destino = d.id_destino

            WHERE a.id_atividade = ?
              AND a.ativo = 1

            LIMIT 1
        `;

        connection.query(sql, [id], function(erro, resultados) {

            connection.end();

            if (erro) {
                console.error(
                    'ERRO AO BUSCAR ATIVIDADE:',
                    erro
                );

                return callback(erro, null);
            }

            if (resultados.length === 0) {
                return callback(null, null);
            }

            callback(null, resultados[0]);
        });
    }

}

module.exports = AtividadesBD;