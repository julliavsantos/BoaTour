const { spawn } = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const services = [
    {
        name: "API BoaTour",
        port: 3000,
        cwd: projectRoot,
        entry: path.join(projectRoot, "servidor", "app.js")
    },
    {
        name: "Chatbot",
        port: Number(process.env.CHATBOT_PORT || 3001),
        cwd: path.join(projectRoot, "CHATBOT"),
        entry: path.join(projectRoot, "CHATBOT", "server", "app.js"),
        env: {
            ...process.env,
            PORT: process.env.CHATBOT_PORT || "3001"
        }
    }
];

let encerrando = false;
const processos = [];
let processosAtivos = 0;

function encerrar() {
    if (encerrando) return;
    encerrando = true;

    for (const processo of processos) {
        if (processo.exitCode === null && !processo.killed) {
            processo.kill("SIGTERM");
        }
    }

}

function portaDisponivel(porta) {
    return new Promise((resolve, reject) => {
        const servidorTeste = net.createServer();

        servidorTeste.once("error", erro => {
            if (erro.code === "EADDRINUSE") {
                resolve(false);
            } else {
                reject(erro);
            }
        });

        servidorTeste.listen(porta, () => {
            servidorTeste.close(erro => {
                if (erro) reject(erro);
                else resolve(true);
            });
        });
    });
}

async function iniciarServicos() {
    for (const servico of services) {
        if (!(await portaDisponivel(servico.port))) {
            console.log(
                `${servico.name} já está rodando (porta ${servico.port}); vou usar essa instância.`
            );
            continue;
        }

        console.log(`Iniciando ${servico.name} na porta ${servico.port}...`);

        const processo = spawn(
            process.execPath,
            [servico.entry],
            {
                cwd: servico.cwd,
                env: servico.env || process.env,
                stdio: "inherit",
                windowsHide: true
            }
        );

        processos.push(processo);
        processosAtivos++;

        processo.on("error", erro => {
            console.error(`Falha ao iniciar ${servico.name}:`, erro.message);
        });

        processo.on("exit", (codigo, sinal) => {
            processosAtivos--;
            if (encerrando) return;

            console.error(
                `${servico.name} encerrou${sinal ? ` (${sinal})` : ` com código ${codigo}`}.`
            );

            if (processosAtivos === 0) {
                process.exitCode = codigo || 1;
            }
        });
    }

    console.log("API: http://localhost:3000 | Chatbot: http://localhost:3001");
    console.log("Use Ctrl+C para encerrar os serviços iniciados por este comando.");
}

iniciarServicos().catch(erro => {
    console.error("Não foi possível iniciar os serviços:", erro.message);
    process.exitCode = 1;
});

process.on("SIGINT", encerrar);
process.on("SIGTERM", encerrar);
