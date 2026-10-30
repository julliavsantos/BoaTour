
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("mensagem");
    const chat = document.getElementById("chat");

    const adicionarMensagem = (autor, mensagem, classe) => {
        const bloco = document.createElement("p");
        bloco.className = `mensagem ${classe}`;
        const nome = document.createElement("strong");
        nome.textContent = `${autor}:`;
        bloco.append(nome, document.createTextNode(` ${mensagem}`));
        chat.appendChild(bloco);
    };


    window.enviar = async function () {

        const mensagem = input.value.trim();

        if (!mensagem) {
            return;
        }

        adicionarMensagem("Você", mensagem, "usuario");

        input.value = "";

        chat.scrollTop = chat.scrollHeight;

        try {

            const resposta = await fetch("/chat", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mensagem: mensagem
                })
            });

            const dados = await resposta.json().catch(() => ({}));
            if (!resposta.ok) {
                adicionarMensagem("Julianinha", dados.resposta || dados.error || "O assistente está temporariamente indisponível.", "bot");
            } else {
                adicionarMensagem("Julianinha", dados.resposta || "Não recebi uma resposta do servidor.", "bot");
            }

        } catch (erro) {

            console.error("Erro ao consultar o assistente:", erro);

            adicionarMensagem("Julianinha", "Não consegui conectar ao servidor.", "bot");
        }

        chat.scrollTop = chat.scrollHeight;
    };


    input.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            enviar();
        }
    });

    const botoesRapidos = document.querySelectorAll(".opcao-rapida");

    botoesRapidos.forEach((botao) => {

        botao.addEventListener("click", () => {

            const texto = botao.querySelector("p").textContent.trim();

            input.value = texto;

            enviar();
        });

    });

    const imagens = document.querySelectorAll(".folder .imagem");
let atual = 0;

console.log("Total de imagens:", imagens.length);

if (imagens.length > 1) {
    setInterval(() => {
        imagens[atual].classList.remove("ativa");

        atual = (atual + 1) % imagens.length;

        imagens[atual].classList.add("ativa");

        console.log("Exibindo imagem:", atual + 1);
    }, 3000);
}
});
