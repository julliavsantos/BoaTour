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