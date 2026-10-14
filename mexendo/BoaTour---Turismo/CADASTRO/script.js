const fotoPerfil = document.querySelector(".foto-viajante");

if (fotoPerfil) {
    fotoPerfil.addEventListener("click", () => {
        window.location.href = "../PERFIL/index.html";
    });
}
// ==========================================
// MOSTRAR / OCULTAR SENHA
// ==========================================

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


// ==========================================
// CADASTRO DE USUÁRIO
// ==========================================

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


        // ==========================================
        // VALIDAÇÕES
        // ==========================================

        if (!nome) {

            alert("Digite seu nome completo.");

            nomeCadastro.focus();

            return;
        }


        if (!cpf) {

            alert("Digite seu CPF.");

            cpfCadastro.focus();

            return;
        }


        // Remove pontos e traço do CPF
        const cpfLimpo =
            cpf.replace(/\D/g, "");


        if (cpfLimpo.length !== 11) {

            alert("Digite um CPF válido.");

            cpfCadastro.focus();

            return;
        }


        if (!email) {

            alert("Digite seu e-mail.");

            emailCadastro.focus();

            return;
        }


        if (!senha) {

            alert("Digite uma senha.");

            senhaCadastro.focus();

            return;
        }


        if (senha.length < 6) {

            alert(
                "A senha deve ter pelo menos 6 caracteres."
            );

            senhaCadastro.focus();

            return;
        }


        if (!senhaConfirmar) {

            alert(
                "Confirme sua senha."
            );

            senhaCadastroConfirmar.focus();

            return;
        }


        if (senha !== senhaConfirmar) {

            alert(
                "As senhas não são iguais."
            );

            senhaCadastroConfirmar.focus();

            return;
        }


        if (!termo.checked) {

            alert(
                "Você precisa aceitar os Termos de Uso e a Política de Privacidade."
            );

            return;
        }


        // ==========================================
        // ENVIA PARA O SERVIDOR
        // ==========================================

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


            // ==========================================
            // ERRO
            // ==========================================

            if (resultado.error) {

                alert(resultado.error);

                return;
            }


            // ==========================================
            // CADASTRO REALIZADO
            // ==========================================

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

// ==========================================
// ESQUECI MINHA SENHA (modais)
// ==========================================

// Página que abre depois do OK (a que pede o código enviado por e-mail)
const PAGINA_REDEFINIR_SENHA = "trocaSenha.html";

document.addEventListener("DOMContentLoaded", function () {

    const modalLogin = document.getElementById("modalLogin");
    const modalRecuperar = document.getElementById("modalRecuperarSenha");
    const modalAviso = document.getElementById("modalAviso");

    const esqueciSenha = document.getElementById("esqueciSenha");
    const fecharRecuperar = document.getElementById("fecharRecuperar");
    const voltarParaLogin = document.getElementById("voltarParaLogin");
    const emailRecuperar = document.getElementById("emailRecuperar");
    const erroRecuperar = document.getElementById("erroRecuperar");
    const btnEnviar = document.getElementById("btnEnviarRecuperacao");

    const avisoIcone = document.getElementById("avisoIcone");
    const avisoTitulo = document.getElementById("avisoTitulo");
    const avisoTexto = document.getElementById("avisoTexto");
    const btnAvisoOk = document.getElementById("btnAvisoOk");

    if (!esqueciSenha || !modalRecuperar || !modalAviso) return;

    // Ação do botão OK do aviso (muda conforme sucesso/erro)
    let acaoOk = () => {};

    function abrir(modal) { modal.classList.add("ativo"); }
    function fechar(modal) { modal.classList.remove("ativo"); }

    function mostrarErro(texto) {
        erroRecuperar.textContent = texto || "";
    }

    function mostrarAviso({ tipo, titulo, texto, aoConfirmar }) {
        const erro = tipo === "erro";
        avisoIcone.textContent = erro ? "!" : "✓";
        avisoIcone.classList.toggle("erro", erro);
        avisoTitulo.textContent = titulo;
        avisoTexto.textContent = texto;
        acaoOk = aoConfirmar || (() => {});
        abrir(modalAviso);
    }

    // Login -> Recuperar senha
    esqueciSenha.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarErro("");
        fechar(modalLogin);
        abrir(modalRecuperar);
        setTimeout(() => emailRecuperar.focus(), 150);
    });

    // Recuperar senha -> volta para o login
    voltarParaLogin.addEventListener("click", (e) => {
        e.preventDefault();
        fechar(modalRecuperar);
        abrir(modalLogin);
    });

    fecharRecuperar.addEventListener("click", () => fechar(modalRecuperar));

    modalRecuperar.addEventListener("click", (e) => {
        if (e.target === modalRecuperar) fechar(modalRecuperar);
    });

    // Botão OK do aviso
    btnAvisoOk.addEventListener("click", () => {
        fechar(modalAviso);
        acaoOk();
    });

    // Enter envia o formulário
    emailRecuperar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") btnEnviar.click();
    });

    // Enviar código
    btnEnviar.addEventListener("click", async () => {

        const email = emailRecuperar.value.trim();

        if (!email) {
            mostrarErro("Digite o seu e-mail.");
            emailRecuperar.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarErro("Digite um e-mail válido.");
            emailRecuperar.focus();
            return;
        }

        mostrarErro("");
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";

        try {
            const resposta = await fetch("http://localhost:3000/enviarEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email })
            });

            const resultado = await resposta.json();

            if (resposta.ok && resultado.mensagem === "Deu certo") {
                fechar(modalRecuperar);
                mostrarAviso({
                    tipo: "sucesso",
                    titulo: "E-mail enviado!",
                    texto: "Enviamos um código de recuperação para " + email +
                           ". Clique em OK para continuar.",
                    aoConfirmar: () => {
                        // A página de redefinição precisa saber qual e-mail está em recuperação
                        sessionStorage.setItem("boatourRecuperacaoEmail", email.toLowerCase());
                        window.location.href = PAGINA_REDEFINIR_SENHA;
                    }
                });
            } else {
                fechar(modalRecuperar);
                mostrarAviso({
                    tipo: "erro",
                    titulo: "Não foi possível enviar",
                    texto: "Ocorreu um erro ao processar a solicitação. Tente novamente.",
                    aoConfirmar: () => abrir(modalRecuperar)
                });
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
            fechar(modalRecuperar);
            mostrarAviso({
                tipo: "erro",
                titulo: "Sem conexão",
                texto: "Não foi possível conectar ao servidor.",
                aoConfirmar: () => abrir(modalRecuperar)
            });
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar código";
        }
    });
});

// Abre o modal de login automaticamente quando a URL traz ?login=1
// (usado pelo botão "Ir para o login" depois de redefinir a senha)
document.addEventListener("DOMContentLoaded", function () {
    if (new URLSearchParams(window.location.search).get("login") === "1") {
        const modal = document.getElementById("modalLogin");
        if (modal) modal.classList.add("ativo");
    }
});
