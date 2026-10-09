const mysql = require('mysql');

class FavoritosBD {

    static connect() {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'boatour_bd',
            charset: 'utf8mb4'
        });

        return connection;
    }

    // ADICIONAR FAVORITO
    static adicionar(idUsuario, tipo, idItem, callback) {

        const connection = FavoritosBD.connect();

        const sql = `
            INSERT INTO favoritos
                (id_usuario, tipo, id_item)
            VALUES (?, ?, ?)
        `;

        connection.query(
            sql,
            [idUsuario, tipo, idItem],
            (error, resultado) => {

                connection.end();

                if (error) {

    if (error.code === 'ER_DUP_ENTRY') {
        return callback({
            message: 'Este item já está nos favoritos.',
            jaFavoritado: true
        });
    }

    console.error(
        'ERRO AO ADICIONAR FAVORITO:',
        error
    );

    return callback({
        error: 'Erro ao adicionar favorito.'
    });
}

                callback({
                    message: 'Favorito adicionado com sucesso.',
                    id_favorito: resultado.insertId
                });
            }
        );
    }


    // REMOVER FAVORITO
    static remover(idUsuario, tipo, idItem, callback) {

        const connection = FavoritosBD.connect();

        const sql = `
            DELETE FROM favoritos
            WHERE id_usuario = ?
              AND tipo = ?
              AND id_item = ?
        `;

        connection.query(
            sql,
            [idUsuario, tipo, idItem],
            (error, resultado) => {

                connection.end();

                if (error) {

                    console.error(
                        'ERRO AO REMOVER FAVORITO:',
                        error
                    );

                    return callback({
                        error: 'Erro ao remover favorito.'
                    });
                }

                callback({
                    message: 'Favorito removido com sucesso.'
                });
            }
        );
    }


    // VERIFICAR SE JÁ É FAVORITO
    static verificar(idUsuario, tipo, idItem, callback) {

        const connection = FavoritosBD.connect();

        const sql = `
            SELECT id_favorito
            FROM favoritos
            WHERE id_usuario = ?
              AND tipo = ?
              AND id_item = ?
            LIMIT 1
        `;

        connection.query(
            sql,
            [idUsuario, tipo, idItem],
            (error, resultados) => {

                connection.end();

                if (error) {

                    console.error(
                        'ERRO AO VERIFICAR FAVORITO:',
                        error
                    );

                    return callback({
                        error: 'Erro ao verificar favorito.'
                    });
                }

                callback({
                    favorito: resultados.length > 0
                });
            }
        );
    }

    
    static listar(idUsuario, callback) {
    const connection = FavoritosBD.connect();

    const sql = `
        SELECT id_favorito, tipo, id_item
        FROM favoritos
        WHERE id_usuario = ?
        ORDER BY id_favorito DESC
    `;

    connection.query(
        sql,
        [idUsuario],
        (error, resultados) => {
            connection.end();

            if (error) {
                console.error(
                    'ERRO AO BUSCAR FAVORITOS:',
                    error
                );

                return callback({
                    error: 'Erro ao buscar favoritos.'
                });
            }

            callback({
                favoritos: resultados
            });
        }
    );
}
}

module.exports = FavoritosBD;
