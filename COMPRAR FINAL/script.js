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
    let cartaoCompletoNestaSessao = Boolean(pagamento.metodo && pagamento.metodo !== "cartao");

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

        if (nome) nome.textContent = item.nome || "Viagem selecionada";
        if (imagem && item.imagem) {
            imagem.src = item.imagem;
            imagem.alt = item.nome || "Viagem selecionada";
        }

        if (detalhes && Array.isArray(item.detalhes)) {
            detalhes.replaceChildren();
            item.detalhes.forEach(detalhe => {
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
        }

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
            descricao.textContent = pagamento.metodo === "cartao" ? "Cartão final " + pagamento.ultimosDigitos : "Forma de pagamento pronta para finalizar.";
            botao.textContent = "✎ Alterar";
        }
    };
    const atualizarCamposCartao = () => {
        const escolhido = document.querySelector("input[name=metodoPagamento]:checked")?.value || "";
        dadosCartao.hidden = escolhido !== "cartao";
    };
    const abrirPagamento = () => {
        metodoPagamentoInputs.forEach(input => { input.checked = input.value === pagamento.metodo; });
        erroPagamento.textContent = "";
        atualizarCamposCartao();
        modalPagamento.hidden = false;
    };
    const fecharPagamento = () => {
        formPagamento.reset();
        dadosCartao.hidden = true;
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
        if (metodo === "cartao") {
            const numero = apenasNumeros(numeroCartaoPagamento.value);
            const nome = nomeCartaoPagamento.value.trim();
            const validade = validadeCartaoPagamento.value.trim();
            const cvv = apenasNumeros(cvvCartaoPagamento.value);
            if (numero.length < 13 || nome.length < 3 || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(validade) || cvv.length < 3) {
                erroPagamento.textContent = "Confira o número, nome, validade e CVV do cartão.";
                return;
            }
            pagamento = { metodo: "cartao", ultimosDigitos: numero.slice(-4) };
            cartaoCompletoNestaSessao = true;
        } else {
            pagamento = { metodo, ultimosDigitos: "" };
            cartaoCompletoNestaSessao = true;
        }
        salvarPendente();
        atualizarStatusPagamento();
        fecharPagamento();
    });
    document.querySelector(".finalizaeButton")?.addEventListener("click", evento => {
        if (!pagamento.metodo || (pagamento.metodo === "cartao" && !cartaoCompletoNestaSessao)) {
            evento.preventDefault();
            abrirPagamento();
        }
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
