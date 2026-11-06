const mysql = require('mysql');

class NotificacoesBD {
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

    static listar(idUsuario, callback) {
        const connection = NotificacoesBD.connect();
        const sql = `
            SELECT id_notificacao, tipo, titulo, mensagem, link,
                   referencia_tipo, referencia_id, lida,
                   data_criacao, data_leitura
            FROM notificacoes
            WHERE id_usuario = ?
            ORDER BY data_criacao DESC, id_notificacao DESC
            LIMIT 100
        `;
        connection.query(sql, [idUsuario], (erro, resultados) => {
            connection.end();
            callback(erro, resultados);
        });
    }

    static criar(dados, callback) {
        const connection = NotificacoesBD.connect();
        const sql = `
            INSERT INTO notificacoes
                (id_usuario, tipo, titulo, mensagem, link, referencia_tipo, referencia_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        connection.query(sql, [
            dados.id_usuario,
            dados.tipo,
            dados.titulo,
            dados.mensagem,
            dados.link || null,
            dados.referencia_tipo || null,
            dados.referencia_id == null ? null : String(dados.referencia_id)
        ], (erro, resultado) => {
            connection.end();
            callback(erro, resultado);
        });
    }

    static marcarComoLida(idUsuario, idNotificacao, callback) {
        const connection = NotificacoesBD.connect();
        const sql = `
            UPDATE notificacoes
            SET lida = 1, data_leitura = COALESCE(data_leitura, NOW())
            WHERE id_notificacao = ? AND id_usuario = ?
        `;
        connection.query(sql, [idNotificacao, idUsuario], (erro, resultado) => {
            connection.end();
            callback(erro, resultado);
        });
    }

    static marcarTodasComoLidas(idUsuario, callback) {
        const connection = NotificacoesBD.connect();
        const sql = `
            UPDATE notificacoes
            SET lida = 1, data_leitura = NOW()
            WHERE id_usuario = ? AND lida = 0
        `;
        connection.query(sql, [idUsuario], (erro, resultado) => {
            connection.end();
            callback(erro, resultado);
        });
    }

    static excluir(idUsuario, idNotificacao, callback) {
        const connection = NotificacoesBD.connect();
        connection.query(
            'DELETE FROM notificacoes WHERE id_notificacao = ? AND id_usuario = ?',
            [idNotificacao, idUsuario],
            (erro, resultado) => {
                connection.end();
                callback(erro, resultado);
            }
        );
    }
}

module.exports = NotificacoesBD;
