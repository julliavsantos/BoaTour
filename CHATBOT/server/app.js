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

app.use(express.json());


// ===============================
// PASTAS DO PROJETO
// ===============================

const pastaPublic = path.join(__dirname, "../public");

const pastaImgUniversal = path.join(__dirname, "../../img");
const pastaCssUniversal = path.join(__dirname, "../../css");
const pastaJsUniversal = path.join(__dirname, "../../js");


// ===============================
// ARQUIVOS ESTÁTICOS
// ===============================

// Arquivos próprios do chatbot
app.use(express.static(pastaPublic));

// Arquivos universais do BoaTour
app.use("/global-img", express.static(pastaImgUniversal));
app.use("/global-css", express.static(pastaCssUniversal));
app.use("/global-js", express.static(pastaJsUniversal));


// ===============================
// PÁGINA PRINCIPAL
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(pastaPublic, "index.html"));
});


// ===============================
// MEMÓRIA DO CHAT
// ===============================

const memoria = [];


// ===============================
// ROTA DO CHAT
// ===============================

app.post("/chat", async (req, res) => {

    const mensagem = req.body.mensagem;

    if (!mensagem) {
        return res.status(400).json({
            erro: "Mensagem vazia"
        });
    }

    memoria.push({
        role: "user",
        content: mensagem
    });

    try {

        const resposta = await fetch(
            `${process.env.OLLAMA_HOST}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model:
                        process.env.OLLAMA_MODEL ||
                        "gpt-oss:20b-cloud",

                    stream: false,

                    messages: [

                        {
                            role: "system",

                            content:
                                `Instruções do Bot: ${JSON.stringify(identidade.personalidade)}.
                                 Dados da Empresa: ${JSON.stringify(empresa)}`
                        },

                        ...memoria

                    ]

                })
            }
        );

        const dados = await resposta.json();

        const texto = dados.message.content;

        memoria.push({
            role: "assistant",
            content: texto
        });

        res.json({
            resposta: texto
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            resposta: "Não consegui conectar ao Ollama."
        });

    }

});


// ===============================
// SERVIDOR
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("================================");
    console.log("Chatbot funcionando!");
    console.log(`http://localhost:${PORT}`);
    console.log("================================");

});