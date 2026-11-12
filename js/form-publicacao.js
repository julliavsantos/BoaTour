
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#formPublicacaoViagem");
    const abrir = document.querySelector("#abrirFormularioPublicacao");
    const cancelar = document.querySelector("#cancelarPublicacao");
    const inputFotos = document.querySelector("#fotosViagem");
    const compra = document.querySelector("#compraViagem");
    const nomeArquivos = document.querySelector("#nomeArquivosViagem");
    const previa = document.querySelector("#previaFotosViagem");
    const mensagem = document.querySelector("#mensagemPublicacao");
    const enviar = document.querySelector("#enviarPublicacao");
    const opcoesNota = Array.from(form?.querySelectorAll('input[name="nota_experiencia"]') || []);

    if (!form || !abrir || !inputFotos || !previa || !mensagem || !enviar || !compra) {
        console.error("Não foi possível encontrar todos os elementos do formulário.");
        return;
    }

    const API = window.location.origin;
    let urlsPrevias = [];
    let comprasElegiveis = [];

    function mostrarModalCompras(mensagemModal, tituloModal = "Compartilhe uma viagem", oferecerLogin = false) {
        let modal = document.querySelector("#modalSemComprasGaleria");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "modalSemComprasGaleria";
            modal.className = "modal-sem-compras-galeria";
            modal.hidden = true;
            modal.innerHTML = `<section class="modal-sem-compras-galeria__painel" role="dialog" aria-modal="true" aria-labelledby="tituloSemComprasGaleria">
                <button type="button" class="modal-sem-compras-galeria__fechar" aria-label="Fechar">&times;</button>
                <div class="modal-sem-compras-galeria__icone" aria-hidden="true"><img src="../img/icones/mascote02.png"</div>
                <h2 id="tituloSemComprasGaleria">Compartilhe uma viagem</h2>
                <p class="modal-sem-compras-galeria__mensagem"></p>
                <div class="modal-sem-compras-galeria__acoes">
                    <button type="button" class="modal-sem-compras-galeria__login" hidden>Fazer login</button>
                    <button type="button" class="modal-sem-compras-galeria__ok">Entendi</button>
                </div>
            </section>`;
            document.body.appendChild(modal);
            const fechar = () => { modal.hidden = true; };
            modal.querySelectorAll(".modal-sem-compras-galeria__fechar, .modal-sem-compras-galeria__ok").forEach(botao => botao.addEventListener("click", fechar));
            modal.querySelector(".modal-sem-compras-galeria__login").addEventListener("click", () => {
                fechar();
                document.querySelectorAll(".modal-oferta.ativo").forEach(janela => janela.classList.remove("ativo"));
                document.body.style.overflow = "";
                document.getElementById("modalLogin")?.classList.add("ativo");
                document.getElementById("cpfLogin")?.focus();
            });
            modal.addEventListener("click", evento => { if (evento.target === modal) fechar(); });
            document.addEventListener("keydown", evento => { if (evento.key === "Escape") fechar(); });
        }
        modal.querySelector("#tituloSemComprasGaleria").textContent = tituloModal;
        modal.querySelector(".modal-sem-compras-galeria__mensagem").textContent = mensagemModal;
        modal.querySelector(".modal-sem-compras-galeria__login").hidden = !oferecerLogin;
        modal.querySelector(".modal-sem-compras-galeria__ok").textContent = oferecerLogin ? "Continuar navegando" : "Entendi";
        modal.hidden = false;
        modal.querySelector(".modal-sem-compras-galeria__ok").focus();
    }

    function localDaCompra(pagamento) {
        const pedido = pagamento.pedido || {};
        const texto = String(pedido.destino || pedido.titulo || pagamento.descricao || "Viagem BoaTour").trim();
        const partes = texto.split(",").map(parte => parte.trim()).filter(Boolean);
        return { cidade: partes[0] || texto, pais: partes[1] || pedido.pais || "Viagem BoaTour" };
    }

    async function carregarCompras() {
        const token = localStorage.getItem("boatourSessionToken");
        if (!token) {
            mostrarModalCompras("Você precisa estar logado na BoaTour para consultar suas compras e publicar na galeria. Entre na sua conta ou continue navegando.", "Faça login para continuar", true);
            return false;
        }
        const resposta = await fetch(`${API}/pagamentos/historico`, { headers: { "x-session-token": token } });
        if (resposta.status === 401) {
            mostrarModalCompras("Sua sessão expirou. Entre novamente na BoaTour para consultar suas compras e publicar na galeria, ou continue navegando.", "Faça login para continuar", true);
            return false;
        }
        if (!resposta.ok) throw new Error("Não foi possível consultar suas compras agora. Tente novamente em instantes.");
        const historico = await resposta.json();
        comprasElegiveis = (historico.pagamentos || []).filter(p =>
            String(p.status).toLowerCase() === "aprovado" && String(p.tipo).toLowerCase() !== "recarga"
        );
        compra.replaceChildren(new Option("Selecione uma compra aprovada", ""));
        comprasElegiveis.forEach(pagamento => {
            const local = localDaCompra(pagamento);
            const opcao = new Option(`${pagamento.pedido?.titulo || pagamento.descricao || "Viagem"} · ${local.cidade}`, String(pagamento.id_pagamento || pagamento.id));
            opcao.dataset.cidade = local.cidade;
            opcao.dataset.pais = local.pais;
            compra.add(opcao);
        });
        if (!comprasElegiveis.length) {
            mostrarModalCompras("Sim. Primeiro, faça uma compra pela BoaTour e aguarde a confirmação do pagamento. Para publicar, é preciso estar logado e ter pelo menos uma compra com status aprovada. Compras pendentes, recusadas ou canceladas não liberam o envio.", "É necessário ter uma compra aprovada");
            return false;
        }
        return true;
    }

    compra.addEventListener("change", () => {
        const selecionada = compra.selectedOptions[0];
        form.elements.cidade.value = selecionada?.dataset.cidade || "";
        form.elements.pais.value = selecionada?.dataset.pais || "";
    });

    abrir.addEventListener("click", async () => {
        if (!form.hidden) { form.hidden = true; return; }
        abrir.disabled = true;
        try {
            if (!await carregarCompras()) return;
            form.hidden = false;
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (erro) {
            mostrarModalCompras(erro.message, "Não foi possível consultar suas compras");
        } finally { abrir.disabled = false; }
    });

    function atualizarEstrelasSelecionadas() {
        const nota = Number(form.querySelector('input[name="nota_experiencia"]:checked')?.value || 0);
        opcoesNota.forEach(opcao => {
            opcao.closest("label")?.classList.toggle("selecionada", Number(opcao.value) <= nota);
        });
    }

    opcoesNota.forEach(opcao => opcao.addEventListener("change", atualizarEstrelasSelecionadas));

    // Abrir e fechar o formulário
    // Cancelar publicação
    cancelar?.addEventListener("click", () => {
        form.reset();
        if (nomeArquivos) nomeArquivos.textContent = "Nenhum arquivo selecionado";
        atualizarEstrelasSelecionadas();
        limparPrevia();
        mensagem.textContent = "";
        form.hidden = true;
    });

    // Limpar prévias das imagens
    function limparPrevia() {
        urlsPrevias.forEach(url => URL.revokeObjectURL(url));
        urlsPrevias = [];
        previa.replaceChildren();
    }

    // Mostrar prévia das fotos
    inputFotos.addEventListener("change", () => {
        limparPrevia();

        const arquivos = Array.from(inputFotos.files || []);

        if (arquivos.length > 5) {
            inputFotos.value = "";
            if (nomeArquivos) nomeArquivos.textContent = "Nenhum arquivo selecionado";
            mensagem.textContent = "Escolha no máximo 5 fotos.";
            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const arquivoInvalido = arquivos.find(arquivo =>
            !tiposPermitidos.includes(arquivo.type) ||
            arquivo.size > 5 * 1024 * 1024
        );

        if (arquivoInvalido) {
            inputFotos.value = "";
            if (nomeArquivos) nomeArquivos.textContent = "Nenhum arquivo selecionado";
            mensagem.textContent =
                "Use fotos JPG, PNG ou WEBP de até 5 MB cada.";
            return;
        }

        mensagem.textContent = "";
        if (nomeArquivos) nomeArquivos.textContent = arquivos.length ? arquivos.map(arquivo => arquivo.name).join(", ") : "Nenhum arquivo selecionado";

        arquivos.forEach(arquivo => {
            const url = URL.createObjectURL(arquivo);
            urlsPrevias.push(url);

            const imagem = document.createElement("img");
            imagem.src = url;
            imagem.alt = `Prévia: ${arquivo.name}`;

            previa.appendChild(imagem);
        });
    });

    // Enviar publicação
    form.addEventListener("submit", async evento => {
        evento.preventDefault();

        // IMPORTANTE: mesmo nome usado no login
        const token = localStorage.getItem("boatourSessionToken");

        if (!token) {
            mensagem.textContent =
                "Sua sessão não foi encontrada. Faça login novamente.";
            return;
        }

        const arquivos = Array.from(inputFotos.files || []);

        if (arquivos.length < 1 || arquivos.length > 5) {
            mensagem.textContent =
                "Selecione entre 1 e 5 fotos para publicar.";
            return;
        }

        if (arquivos.some(arquivo =>
            arquivo.size > 5 * 1024 * 1024 ||
            !["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)
        )) {
            mensagem.textContent =
                "Confira as fotos: JPG, PNG ou WEBP, até 5 MB cada.";
            return;
        }

        const dados = new FormData(form);

        enviar.disabled = true;
        abrir.disabled = true;
        mensagem.textContent = "Enviando sua viagem...";

        try {
            const resposta = await fetch(`${API}/publicacoes`, {
                method: "POST",
                headers: {
                    "x-session-token": token
                },
                body: dados
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.error || "Não foi possível publicar a viagem."
                );
            }

            mensagem.textContent = "Viagem publicada com sucesso!";

            form.reset();
            if (nomeArquivos) nomeArquivos.textContent = "Nenhum arquivo selecionado";
            atualizarEstrelasSelecionadas();
            limparPrevia();

            if (typeof carregarGaleria === "function") {
                await carregarGaleria();
            }

            setTimeout(() => {
                form.hidden = true;
                mensagem.textContent = "";
            }, 1800);

        } catch (erro) {
            console.error("Erro ao publicar viagem:", erro);
            mensagem.textContent = erro.message;

        } finally {
            enviar.disabled = false;
            abrir.disabled = false;
        }
    });
});

