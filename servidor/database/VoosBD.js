const mysql = require('mysql')

class VoosBD {

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


    // --- BUSCA TODOS OS VOOS ---

    static buscaVoos(callback) {

    const connection = VoosBD.connect()

    const sql = `
        SELECT *
        FROM voos
        ORDER BY data_saida, horario_saida
    `

    connection.query(sql, function(error, results) {

        if (error) {

            console.log(
                'ERRO AO BUSCAR VOOS:',
                error
            )

            connection.end()

            return callback(error, null)
        }

        callback(null, results)

        connection.end()
    })
}

    // --- BUSCA E FILTRA OS VOOS ---

    static filtrarVoos(filtros, callback) {

        const connection = VoosBD.connect()

        let sql = `
            SELECT *
            FROM voos
            WHERE 1 = 1
        `

        const valores = []


        // --- PESQUISA ---

        if (filtros.pesquisa) {

            sql += `
                AND (
                    numero_voo LIKE ?
                    OR companhia_aerea LIKE ?
                    OR origem LIKE ?
                    OR destino LIKE ?
                )
            `

            const pesquisa = `%${filtros.pesquisa}%`

            valores.push(
                pesquisa,
                pesquisa,
                pesquisa,
                pesquisa
            )
        }


        // --- ORIGEM ---

        if (filtros.origem) {

            sql += `
                AND origem LIKE ?
            `

            valores.push(
                `%${filtros.origem}%`
            )
        }


        // --- DESTINO ---

        if (filtros.destino) {

            sql += `
                AND destino LIKE ?
            `

            valores.push(
                `%${filtros.destino}%`
            )
        }


        // --- DATA ---

        if (filtros.data) {

            sql += `
                AND data_saida = ?
            `

            valores.push(
                filtros.data
            )
        }


        // --- PREÇO MÍNIMO ---

        if (
            filtros.precoMin !== undefined &&
            filtros.precoMin !== ''
        ) {

            sql += `
                AND preco >= ?
            `

            valores.push(
                Number(filtros.precoMin)
            )
        }


        // --- PREÇO MÁXIMO ---

        if (
            filtros.precoMax !== undefined &&
            filtros.precoMax !== ''
        ) {

            sql += `
                AND preco <= ?
            `

            valores.push(
                Number(filtros.precoMax)
            )
        }


        // --- ORDENAÇÃO ---

        sql += `
            ORDER BY data_saida, horario_saida
        `


        connection.query(
            sql,
            valores,
            function(error, results) {

                if (error) {

                    console.log(
                        'ERRO AO FILTRAR VOOS:',
                        error
                    )

                    connection.end()

                    return callback(error, null)
                }

                callback(null, results)

                connection.end()
            }
        )
    }


    // --- BUSCA UM VOO PELO ID ---

    static getVooById(id, callback) {

        const connection = VoosBD.connect()

        const sql = `
            SELECT *
            FROM voos
            WHERE id_voo = ?
        `

        connection.query(
            sql,
            [id],
            function(error, results) {

                if (error) {

                    console.log(
                        'ERRO AO BUSCAR VOO:',
                        error
                    )

                    connection.end()

                    return
                }

                if (results.length === 0) {

                    console.log(
                        'Voo não encontrado.'
                    )

                    connection.end()

                    return
                }

                callback(results[0])

                connection.end()
            }
        )
    }
}

module.exports = VoosBD
