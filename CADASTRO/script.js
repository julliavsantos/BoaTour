
// --- MOSTRAR / OCULTAR SENHA ---

document.querySelectorAll(".mostrar-senha").forEach(botao => {

    botao.addEventListener("click", () => {

        const id = botao.dataset.target;

        const campo = document.getElementById(id);

        if (campo.type === "password") {

            campo.type = "text";

            botao.textContent = "Ocultar";
            botao.setAttribute("aria-label", id === "senhaCadastro" ? "Ocultar senha" : "Ocultar confirmação de senha");

        } else {

            campo.type = "password";

            botao.textContent = "Mostrar";
            botao.setAttribute("aria-label", id === "senhaCadastro" ? "Mostrar senha" : "Mostrar confirmação de senha");

        }

    });

});


// --- CADASTRO DE USUÁRIO ---

const btnCadastro =
    document.getElementById("btnCadastro");

const nomeCadastro =
    document.getElementById("nomeCadastro");

const cpfCadastro =
    document.getElementById("cpfCadastro");

const emailCadastro =
    document.getElementById("emailCadastro");

const telefoneCadastro =
    document.getElementById("telefoneCadastro");

const nascimentoCadastro =
    document.getElementById("nascimentoCadastro");

const senhaCadastro =
    document.getElementById("senhaCadastro");

const senhaCadastroConfirmar =
    document.getElementById("senhaCadastroConfirmar");

const termo =
    document.getElementById("Termo");

const modalDocumentoCadastro = document.getElementById("modalDocumentoCadastro");
const abrirDocumentoCadastro = (titulo, texto) => {
    document.getElementById("tituloDocumentoCadastro").textContent = titulo;
    document.getElementById("textoDocumentoCadastro").replaceChildren(...texto.map(item => {
        const p = document.createElement("p"); p.textContent = item; return p;
    }));
    modalDocumentoCadastro?.showModal();
};
const abrirTermosCadastro = document.getElementById("abrirTermosCadastro");
const abrirPrivacidadeCadastro = document.getElementById("abrirPrivacidadeCadastro");
abrirTermosCadastro?.addEventListener("click", evento => { evento.preventDefault(); evento.stopPropagation(); abrirDocumentoCadastro("Termos de Uso", ["A BoaTour reúne informações de destinos e serviços para apoiar o planejamento de viagens. A disponibilidade, os preços e as condições de cada serviço devem ser conferidos no momento da compra.", "Ao criar uma conta, você declara que os dados informados são corretos e que tem pelo menos 16 anos. Mantenha seus dados de acesso protegidos e use a plataforma de forma responsável."]); });
abrirPrivacidadeCadastro?.addEventListener("click", evento => { evento.preventDefault(); evento.stopPropagation(); abrirDocumentoCadastro("Política de Privacidade", ["Os dados solicitados no cadastro, como nome, CPF, e-mail, telefone e data de nascimento, são usados para criar e administrar sua conta e prestar os serviços da plataforma.", "A BoaTour deve proteger esses dados e limitar seu uso às finalidades do serviço e às obrigações aplicáveis. Para solicitar informações sobre seus dados, use os canais de contato exibidos no site."]); });
for (const el of [abrirTermosCadastro, abrirPrivacidadeCadastro]) el?.addEventListener("keydown", evento => { if (evento.key === "Enter" || evento.key === " ") el.click(); });
document.getElementById("fecharDocumentoCadastro")?.addEventListener("click", () => modalDocumentoCadastro?.close());
document.getElementById("okDocumentoCadastro")?.addEventListener("click", () => modalDocumentoCadastro?.close());

function aplicarMascara(input, limite, formatar) {
    if (!input) return;

    input.addEventListener("input", () => {
        const posicao = input.selectionStart ?? input.value.length;
        const digitosAntes = input.value.slice(0, posicao).replace(/\D/g, "").length;
        const digitos = input.value.replace(/\D/g, "").slice(0, limite);
        const valorFormatado = formatar(digitos, input.value);
        input.value = valorFormatado;

        let novaPosicao = 0;
        let digitosContados = 0;
        while (novaPosicao < valorFormatado.length && digitosContados < digitosAntes) {
            if (/\d/.test(valorFormatado[novaPosicao])) digitosContados++;
            novaPosicao++;
        }
        if (digitosAntes > 0) {
            while (/\D/.test(valorFormatado[novaPosicao] || "") && novaPosicao < valorFormatado.length) {
                novaPosicao++;
            }
        }
        input.setSelectionRange(novaPosicao, novaPosicao);
    });
}

function formatarTelefone(digitos, valorOriginal = "") {
    if (String(valorOriginal).trim().startsWith("+")) return digitos ? `+${digitos}` : "+";
    if (![10, 11].includes(digitos.length)) return digitos;
    if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
    const tamanhoPrefixo = digitos.length > 10 ? 5 : 4;
    const prefixo = `(${digitos.slice(0, 2)}) ${digitos.slice(2, 2 + tamanhoPrefixo)}`;
    const restante = digitos.slice(2 + tamanhoPrefixo);
    return restante ? `${prefixo}-${restante}` : prefixo;
}

function formatarDataNascimento(digitos) {
    let valor = digitos.slice(0, 2);
    if (digitos.length > 2) valor += "/" + digitos.slice(2, 4);
    if (digitos.length > 4) valor += "/" + digitos.slice(4, 8);
    return valor;
}

aplicarMascara(telefoneCadastro, 15, formatarTelefone);
aplicarMascara(nascimentoCadastro, 8, formatarDataNascimento);

function capitalizarNomeCompleto(nome) {
    const particulas = new Set(["da", "das", "de", "do", "dos", "e"]);
    return String(nome || "").trim().toLocaleLowerCase("pt-BR").split(/\s+/).filter(Boolean)
        .map((palavra, indice) => {
            if (indice > 0 && particulas.has(palavra)) return palavra;
            return palavra.split(/([-'])/).map(parte => {
                if (parte === "-" || parte === "'") return parte;
                return parte ? parte.charAt(0).toLocaleUpperCase("pt-BR") + parte.slice(1) : "";
            }).join("");
        }).join(" ");
}

nomeCadastro?.addEventListener("blur", () => {
    nomeCadastro.value = capitalizarNomeCompleto(nomeCadastro.value);
});

emailCadastro?.addEventListener("blur", () => {
    emailCadastro.value = emailCadastro.value.trim().toLocaleLowerCase("pt-BR");
});

function validarCPF(cpf) {
    if (!/^\d{11}$/.test(cpf) || /^([0-9])\1{10}$/.test(cpf)) return false;
    const calcularDigito = (base, pesoInicial) => {
        const soma = base.split("").reduce((total, digito, indice) =>
            total + Number(digito) * (pesoInicial - indice), 0);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };
    return calcularDigito(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
        calcularDigito(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

function validarEmail(email) {
    if (email.length > 254 || /\s/.test(email)) return false;
    const partes = email.split("@");
    if (partes.length !== 2 || partes[0].length > 64 || partes[0].includes("..")) return false;
    return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(partes[0]) &&
        /^(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,}$/i.test(partes[1]);
}

function validarNascimento(valor) {
    const correspondencia = String(valor || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!correspondencia) return { valido: false };
    const dia = Number(correspondencia[1]);
    const mes = Number(correspondencia[2]);
    const ano = Number(correspondencia[3]);
    const hoje = new Date();
    const data = new Date(ano, mes - 1, dia);
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia || data > hoje) {
        return { valido: false };
    }
    let idade = hoje.getFullYear() - ano;
    if (hoje.getMonth() < mes - 1 || (hoje.getMonth() === mes - 1 && hoje.getDate() < dia)) idade--;
    return { valido: true, idade, maioridadeMinima: idade >= 16, iso: `${String(ano).padStart(4, "0")}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}` };
}


if (btnCadastro) {

    btnCadastro.addEventListener("click", async () => {

        const nome = capitalizarNomeCompleto(nomeCadastro.value);
        nomeCadastro.value = nome;

        const cpf =
            cpfCadastro.value.trim();

        const email = emailCadastro.value.trim().toLocaleLowerCase("pt-BR");
        emailCadastro.value = email;

        const telefone = telefoneCadastro.value.trim();
        const telefoneDigitos = telefone.replace(/\D/g, "");
        const telefoneCoreia = telefone.startsWith("+82");
        const nascimento = validarNascimento(nascimentoCadastro.value.trim());

        const senha =
            senhaCadastro.value;

        const senhaConfirmar =
            senhaCadastroConfirmar.value;


        // --- VALIDAÇÕES ---

        if (!nome) {

            window.boatourFieldError(nomeCadastro, "Informe seu nome completo.");

            nomeCadastro.focus();

            return;
        }


        if (!cpf) {

            window.boatourFieldError(cpfCadastro, "Informe seu CPF.");

            cpfCadastro.focus();

            return;
        }


        // Remove pontos e traço do CPF
        const cpfLimpo =
            cpf.replace(/\D/g, "");


        if (!validarCPF(cpfLimpo)) {

            window.boatourFieldError(cpfCadastro, "Digite um CPF válido e não use números repetidos.");

            cpfCadastro.focus();

            return;
        }


        if (!email) {

            window.boatourFieldError(emailCadastro, "Informe seu e-mail.");

            emailCadastro.focus();

            return;
        }

        if (!validarEmail(email)) {
            window.boatourFieldError(emailCadastro, "Digite um e-mail válido.");
            emailCadastro.focus();
            return;
        }

        if (!nascimentoCadastro.value.trim()) {
            window.boatourFieldError(nascimentoCadastro, "Informe sua data de nascimento.");
            nascimentoCadastro.focus();
            return;
        }

        if (!nascimento.valido) {
            window.boatourFieldError(nascimentoCadastro, "Digite uma data de nascimento válida.");
            nascimentoCadastro.focus();
            return;
        }

        if (!nascimento.maioridadeMinima || (telefoneCoreia && nascimento.idade <= 16)) {
            window.boatourFieldError(nascimentoCadastro, telefoneCoreia ? "Para usar um telefone da Coreia do Sul, é necessário ter mais de 16 anos." : "É necessário ter pelo menos 16 anos para criar uma conta.");
            nascimentoCadastro.focus();
            return;
        }

        const telefoneBrasileiro = !telefone.startsWith("+") && [10, 11].includes(telefoneDigitos.length);
        const telefoneInternacional = /^\+[1-9]\d{7,14}$/.test(telefone);
        if (telefone && !telefoneBrasileiro && !telefoneInternacional) {
            window.boatourFieldError(telefoneCadastro, "Digite um telefone brasileiro com DDD ou um número internacional com código do país, como +5511999999999.");
            telefoneCadastro.focus();
            return;
        }


        if (!senha) {

            window.boatourFieldError(senhaCadastro, "Informe uma senha.");

            senhaCadastro.focus();

            return;
        }


        if (senha.length < 6) {

            window.boatourFieldError(senhaCadastro, "A senha precisa ter pelo menos 6 caracteres.");

            senhaCadastro.focus();

            return;
        }


        if (!senhaConfirmar) {

            window.boatourFieldError(senhaCadastroConfirmar, "Confirme sua senha.");

            senhaCadastroConfirmar.focus();

            return;
        }


        if (senha !== senhaConfirmar) {

            window.boatourFieldError(senhaCadastroConfirmar, "As senhas não são iguais.");

            senhaCadastroConfirmar.focus();

            return;
        }


        if (!termo.checked) {

            alert(
                "Você precisa aceitar os Termos de Uso e a Política de Privacidade."
            );

            return;
        }


        // --- ENVIA PARA O SERVIDOR ---

        try {

            const resposta = await fetch(
                "/registro",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nome: nome,

                        cpf: cpfLimpo,

                        email: email,

                        telefone: telefone,

                        data_nascimento: nascimento.iso,

                        senha: senha,

                        termos_aceitos: true

                    })

                }
            );


            const resultado =
                await resposta.json();


            // --- ERRO ---

            if (resultado.error) {
                if (/cpf.*e-?mail|e-?mail.*cpf/i.test(resultado.error)) {
                    window.boatourFieldError(cpfCadastro, resultado.error);
                    window.boatourFieldError(emailCadastro, resultado.error);
                    return;
                }
                const campoErro = /cpf/i.test(resultado.error)
                    ? cpfCadastro
                    : /e-?mail/i.test(resultado.error)
                        ? emailCadastro
                        : /nascimento|16 anos|idade/i.test(resultado.error)
                            ? nascimentoCadastro
                            : /telefone/i.test(resultado.error)
                                ? telefoneCadastro
                        : /senha/i.test(resultado.error)
                            ? senhaCadastro
                            : /nome/i.test(resultado.error)
                                ? nomeCadastro
                                : null;
                if (campoErro) window.boatourFieldError(campoErro, resultado.error);
                else alert(resultado.error);

                return;
            }


            // --- CADASTRO REALIZADO ---

            if (resultado.message) {

    // Guarda a sessão e os dados retornados pelo servidor
    if (resultado.usuario) {
        localStorage.setItem(
            "boatourUsuario",
            JSON.stringify(resultado.usuario)
        );
    }

    if (resultado.session_token) {
        localStorage.setItem(
            "boatourSessionToken",
            resultado.session_token
        );
    }

    // Informa que o cadastro acabou de acontecer
    window.location.href =
        "../index.html?cadastro=sucesso";
}

const PAGINA_REDEFINIR_SENHA = 'trocaSenha.html';

document.addEventListener('DOMContentLoaded', () => {
    const modalLogin = document.getElementById('modalLogin');
    const modalRecuperar = document.getElementById('modalRecuperarSenha');
    const modalAviso = document.getElementById('modalAviso');
    const esqueciSenha = document.getElementById('esqueciSenha');
    const emailRecuperar = document.getElementById('emailRecuperar');
    const erroRecuperar = document.getElementById('erroRecuperar');
    const btnEnviar = document.getElementById('btnEnviarRecuperacao');

    if (!modalLogin || !modalRecuperar || !modalAviso || !esqueciSenha || !emailRecuperar || !btnEnviar) return;

    let acaoOk = () => {};
    const abrir = modal => modal.classList.add('ativo');
    const fechar = modal => modal.classList.remove('ativo');

    function mostrarAviso(tipo, titulo, texto, aoConfirmar) {
        document.getElementById('avisoIcone').textContent = tipo === 'erro' ? '!' : '✓';
        document.getElementById('avisoIcone').classList.toggle('erro', tipo === 'erro');
        document.getElementById('avisoTitulo').textContent = titulo;
        document.getElementById('avisoTexto').textContent = texto;
        acaoOk = aoConfirmar || (() => {});
        abrir(modalAviso);
    }

    esqueciSenha.addEventListener('click', event => {
        event.preventDefault();
        erroRecuperar.textContent = '';
        fechar(modalLogin);
        abrir(modalRecuperar);
        setTimeout(() => emailRecuperar.focus(), 150);
    });

    document.getElementById('fecharRecuperar').addEventListener('click', () => fechar(modalRecuperar));
    document.getElementById('voltarParaLogin').addEventListener('click', event => {
        event.preventDefault();
        fechar(modalRecuperar);
        abrir(modalLogin);
    });
    document.getElementById('btnAvisoOk').addEventListener('click', () => {
        fechar(modalAviso);
        acaoOk();
    });
    modalRecuperar.addEventListener('click', event => {
        if (event.target === modalRecuperar) fechar(modalRecuperar);
    });
    emailRecuperar.addEventListener('keydown', event => {
        if (event.key === 'Enter') btnEnviar.click();
    });

    btnEnviar.addEventListener('click', async () => {
        const email = emailRecuperar.value.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            erroRecuperar.textContent = 'Digite um e-mail válido.';
            emailRecuperar.focus();
            return;
        }

        erroRecuperar.textContent = '';
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        try {
            const resposta = await fetch('/enviarEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const resultado = await resposta.json();
            if (!resposta.ok) throw new Error(resultado.error || 'Não foi possível enviar o código.');

            fechar(modalRecuperar);
            mostrarAviso('sucesso', 'E-mail enviado!', 'Enviamos um código de recuperação para ' + email + '.', () => {
                sessionStorage.setItem('boatourRecuperacaoEmail', email);
                window.location.href = PAGINA_REDEFINIR_SENHA;
            });
        } catch (erro) {
            fechar(modalRecuperar);
            mostrarAviso('erro', 'Não foi possível enviar', erro.message, () => abrir(modalRecuperar));
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar código';
        }
    });

    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get('recuperar') === '1') {
        abrir(modalRecuperar);
        setTimeout(() => emailRecuperar.focus(), 150);
    } else if (parametros.get('login') === '1') {
        abrir(modalLogin);
    }
});

        } catch (error) {

            console.error(
                "Erro ao cadastrar:",
                error
            );

            alert(
                "Não foi possível conectar ao servidor."
            );

        }

    });

}
