const mysql = require('mysql')

class DestinoBD {

    static connect() {

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'boatour_bd'
        })

        connection.connect()

        return connection
    }


    // ==========================================
    // BUSCA TODOS OS DESTINOS + CATEGORIAS
    // ==========================================

    static getDestinos(callback) {

        const connection = DestinoBD.connect()

        var sql = `
            SELECT
            destinos.*,
            GROUP_CONCAT(
            categorias_destino.nome
            ORDER BY categorias_destino.nome
            SEPARATOR ','
        ) AS categorias
FROM destinos

LEFT JOIN destino_categorias
    ON destinos.id_destino = destino_categorias.id_destino

LEFT JOIN categorias_destino
    ON destino_categorias.id_categoria = categorias_destino.id_categoria

GROUP BY destinos.id_destino
        `

        connection.query(sql, function(error, results) {

            if (error) {

                console.log('ERRO AO BUSCAR DESTINOS:', error)

                connection.end()

                return
            }

            // Transforma a string "Praia,Natureza,Turismo"
            // em um array ["Praia", "Natureza", "Turismo"]

            results.forEach(function(destino) {

                if (destino.categorias) {

                    destino.categorias = destino.categorias.split(',')

                } else {

                    destino.categorias = []

                }

            })

            callback(results)

            connection.end()
        })
    }


    // ==========================================
    // BUSCA SOMENTE AS PRAIAS POPULARES
    // ==========================================

    static getPraiasPopulares(callback) {

        const connection = DestinoBD.connect()

        var sql = `
            SELECT
                d.*,
                GROUP_CONCAT(
                    c.nome
                    ORDER BY c.nome
                    SEPARATOR ','
                ) AS categorias
            FROM destinos d

            LEFT JOIN destino_categorias dc
                ON d.id_destino = dc.id_destino

            LEFT JOIN categorias_destino c
                ON dc.id_categoria = c.id_categoria

            WHERE d.praia_popular = 1

            GROUP BY d.id_destino
        `

        connection.query(sql, function(error, results) {

            if (error) {

                console.log(
                    'ERRO AO BUSCAR PRAIAS POPULARES:',
                    error
                )

                connection.end()

                return
            }

            results.forEach(function(destino) {

                if (destino.categorias) {

                    destino.categorias = destino.categorias.split(',')

                } else {

                    destino.categorias = []

                }

            })

            callback(results)

            connection.end()
        })
    }


    // ==========================================
    // BUSCA UM DESTINO PELO ID
    // ==========================================

    static getDestinoById(id, callback) {

        const connection = DestinoBD.connect()

        var sql = `
            SELECT
                d.*,
                GROUP_CONCAT(
                    c.nome
                    ORDER BY c.nome
                    SEPARATOR ','
                ) AS categorias
            FROM destinos d

            LEFT JOIN destino_categorias dc
                ON d.id_destino = dc.id_destino

            LEFT JOIN categorias_destino c
                ON dc.id_categoria = c.id_categoria

            WHERE d.id_destino = ?

            GROUP BY d.id_destino
        `

        connection.query(sql, id, function(error, results) {

            if (error) {

                console.log('ERRO AO BUSCAR DESTINO:', error)

                connection.end()

                return
            }

            if (results.length == 0) {

                console.log('Destino não encontrado.')

                connection.end()

                return
            }

            var destino = results[0]

            if (destino.categorias) {

                destino.categorias = destino.categorias.split(',')

            } else {

                destino.categorias = []

            }

            callback(destino)

            connection.end()
        })
    }
}

module.exports = DestinoBD