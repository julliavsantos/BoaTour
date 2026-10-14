const mysql = require('mysql');

class AeroportosBD {

    static connect() {

        const connection = mysql.createConnection({

            host: 'localhost',
            user: 'root',
            password: '',
            database: 'boatour_bd'

        });

        connection.connect();

        return connection;
    }


    // BUSCA TODOS OS AEROPORTOS
    static getAeroportos(callback) {

        const connection = AeroportosBD.connect();

        var sql = `
            SELECT
                id_aeroporto,
                nome,
                cidade,
                pais,
                codigo_iata
            FROM aeroportos
            ORDER BY nome
        `;

        connection.query(sql, function(error, results) {

            if (error) {

                console.log(
                    'ERRO AO BUSCAR AEROPORTOS:',
                    error
                );

                connection.end();

                return callback(error, null);
            }

            callback(null, results);

            connection.end();

        });
    }
}

module.exports = AeroportosBD;
