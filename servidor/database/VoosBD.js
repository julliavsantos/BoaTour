const mysql = require('mysql')

class VoosBD {

    static consultaBase() {
        return `
            SELECT
                v.*,
                COALESCE(c.nome, v.companhia_aerea) AS companhia_nome,
                c.logo AS logo_companhia,
                COALESCE(cl.nome, v.classe) AS classe_nome,
                ao.nome AS aeroporto_origem_nome,
                ao.cidade AS cidade_origem,
                ao.pais AS pais_origem,
                ao.codigo_iata AS codigo_origem,
                ad.nome AS aeroporto_destino_nome,
                ad.cidade AS cidade_destino,
                ad.pais AS pais_destino,
                ad.codigo_iata AS codigo_destino
            FROM voos v
            LEFT JOIN companhias_aereas c
                ON c.id_companhia = v.id_companhia
            LEFT JOIN classes_voo cl
                ON cl.id_classe = v.id_classe
            LEFT JOIN aeroportos ao
                ON ao.id_aeroporto = v.id_aeroporto_origem
            LEFT JOIN aeroportos ad
                ON ad.id_aeroporto = v.id_aeroporto_destino
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
        WHERE v.ativo = 1
          AND v.assentos_disponiveis > 0
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
            WHERE v.ativo = 1
              AND v.assentos_disponiveis > 0
        `

        const valores = []


        // --- PESQUISA ---

        if (filtros.pesquisa) {

            sql += `
                AND (
                    v.numero_voo LIKE ?
                    OR v.companhia_aerea LIKE ?
                    OR c.nome LIKE ?
                    OR v.origem LIKE ?
                    OR v.destino LIKE ?
                    OR ao.cidade LIKE ?
                    OR ao.nome LIKE ?
                    OR ao.codigo_iata LIKE ?
                    OR ad.cidade LIKE ?
                    OR ad.nome LIKE ?
                    OR ad.codigo_iata LIKE ?
                )
            `

            const pesquisa = `%${filtros.pesquisa}%`

            valores.push(
                pesquisa,
                pesquisa,
                pesquisa,
                pesquisa,
                pesquisa,
                pesquisa,
                pesquisa,
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
                    v.origem LIKE ? OR ao.cidade LIKE ? OR
                    ao.nome LIKE ? OR ao.codigo_iata LIKE ?
                )
            `

            valores.push(
                `%${filtros.origem}%`,
                `%${filtros.origem}%`,
                `%${filtros.origem}%`,
                `%${filtros.origem}%`
            )
        }


        // --- DESTINO ---

        if (filtros.destino) {

            sql += `
                AND (
                    v.destino LIKE ? OR ad.cidade LIKE ? OR
                    ad.nome LIKE ? OR ad.codigo_iata LIKE ?
                )
            `

            valores.push(
                `%${filtros.destino}%`,
                `%${filtros.destino}%`,
                `%${filtros.destino}%`,
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
              AND v.ativo = 1
              AND v.assentos_disponiveis > 0
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
