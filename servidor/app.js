const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { formidable } = require('formidable');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

const DestinoBD = require('./database/DestinoBD');
const OfertaBD = require('./database/OfertaBD');
const UsuariosBD = require('./database/UsuariosBD');
const FavoritosBD = require('./database/FavoritosBD');
const AeroportosBD = require('./database/AeroportosBD');
const VoosBD = require('./database/VoosBD');
const HotelBD = require('./database/HoteisBD');
const AtividadesBD = require('./database/AtividadesBD');

const PORT = Number(process.env.PORT || 3000);
const sessions = new Map();
const recuperacoesSenha = new Map();
const DURACAO_CODIGO_MS = 10 * 60 * 1000;
const DURACAO_TOKEN_MS = 10 * 60 * 1000;
const MAX_TENTATIVAS_CODIGO = 5;

// Aceita os nomes antigos do .env e os nomes em maiúsculas documentados abaixo.
const remetenteEmail = process.env.EMAIL_REMETENTE || process.env.email_remitente;
const senhaEmail = process.env.EMAIL_SENHA_APP || process.env.email_senha_app;
const transportadorEmail = remetenteEmail && senhaEmail
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: remetenteEmail, pass: senhaEmail }
    })
    : null;


// CORS - desenvolvimento local
function setCors(res, req) {
    const origin = req.headers.origin || '';
    const permitido =
        origin === 'http://localhost:5500' ||
        origin === 'http://127.0.0.1:5500' ||
        origin === 'http://localhost:3000' ||
        origin === 'http://127.0.0.1:3000';

    res.setHeader('Access-Control-Allow-Origin', permitido ? origin : 'http://localhost:5500');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Token');
    res.setHeader('Access-Control-Max-Age', '86400');
}

function json(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

function readJson(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
        if (body.length > 1024 * 1024) req.destroy();
    });
    req.on('end', () => {
        try {
            callback(null, JSON.parse(body || '{}'));
        } catch {
            callback(new Error('JSON inválido.'));
        }
    });
}

function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function codigoRecuperacao() {
    return crypto.randomInt(100000, 1000000).toString();
}

function hashCodigoRecuperacao(codigo) {
    return crypto.createHash('sha256').update(String(codigo)).digest('hex');
}

function compararSegredos(a, b) {
    const segredoA = Buffer.from(String(a || ''), 'utf8');
    const segredoB = Buffer.from(String(b || ''), 'utf8');

    return segredoA.length === segredoB.length && crypto.timingSafeEqual(segredoA, segredoB);
}

function enviarCodigoRecuperacao(email, codigo) {
    if (!transportadorEmail) {
        return Promise.reject(new Error('E-mail de recuperação não configurado.'));
    }

    return transportadorEmail.sendMail({
        from: `BoaTour <${remetenteEmail}>`,
        to: email,
        subject: 'Código para redefinir sua senha - BoaTour',
        text: `Seu código de recuperação da BoaTour é ${codigo}. Ele expira em 10 minutos. Se você não solicitou a alteração, ignore este e-mail.`
    });
}


//USUÁRIO
function token() {
    return crypto.randomBytes(32).toString('hex');
}

function criarSessao(usuario) {
    const sessionToken = token();
    sessions.set(sessionToken, {
        id_usuario: usuario.id_usuario,
        criadaEm: Date.now()
    });
    return sessionToken;
}

function obterSessao(req) {
    const sessionToken = req.headers['x-session-token'];
    if (!sessionToken || !sessions.has(sessionToken)) return null;
    return { token: sessionToken, ...sessions.get(sessionToken) };
}

function exigirSessao(req, res) {
    const sessao = obterSessao(req);
    if (!sessao) {
        json(res, 401, { error: 'Sessão expirada. Faça login novamente.' });
        return null;
    }
    return sessao;
}


// DESTINOS / OFERTAS
function buscaDestinos(res) {
    DestinoBD.getDestinos(destinos => json(res, 200, destinos));
}

function buscaPraiasPopulares(res) {
    DestinoBD.getPraiasPopulares(destinos => json(res, 200, destinos));
}

function buscaOfertas(res) {
    OfertaBD.getOfertas(ofertas => json(res, 200, ofertas));
}


 // HOTÉIS
function buscaHoteis(res) {
    HotelBD.getHoteis((erro, hoteis) => {
        if (erro) {
            console.error('Erro ao buscar hotéis:', erro);
            return json(res, 500, {
                error: 'Erro ao buscar hotéis.'
            });
        }

        return json(res, 200, hoteis);
    });
}

function buscaHotelPorId(res, id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return json(res, 400, {
            error: 'ID do hotel inválido.'
        });
    }

    HotelBD.getHotelById(Number(id), (erro, hotel) => {
        if (erro) {
            console.error('Erro ao buscar hotel:', erro);
            return json(res, 500, {
                error: 'Erro ao buscar hotel.'
            });
        }

        if (!hotel) {
            return json(res, 404, {
                error: 'Hotel não encontrado.'
            });
        }

        return json(res, 200, hotel);
    });
}

function buscaFotosHotel(res, id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return json(res, 400, {
            error: 'ID do hotel inválido.'
        });
    }

    HotelBD.getFotosByHotelId(Number(id), (erro, fotos) => {
        if (erro) {
            console.error('Erro ao buscar fotos do hotel:', erro);
            return json(res, 500, {
                error: 'Erro ao buscar fotos do hotel.'
            });
        }

        return json(res, 200, fotos);
    });
}


// AEROPORTOS
function buscarAeroportos(req, res) {
    AeroportosBD.getAeroportos((erro, aeroportos) => {
        if (erro) {
            console.error('Erro ao buscar aeroportos:', erro);
            return json(res, 500, { error: 'Erro ao buscar aeroportos.' });
        }

        return json(res, 200, aeroportos);
    });
}


// VOOS 
function buscaVoos(res, query) {
    const filtros = {
        pesquisa: query.pesquisa,
        origem: query.origem,
        destino: query.destino,
        data: query.data,
        precoMin: query.precoMin,
        precoMax: query.precoMax
    };
    const possuiFiltros = Object.values(filtros).some(
        valor => valor !== undefined && valor !== ''
    );

    const responder = (erro, voos) => {
        if (erro) {
            console.error('Erro ao buscar voos:', erro);
            return json(res, 500, { error: 'Erro ao buscar voos.' });
        }

        return json(res, 200, voos);
    };

    if (possuiFiltros) {
        return VoosBD.filtrarVoos(filtros, responder);
    }

    return VoosBD.buscaVoos(responder);
}


// FAVORITOS
function adicionarFavorito(req, res) {

    const sessao = exigirSessao(req, res);

    if (!sessao) return;

    readJson(req, (error, dados) => {

        if (error) {
            return json(res, 400, {
                error: error.message
            });
        }

        const tipo = dados.tipo;
        const idItem = Number(dados.id_item);

        const tiposPermitidos = [
            'destino',
            'oferta',
            'hotel',
            'atividade'
        ];

        if (!tiposPermitidos.includes(tipo)) {
            return json(res, 400, {
                error: 'Tipo de favorito inválido.'
            });
        }

        if (!Number.isInteger(idItem) || idItem <= 0) {
            return json(res, 400, {
                error: 'ID do item inválido.'
            });
        }

        FavoritosBD.adicionar(
            sessao.id_usuario,
            tipo,
            idItem,
            (resultado) => {

                if (resultado.error) {
                    return json(res, 400, resultado);
                }

                return json(res, 201, resultado);
            }
        );
    });
}

function removerFavorito(req, res) {

    const sessao = exigirSessao(req, res);

    if (!sessao) return;

    readJson(req, (error, dados) => {

        if (error) {
            return json(res, 400, {
                error: error.message
            });
        }

        const tipo = dados.tipo;
        const idItem = Number(dados.id_item);

        const tiposPermitidos = [
            'destino',
            'oferta',
            'hotel',
            'atividade'
        ];

        if (!tiposPermitidos.includes(tipo)) {
            return json(res, 400, {
                error: 'Tipo de favorito inválido.'
            });
        }

        if (!Number.isInteger(idItem) || idItem <= 0) {
            return json(res, 400, {
                error: 'ID do item inválido.'
            });
        }

        FavoritosBD.remover(
            sessao.id_usuario,
            tipo,
            idItem,
            (resultado) => {

                if (resultado.error) {
                    return json(res, 400, resultado);
                }

                return json(res, 200, resultado);
            }
        );
    });
}


// CADASTRO
function cadastraUsuario(req, res) {
    readJson(req, (error, usuario) => {
        if (error) return json(res, 400, { error: error.message });

        UsuariosBD.addUsuario(usuario, resultado => {
            if (resultado.error) return json(res, 400, resultado);
            const sessionToken = criarSessao(resultado.usuario);
            json(res, 201, {
                ...resultado,
                session_token: sessionToken
            });
        });
    });
}


// LOGIN
function loginUsuario(req, res) {
    readJson(req, (error, usuario) => {
        if (error) return json(res, 400, { error: error.message });

        UsuariosBD.login(usuario, resultado => {
            if (resultado.error) return json(res, 401, resultado);

            const sessionToken = criarSessao(resultado.usuario);
            json(res, 200, {
                ...resultado,
                session_token: sessionToken
            });
        });
    });
}


// ME / BUSCAR USUÁRIO
function meuUsuario(req, res) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    UsuariosBD.buscarPorId(sessao.id_usuario, resultado => {
        if (resultado.error) return json(res, 404, resultado);
        json(res, 200, resultado.usuario);
    });
}

function buscarUsuario(req, res, id) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    if (Number(id) !== sessao.id_usuario) {
        return json(res, 403, { error: 'Você não pode acessar outra conta.' });
    }

    UsuariosBD.buscarPorId(id, resultado => {
        if (resultado.error) return json(res, 404, resultado);
        json(res, 200, resultado.usuario);
    });
}


// ATUALIZAR DADOS
function atualizarUsuario(req, res, id) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    if (Number(id) !== sessao.id_usuario) {
        return json(res, 403, { error: 'Você não pode alterar outra conta.' });
    }

    readJson(req, (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        UsuariosBD.atualizar(id, dados, resultado => {
            if (resultado.error) return json(res, 400, resultado);
            json(res, 200, {
                message: 'Dados atualizados com sucesso.',
                usuario: resultado.usuario
            });
        });
    });
}


// ALTERAR SENHA
function alterarSenha(req, res) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    readJson(req, (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        UsuariosBD.alterarSenha(
            sessao.id_usuario,
            dados.senha_atual,
            dados.nova_senha,
            resultado => json(res, resultado.error ? 400 : 200, resultado)
        );
    });
}


// CONFIRMAR SENHA
function confirmarSenha(req, res) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    readJson(req, (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        UsuariosBD.confirmarSenha(
            sessao.id_usuario,
            dados.senha,
            resultado => json(res, resultado.error ? 401 : 200, resultado)
        );
    });
}


function solicitarRedefinicaoSenha(req, res) {
    readJson(req, async (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        const email = normalizarEmail(dados.email);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return json(res, 400, { error: 'Digite um e-mail válido.' });
        }

        UsuariosBD.emailCadastrado(email, async resultado => {
            if (resultado.error) return json(res, 500, resultado);
            if (!resultado.cadastrado) return json(res, 404, { error: 'Não encontramos uma conta com este e-mail.' });

            const codigo = codigoRecuperacao();
            try {
                await enviarCodigoRecuperacao(email, codigo);
                recuperacoesSenha.set(email, {
                    // O código nunca fica em texto puro na memória do servidor.
                    codigoHash: hashCodigoRecuperacao(codigo),
                    expiraEm: Date.now() + DURACAO_CODIGO_MS,
                    tentativas: 0,
                    token: null,
                    tokenExpiraEm: 0
                });
                return json(res, 200, { mensagem: 'Deu certo' });
            } catch (erro) {
                console.error('ERRO AO ENVIAR E-MAIL DE RECUPERAÇÃO:', erro.message);
                return json(res, 503, { error: 'Não foi possível enviar o código de recuperação.' });
            }
        });
    });
}

function verificarCodigoRedefinicao(req, res) {
    readJson(req, (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        const email = normalizarEmail(dados.email);
        const recuperacao = recuperacoesSenha.get(email);
        if (!recuperacao || recuperacao.expiraEm < Date.now()) {
            recuperacoesSenha.delete(email);
            return json(res, 400, { error: 'O código expirou. Solicite outro.', expirado: true });
        }

        const codigoInformado = String(dados.codigo || '');
        const codigoValido = /^\d{6}$/.test(codigoInformado) &&
            compararSegredos(recuperacao.codigoHash, hashCodigoRecuperacao(codigoInformado));

        if (!codigoValido) {
            recuperacao.tentativas++;
            if (recuperacao.tentativas >= MAX_TENTATIVAS_CODIGO) {
                recuperacoesSenha.delete(email);
                return json(res, 429, { error: 'Muitas tentativas. Solicite outro código.', expirado: true });
            }
            return json(res, 400, { error: 'Código inválido. Tente novamente.' });
        }

        recuperacao.token = token();
        recuperacao.tokenExpiraEm = Date.now() + DURACAO_TOKEN_MS;
        recuperacao.codigoHash = null;
        return json(res, 200, { token_redefinicao: recuperacao.token });
    });
}

function redefinirSenhaPorCodigo(req, res) {
    readJson(req, (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        const email = normalizarEmail(dados.email);
        const recuperacao = recuperacoesSenha.get(email);
        if (!recuperacao || !recuperacao.token || recuperacao.token !== dados.token || recuperacao.tokenExpiraEm < Date.now()) {
            recuperacoesSenha.delete(email);
            return json(res, 400, { error: 'Sua verificação expirou. Solicite um novo código.', expirado: true });
        }

        UsuariosBD.redefinirSenhaPorEmail(email, dados.novaSenha, resultado => {
            if (resultado.error) return json(res, 400, resultado);
            recuperacoesSenha.delete(email);
            return json(res, 200, resultado);
        });
    });
}

// LOGOUT
function logout(req, res) {
    const sessionToken = req.headers['x-session-token'];
    if (sessionToken) sessions.delete(sessionToken);
    json(res, 200, { message: 'Logout realizado com sucesso.' });
}


// EXCLUIR CONTA
function excluirConta(req, res) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    readJson(req, (error, dados) => {
        if (error) return json(res, 400, { error: error.message });

        UsuariosBD.confirmarSenha(sessao.id_usuario, dados.senha, confirmacao => {
            if (confirmacao.error) return json(res, 401, confirmacao);

            UsuariosBD.excluir(sessao.id_usuario, resultado => {
                if (resultado.error) return json(res, 400, resultado);

                sessions.delete(sessao.token);
                json(res, 200, resultado);
            });
        });
    });
}


// UPLOAD FOTO
function atualizaFotoPerfil(req, res) {
    const sessao = exigirSessao(req, res);
    if (!sessao) return;

    const pastaUploads = path.join(__dirname, '..', 'uploads', 'perfis');
    fs.mkdirSync(pastaUploads, { recursive: true });

    const form = formidable({
        uploadDir: pastaUploads,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024,
        multiples: false
    });

    form.parse(req, (error, fields, files) => {
        if (error) {
            return json(res, 400, {
                error: error.code === 'ETOOBIG'
                    ? 'A imagem deve ter no máximo 5 MB.'
                    : 'Erro ao enviar a foto.'
            });
        }

        const arquivo = Array.isArray(files.foto) ? files.foto[0] : files.foto;
        if (!arquivo) return json(res, 400, { error: 'Nenhuma foto foi enviada.' });

        const mime = String(arquivo.mimetype || '').toLowerCase();
        const extensao = path.extname(arquivo.originalFilename || '').toLowerCase();
        const permitidos = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        };

        if (!permitidos[mime] || !['.jpg', '.jpeg', '.png', '.webp'].includes(extensao)) {
            try { fs.unlinkSync(arquivo.filepath); } catch {}
            return json(res, 400, { error: 'Formato de imagem não permitido. Use JPG, PNG ou WEBP.' });
        }

        const extFinal = permitidos[mime];
        const novoNome = `perfil_${sessao.id_usuario}_${Date.now()}${extFinal}`;
        const novoCaminho = path.join(pastaUploads, novoNome);

        fs.rename(arquivo.filepath, novoCaminho, erroRenomear => {
            if (erroRenomear) {
                console.error('ERRO AO SALVAR FOTO:', erroRenomear);
                return json(res, 500, { error: 'Erro ao salvar a foto.' });
            }

            const caminhoBanco = `uploads/perfis/${novoNome}`;

            UsuariosBD.atualizaFoto(sessao.id_usuario, caminhoBanco, resultado => {
                if (resultado.error) {
                    try { fs.unlinkSync(novoCaminho); } catch {}
                    return json(res, 500, resultado);
                }

                json(res, 200, resultado);
            });
        });
    });
}


// SERVIR ARQUIVOS
function mostraArquivo(res, caminho, tipo) {
    fs.readFile(caminho, (error, data) => {
        if (error) return json(res, 404, { error: 'Arquivo não encontrado.' });
        res.writeHead(200, { 'Content-Type': tipo });
        res.end(data);
    });
}

function servirArquivoPublico(res, pathname) {
    const arquivo = path.normalize(path.join(__dirname, '..', pathname));
    const raiz = path.normalize(path.join(__dirname, '..'));

    const caminhoRelativo = path.relative(raiz, arquivo);
    if (caminhoRelativo.startsWith('..') || path.isAbsolute(caminhoRelativo)) {
        return json(res, 403, { error: 'Acesso negado.' });
    }

    const extensao = path.extname(arquivo).toLowerCase();
    const tipos = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    mostraArquivo(res, arquivo, tipos[extensao] || 'application/octet-stream');
}

function listarFavoritos(req, res) {

    const sessao = exigirSessao(req, res);

    if (!sessao) return;

    FavoritosBD.listar(
        sessao.id_usuario,
        (resultado) => {

            if (resultado.error) {
                return json(res, 400, resultado);
            }

            return json(res, 200, resultado);
        }
    );
}

function buscaAtividades(res) {

    AtividadesBD.getAtividades((erro, atividades) => {

        if (erro) {
            return json(res, 500, {
                error: 'Erro ao buscar atividades.'
            });
        }

        return json(res, 200, atividades);
    });
}

// ROTAS
const callback = (req, res) => {
    setCors(res, req);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    const rota = url.parse(req.url, true);
    let p;
    try {
        p = decodeURIComponent(rota.pathname);
    } catch {
        return json(res, 400, { error: 'Caminho inválido.' });
    }

    // Usuários
    if (req.method === 'POST' && (p === '/registro' || p === '/usuarios/cadastro')) {
        return cadastraUsuario(req, res);
    }

    if (req.method === 'POST' && (p === '/login' || p === '/usuarios/login')) {
        return loginUsuario(req, res);
    }

    if (req.method === 'POST' && p === '/enviarEmail') {
        return solicitarRedefinicaoSenha(req, res);
    }

    if (req.method === 'POST' && p === '/verificarCodigo') {
        return verificarCodigoRedefinicao(req, res);
    }

    if (req.method === 'POST' && p === '/redefinirSenha') {
        return redefinirSenhaPorCodigo(req, res);
    }

    if (req.method === 'POST' && p === '/favoritos') {
    return adicionarFavorito(req, res);
    }

    if (req.method === 'DELETE' && p === '/favoritos') {
    return removerFavorito(req, res);
    }

    if (req.method === 'GET' && p === '/favoritos') {
    return listarFavoritos(req, res);
    }

    if (req.method === 'GET' && p === '/usuarios/me') {
        return meuUsuario(req, res);
    }

    const usuarioMatch = p.match(/^\/usuarios\/(\d+)$/);
    if (usuarioMatch && req.method === 'GET') {
        return buscarUsuario(req, res, usuarioMatch[1]);
    }

    if (usuarioMatch && req.method === 'PUT') {
        return atualizarUsuario(req, res, usuarioMatch[1]);
    }

    if (req.method === 'PUT' && p === '/usuarios/senha') {
        return alterarSenha(req, res);
    }

    if (req.method === 'POST' && p === '/confirmar-senha') {
        return confirmarSenha(req, res);
    }

    if (req.method === 'POST' && p === '/logout') {
        return logout(req, res);
    }

    if (req.method === 'DELETE' && p === '/usuarios/me') {
        return excluirConta(req, res);
    }

    if (req.method === 'POST' && p === '/upload-foto') {
        return atualizaFotoPerfil(req, res);
    }

    // Destinos / ofertas
    if (req.method === 'GET' && p === '/destinos') return buscaDestinos(res);
    if (req.method === 'GET' && p === '/destinos/praias-populares') return buscaPraiasPopulares(res);
    if (req.method === 'GET' && p === '/ofertas') return buscaOfertas(res);

    if (req.method === 'GET' && p === '/atividades') {
    return buscaAtividades(res);
}
    // HOTÉIS
    if (req.method === 'GET' && p === '/hoteis') {
        return buscaHoteis(res);
    }

    const fotosHotelMatch = p.match(/^\/hoteis\/(\d+)\/fotos$/);

    if (req.method === 'GET' && fotosHotelMatch) {
        return buscaFotosHotel(res, fotosHotelMatch[1]);
    }

    const hotelMatch = p.match(/^\/hoteis\/(\d+)$/);

    if (req.method === 'GET' && hotelMatch) {
        return buscaHotelPorId(res, hotelMatch[1]);
    }

    //aeroportos
    if (req.method === 'GET' && p === '/aeroportos') {
    return buscarAeroportos(req, res);
    }

    //voos
    if (req.method === 'GET' && p === '/voos') {
    return buscaVoos(res, rota.query);
    }

    // Páginas
    if (p === '/') return servirArquivoPublico(res, '/index.html');
    if (p === '/destinos/') return servirArquivoPublico(res, '/DESTINOS/index.html');

    if (
        p.startsWith('/css/') ||
        p.startsWith('/js/') ||
        p.startsWith('/img/') ||
        p.startsWith('/uploads/') ||
        p.startsWith('/CADASTRO/') ||
        p.startsWith('/DESTINOS/') ||
        p.startsWith('/VOOS/') ||
        p.startsWith('/HOTEIS/') ||
        p.startsWith('/ATIVIDADES/') ||
        p.startsWith('/OFERTAS/') ||
        p.startsWith('/PERFIL/') ||
        p.startsWith('/CONFIGURAÇÕES/') ||
        p.startsWith('/PAGAMENTOS/') ||
        p.startsWith('/FAVORITOS/') ||
        p.startsWith('/COMPRAR/') ||
        p.startsWith('/TURISMO CONSCIENTE/') ||
        p.endsWith('.html')
    ) {
        return servirArquivoPublico(res, p);
    }

    

    json(res, 404, { error: 'Rota não encontrada.' });
};


//SERVIDOR
const server = http.createServer(callback);
server.listen(PORT, () => {
    console.log(`Servidor BoaTour rodando em http://localhost:${PORT}`);
    console.log('Rotas de usuários: /registro, /login, /usuarios/me, /usuarios/:id, /usuarios/senha, /upload-foto, /logout');
});
