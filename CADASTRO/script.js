
// --- MOSTRAR / OCULTAR SENHA ---

document.querySelectorAll(".mostrar-senha").forEach(botao => {

    botao.addEventListener("click", () => {

        const id = botao.dataset.target;

        const campo = document.getElementById(id);

        if (campo.type === "password") {

            campo.type = "text";

            botao.textContent = "🙈";

        } else {

            campo.type = "password";

            botao.textContent = "👁";

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

const senhaCadastro =
    document.getElementById("senhaCadastro");

const senhaCadastroConfirmar =
    document.getElementById("senhaCadastroConfirmar");

const termo =
    document.getElementById("Termo");


if (btnCadastro) {

    btnCadastro.addEventListener("click", async () => {

        const nome =
            nomeCadastro.value.trim();

        const cpf =
            cpfCadastro.value.trim();

        const email =
            emailCadastro.value.trim();

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


        if (cpfLimpo.length !== 11) {

            window.boatourFieldError(cpfCadastro, "Digite um CPF válido.");

            cpfCadastro.focus();

            return;
        }


        if (!email) {

            window.boatourFieldError(emailCadastro, "Informe seu e-mail.");

            emailCadastro.focus();

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
                "http://localhost:3000/registro",
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
            const resposta = await fetch('http://localhost:3000/enviarEmail', {
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
