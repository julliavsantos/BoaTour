const mysql = require('mysql')

class OfertaBD {

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


    // BUSCA TODAS AS OFERTAS

    static getOfertas(callback) {

        const connection = OfertaBD.connect()

        var sql = 'SELECT * FROM ofertas'

        connection.query(sql, function(error, results) {

            if (error) {

                console.log(
                    'ERRO AO BUSCAR OFERTAS:',
                    error
                )

                connection.end()

                return
            }

            callback(results)

            connection.end()

        })

    }


    // BUSCA SOMENTE AS OFERTAS EM DESTAQUE

    static getOfertasDestaque(callback) {

        const connection = OfertaBD.connect()

        var sql = `
            SELECT * FROM ofertas
            WHERE destaque = 1
        `

        connection.query(sql, function(error, results) {

            if (error) {

                console.log(
                    'ERRO AO BUSCAR OFERTAS EM DESTAQUE:',
                    error
                )

                connection.end()

                return
            }

            callback(results)

            connection.end()

        })

    }


    // BUSCA UMA OFERTA PELO ID

    static getOfertaById(id, callback) {

        const connection = OfertaBD.connect()

        var sql = `
            SELECT * FROM ofertas
            WHERE id = ?
        `

        connection.query(
            sql,
            id,
            function(error, results) {

                if (error) {

                    console.log(
                        'ERRO AO BUSCAR OFERTA:',
                        error
                    )

                    connection.end()

                    return
                }


                if (results.length == 0) {

                    console.log(
                        'Oferta não encontrada.'
                    )

                    connection.end()

                    return
                }


                var oferta = results[0]

                callback(oferta)

                connection.end()

            }
        )

    }

}


module.exports = OfertaBD