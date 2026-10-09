const fotoPerfil = document.querySelector(".foto-viajante");

if (fotoPerfil) {
    fotoPerfil.addEventListener("click", () => {
        window.location.href = "../../PERFIL/index.html";
    });
}
document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("mensagem");
    const chat = document.getElementById("chat");


    window.enviar = async function () {

        const mensagem = input.value.trim();

        if (!mensagem) {
            return;
        }

        chat.innerHTML += `
            <p class="mensagem usuario">
                <strong>Você:</strong>
                ${mensagem}
            </p>
        `;

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

            if (!resposta.ok) {
                throw new Error("Erro na resposta do servidor");
            }

            const dados = await resposta.json();

            chat.innerHTML += `
                <p class="mensagem bot">
                    <strong>Julianinha:</strong>
                    ${dados.resposta}
                </p>
            `;

        } catch (erro) {

            console.error("Erro:", erro);

            chat.innerHTML += `
                <p class="mensagem bot">
                    <strong>Julianinha:</strong>
                    Não consegui conectar ao servidor.
                </p>
            `;
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

    const imagens = document.querySelectorAll(".imagem");

    let atual = 0;

    if (imagens.length > 1) {

        setInterval(() => {

            imagens[atual].classList.remove("ativa");

            atual++;

            if (atual >= imagens.length) {
                atual = 0;
            }

            imagens[atual].classList.add("ativa");

        }, 3000);
    }

});