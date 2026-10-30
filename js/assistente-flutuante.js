(() => {
    const adicionarBotaoAssistente = () => {
        if (document.querySelector(".assistente-flutuante")) return;

        const caminhoBase = document.currentScript?.src
            ? new URL("../", document.currentScript.src)
            : new URL("../", window.location.href);
        const botao = document.createElement("a");
        botao.className = "assistente-flutuante";
        const hostname = window.location.hostname || "localhost";
        const protocolo = window.location.protocol === "https:" ? "https:" : "http:";
        const urlChatbot = new URL("/CHATBOT/public/index.html", window.location.origin);
        const atualizarLinkComTema = () => {
            const escuro = document.body.classList.contains("dark-mode")
                || document.cookie.split("; ").includes("boatour-dark-mode=ativo");
            urlChatbot.searchParams.set("tema", escuro ? "ativo" : "desativado");
            botao.href = urlChatbot.href;
        };
        const estaNoChatbot = window.location.pathname.startsWith("/CHATBOT/public/") || window.location.port === "3001";
        atualizarLinkComTema();
        if (estaNoChatbot) {
            botao.href = "#mensagem";
            botao.addEventListener("click", evento => {
                evento.preventDefault();
                const campoMensagem = document.getElementById("mensagem");
                campoMensagem?.scrollIntoView({ behavior: "smooth", block: "center" });
                campoMensagem?.focus();
            });
        } else {
            botao.addEventListener("click", atualizarLinkComTema);
            botao.target = "_blank";
            botao.rel = "noopener noreferrer";
        }
        botao.setAttribute("aria-label", estaNoChatbot ? "Ir para o campo de mensagem do assistente" : "Abrir assistente virtual BoaTour em uma nova aba");
        botao.innerHTML = `<img src="${new URL("img/icones/mascote.png", caminhoBase).href}" alt=""><span>Fale com a Julianinha</span>`;
        document.body.appendChild(botao);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", adicionarBotaoAssistente, { once: true });
    } else {
        adicionarBotaoAssistente();
    }
})();
