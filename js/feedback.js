// Avisos e confirmações com o visual compartilhado do BoaTour.
(() => {
    const estilo = document.createElement("style");
    estilo.textContent = `
        .boatour-feedback-stack { position: fixed; z-index: 200000; top: 24px; right: 24px; display: grid; gap: 12px; width: min(390px, calc(100vw - 32px)); pointer-events: none; }
        .boatour-feedback { display: grid; grid-template-columns: 38px 1fr 32px; align-items: center; gap: 12px; padding: 15px 14px; border: 1px solid var(--border, #dce5e5); border-left: 4px solid var(--feedback-color, #c56b57); border-radius: 16px; background: linear-gradient(135deg, var(--card, #fff), color-mix(in srgb, var(--feedback-color, #c56b57) 5%, var(--card, #fff))); color: var(--text, #263638); box-shadow: 0 16px 38px rgb(21 45 48 / 20%); font: 500 14px/1.45 'Plus Jakarta Sans', sans-serif; pointer-events: auto; animation: boatour-feedback-in 240ms ease-out; backdrop-filter: blur(12px); }
        .boatour-feedback[data-type="success"] { --feedback-color: #3e9278; }
        .boatour-feedback[data-type="warning"] { --feedback-color: #d39a34; }
        .boatour-feedback__icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: color-mix(in srgb, var(--feedback-color) 13%, transparent); color: var(--feedback-color); font-size: 18px; font-weight: 800; }
        .boatour-feedback__message { margin: 0; overflow-wrap: anywhere; }
        .boatour-feedback__close { display: grid; place-items: center; align-self: center; width: 30px; height: 30px; margin: 0; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--muted, #68797b); font: 21px/1 'Plus Jakarta Sans', sans-serif; text-align: center; cursor: pointer; }
        .boatour-feedback__close:hover { background: var(--hover, #edf3f3); color: var(--text, #263638); }
        .boatour-input-error { border-color: #c65353 !important; box-shadow: 0 0 0 3px rgb(198 83 83 / 14%) !important; }
        .boatour-field-error { display: block; width: 100%; margin: 6px 0 0; color: #b34444; font: 500 12px/1.4 'Plus Jakarta Sans', sans-serif; }
        .boatour-dialog-backdrop { position: fixed; z-index: 200001; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(18 35 37 / 58%); backdrop-filter: blur(3px); }
        .boatour-dialog { width: min(440px, 100%); padding: 28px; border: 1px solid var(--border, #dce5e5); border-radius: 20px; background: var(--card, #fff); color: var(--text, #263638); box-shadow: 0 24px 70px rgb(0 0 0 / 22%); font-family: 'Plus Jakarta Sans', sans-serif; animation: boatour-dialog-in 180ms ease-out; }
        .boatour-dialog__icon { display: grid; place-items: center; width: 48px; height: 48px; margin-bottom: 16px; border-radius: 15px; background: color-mix(in srgb, var(--primary, #518d93) 13%, transparent); color: var(--primary-dark, #32686d); font-size: 24px; }
        .boatour-dialog h2 { margin: 0 0 8px; color: var(--heading, var(--text, #263638)); font-size: 20px; }
        .boatour-dialog p { margin: 0; color: var(--muted, #68797b); font-size: 14px; line-height: 1.55; }
        .boatour-dialog input { width: 100%; height: 46px; margin-top: 18px; padding: 0 13px; border: 1px solid var(--border, #dce5e5); border-radius: 10px; background: var(--surface, #fff); color: var(--text, #263638); font: inherit; outline: none; }
        .boatour-dialog input:focus { border-color: var(--primary, #518d93); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary, #518d93) 17%, transparent); }
        .boatour-dialog__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
        .boatour-dialog__actions button { min-height: 42px; padding: 0 16px; border: 1px solid var(--border, #dce5e5); border-radius: 10px; background: var(--surface-alt, #f4f7f7); color: var(--text, #263638); font: 600 14px 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: transform 180ms ease, background-color 180ms ease; }
        .boatour-dialog__actions button:hover { transform: translateY(-1px); background: var(--hover, #edf3f3); }
        .boatour-dialog__actions .boatour-dialog__confirm { border-color: transparent; background: var(--primary, #518d93); color: #fff; }
        .boatour-dialog__actions .boatour-dialog__confirm:hover { background: var(--primary-dark, #32686d); }
        .boatour-dialog__actions .boatour-dialog__danger { background: #b84e49; color: #fff; }
        .boatour-dialog__actions .boatour-dialog__danger:hover { background: #963d39; }
        @keyframes boatour-feedback-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes boatour-dialog-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (max-width: 600px) { .boatour-feedback-stack { top: 12px; right: 12px; width: calc(100vw - 24px); } .boatour-dialog { padding: 23px; } }
        @media (prefers-reduced-motion: reduce) { .boatour-feedback, .boatour-dialog { animation: none; } .boatour-dialog__actions button { transition: none; } }
    `;
    document.head.appendChild(estilo);

    function formatarCpf(valor) {
        const digitos = String(valor || "").replace(/\D/g, "").slice(0, 11);
        let formatado = digitos.slice(0, 3);
        if (digitos.length > 3) formatado += "." + digitos.slice(3, 6);
        if (digitos.length > 6) formatado += "." + digitos.slice(6, 9);
        if (digitos.length > 9) formatado += "-" + digitos.slice(9, 11);
        return formatado;
    }

    window.boatourFormatCpf = formatarCpf;

    function ehCampoCpf(campo) {
        return campo instanceof HTMLInputElement && campo.id.toLowerCase().includes("cpf");
    }

    function prepararCampoCpf(campo) {
        campo.type = "text";
        campo.inputMode = "numeric";
        campo.maxLength = 14;
        if (!campo.placeholder || campo.placeholder.toLowerCase() === "cpf") {
            campo.placeholder = "000.000.000-00";
        }
        const valorFormatado = formatarCpf(campo.value);
        if (campo.value !== valorFormatado) campo.value = valorFormatado;
    }

    document.querySelectorAll("input").forEach(campo => {
        if (ehCampoCpf(campo)) prepararCampoCpf(campo);
    });

    document.addEventListener("input", evento => {
        const campo = evento.target;
        if (!ehCampoCpf(campo)) return;

        const posicao = campo.selectionStart ?? campo.value.length;
        const digitosAntes = campo.value.slice(0, posicao).replace(/\D/g, "").length;
        const valorFormatado = formatarCpf(campo.value);
        if (campo.value === valorFormatado) return;
        campo.value = valorFormatado;

        let novaPosicao = 0;
        let contagem = 0;
        while (novaPosicao < valorFormatado.length && contagem < digitosAntes) {
            if (/\d/.test(valorFormatado[novaPosicao])) contagem++;
            novaPosicao++;
        }
        campo.setSelectionRange(novaPosicao, novaPosicao);
    });

    let pilha;
    function obterPilha() {
        if (pilha?.isConnected) return pilha;
        pilha = document.createElement("div");
        pilha.className = "boatour-feedback-stack";
        pilha.setAttribute("aria-live", "polite");
        pilha.setAttribute("aria-relevant", "additions");
        document.body.appendChild(pilha);
        return pilha;
    }

    window.boatourFeedback = (mensagem, tipo) => {
        const texto = String(mensagem ?? "").trim();
        if (!texto) return;
        const tipoDetectado = tipo || (/sucesso|realizado|realizada|atualizado|atualizada|alterado|alterada|exclu[ií]d[oa]|cadastrad[oa]/i.test(texto) ? "success" : (/selecione|preencha|digite|informe|deve ter|inválid|incorret/i.test(texto) ? "warning" : "error"));
        const aviso = document.createElement("div");
        aviso.className = "boatour-feedback";
        aviso.dataset.type = tipoDetectado;
        aviso.setAttribute("role", tipoDetectado === "error" ? "alert" : "status");
        const icones = { success: "✓", warning: "!", error: "×" };
        const icone = document.createElement("span");
        icone.className = "boatour-feedback__icon";
        icone.setAttribute("aria-hidden", "true");
        icone.textContent = icones[tipoDetectado] || "i";
        const textoAviso = document.createElement("p");
        textoAviso.className = "boatour-feedback__message";
        textoAviso.textContent = texto;
        const fechar = document.createElement("button");
        fechar.type = "button";
        fechar.className = "boatour-feedback__close";
        fechar.setAttribute("aria-label", "Fechar aviso");
        fechar.textContent = "×";
        const remover = () => {
            aviso.remove();
            document.removeEventListener("keydown", fecharAoDigitar);
        };
        const fecharAoDigitar = evento => {
            if (evento.isComposing) return;
            remover();
        };
        fechar.addEventListener("click", remover);
        document.addEventListener("keydown", fecharAoDigitar);
        aviso.append(icone, textoAviso, fechar);
        obterPilha().appendChild(aviso);
        window.setTimeout(remover, tipoDetectado === "success" ? 4200 : 6500);
    };

    window.alert = mensagem => window.boatourFeedback(mensagem);

    window.boatourClearFieldError = inputOuId => {
        const input = typeof inputOuId === "string"
            ? document.getElementById(inputOuId)
            : inputOuId;
        if (!input) return;
        input.classList.remove("boatour-input-error");
        input.setAttribute("aria-invalid", "false");
        const erro = input._boatourFieldError;
        if (erro) {
            const descricao = (input.getAttribute("aria-describedby") || "")
                .split(/\s+/)
                .filter(id => id && id !== erro.id);
            if (descricao.length) input.setAttribute("aria-describedby", descricao.join(" "));
            else input.removeAttribute("aria-describedby");
            erro.remove();
        }
        delete input._boatourFieldError;
    };

    window.boatourFieldError = (inputOuId, mensagem) => {
        const input = typeof inputOuId === "string"
            ? document.getElementById(inputOuId)
            : inputOuId;
        if (!input) {
            window.boatourFeedback(mensagem, "warning");
            return;
        }

        window.boatourClearFieldError(input);
        input.classList.add("boatour-input-error");
        input.setAttribute("aria-invalid", "true");
        const erro = document.createElement("small");
        erro.className = "boatour-field-error";
        erro.textContent = String(mensagem || "Campo obrigatório.");
        erro.id = `erro-${input.id || Math.random().toString(36).slice(2)}`;
        input._boatourFieldError = erro;

        const descricaoExistente = input.getAttribute("aria-describedby");
        input.setAttribute("aria-describedby", [descricaoExistente, erro.id].filter(Boolean).join(" "));
        const ancora = input.closest(".input-data, .campo-senha") || input;
        ancora.insertAdjacentElement("afterend", erro);

        if (!input._boatourClearOnInput) {
            input._boatourClearOnInput = () => window.boatourClearFieldError(input);
            input.addEventListener("input", input._boatourClearOnInput);
        }
    };

    document.addEventListener("invalid", evento => {
        const campo = evento.target;
        if (!(campo instanceof HTMLInputElement || campo instanceof HTMLSelectElement || campo instanceof HTMLTextAreaElement)) return;

        let mensagem = "Confira este campo.";
        if (campo.validity.valueMissing) mensagem = "Este campo é obrigatório.";
        else if (campo.validity.typeMismatch && campo.type === "email") mensagem = "Digite um e-mail válido.";
        else if (campo.validity.tooShort) mensagem = `Digite pelo menos ${campo.minLength} caracteres.`;
        else if (campo.validity.patternMismatch) mensagem = "Confira o formato informado.";

        evento.preventDefault();
        window.boatourFieldError(campo, mensagem);
    }, true);

    function abrirDialogo({ titulo, mensagem, tipo = "confirm", placeholder = "", textoConfirmar, perigoso = false }) {
        return new Promise(resolve => {
            const fundo = document.createElement("div");
            fundo.className = "boatour-dialog-backdrop";
            const dialogo = document.createElement("section");
            dialogo.className = "boatour-dialog";
            dialogo.setAttribute("role", tipo === "prompt" ? "dialog" : "alertdialog");
            dialogo.setAttribute("aria-modal", "true");
            const icone = tipo === "prompt" ? "✎" : "!";
            dialogo.innerHTML = `<div class="boatour-dialog__icon" aria-hidden="true">${icone}</div><h2></h2><p></p>`;
            dialogo.querySelector("h2").textContent = titulo;
            dialogo.querySelector("p").textContent = mensagem;
            let entrada;
            if (tipo === "prompt") {
                entrada = document.createElement("input");
                entrada.type = "password";
                entrada.placeholder = placeholder;
                entrada.autocomplete = "current-password";
                entrada.setAttribute("aria-label", placeholder);
                dialogo.appendChild(entrada);
            }
            const acoes = document.createElement("div");
            acoes.className = "boatour-dialog__actions";
            const cancelar = document.createElement("button");
            cancelar.type = "button";
            cancelar.textContent = "Cancelar";
            const confirmar = document.createElement("button");
            confirmar.type = "button";
            confirmar.className = `boatour-dialog__confirm${perigoso ? " boatour-dialog__danger" : ""}`;
            confirmar.textContent = textoConfirmar || (tipo === "prompt" ? "Continuar" : "Confirmar");
            acoes.append(cancelar, confirmar);
            dialogo.appendChild(acoes);
            fundo.appendChild(dialogo);
            document.body.appendChild(fundo);

            let concluido = false;
            const finalizar = valor => {
                if (concluido) return;
                concluido = true;
                document.removeEventListener("keydown", teclado);
                fundo.remove();
                resolve(valor);
            };
            const teclado = evento => {
                if (evento.key === "Escape") finalizar(tipo === "prompt" ? null : false);
                if (evento.key === "Enter" && tipo === "prompt") finalizar(entrada.value);
            };
            cancelar.addEventListener("click", () => finalizar(tipo === "prompt" ? null : false));
            confirmar.addEventListener("click", () => finalizar(tipo === "prompt" ? entrada.value : true));
            fundo.addEventListener("click", evento => {
                if (evento.target === fundo) finalizar(tipo === "prompt" ? null : false);
            });
            document.addEventListener("keydown", teclado);
            (entrada || confirmar).focus();
        });
    }

    window.boatourConfirm = mensagem => abrirDialogo({
        titulo: "Confirme a ação",
        mensagem,
        textoConfirmar: "Excluir conta",
        perigoso: true
    });
    window.boatourPrompt = (mensagem, placeholder = "Digite sua senha") => abrirDialogo({
        titulo: "Confirme sua identidade",
        mensagem,
        tipo: "prompt",
        placeholder,
        textoConfirmar: "Continuar",
        perigoso: true
    });
})();
