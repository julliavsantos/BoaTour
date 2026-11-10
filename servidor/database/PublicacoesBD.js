
const mysql = require('mysql');

class PublicacoesBD {

    // CONEXÃO COM O BANCO
    static connect() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'boatour_bd',
            charset: 'utf8mb4'
        });
    }

    // LISTAR PUBLICAÇÕES DA GALERIA
    static listarPublicacoes(callback) {
        const connection = PublicacoesBD.connect();

        const sql = `
            SELECT
                p.id_publicacao,
                p.id_usuario,
                p.titulo,
                p.descricao,
                p.cidade,
                p.pais,
                p.nota_experiencia,
                p.data_publicacao,
                u.nome AS nome_usuario,
                u.foto_perfil
            FROM publicacoes_viagens p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            WHERE p.ativo = 1
            ORDER BY p.data_publicacao DESC
        `;

        connection.query(sql, (erro, resultados) => {
            connection.end();

            if (erro) {
                console.error('Erro ao listar publicações:', erro);
                return callback(erro);
            }

            return callback(null, resultados);
        });
    }

    // BUSCAR UMA PUBLICAÇÃO PELO ID, INCLUINDO AS FOTOS
    static buscarPorId(idPublicacao, idUsuario, callback) {
        const connection = PublicacoesBD.connect();

        const sql = `
            SELECT
                p.id_publicacao,
                p.id_usuario,
                p.titulo,
                p.descricao,
                p.cidade,
                p.pais,
                p.nota_experiencia,
                p.data_publicacao,
                u.nome AS nome_usuario,
                u.foto_perfil
            FROM publicacoes_viagens p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            WHERE p.id_publicacao = ?
              AND p.ativo = 1
        `;

        connection.query(sql, [idPublicacao], (erro, resultados) => {
            if (erro) {
                connection.end();
                console.error('Erro ao buscar publicação:', erro);
                return callback(erro);
            }

            if (resultados.length === 0) {
                connection.end();
                return callback(null, null);
            }

            const publicacao = resultados[0];

            const sqlFotos = `
                SELECT id_foto, caminho_foto, ordem
                FROM fotos_publicacoes
                WHERE id_publicacao = ?
                ORDER BY ordem ASC
            `;

            connection.query(
                sqlFotos,
                [idPublicacao],
                (erroFotos, fotos) => {
                    if (erroFotos) {
                        connection.end();
                        console.error('Erro ao buscar fotos:', erroFotos);
                        return callback(erroFotos);
                    }

                    publicacao.fotos = fotos;
                    PublicacoesBD.buscarResumoAvaliacao(
                        connection,
                        idPublicacao,
                        idUsuario,
                        (erroAvaliacao, resumo) => {
                            connection.end();

                            if (erroAvaliacao) {
                                console.error('Erro ao buscar avaliações:', erroAvaliacao);
                                return callback(erroAvaliacao);
                            }

                            Object.assign(publicacao, resumo);
                            return callback(null, publicacao);
                        }
                    );
                }
            );
        });
    }

    static buscarResumoAvaliacao(connection, idPublicacao, idUsuario, callback) {
        const sql = `
            SELECT
                COALESCE(AVG(nota), 0) AS media_avaliacao,
                COUNT(*) AS total_avaliacoes,
                MAX(CASE WHEN id_usuario = ? THEN nota END) AS minha_avaliacao
            FROM avaliacoes
            WHERE id_publicacao = ?
        `;

        connection.query(sql, [idUsuario || 0, idPublicacao], (erro, resultados) => {
            if (erro) return callback(erro);
            return callback(null, resultados[0]);
        });
    }

    static avaliarPublicacao(idPublicacao, idUsuario, nota, callback) {
        const connection = PublicacoesBD.connect();
        const sqlPublicacao = `
            SELECT id_publicacao
            FROM publicacoes_viagens
            WHERE id_publicacao = ? AND ativo = 1
        `;

        connection.query(sqlPublicacao, [idPublicacao], (erro, publicacoes) => {
            if (erro) {
                connection.end();
                return callback(erro);
            }

            if (publicacoes.length === 0) {
                connection.end();
                return callback(null, null);
            }

            const sqlAvaliacao = `
                INSERT INTO avaliacoes (id_usuario, id_publicacao, nota)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    nota = VALUES(nota),
                    data_avaliacao = CURRENT_TIMESTAMP
            `;

            connection.query(
                sqlAvaliacao,
                [idUsuario, idPublicacao, nota],
                erroAvaliacao => {
                    if (erroAvaliacao) {
                        connection.end();
                        return callback(erroAvaliacao);
                    }

                    PublicacoesBD.buscarResumoAvaliacao(
                        connection,
                        idPublicacao,
                        idUsuario,
                        (erroResumo, resumo) => {
                            connection.end();
                            if (erroResumo) return callback(erroResumo);
                            return callback(null, resumo);
                        }
                    );
                }
            );
        });
    }

    // CRIAR UMA PUBLICAÇÃO
    // O ID do usuário vem da sessão, não do formulário.
 
    // SALVAR O CAMINHO DE UMA FOTO
    static adicionarFoto(dados, callback) {
        const connection = PublicacoesBD.connect();

        const sql = `
            INSERT INTO fotos_publicacoes
                (id_publicacao, caminho_foto, ordem)
            VALUES (?, ?, ?)
        `;

        const valores = [
            dados.id_publicacao,
            dados.caminho_foto,
            dados.ordem
        ];

        connection.query(sql, valores, (erro, resultado) => {
            connection.end();

            if (erro) {
                console.error('Erro ao salvar foto:', erro);
                return callback(erro);
            }

            return callback(null, resultado);
        });
    }

    // EXCLUIR PUBLICAÇÃO DO PRÓPRIO USUÁRIO
    static excluirPublicacao(idPublicacao, idUsuario, callback) {
        const connection = PublicacoesBD.connect();

        const sql = `
            DELETE FROM publicacoes_viagens
            WHERE id_publicacao = ?
              AND id_usuario = ?
        `;

        connection.query(
            sql,
            [idPublicacao, idUsuario],
            (erro, resultado) => {
                connection.end();

                if (erro) {
                    console.error('Erro ao excluir publicação:', erro);
                    return callback(erro);
                }

                return callback(null, resultado.affectedRows > 0);
            }
        );
    }

    static atualizarPublicacao(idPublicacao, idUsuario, dados, callback) {
        const connection = PublicacoesBD.connect();
        connection.query(
            'SELECT id_publicacao FROM publicacoes_viagens WHERE id_publicacao = ? AND id_usuario = ? AND ativo = 1',
            [idPublicacao, idUsuario],
            (erroBusca, publicacoes) => {
                if (erroBusca) {
                    connection.end();
                    return callback(erroBusca);
                }
                if (!publicacoes.length) {
                    connection.end();
                    return callback(null, false);
                }
                connection.query(
                    `UPDATE publicacoes_viagens SET titulo = ?, descricao = ?, nota_experiencia = ?
                     WHERE id_publicacao = ? AND id_usuario = ? AND ativo = 1`,
                    [dados.titulo, dados.descricao, dados.nota_experiencia, idPublicacao, idUsuario],
                    erroAtualizacao => {
                        connection.end();
                        if (erroAtualizacao) return callback(erroAtualizacao);
                        return callback(null, true);
                    }
                );
            }
        );
    }
    

static criarPublicacao(idUsuario, dados, callback) {
    const connection = PublicacoesBD.connect();

    const sql = `
        INSERT INTO publicacoes_viagens
        (id_usuario, titulo, descricao, cidade, pais, nota_experiencia)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        idUsuario,
        dados.titulo,
        dados.descricao,
        dados.cidade,
        dados.pais,
        dados.nota_experiencia
    ];

    connection.query(sql, valores, (erro, resultado) => {
        connection.end();

        if (erro) {
            return callback(erro);
        }

        return callback(null, resultado.insertId);
    });
}
}

module.exports = PublicacoesBD;
