const mysql = require('mysql')

class VoosBD {

    static consultaBase() {
        return `
            SELECT
                v.*,
                v.companhia_aerea AS companhia_nome,
                NULL AS logo_companhia,
                v.classe AS classe_nome,
                v.origem AS cidade_origem,
                v.destino AS cidade_destino
            FROM voos v
        `;
    }

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
        ${VoosBD.consultaBase()}
        ORDER BY v.data_saida, v.horario_saida
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
            ${VoosBD.consultaBase()}
            WHERE 1 = 1
        `

        const valores = []


        // --- PESQUISA ---

        if (filtros.pesquisa) {

            sql += `
                AND (
                    v.numero_voo LIKE ?
                    OR v.companhia_aerea LIKE ?
                    OR v.origem LIKE ?
                    OR v.destino LIKE ?
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
                AND (
                    v.origem LIKE ?
                )
            `

            valores.push(
                `%${filtros.origem}%`
            )
        }


        // --- DESTINO ---

        if (filtros.destino) {

            sql += `
                AND (
                    v.destino LIKE ?
                )
            `

            valores.push(
                `%${filtros.destino}%`
            )
        }


        // --- DATA ---

        if (filtros.data) {

            sql += `
                AND v.data_saida = ?
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
                AND v.preco >= ?
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
                AND v.preco <= ?
            `

            valores.push(
                Number(filtros.precoMax)
            )
        }


        // --- ORDENAÇÃO ---

        sql += `
            ORDER BY v.data_saida, v.horario_saida
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
            ${VoosBD.consultaBase()}
            WHERE v.id_voo = ?
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
