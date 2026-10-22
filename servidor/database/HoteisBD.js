
const mysql = require('mysql')

class HotelBD {

    // --- CONEXÃO COM O BANCO DE DADOS ---

    static connect() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'boatour_bd'
        })
    }


    // --- BUSCAR TODOS OS HOTÉIS ---

    static getHoteis(callback) {
        const connection = HotelBD.connect()

        const sql = `
            SELECT
                id_hotel,
                nome_hotel,
                quarto_hotel,
                descricao_hotel,
                cidade,
                pais,
                endereco,
                preco_diaria,
                classificacao,
                imagem_principal,
                site_oficial,
                ods8,
                ods12,
                ativo
            FROM hoteis
            WHERE ativo = 1
            ORDER BY id_hotel
        `

        connection.query(sql, function(error, resultados) {
            connection.end()

            if (error) {
                console.log('ERRO AO BUSCAR HOTÉIS:', error)
                return callback(error, null)
            }

            callback(null, resultados)
        })
    }


    // --- BUSCAR UM HOTEL PELO ID ---

    static getHotelById(id, callback) {
        const connection = HotelBD.connect()

        const sql = `
            SELECT *
            FROM hoteis
            WHERE id_hotel = ?
              AND ativo = 1
            LIMIT 1
        `

        connection.query(sql, [id], function(error, resultados) {
            connection.end()

            if (error) {
                console.log('ERRO AO BUSCAR HOTEL:', error)
                return callback(error, null)
            }

            callback(
                null,
                resultados.length > 0 ? resultados[0] : null
            )
        })
    }


    // --- BUSCAR FOTOS APROVADAS DE UM HOTEL ---

    static getFotosByHotelId(id, callback) {
        const connection = HotelBD.connect()

        const sql = `
            SELECT
                id_foto,
                id_hotel,
                caminho_foto,
                legenda,
                id_usuario,
                origem,
                data_envio
            FROM fotos_hoteis
            WHERE id_hotel = ?
              AND status = 'aprovada'
            ORDER BY
                CASE
                    WHEN origem = 'oficial' THEN 0
                    ELSE 1
                END,
                data_envio DESC
        `

        connection.query(sql, [id], function(error, resultados) {
            connection.end()

            if (error) {
                console.log('ERRO AO BUSCAR FOTOS:', error)
                return callback(error, null)
            }

            callback(null, resultados)
        })
    }

}

module.exports = HotelBD
