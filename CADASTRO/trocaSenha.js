// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API = "http://localhost:3000";
const CHAVE_EMAIL = "boatourRecuperacaoEmail";
const ESPERA_REENVIO = 30; // segundos

// Token que o servidor entrega depois que o código é validado.
// Fica só em memória (não é salvo no navegador).
let tokenRedefinicao = "";

// Contagem para liberar o botão de reenviar
let temporizador = null;

// ==========================================
// ELEMENTOS
// ==========================================

const logo = document.getElementById("logoBoatour");
const passos = document.getElementById("passos");
const passo1 = document.getElementById("passo1");
const passo2 = document.getElementById("passo2");

const etapas = document.querySelectorAll(".etapa");

const emailMascarado = document.getElementById("emailMascarado");
const blocoCodigo = document.getElementById("codigoInputs");
const campos = Array.from(blocoCodigo.querySelectorAll("input"));
const msgCodigo = document.getElementById("msgCodigo");
const btnConfirmarCodigo = document.getElementById("btnConfirmarCodigo");
const btnReenviar = document.getElementById("btnReenviar");

const novaSenha = document.getElementById("novaSenha");
const confirmarSenha = document.getElementById("confirmarSenha");
const msgSenha = document.getElementById("msgSenha");
const btnSalvarSenha = document.getElementById("btnSalvarSenha");

// ==========================================
// MODO ESCURO (usa a escolha salva no site)
// ==========================================

const modoTemaCookie = document.cookie.match(/(?:^|;\s*)boatour-dark-mode=(ativo|desativado)(?:;|$)/)?.[1];
const modoTemaInicial = modoTemaCookie || localStorage.getItem("boatour-dark-mode") || "desativado";
localStorage.setItem("boatour-dark-mode", modoTemaInicial);
if (!modoTemaCookie) document.cookie = "boatour-dark-mode=" + modoTemaInicial + "; path=/; max-age=31536000; SameSite=Lax";
if (modoTemaInicial === "ativo") {
    document.body.classList.add("dark-mode");
    if (logo) logo.src = "../img/logo/logodarkmode.png";
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function mostrarEtapa(id) {

    etapas.forEach((etapa) => {
        etapa.hidden = etapa.id !== id;
    });

    passos.hidden = id === "etapaSemEmail";

    passo1.classList.remove("ativo", "feito");
    passo2.classList.remove("ativo", "feito");
    passo1.querySelector("span").textContent = "1";
    passo2.querySelector("span").textContent = "2";

    if (id === "etapaCodigo") {
        passo1.classList.add("ativo");
    }

    if (id === "etapaSenha" || id === "etapaSucesso") {
        passo1.classList.add("feito");
        passo1.querySelector("span").textContent = "✓";
    }

    if (id === "etapaSenha") {
        passo2.classList.add("ativo");
    }

    if (id === "etapaSucesso") {
        passo2.classList.add("feito");
        passo2.querySelector("span").textContent = "✓";
    }
}

function setMsg(elemento, texto, sucesso = false) {
    elemento.textContent = texto || "";
    elemento.classList.toggle("sucesso", !!sucesso && !!texto);
}

function setCarregando(botao, carregando, textoCarregando, textoNormal) {
    botao.disabled = carregando;
    botao.textContent = carregando ? textoCarregando : textoNormal;
}

function mascararEmail(email) {
    const [usuario, dominio] = email.split("@");
    if (!dominio) return email;
    const inicio = usuario.slice(0, 2);
    return inicio + "*".repeat(Math.max(usuario.length - 2, 1)) + "@" + dominio;
}

async function post(caminho, corpo) {

    const resposta = await fetch(API + caminho, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    });

    let dados = {};

    try {
        dados = await resposta.json();
    } catch (e) {
        dados = {};
    }

    return { ok: resposta.ok, status: resposta.status, dados };
}

// ==========================================
// E-MAIL DA SOLICITAÇÃO
// ==========================================

const email = (sessionStorage.getItem(CHAVE_EMAIL) || "").trim().toLowerCase();

if (!email) {

    mostrarEtapa("etapaSemEmail");

} else {

    emailMascarado.textContent = mascararEmail(email);
    mostrarEtapa("etapaCodigo");
    campos[0].focus();
    iniciarEspera();
}

// ==========================================
// CAMPOS DO CÓDIGO (6 quadradinhos)
// ==========================================

function erroNoCodigo(texto) {

    setMsg(msgCodigo, texto);

    // reinicia a animação de tremer
    blocoCodigo.classList.remove("erro");
    void blocoCodigo.offsetWidth;
    blocoCodigo.classList.add("erro");
}

function limparErroCodigo() {
    blocoCodigo.classList.remove("erro");
    setMsg(msgCodigo, "");
}

function limparCampos() {
    campos.forEach((campo) => {
        campo.value = "";
        campo.classList.remove("preenchido");
    });
    campos[0].focus();
}

function lerCodigo() {
    return campos.map((campo) => campo.value).join("");
}

campos.forEach((campo, i) => {

    campo.addEventListener("focus", () => campo.select());

    campo.addEventListener("input", () => {

        // só números
        campo.value = campo.value.replace(/\D/g, "").slice(-1);
        campo.classList.toggle("preenchido", campo.value !== "");
        limparErroCodigo();

        if (campo.value !== "" && i < campos.length - 1) {
            campos[i + 1].focus();
        }
    });

    campo.addEventListener("keydown", (e) => {

        if (e.key === "Backspace" && campo.value === "" && i > 0) {
            e.preventDefault();
            campos[i - 1].value = "";
            campos[i - 1].classList.remove("preenchido");
            campos[i - 1].focus();
        }

        if (e.key === "ArrowLeft" && i > 0) {
            e.preventDefault();
            campos[i - 1].focus();
        }

        if (e.key === "ArrowRight" && i < campos.length - 1) {
            e.preventDefault();
            campos[i + 1].focus();
        }

        if (e.key === "Enter") {
            btnConfirmarCodigo.click();
        }
    });

    // Colar o código inteiro de uma vez
    campo.addEventListener("paste", (e) => {

        e.preventDefault();

        const texto = (e.clipboardData || window.clipboardData)
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, campos.length);

        if (!texto) return;

        const inicio = texto.length === campos.length ? 0 : i;

        texto.split("").forEach((digito, k) => {
            const destino = campos[inicio + k];
            if (destino) {
                destino.value = digito;
                destino.classList.add("preenchido");
            }
        });

        limparErroCodigo();

        campos[Math.min(inicio + texto.length, campos.length - 1)].focus();
    });
});

// ==========================================
// CONFIRMAR CÓDIGO (o servidor compara)
// ==========================================

btnConfirmarCodigo.addEventListener("click", async () => {

    const codigo = lerCodigo();

    if (codigo.length < campos.length) {
        erroNoCodigo("Digite os 6 dígitos do código.");
        const vazio = campos.find((campo) => campo.value === "");
        if (vazio) vazio.focus();
        return;
    }

    setCarregando(btnConfirmarCodigo, true, "Verificando...", "Confirmar");

    try {

        const r = await post("/verificarCodigo", { email: email, codigo: codigo });

        if (r.ok && r.dados.token_redefinicao) {

            tokenRedefinicao = r.dados.token_redefinicao;

            mostrarEtapa("etapaSenha");
            novaSenha.focus();

        } else {

            erroNoCodigo(r.dados.error || "Código inválido. Tente novamente.");

            if (r.dados.expirado) {
                liberarReenvio();
            }
        }

    } catch (erro) {

        console.error("Erro ao verificar código:", erro);
        erroNoCodigo("Não foi possível conectar ao servidor.");

    } finally {

        setCarregando(btnConfirmarCodigo, false, "Verificando...", "Confirmar");
    }
});

// ==========================================
// REENVIAR CÓDIGO
// ==========================================

function liberarReenvio() {
    clearInterval(temporizador);
    btnReenviar.disabled = false;
    btnReenviar.textContent = "Reenviar código";
}

function iniciarEspera(segundos = ESPERA_REENVIO) {

    clearInterval(temporizador);

    let restante = segundos;

    btnReenviar.disabled = true;
    btnReenviar.textContent = "Reenviar código (" + restante + "s)";

    temporizador = setInterval(() => {

        restante--;

        if (restante <= 0) {
            liberarReenvio();
        } else {
            btnReenviar.textContent = "Reenviar código (" + restante + "s)";
        }

    }, 1000);
}

btnReenviar.addEventListener("click", async () => {

    btnReenviar.disabled = true;
    btnReenviar.textContent = "Enviando...";

    try {

        const r = await post("/enviarEmail", { email: email });

        if (r.ok && r.dados.mensagem === "Deu certo") {

            limparCampos();
            limparErroCodigo();
            setMsg(msgCodigo, "Novo código enviado! Verifique seu e-mail.", true);
            iniciarEspera();

        } else {

            erroNoCodigo(r.dados.mensagem || "Não foi possível reenviar o código.");
            iniciarEspera(10);
        }

    } catch (erro) {

        console.error("Erro ao reenviar código:", erro);
        erroNoCodigo("Não foi possível conectar ao servidor.");
        iniciarEspera(10);
    }
});

// ==========================================
// MOSTRAR / OCULTAR SENHA
// ==========================================

document.querySelectorAll(".mostrar-senha").forEach((botao) => {

    botao.addEventListener("click", () => {

        const campo = document.getElementById(botao.dataset.target);
        const mostrando = campo.type === "text";

        campo.type = mostrando ? "password" : "text";
        botao.textContent = mostrando ? "👁" : "🙈";
        botao.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
    });
});

// ==========================================
// SALVAR NOVA SENHA
// ==========================================

function erroNaSenha(texto, campo) {
    setMsg(msgSenha, texto);
    novaSenha.classList.remove("erro");
    confirmarSenha.classList.remove("erro");
    if (campo) {
        campo.classList.add("erro");
        campo.focus();
    }
}

[novaSenha, confirmarSenha].forEach((campo) => {
    campo.addEventListener("input", () => {
        campo.classList.remove("erro");
        setMsg(msgSenha, "");
    });
});

novaSenha.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmarSenha.focus();
});

confirmarSenha.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btnSalvarSenha.click();
});

btnSalvarSenha.addEventListener("click", async () => {

    const senha = novaSenha.value;
    const confirmacao = confirmarSenha.value;

    if (!senha) {
        return erroNaSenha("Digite a nova senha.", novaSenha);
    }

    if (senha.length < 6) {
        return erroNaSenha("A senha deve ter pelo menos 6 caracteres.", novaSenha);
    }

    if (!confirmacao) {
        return erroNaSenha("Confirme a nova senha.", confirmarSenha);
    }

    if (senha !== confirmacao) {
        return erroNaSenha("As senhas não coincidem.", confirmarSenha);
    }

    setCarregando(btnSalvarSenha, true, "Salvando...", "Salvar nova senha");

    try {

        const r = await post("/redefinirSenha", {
            email: email,
            token: tokenRedefinicao,
            novaSenha: senha
        });

        if (r.ok) {

            sessionStorage.removeItem(CHAVE_EMAIL);
            tokenRedefinicao = "";
            novaSenha.value = "";
            confirmarSenha.value = "";

            mostrarEtapa("etapaSucesso");

        } else if (r.dados.expirado) {

            // A verificação venceu: volta para a etapa do código
            tokenRedefinicao = "";
            limparCampos();
            mostrarEtapa("etapaCodigo");
            erroNoCodigo(r.dados.error || "Sua verificação expirou. Solicite um novo código.");
            liberarReenvio();

        } else {

            erroNaSenha(r.dados.error || "Não foi possível alterar a senha.");
        }

    } catch (erro) {

        console.error("Erro ao redefinir senha:", erro);
        erroNaSenha("Não foi possível conectar ao servidor.");

    } finally {

        setCarregando(btnSalvarSenha, false, "Salvando...", "Salvar nova senha");
    }
});
