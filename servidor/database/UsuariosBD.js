const mysql = require('mysql');
const bcrypt = require('bcrypt');

class UsuariosBD {
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

    static normalizarCPF(cpf) {
        return String(cpf || '').replace(/\D/g, '');
    }

    static normalizarEmail(email) {
        return String(email || '').trim().toLowerCase();
    }

    static emailCadastrado(email, callback) {
        const emailNormalizado = UsuariosBD.normalizarEmail(email);
        const connection = UsuariosBD.connect();

        connection.query(
            'SELECT 1 FROM usuarios WHERE email = ? LIMIT 1',
            [emailNormalizado],
            (error, results) => {
                connection.end();
                if (error) {
                    console.error('ERRO AO VERIFICAR E-MAIL:', error);
                    return callback({ error: 'Não foi possível verificar o e-mail.' });
                }
                callback({ cadastrado: results.length > 0 });
            }
        );
    }

    static dadosPublicos(usuario) {
        if (!usuario) return null;

        return {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            cpf: usuario.cpf,
            email: usuario.email,
            telefone: usuario.telefone || '',
            data_nascimento: usuario.data_nascimento || null,
            termos_aceitos: !!usuario.termos_aceitos,
            data_cadastro: usuario.data_cadastro,
            foto_perfil: usuario.foto_perfil || null,
            banner_perfil: usuario.banner_perfil || null
        };
    }

    static addUsuario(usuario, callback) {
        const nome = String(usuario.nome || '').trim();
        const cpf = UsuariosBD.normalizarCPF(usuario.cpf);
        const email = UsuariosBD.normalizarEmail(usuario.email);
        const senha = String(usuario.senha || '');
        const termosAceitos = !!usuario.termos_aceitos;

        if (nome.length < 3) {
            return callback({ error: 'Digite seu nome completo.' });
        }

        if (cpf.length !== 11) {
            return callback({ error: 'Digite um CPF válido.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return callback({ error: 'Digite um e-mail válido.' });
        }

        if (senha.length < 6) {
            return callback({ error: 'A senha deve ter pelo menos 6 caracteres.' });
        }

        if (!termosAceitos) {
            return callback({ error: 'Você precisa aceitar os Termos de Uso e a Política de Privacidade.' });
        }

        const connection = UsuariosBD.connect();

        bcrypt.hash(senha, 12, (hashError, senhaHash) => {
            if (hashError) {
                connection.end();
                return callback({ error: 'Erro ao proteger a senha.' });
            }

            const sql = `
                INSERT INTO usuarios
                    (nome, cpf, email, senha, termos_aceitos, telefone, data_nascimento)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(sql, [
                nome,
                cpf,
                email,
                senhaHash,
                1,
                String(usuario.telefone || '').trim() || null,
                usuario.data_nascimento || null
            ], (error, result) => {
                connection.end();

                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        const msg = String(error.sqlMessage || '').toLowerCase();
                        if (msg.includes('email')) return callback({ error: 'Este e-mail já está cadastrado.' });
                        if (msg.includes('cpf')) return callback({ error: 'Este CPF já está cadastrado.' });
                        return callback({ error: 'CPF ou e-mail já cadastrado.' });
                    }
                    console.error('ERRO MYSQL CADASTRO:', error);
                    return callback({ error: 'Erro ao cadastrar usuário.' });
                }

                UsuariosBD.buscarPorId(result.insertId, (busca) => {
                    if (busca.error) return callback(busca);
                    callback({
                        message: 'Usuário cadastrado com sucesso!',
                        usuario: UsuariosBD.dadosPublicos(busca.usuario)
                    });
                });
            });
        });
    }

    static login(usuario, callback) {
        const cpf = UsuariosBD.normalizarCPF(usuario.cpf);
        const senha = String(usuario.senha || '');

        if (cpf.length !== 11 || !senha) {
            return callback({ error: 'Digite um CPF válido e sua senha.' });
        }

        const connection = UsuariosBD.connect();
        const sql = `
            SELECT id_usuario, nome, cpf, email, senha,
                   telefone, data_nascimento, termos_aceitos,
                   data_cadastro, foto_perfil, banner_perfil
            FROM usuarios
            WHERE cpf = ?
            LIMIT 1
        `;

        connection.query(sql, [cpf], (error, results) => {
            if (error) {
                connection.end();
                console.error('ERRO MYSQL LOGIN:', error);
                return callback({ error: 'Erro ao realizar login.' });
            }

            if (!results.length) {
                connection.end();
                return callback({ error: 'CPF ou senha incorretos.' });
            }

            const usuarioBanco = results[0];

            bcrypt.compare(senha, usuarioBanco.senha, (compareError, senhaValida) => {
                connection.end();

                if (compareError || !senhaValida) {
                    return callback({ error: 'CPF ou senha incorretos.' });
                }

                callback({
                    message: 'Login realizado com sucesso!',
                    usuario: UsuariosBD.dadosPublicos(usuarioBanco)
                });
            });
        });
    }

    static buscarPorId(idUsuario, callback) {
        const id = Number(idUsuario);
        if (!Number.isInteger(id) || id <= 0) {
            return callback({ error: 'Usuário inválido.' });
        }

        const connection = UsuariosBD.connect();
        const sql = `
            SELECT id_usuario, nome, cpf, email,
                   telefone, data_nascimento, termos_aceitos,
                   data_cadastro, foto_perfil, banner_perfil
            FROM usuarios
            WHERE id_usuario = ?
            LIMIT 1
        `;

        connection.query(sql, [id], (error, results) => {
            connection.end();

            if (error) {
                console.error('ERRO AO BUSCAR USUÁRIO:', error);
                return callback({ error: 'Erro ao buscar usuário.' });
            }

            if (!results.length) {
                return callback({ error: 'Usuário não encontrado.' });
            }

            callback({ usuario: results[0] });
        });
    }

    static atualizar(idUsuario, dados, callback) {
        const id = Number(idUsuario);
        const nome = String(dados.nome || '').trim();
        const email = UsuariosBD.normalizarEmail(dados.email);
        const cpf = UsuariosBD.normalizarCPF(dados.cpf);
        const telefone = String(dados.telefone || '').trim() || null;
        const dataNascimento = dados.data_nascimento || null;
        const banner = dados.banner_perfil || null;

        if (!Number.isInteger(id) || id <= 0) return callback({ error: 'Usuário inválido.' });
        if (nome.length < 3) return callback({ error: 'O nome deve ter pelo menos 3 caracteres.' });
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return callback({ error: 'Digite um e-mail válido.' });
        if (cpf.length !== 11) return callback({ error: 'Digite um CPF válido.' });

        const connection = UsuariosBD.connect();
        const sql = `
            UPDATE usuarios
            SET nome = ?, email = ?, cpf = ?, telefone = ?,
                data_nascimento = ?, banner_perfil = ?
            WHERE id_usuario = ?
        `;

        connection.query(sql, [
            nome, email, cpf, telefone, dataNascimento, banner, id
        ], (error, result) => {
            connection.end();

            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    const msg = String(error.sqlMessage || '').toLowerCase();
                    if (msg.includes('email')) return callback({ error: 'Este e-mail já está cadastrado.' });
                    if (msg.includes('cpf')) return callback({ error: 'Este CPF já está cadastrado.' });
                    return callback({ error: 'CPF ou e-mail já cadastrado.' });
                }

                console.error('ERRO AO ATUALIZAR USUÁRIO:', error);
                return callback({ error: 'Erro ao atualizar os dados.' });
            }

            if (!result.affectedRows) return callback({ error: 'Usuário não encontrado.' });

            UsuariosBD.buscarPorId(id, callback);
        });
    }

    static alterarSenha(idUsuario, senhaAtual, novaSenha, callback) {
        const id = Number(idUsuario);
        if (!Number.isInteger(id) || id <= 0) return callback({ error: 'Usuário inválido.' });
        if (!senhaAtual || !novaSenha) return callback({ error: 'Preencha a senha atual e a nova senha.' });
        if (novaSenha.length < 6) return callback({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });

        const connection = UsuariosBD.connect();

        connection.query(
            'SELECT senha FROM usuarios WHERE id_usuario = ? LIMIT 1',
            [id],
            (error, results) => {
                if (error) {
                    connection.end();
                    return callback({ error: 'Erro ao verificar a senha.' });
                }

                if (!results.length) {
                    connection.end();
                    return callback({ error: 'Usuário não encontrado.' });
                }

                bcrypt.compare(senhaAtual, results[0].senha, (compareError, ok) => {
                    if (compareError || !ok) {
                        connection.end();
                        return callback({ error: 'A senha atual está incorreta.' });
                    }

                    bcrypt.hash(novaSenha, 12, (hashError, hash) => {
                        if (hashError) {
                            connection.end();
                            return callback({ error: 'Erro ao proteger a nova senha.' });
                        }

                        connection.query(
                            'UPDATE usuarios SET senha = ? WHERE id_usuario = ?',
                            [hash, id],
                            (updateError) => {
                                connection.end();
                                if (updateError) {
                                    console.error('ERRO AO ALTERAR SENHA:', updateError);
                                    return callback({ error: 'Erro ao alterar a senha.' });
                                }
                                callback({ message: 'Senha alterada com sucesso.' });
                            }
                        );
                    });
                });
            }
        );
    }

    static redefinirSenhaPorEmail(email, novaSenha, callback) {
        const emailNormalizado = UsuariosBD.normalizarEmail(email);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
            return callback({ error: 'Digite um e-mail válido.' });
        }

        if (String(novaSenha || '').length < 6) {
            return callback({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
        }

        const connection = UsuariosBD.connect();

        bcrypt.hash(novaSenha, 12, (hashError, senhaHash) => {
            if (hashError) {
                connection.end();
                return callback({ error: 'Erro ao proteger a nova senha.' });
            }

            connection.query(
                'UPDATE usuarios SET senha = ? WHERE email = ?',
                [senhaHash, emailNormalizado],
                (error, result) => {
                    connection.end();

                    if (error) {
                        console.error('ERRO AO REDEFINIR SENHA:', error);
                        return callback({ error: 'Erro ao redefinir a senha.' });
                    }

                    if (!result.affectedRows) return callback({ error: 'Usuário não encontrado.' });
                    callback({ message: 'Senha redefinida com sucesso.' });
                }
            );
        });
    }

    static atualizaFoto(idUsuario, caminhoFoto, callback) {
        const connection = UsuariosBD.connect();
        connection.query(
            'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?',
            [caminhoFoto, idUsuario],
            (error, results) => {
                connection.end();

                if (error) {
                    console.error('ERRO AO ATUALIZAR FOTO:', error);
                    return callback({ error: 'Erro ao salvar a foto no banco.' });
                }

                if (!results.affectedRows) return callback({ error: 'Usuário não encontrado.' });

                callback({ message: 'Foto atualizada com sucesso.', foto: caminhoFoto });
            }
        );
    }

    static atualizaBanner(idUsuario, banner, callback) {
        const connection = UsuariosBD.connect();
        connection.query(
            'UPDATE usuarios SET banner_perfil = ? WHERE id_usuario = ?',
            [banner || null, idUsuario],
            (error, results) => {
                connection.end();

                if (error) {
                    console.error('ERRO AO ATUALIZAR BANNER:', error);
                    return callback({ error: 'Erro ao salvar o banner.' });
                }

                if (!results.affectedRows) return callback({ error: 'Usuário não encontrado.' });
                callback({ message: 'Banner atualizado com sucesso.' });
            }
        );
    }

    static confirmarSenha(idUsuario, senha, callback) {
        const id = Number(idUsuario);
        if (!id || !senha) return callback({ error: 'Digite sua senha.' });

        const connection = UsuariosBD.connect();
        connection.query(
            'SELECT senha FROM usuarios WHERE id_usuario = ? LIMIT 1',
            [id],
            (error, results) => {
                if (error) {
                    connection.end();
                    return callback({ error: 'Erro ao verificar a senha.' });
                }

                if (!results.length) {
                    connection.end();
                    return callback({ error: 'Usuário não encontrado.' });
                }

                bcrypt.compare(senha, results[0].senha, (compareError, ok) => {
                    connection.end();
                    if (compareError || !ok) return callback({ error: 'Senha incorreta.' });
                    callback({ message: 'Senha confirmada.' });
                });
            }
        );
    }

    static excluir(idUsuario, callback) {
        const id = Number(idUsuario);
        if (!id) return callback({ error: 'Usuário inválido.' });

        const connection = UsuariosBD.connect();
        connection.query(
            'DELETE FROM usuarios WHERE id_usuario = ?',
            [id],
            (error, results) => {
                connection.end();

                if (error) {
                    console.error('ERRO AO EXCLUIR USUÁRIO:', error);
                    return callback({ error: 'Não foi possível excluir a conta.' });
                }

                if (!results.affectedRows) return callback({ error: 'Usuário não encontrado.' });
                callback({ message: 'Conta excluída com sucesso.' });
            }
        );
    }

    static getUsuarios(callback) {
        const connection = UsuariosBD.connect();
        connection.query(`
            SELECT id_usuario, nome, cpf, email, telefone,
                   data_nascimento, termos_aceitos, data_cadastro,
                   foto_perfil, banner_perfil
            FROM usuarios
            ORDER BY id_usuario DESC
        `, (error, results) => {
            connection.end();

            if (error) {
                console.error('ERRO AO LISTAR USUÁRIOS:', error);
                return callback({ error: 'Erro ao buscar usuários.' });
            }

            callback(results);
        });
    }
}

module.exports = UsuariosBD;
