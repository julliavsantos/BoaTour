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

        const sql = `
            SELECT
                o.*,
                p.titulo AS nome_pacote,
                COALESCE(p.dias, d.dias) AS dias,
                p.quantidade_paises,
                v.data_saida AS data_voo,
                v.horario_saida AS horario_voo,
                v.horario_chegada AS chegada_voo,
                c.logo AS logo_companhia,
                COALESCE(d.nome, h.nome_hotel, v.numero_voo, a.nome_atividade) AS nome_produto,
                COALESCE(d.imagem, h.imagem_principal, c.logo, a.imagem_principal, p.imagem, o.imagem) AS imagem_resumo,
                COALESCE(ip.hoteis, h.nome_hotel) AS hoteis_inclusos,
                COALESCE(ip.voos, CASE WHEN v.id_voo IS NOT NULL THEN CONCAT(v.companhia_aerea, ' · ', v.numero_voo, ' · ', v.origem, ' → ', v.destino, ' · ', DATE_FORMAT(v.data_saida, '%d/%m/%Y'), ' · ', TIME_FORMAT(v.horario_saida, '%H:%i')) END) AS voos_inclusos,
                COALESCE(ip.atividades, a.nome_atividade) AS atividades_inclusas,
                COALESCE(ip.destinos, d.nome) AS destinos_inclusos,
                CASE WHEN (o.tipo_alvo = 'produto' AND o.tipo_produto = 'hotel' AND h.id_hotel IS NOT NULL)
                          OR COALESCE(ip.tem_hotel, 0) > 0 THEN 1 ELSE 0 END AS hospedagem,
                CASE WHEN (o.tipo_alvo = 'produto' AND o.tipo_produto = 'voo' AND v.id_voo IS NOT NULL)
                          OR COALESCE(ip.tem_voo, 0) > 0 THEN 1 ELSE 0 END AS passagem_aerea,
                CASE WHEN (o.tipo_alvo = 'produto' AND o.tipo_produto = 'atividade' AND a.id_atividade IS NOT NULL)
                          OR COALESCE(ip.tem_atividade, 0) > 0 THEN 1 ELSE 0 END AS passeios
            FROM ofertas o
            LEFT JOIN pacotes p
                ON o.tipo_alvo = 'pacote' AND p.id_pacote = o.id_pacote
            LEFT JOIN destinos d
                ON o.tipo_alvo = 'produto' AND o.tipo_produto = 'destino' AND d.id_destino = o.id_produto
            LEFT JOIN hoteis h
                ON o.tipo_alvo = 'produto' AND o.tipo_produto = 'hotel' AND h.id_hotel = o.id_produto
            LEFT JOIN voos v
                ON o.tipo_alvo = 'produto' AND o.tipo_produto = 'voo' AND v.id_voo = o.id_produto
            LEFT JOIN companhias_aereas c
                ON c.id_companhia = v.id_companhia
            LEFT JOIN atividades a
                ON o.tipo_alvo = 'produto' AND o.tipo_produto = 'atividade' AND a.id_atividade = o.id_produto
            LEFT JOIN (
                SELECT
                    pi.id_pacote,
                    GROUP_CONCAT(DISTINCT CASE WHEN pi.tipo_item = 'hotel' THEN h_pacote.nome_hotel END ORDER BY h_pacote.nome_hotel SEPARATOR ' · ') AS hoteis,
                    GROUP_CONCAT(DISTINCT CASE WHEN pi.tipo_item = 'voo' THEN CONCAT(v_pacote.companhia_aerea, ' · ', v_pacote.numero_voo, ' · ', v_pacote.origem, ' → ', v_pacote.destino, ' · ', DATE_FORMAT(v_pacote.data_saida, '%d/%m/%Y'), ' · ', TIME_FORMAT(v_pacote.horario_saida, '%H:%i')) END ORDER BY v_pacote.numero_voo SEPARATOR ' | ') AS voos,
                    GROUP_CONCAT(DISTINCT CASE WHEN pi.tipo_item = 'atividade' THEN a_pacote.nome_atividade END ORDER BY a_pacote.nome_atividade SEPARATOR ' · ') AS atividades,
                    GROUP_CONCAT(DISTINCT CASE WHEN pi.tipo_item = 'destino' THEN d_pacote.nome END ORDER BY d_pacote.nome SEPARATOR ' · ') AS destinos,
                    SUM(pi.tipo_item = 'hotel') AS tem_hotel,
                    SUM(pi.tipo_item = 'voo') AS tem_voo,
                    SUM(pi.tipo_item = 'atividade') AS tem_atividade
                FROM pacote_itens pi
                LEFT JOIN hoteis h_pacote
                    ON pi.tipo_item = 'hotel' AND h_pacote.id_hotel = pi.id_item
                LEFT JOIN voos v_pacote
                    ON pi.tipo_item = 'voo' AND v_pacote.id_voo = pi.id_item
                LEFT JOIN atividades a_pacote
                    ON pi.tipo_item = 'atividade' AND a_pacote.id_atividade = pi.id_item
                LEFT JOIN destinos d_pacote
                    ON pi.tipo_item = 'destino' AND d_pacote.id_destino = pi.id_item
                GROUP BY pi.id_pacote
            ) ip ON ip.id_pacote = p.id_pacote
            WHERE o.status = 'ativa'
              AND o.data_inicio <= NOW()
              AND o.data_fim >= NOW()
            ORDER BY o.destaque DESC, o.data_fim ASC, o.id DESC
        `

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
              AND status = 'ativa'
              AND data_inicio <= NOW()
              AND data_fim >= NOW()
            ORDER BY data_fim ASC, id DESC
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
