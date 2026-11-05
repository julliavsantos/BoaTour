document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("mensagem");
    const chat = document.getElementById("chat");

    const formatarMensagem = (mensagem) => {
        const elemento = document.createElement("div");
        elemento.className = "mensagem-conteudo";
        const texto = String(mensagem ?? "").trim();

        if (window.marked && window.DOMPurify) {
            const html = window.marked.parse(texto, { gfm: true, breaks: false });
            elemento.innerHTML = window.DOMPurify.sanitize(html);
            elemento.querySelectorAll("table").forEach((tabela) => {
                const wrapper = document.createElement("div");
                wrapper.className = "tabela-mensagem-scroll";
                tabela.parentNode.insertBefore(wrapper, tabela);
                wrapper.appendChild(tabela);
            });
        } else {
            elemento.textContent = texto;
        }
        return elemento;
    };

    const adicionarMensagem = (autor, mensagem, classe, acao) => {
        const bloco = document.createElement("div");
        bloco.className = `mensagem ${classe}`;

        const nome = document.createElement("strong");
        nome.className = "mensagem-autor";
        nome.textContent = `${autor}:`;
        bloco.append(nome, formatarMensagem(mensagem));

        if (acao && acao.texto && acao.url) {
            const botao = document.createElement("a");
            botao.className = "btn-acao-chat";
            botao.href = acao.url;
            botao.textContent = acao.texto;
            bloco.appendChild(botao);
        }
        chat.appendChild(bloco);
        chat.scrollTop = chat.scrollHeight;
    };

    window.enviar = async function () {
        const mensagem = input.value.trim();
        if (!mensagem) return;
        adicionarMensagem("Você", mensagem, "usuario");
        input.value = "";

        try {
            const resposta = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mensagem })
            });
            const dados = await resposta.json().catch(() => ({}));
            adicionarMensagem(
                "Julianinha",
                dados.resposta || dados.error || "Não recebi uma resposta do servidor.",
                "bot",
                dados.acao
            );
        } catch (erro) {
            console.error("Erro ao consultar o assistente:", erro);
            adicionarMensagem("Julianinha", "Não consegui conectar ao servidor.", "bot");
        }
        chat.scrollTop = chat.scrollHeight;
    };

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            enviar();
        }
    });

    document.querySelectorAll(".opcao-rapida").forEach((botao) => {
        botao.addEventListener("click", () => {
            const texto = botao.querySelector("p")?.textContent.trim();
            if (!texto) return;
            input.value = texto;
            enviar();
        });
    });

    const imagens = document.querySelectorAll(".imagem");
    let atual = 0;
    if (imagens.length > 1) {
        setInterval(() => {
            imagens[atual].classList.remove("ativa");
            atual = (atual + 1) % imagens.length;
            imagens[atual].classList.add("ativa");
        }, 3000);
    }
});
