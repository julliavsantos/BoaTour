import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import empresa, { contatoEmpresa } from "./empresa.js";
import identidade from "./bot.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "16kb" }));


// --- PASTAS DO PROJETO ---

const pastaPublic = path.join(__dirname, "../public");

const pastaImgUniversal = path.join(__dirname, "../../img");
const pastaCssUniversal = path.join(__dirname, "../../css");
const pastaJsUniversal = path.join(__dirname, "../../js");



// --- ARQUIVOS ESTÁTICOS ---

// Arquivos próprios do chatbot
app.use(express.static(pastaPublic));
app.use("/CHATBOT/public", express.static(pastaPublic));
app.use("/global-img", express.static(pastaImgUniversal));
app.use("/global-css", express.static(pastaCssUniversal));
app.use("/global-js", express.static(pastaJsUniversal));

// Arquivos universais do BoaTour


// --- PÁGINA PRINCIPAL ---

app.get("/", (req, res) => {
    res.sendFile(path.join(pastaPublic, "index.html"));
});


// --- MEMÓRIA DO CHAT ---

const memoria = [];


// --- BOTÃO DE PROMOÇÕES ---

// Endereço do site principal (onde fica a página de Ofertas)
const URL_SITE = (process.env.URL_SITE || "http://localhost:3000").replace(/\/$/, "");

const acaoPromocoes = {
    texto: "Confira as nossas promoções",
    url: `${URL_SITE}/OFERTAS/index.html`
};

// --- BOTÃO DE DESTINOS ---

// ✏️ MUDE AQUI: texto do botão e caminho da aba de Destinos.
// O botão aparece sozinho sempre que a resposta da Julianinha mencionar a "aba de Destinos"
// (ex.: quando o cliente pergunta preço). Para mudar o gatilho, edite mencionaAbaDestinos() abaixo.
const acaoDestinos = {
    texto: "Ver destinos",
    url: `${URL_SITE}/DESTINOS/index.html`
};

// Remove acentos, maiúsculas e marcas de formatação (**negrito**, `código`) para comparar textos
function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[*_`]/g, "");
}

// A resposta cita a aba de Destinos? (aceita "aba de Destinos", "aba Destinos", "parte de destinos"...)
function mencionaAbaDestinos(texto) {
    return /(aba|pagina|secao|parte|guia)\s+(de\s+|dos\s+)?["'“”‘’«»]?destinos/.test(normalizar(texto));
}


// --- CONTATO ---

// O contato só é enviado quando o cliente pede (o modelo nem conhece o número).
function perguntouSobreContato(texto) {
    return /(contato|telefone|celular|whats|zap|atendente|atendimento humano|suporte|ligar para|ligar pra|me ligar|ligacao|falar com (alguem|uma pessoa|um humano|humano|pessoa|voces|vcs))/.test(normalizar(texto));
}


// O atalho "Dicas de viagem" deste projeto é dedicado às dicas sustentáveis e às ODS.
function perguntouSobreDicasODS(texto) {
    const limpo = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    return /^(dicas de viagem|dicas sobre ods|dicas das ods|ods|turismo sustentavel)$/.test(limpo)
        || /dicas.{0,30}(ods|sustentabil)/.test(limpo)
        || /(ods|objetivos de desenvolvimento sustentavel).{0,30}dicas/.test(limpo);
}

const respostaDicasODS = `Aqui vão dicas práticas para viajar de forma mais sustentável, relacionadas principalmente às ODS 12 e 8:

**1. Reduza o lixo (ODS 12)**
Leve uma garrafa reutilizável e evite plásticos descartáveis. Separe os resíduos quando houver coleta seletiva.

**2. Economize água e energia (ODS 12)**
Reutilize toalhas, apague as luzes e desligue o ar-condicionado ao sair do quarto.

**3. Valorize o comércio local (ODS 8)**
Prefira restaurantes, guias, artesãos e pequenos negócios da região. Assim, sua viagem também fortalece a comunidade.

**4. Respeite a natureza (ODS 12)**
Não deixe lixo em praias e trilhas, não retire elementos naturais e observe os animais à distância.

**5. Escolha deslocamentos conscientes (ODS 12)**
Quando for viável e seguro, caminhe, use bicicleta ou transporte coletivo para conhecer o destino.

**6. Consuma com responsabilidade (ODS 8 e 12)**
Compre apenas o necessário e dê preferência a produtos locais e duráveis.

Pequenas escolhas ajudam a proteger o destino e a valorizar quem vive nele.`;

// Verifica se o cliente está pedindo promoções (ignora acentos e maiúsculas)
function perguntouSobrePromocoes(texto) {
    const limpo = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return /promo|ofert|descont/.test(limpo);
}


// --- ROTA DO CHAT ---

app.post("/chat", async (req, res) => {

    const mensagem = typeof req.body?.mensagem === "string"
        ? req.body.mensagem.trim()
        : "";

    if (!mensagem || mensagem.length > 4000) {
        return res.status(400).json({
            resposta: mensagem ? "A mensagem é muito longa. Envie até 4.000 caracteres." : "Digite uma mensagem para continuar."
        });
    }

    // Responde ao atalho de dicas sustentáveis sem perguntar o destino da viagem.
    if (perguntouSobreDicasODS(mensagem)) {
        memoria.push(
            { role: "user", content: mensagem },
            { role: "assistant", content: respostaDicasODS }
        );
        if (memoria.length > 20) memoria.splice(0, memoria.length - 20);
        return res.json({ resposta: respostaDicasODS });
    }

    // Cliente pediu contato / atendente: responde direto com o número (só aqui o contato é revelado)
    if (perguntouSobreContato(mensagem)) {
        const textoContato = `Claro! Para falar com a nossa equipe, o contato é o celular **${contatoEmpresa.celular}**.`;

        memoria.push(
            { role: "user", content: mensagem },
            { role: "assistant", content: textoContato }
        );
        if (memoria.length > 20) memoria.splice(0, memoria.length - 20);

        return res.json({ resposta: textoContato });
    }

    // Cliente pediu promoções: responde direto com o botão (sem inventar valores)
    if (perguntouSobrePromocoes(mensagem)) {
        const textoPromo = "Claro! Todas as promoções da Boatur ficam na aba de Ofertas. Clique no botão abaixo para conferir.";

        memoria.push(
            { role: "user", content: mensagem },
            { role: "assistant", content: textoPromo }
        );
        if (memoria.length > 20) memoria.splice(0, memoria.length - 20);

        return res.json({
            resposta: textoPromo,
            acao: acaoPromocoes
        });
    }

    const hostOllama = (process.env.OLLAMA_HOST || "http://127.0.0.1:11434").replace(/\/$/, "");
    const modelo = process.env.OLLAMA_MODEL || "gpt-oss:20b-cloud";

    try {
        const resposta = await fetch(`${hostOllama}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(120_000),
            body: JSON.stringify({
                model: modelo,
                stream: false,
                messages: [
                    {
                        role: "system",
                        content: `Instruções do Bot: ${JSON.stringify(identidade.personalidade)}. Dados da Empresa: ${JSON.stringify(empresa)}`
                    },
                    ...memoria,
                    { role: "user", content: mensagem }
                ]
            })
        });

        const corpo = await resposta.json().catch(() => ({}));
        if (!resposta.ok) {
            const erroOllama = corpo.error || `Ollama respondeu com status ${resposta.status}.`;
            const mensagemErro = /model.*(not found|does not exist)|pull model/i.test(erroOllama)
                ? `O modelo "${modelo}" não está disponível no Ollama. Confirme o modelo configurado e execute "ollama pull ${modelo}".`
                : erroOllama;
            throw new Error(mensagemErro);
        }

        const texto = corpo.message?.content?.trim();
        if (!texto) throw new Error("O Ollama respondeu sem texto. Confira se o modelo configurado está funcionando.");

        memoria.push(
            { role: "user", content: mensagem },
            { role: "assistant", content: texto }
        );
        if (memoria.length > 20) memoria.splice(0, memoria.length - 20);

        res.json({
            resposta: texto,
            // Se a resposta mandou o cliente para a aba de Destinos, mostra o botão (senão fica undefined e some do JSON)
            acao: mencionaAbaDestinos(texto) ? acaoDestinos : undefined
        });

    } catch (erro) {
        const codigo = erro.cause?.code;
        let mensagemErro = erro.message || "Falha ao consultar o Ollama.";
        if (codigo === "ECONNREFUSED" || codigo === "ENOTFOUND") {
            mensagemErro = `O Ollama não está acessível em ${hostOllama}. Abra o Ollama e tente novamente.`;
        } else if (erro.name === "TimeoutError" || erro.name === "AbortError") {
            mensagemErro = "O Ollama demorou demais para responder. Tente novamente em instantes.";
        }
        console.error("Falha ao responder no chatbot:", erro);
        res.status(503).json({ resposta: mensagemErro, error: mensagemErro });
    }

});


// --- SERVIDOR ---

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {

    console.log("================================");
    console.log("Chatbot funcionando!");
    console.log(`http://localhost:${PORT}`);
    console.log("================================");

});
