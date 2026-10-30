import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import empresa from "./empresa.js";
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

// Recursos compartilhados continuam acessíveis quando o chatbot é aberto isoladamente.
app.use("/css", express.static(pastaCssUniversal));
app.use("/img", express.static(pastaImgUniversal));
app.use("/js", express.static(pastaJsUniversal));
// Arquivos próprios do chatbot
app.use(express.static(pastaPublic));
app.use("/CHATBOT/public", express.static(pastaPublic));

// Arquivos universais do BoaTour
app.use("/global-img", express.static(pastaImgUniversal));
app.use("/global-css", express.static(pastaCssUniversal));
app.use("/global-js", express.static(pastaJsUniversal));


// --- PÁGINA PRINCIPAL ---

app.get("/", (req, res) => {
    res.sendFile(path.join(pastaPublic, "index.html"));
});


// --- MEMÓRIA DO CHAT ---

const memoria = [];


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
            resposta: texto
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
