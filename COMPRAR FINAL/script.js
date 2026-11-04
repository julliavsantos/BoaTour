document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("listaViajantes");
    const modalPassageiro = document.getElementById("modalViajante");
    const formPassageiro = document.getElementById("formViajante");
    const erroPassageiro = document.getElementById("erroViajante");
    const campoNomePassageiro = document.getElementById("nomeViajante");
    const campoCpfPassageiro = document.getElementById("cpfViajante");
    const campoNascimento = document.getElementById("nascimentoViajante");
    const campoCategoria = document.getElementById("tipoCadastroViajante");
    const modalComprador = document.getElementById("modalComprador");
    const formComprador = document.getElementById("formComprador");
    const erroComprador = document.getElementById("erroComprador");
    const nomeCompradorInput = document.getElementById("modalNomeComprador");
    const emailCompradorInput = document.getElementById("modalEmailComprador");
    const cpfCompradorInput = document.getElementById("modalCpfComprador");
    const telefoneCompradorInput = document.getElementById("modalTelefoneComprador");
    const modalPagamento = document.getElementById("modalPagamento");
    const formPagamento = document.getElementById("formPagamento");
    const erroPagamento = document.getElementById("erroPagamento");
    const metodoPagamentoInputs = [...document.querySelectorAll("input[name=metodoPagamento]")];
    const dadosCartao = document.getElementById("dadosCartao");
    const numeroCartaoPagamento = document.getElementById("numeroCartaoPagamento");
    const nomeCartaoPagamento = document.getElementById("nomeCartaoPagamento");
    const validadeCartaoPagamento = document.getElementById("validadeCartaoPagamento");
    const cvvCartaoPagamento = document.getElementById("cvvCartaoPagamento");

    const apenasNumeros = valor => String(valor || "").replace(/\D/g, "");
    const mascararCpf = valor => apenasNumeros(valor).slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    const mascararTelefone = valor => apenasNumeros(valor).slice(0, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    const cpfValido = valor => {
        const cpf = apenasNumeros(valor);
        if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
        const digito = limite => {
            let soma = 0;
            for (let i = 0; i < limite; i++) soma += Number(cpf[i]) * (limite + 1 - i);
            const resto = (soma * 10) % 11;
            return resto === 10 ? 0 : resto;
        };
        return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
    };
    const dataBr = iso => {
        if (!iso) return "";
        const partes = iso.split("-");
        return partes[2] + "/" + partes[1] + "/" + partes[0];
    };
    const lerPendente = () => {
        try { return JSON.parse(sessionStorage.getItem("boatourCompraPendente") || "null"); }
        catch { return null; }
    };
    const pendente = lerPendente();
    let usuario = null;
    try { usuario = JSON.parse(localStorage.getItem("boatourUsuario") || "null"); } catch {}
    let comprador = pendente?.comprador || {
        nome: usuario?.nome || "",
        email: usuario?.email || "",
        cpf: usuario?.cpf || "",
        telefone: usuario?.telefone || ""
    };
    let viajantes = Array.isArray(pendente?.viajantes) ? pendente.viajantes : [];
    let indicePassageiroEditado = null;
    let pagamento = { metodo: pendente?.pagamento?.metodo || "", ultimosDigitos: pendente?.pagamento?.ultimosDigitos || "" };
    let cartaoCompletoNestaSessao = Boolean(pagamento.metodo);

    const salvarPendente = () => {
        const compra = pendente || {};
        compra.comprador = comprador;
        compra.viajantes = viajantes;
        compra.pagamento = pagamento.metodo ? { metodo: pagamento.metodo, ultimosDigitos: pagamento.ultimosDigitos || "" } : null;
        sessionStorage.setItem("boatourCompraPendente", JSON.stringify(compra));
    };
    const renderizarComprador = () => {
        const nome = document.getElementById("nomeResumoComprador");
        const detalhes = document.getElementById("detalhesResumoComprador");
        nome.textContent = comprador.nome || "Dados do comprador não informados";
        detalhes.textContent = [comprador.email, comprador.cpf ? "CPF " + comprador.cpf : "", comprador.telefone]
            .filter(Boolean).join(" · ") || "Revise os dados antes de finalizar.";
    };
    const renderizarResumoViagem = () => {
        const item = pendente?.item;
        if (!item) return;

        const nome = document.getElementById("nomeResumoViagem");
        const imagem = document.getElementById("imagemResumoViagem");
        const detalhes = document.getElementById("detalhesResumoViagem");
        const listaResumo = document.getElementById("listaResumoPedidoFinal");
        const total = document.getElementById("totalResumoFinal");
        const itens = Array.isArray(item.itensSelecionados) && item.itensSelecionados.length
            ? item.itensSelecionados
            : [{ nome: item.nome || "Viagem selecionada", imagem: item.imagem || "", valor: "", icone: "../img/icones/globo.png" }];
        let indiceImagem = 0;

        if (nome) nome.textContent = item.nome || "Viagem selecionada";
        if (imagem && item.imagem) {
            imagem.src = item.imagem;
            imagem.alt = item.nome || "Viagem selecionada";
        }

        const controlesGaleria = document.getElementById("controlesGaleriaResumo");
        const contadorGaleria = document.getElementById("contadorImagensResumo");
        const renderizarDetalhesResumo = lista => {
            if (!detalhes) return;
            detalhes.replaceChildren();
            (Array.isArray(lista) ? lista : []).forEach(detalhe => {
                if (!detalhe?.texto) return;
                const linha = document.createElement("div");
                linha.className = "linha-compra";
                const icone = document.createElement("img");
                icone.src = detalhe.icone || "../img/icones/globo.png";
                icone.alt = "";
                const texto = document.createElement("p");
                texto.textContent = detalhe.texto;
                linha.append(icone, texto);
                detalhes.append(linha);
            });
        };
        const renderizarImagemResumo = () => {
            const selecionado = itens[indiceImagem];
            if (!selecionado) return;
            if (imagem && selecionado.imagem) {
                imagem.src = selecionado.imagem;
                imagem.alt = selecionado.nome || "Item selecionado";
            }
            if (nome) nome.textContent = selecionado.nome || item.nome || "Viagem selecionada";
            if (contadorGaleria) contadorGaleria.textContent = `${indiceImagem + 1} / ${itens.length}`;
            renderizarDetalhesResumo(selecionado.detalhes ?? item.detalhes);
            const kicker = document.getElementById("kickerItemResumo");
            const rodape = document.getElementById("textoRodapeItemResumo");
            const categoria = selecionado.categoria || selecionado.tipo || "item";
            if (kicker) kicker.textContent = `${String(categoria).replace(/[-_]/g, " ").toLocaleUpperCase("pt-BR")} · ITEM ${indiceImagem + 1} DE ${itens.length}`;
            if (rodape) rodape.textContent = itens.length > 1
                ? `${itens.length} itens reunidos em um pedido · Exibindo ${indiceImagem + 1} de ${itens.length}`
                : "Este item está incluído no seu pedido";
        };
        if (controlesGaleria) controlesGaleria.hidden = itens.length < 2;
        document.getElementById("anteriorImagemResumo")?.addEventListener("click", () => {
            indiceImagem = (indiceImagem - 1 + itens.length) % itens.length;
            renderizarImagemResumo();
        });
        document.getElementById("proximaImagemResumo")?.addEventListener("click", () => {
            indiceImagem = (indiceImagem + 1) % itens.length;
            renderizarImagemResumo();
        });
        renderizarImagemResumo();

        if (listaResumo) {
            listaResumo.replaceChildren();
            const itens = Array.isArray(item.itensResumo) && item.itensResumo.length
                ? item.itensResumo
                : [{ nome: item.nome || "Item da viagem", valor: item.valorTotal || "—" }];
            itens.forEach(dado => {
                const linha = document.createElement("div");
                linha.className = "linha-compra2";
                const icone = document.createElement("img");
                icone.src = dado.icone || "../img/icones/globo.png";
                icone.alt = "";
                const descricao = document.createElement("p");
                descricao.textContent = dado.nome || "Item da viagem";
                const valor = document.createElement("h3");
                valor.textContent = dado.valor || "—";
                linha.append(icone, descricao, valor);
                listaResumo.append(linha);
            });
        }
        if (total && item.valorTotal) total.textContent = item.valorTotal;
    };
    const abrirComprador = () => {
        nomeCompradorInput.value = comprador.nome || "";
        emailCompradorInput.value = comprador.email || "";
        cpfCompradorInput.value = comprador.cpf || "";
        telefoneCompradorInput.value = comprador.telefone || "";
        erroComprador.textContent = "";
        modalComprador.hidden = false;
        nomeCompradorInput.focus();
    };
    const fecharComprador = () => { modalComprador.hidden = true; };
    const fecharPassageiro = () => { modalPassageiro.hidden = true; };
    const abrirPassageiro = indice => {
        indicePassageiroEditado = Number.isInteger(indice) ? indice : null;
        const passageiro = indicePassageiroEditado === null ? null : viajantes[indicePassageiroEditado];
        formPassageiro.reset();
        document.getElementById("tituloModalViajante").textContent = passageiro ? "Editar passageiro" : "Adicionar passageiro";
        campoNomePassageiro.value = passageiro?.nome || "";
        campoCpfPassageiro.value = passageiro?.cpf || "";
        campoNascimento.value = passageiro?.nascimento || "";
        campoCategoria.value = passageiro?.categoria || "Adulto";
        erroPassageiro.textContent = "";
        modalPassageiro.hidden = false;
        campoNomePassageiro.focus();
    };
    const renderizarPassageiros = () => {
        lista.replaceChildren();
        if (!viajantes.length) {
            const aviso = document.createElement("p");
            aviso.className = "aviso-viajantes";
            aviso.textContent = "Adicione ao menos um passageiro para continuar.";
            lista.append(aviso);
            return;
        }
        viajantes.forEach((passageiro, indice) => {
            const linha = document.createElement("div");
            linha.className = "passageiro";
            const info = document.createElement("div");
            info.className = "passageiro-info";
            const nome = document.createElement("h3");
            nome.textContent = "Passageiro " + (indice + 1) + " · " + passageiro.nome;
            const detalhes = document.createElement("p");
            detalhes.textContent = [passageiro.categoria, passageiro.cpf ? "CPF " + passageiro.cpf : "", passageiro.nascimento ? "Nascimento " + dataBr(passageiro.nascimento) : ""]
                .filter(Boolean).join(" · ");
            const editar = document.createElement("button");
            editar.type = "button";
            editar.className = "btn-editar-passageiro btn-editar-padrao";
            editar.textContent = "✎ Editar";
            editar.addEventListener("click", () => abrirPassageiro(indice));
            const remover = document.createElement("button");
            remover.type = "button";
            remover.className = "btn-remover-passageiro";
            remover.textContent = "Remover";
            remover.setAttribute("aria-label", "Remover " + passageiro.nome);
            remover.addEventListener("click", () => {
                viajantes.splice(indice, 1);
                salvarPendente();
                renderizarPassageiros();
            });
            const acoes = document.createElement("div");
            acoes.className = "passageiro-acoes";
            info.append(nome, detalhes);
            acoes.append(editar, remover);
            linha.append(info, acoes);
            lista.append(linha);
        });
    };

    const rotuloPagamento = metodo => ({ cartao: "Cartão de crédito", pix: "Pix", boleto: "Boleto" })[metodo] || "";
    const valorNumerico = valor => {
        if (typeof valor === "number") return valor;
        const convertido = Number(String(valor || "").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
        return Number.isFinite(convertido) ? convertido : 0;
    };
    const atualizarStatusPagamento = () => {
        const resumo = document.getElementById("resumoPagamento");
        const icone = document.getElementById("iconeStatusPagamento");
        const titulo = document.getElementById("tituloStatusPagamento");
        const descricao = document.getElementById("descricaoStatusPagamento");
        const botao = document.getElementById("abrirModalPagamento");
        const concluido = Boolean(pagamento.metodo && (pagamento.metodo !== "cartao" || cartaoCompletoNestaSessao));
        resumo.classList.toggle("completo", concluido);
        resumo.classList.toggle("pendente", !concluido);
        icone.textContent = concluido ? "✓" : "!";
        if (!pagamento.metodo) {
            titulo.textContent = "Falta escolher a forma de pagamento";
            descricao.textContent = "Escolha cartão, Pix ou boleto para continuar.";
            botao.textContent = "Escolher";
        } else if (pagamento.metodo === "cartao" && !cartaoCompletoNestaSessao) {
            titulo.textContent = "Cartão de crédito selecionado";
            descricao.textContent = pagamento.ultimosDigitos ? "Cartão final " + pagamento.ultimosDigitos + " · faltam os dados do cartão." : "Informe os dados do cartão para concluir.";
            botao.textContent = "✎ Completar";
        } else {
            titulo.textContent = rotuloPagamento(pagamento.metodo) + " selecionado";
            descricao.textContent = pagamento.metodo === "cartao" ? "Cartão escolhido · informe os dados no simulador." : "Forma de pagamento pronta para continuar no simulador.";
            botao.textContent = "✎ Alterar";
        }
    };
    const atualizarCamposCartao = () => {
        const escolhido = document.querySelector("input[name=metodoPagamento]:checked")?.value || "";
        if (dadosCartao) dadosCartao.hidden = escolhido !== "cartao";
    };
    const abrirPagamento = () => {
        metodoPagamentoInputs.forEach(input => { input.checked = input.value === pagamento.metodo; });
        erroPagamento.textContent = "";
        atualizarCamposCartao();
        modalPagamento.hidden = false;
    };
    const fecharPagamento = () => {
        formPagamento.reset();
        if (dadosCartao) dadosCartao.hidden = true;
        erroPagamento.textContent = "";
        modalPagamento.hidden = true;
    };
    metodoPagamentoInputs.forEach(input => input.addEventListener("change", atualizarCamposCartao));
    document.getElementById("abrirModalPagamento")?.addEventListener("click", abrirPagamento);
    document.querySelector(".fechar-modal-pagamento")?.addEventListener("click", fecharPagamento);
    document.querySelector(".btn-cancelar-pagamento")?.addEventListener("click", fecharPagamento);
    modalPagamento?.addEventListener("click", evento => { if (evento.target === modalPagamento) fecharPagamento(); });
    document.addEventListener("keydown", evento => { if (evento.key === "Escape" && !modalPagamento.hidden) fecharPagamento(); });
    numeroCartaoPagamento?.addEventListener("input", evento => {
        const digitos = apenasNumeros(evento.target.value).slice(0, 19);
        evento.target.value = digitos.replace(/(\d{4})(?=\d)/g, "$1 ");
    });
    validadeCartaoPagamento?.addEventListener("input", evento => {
        const digitos = apenasNumeros(evento.target.value).slice(0, 4);
        evento.target.value = digitos.length > 2 ? digitos.slice(0, 2) + "/" + digitos.slice(2) : digitos;
    });
    cvvCartaoPagamento?.addEventListener("input", evento => { evento.target.value = apenasNumeros(evento.target.value).slice(0, 4); });
    formPagamento?.addEventListener("submit", evento => {
        evento.preventDefault();
        const metodo = document.querySelector("input[name=metodoPagamento]:checked")?.value || "";
        if (!metodo) {
            erroPagamento.textContent = "Selecione uma forma de pagamento.";
            return;
        }
        pagamento = { metodo, ultimosDigitos: "" };
        cartaoCompletoNestaSessao = true;
        salvarPendente();
        atualizarStatusPagamento();
        fecharPagamento();
    });
    document.querySelector(".finalizaeButton")?.addEventListener("click", evento => {
        if (!pagamento.metodo || (pagamento.metodo === "cartao" && !cartaoCompletoNestaSessao)) {
            evento.preventDefault();
            abrirPagamento();
            return;
        }
        const item = pendente?.item;
        const valor = valorNumerico(item?.valorTotal);
        if (!item || valor <= 0) {
            evento.preventDefault();
            alert("Não encontrei os dados do pedido para abrir a simulação. Volte à compra e tente novamente.");
            return;
        }
        const itens = Array.isArray(item.itensSelecionados) ? item.itensSelecionados : [];
        const pedidoSimulado = {
            titulo: itens.length > 1 ? itens.map(produto => produto.nome).filter(Boolean).join(" + ") : item.nome || "Compra BoaTour",
            valor,
            origem: item.origem || "",
            destino: item.destino || "",
            ida: item.checkin || "",
            volta: item.checkout || "",
            imagem: item.imagem || "",
            itens,
            comprador: pendente.comprador || {},
            viajantes: pendente.viajantes || [],
            ods: [...new Set(itens.flatMap(produto => Array.isArray(produto.ods) ? produto.ods : []))]
        };
        salvarPendente();
        sessionStorage.setItem("boatourPedido", JSON.stringify(pedidoSimulado));
        sessionStorage.setItem("boatourCheckoutMetodo", pagamento.metodo);
        window.location.href = "../PAGAMENTOS/SIMULADOR/index.html?checkout=1";
    });
    document.getElementById("editarComprador")?.addEventListener("click", abrirComprador);
    document.querySelector(".fechar-modal-comprador")?.addEventListener("click", fecharComprador);
    document.querySelector(".btn-cancelar-comprador")?.addEventListener("click", fecharComprador);
    modalComprador?.addEventListener("click", evento => { if (evento.target === modalComprador) fecharComprador(); });
    document.getElementById("adicionarViajante")?.addEventListener("click", () => abrirPassageiro());
    document.querySelector("#modalViajante .fechar-modal-viajante")?.addEventListener("click", fecharPassageiro);
    document.querySelector(".btn-cancelar-viajante")?.addEventListener("click", fecharPassageiro);
    modalPassageiro?.addEventListener("click", evento => { if (evento.target === modalPassageiro) fecharPassageiro(); });
    document.addEventListener("keydown", evento => {
        if (evento.key !== "Escape") return;
        if (!modalComprador.hidden) fecharComprador();
        if (!modalPassageiro.hidden) fecharPassageiro();
    });
    cpfCompradorInput?.addEventListener("input", evento => { evento.target.value = mascararCpf(evento.target.value); });
    telefoneCompradorInput?.addEventListener("input", evento => { evento.target.value = mascararTelefone(evento.target.value); });
    campoCpfPassageiro?.addEventListener("input", evento => { evento.target.value = mascararCpf(evento.target.value); });

    formComprador?.addEventListener("submit", evento => {
        evento.preventDefault();
        const dados = {
            nome: nomeCompradorInput.value.trim().replace(/\s+/g, " "),
            email: emailCompradorInput.value.trim().toLowerCase(),
            cpf: mascararCpf(cpfCompradorInput.value),
            telefone: mascararTelefone(telefoneCompradorInput.value)
        };
        if (dados.nome.split(" ").length < 2 || !/^\S+@\S+\.\S+$/.test(dados.email) || !cpfValido(dados.cpf) || apenasNumeros(dados.telefone).length < 10) {
            erroComprador.textContent = "Informe nome completo, e-mail, CPF válido e telefone.";
            return;
        }
        comprador = dados;
        salvarPendente();
        renderizarComprador();
        fecharComprador();
    });
    formPassageiro?.addEventListener("submit", evento => {
        evento.preventDefault();
        const dados = {
            nome: campoNomePassageiro.value.trim().replace(/\s+/g, " "),
            cpf: mascararCpf(campoCpfPassageiro.value),
            nascimento: campoNascimento.value,
            categoria: campoCategoria.value
        };
        if (dados.nome.split(" ").length < 2 || !cpfValido(dados.cpf) || !dados.nascimento) {
            erroPassageiro.textContent = "Informe nome completo, CPF válido e data de nascimento.";
            return;
        }
        if (viajantes.some((item, indice) => indice !== indicePassageiroEditado && apenasNumeros(item.cpf) === apenasNumeros(dados.cpf))) {
            erroPassageiro.textContent = "Já existe um passageiro cadastrado com esse CPF.";
            return;
        }
        if (indicePassageiroEditado === null) viajantes.push(dados);
        else viajantes[indicePassageiroEditado] = dados;
        salvarPendente();
        renderizarPassageiros();
        fecharPassageiro();
    });

    renderizarComprador();
    renderizarResumoViagem();
    renderizarPassageiros();
});
