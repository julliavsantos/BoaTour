(() => {
    const adicionarBotaoAssistente = () => {
        if (document.querySelector(".assistente-flutuante")) return;

        // O script cria os botões no DOMContentLoaded, quando currentScript já é null.
        // Use sempre a raiz da origem para evitar acrescentar /CHATBOT/ ou subpastas
        // aos caminhos dos ícones e das páginas.
        const caminhoBase = new URL("/", window.location.origin);
        const estaNoServidorChatbot = window.location.port === "3001";
        const caminhoSite = estaNoServidorChatbot
            ? new URL("/", window.location.protocol + "//" + window.location.hostname + ":3000")
            : caminhoBase;
        const botaoRastreador = document.createElement("a");
        botaoRastreador.className = "assistente-flutuante rastreador-flutuante";
        botaoRastreador.href = new URL("RASTREADOR/index.html", caminhoSite).href;
        botaoRastreador.setAttribute("aria-label", "Rastrear um voo");
        botaoRastreador.innerHTML = `<img src="${new URL("img/icones/mascote03.png", caminhoBase).href}" alt=""><span>Rastrear voos</span>`;
        if (window.location.pathname.includes("/RASTREADOR/")) {
            botaoRastreador.href = "#";
            botaoRastreador.addEventListener("click", evento => {
                evento.preventDefault();
                document.getElementById("btnAbrirModal")?.click();
                document.getElementById("codigoVoo")?.focus();
            });
        }
        document.body.appendChild(botaoRastreador);

        const botao = document.createElement("a");
        botao.className = "assistente-flutuante";
        const estaNoChatbot = window.location.pathname.startsWith("/CHATBOT/public/") || window.location.port === "3001";
        const urlChatbot = new URL("/CHATBOT/public/index.html", window.location.origin);
        const atualizarLinkComTema = () => {
            const escuro = document.body.classList.contains("dark-mode")
                || document.cookie.split("; ").includes("boatour-dark-mode=ativo");
            urlChatbot.searchParams.set("tema", escuro ? "ativo" : "desativado");
            botao.href = urlChatbot.href;
        };
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


