document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:3000";
    const token = () => localStorage.getItem("boatourSessionToken") || "";
    const lerUsuario = () => {
        try { return JSON.parse(localStorage.getItem("boatourUsuario") || "null"); }
        catch { return null; }
    };
    const status = document.getElementById("configStatus");
    let temporizadorStatus;

    const avisar = (mensagem, tipo = "sucesso") => {
        if (!status) return;
        status.textContent = mensagem;
        status.dataset.tipo = tipo;
        status.hidden = false;
        clearTimeout(temporizadorStatus);
        temporizadorStatus = setTimeout(() => { status.hidden = true; }, 3600);
    };

    const configuracoesPadrao = {
        notificacaoOfertas: true,
        notificacaoViagem: true,
        notificacaoDestinos: true,
        idioma: "pt",
        moeda: "brl"
    };
    const lerConfiguracoes = () => {
        try {
            return { ...configuracoesPadrao, ...JSON.parse(localStorage.getItem("boatourConfiguracoes") || "{}") };
        } catch {
            return { ...configuracoesPadrao };
        }
    };
    let configuracoes = lerConfiguracoes();

    // Navegação pelas categorias de configuração.
    const botoesSecao = [...document.querySelectorAll(".config-link[data-secao]")];
    const secoes = [...document.querySelectorAll(".config-secao")];
    const abrirSecao = nome => {
        const secao = secoes.find(item => item.id === nome);
        if (!secao) return;
        botoesSecao.forEach(botao => {
            const ativo = botao.dataset.secao === nome;
            botao.classList.toggle("ativo", ativo);
            botao.setAttribute("aria-selected", String(ativo));
            botao.tabIndex = ativo ? 0 : -1;
        });
        secoes.forEach(item => {
            const ativo = item === secao;
            item.classList.toggle("ativa", ativo);
            item.hidden = !ativo;
        });
    };
    botoesSecao.forEach((botao, indice) => {
        botao.addEventListener("click", () => abrirSecao(botao.dataset.secao));
        botao.addEventListener("keydown", evento => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(evento.key)) return;
            evento.preventDefault();
            const proximo = evento.key === "Home" ? 0
                : evento.key === "End" ? botoesSecao.length - 1
                    : (indice + (evento.key === "ArrowDown" ? 1 : -1) + botoesSecao.length) % botoesSecao.length;
            botoesSecao[proximo]?.focus();
        });
    });
    secoes.forEach(secao => { secao.hidden = !secao.classList.contains("ativa"); });

    // Preferências locais: notificações, idioma e moeda.
    ["notificacaoOfertas", "notificacaoViagem", "notificacaoDestinos"].forEach(id => {
        const controle = document.getElementById(id);
        if (!controle) return;
        controle.checked = Boolean(configuracoes[id]);
        controle.addEventListener("change", () => {
            configuracoes[id] = controle.checked;
            localStorage.setItem("boatourConfiguracoes", JSON.stringify(configuracoes));
            avisar("Preferência de notificação salva.");
        });
    });
    const idioma = document.getElementById("idioma");
    const moeda = document.getElementById("moeda");
    if (idioma) idioma.value = configuracoes.idioma;
    if (moeda) moeda.value = configuracoes.moeda;
    const ligarBotoesOpcao = (grupoId, controle, valorPadrao) => {
        const grupo = document.getElementById(grupoId);
        if (!grupo || !controle) return;

        const atualizarSelecao = valor => {
            const botaoSelecionado = [...grupo.querySelectorAll("button[data-valor]")]
                .find(botao => botao.dataset.valor === valor);
            if (!botaoSelecionado) return;

            controle.value = valor;
            grupo.querySelectorAll("button[data-valor]").forEach(botao => {
                const ativo = botao === botaoSelecionado;
                botao.classList.toggle("ativa", ativo);
                botao.setAttribute("aria-pressed", String(ativo));
            });
        };

        grupo.addEventListener("click", evento => {
            const botao = evento.target.closest("button[data-valor]");
            if (botao && grupo.contains(botao)) atualizarSelecao(botao.dataset.valor);
        });
        atualizarSelecao(controle.value || valorPadrao);
    };

    ligarBotoesOpcao("opcoesIdioma", idioma, "pt");
    ligarBotoesOpcao("opcoesMoeda", moeda, "brl");
    document.getElementById("salvarPreferencias")?.addEventListener("click", () => {
        configuracoes.idioma = idioma?.value || "pt";
        configuracoes.moeda = moeda?.value || "brl";
        localStorage.setItem("boatourConfiguracoes", JSON.stringify(configuracoes));
        avisar("Preferências salvas neste dispositivo.");
    });

    // Tema compartilhado entre as páginas do site.
    const temaPreferencia = localStorage.getItem("boatour-theme-preference");
    const temaSalvo = temaPreferencia || (localStorage.getItem("boatour-dark-mode") === "ativo" ? "escuro" : "claro");
    const radioTema = document.querySelector(`input[name="tema"][value="${temaSalvo}"]`)
        || document.getElementById("temaSistema");
    if (radioTema) radioTema.checked = true;
    document.querySelectorAll('input[name="tema"]').forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.checked) {
                window.boatourDefinirTema?.(radio.value);
                avisar("Aparência atualizada.");
            }
        });
    });

    // Carrega os dados da conta e mantém o menu/header sincronizados.
    const dataNascimentoConta = document.getElementById("dataNascimentoPerfil");
    dataNascimentoConta?.addEventListener("input", () => {
        const digitos = dataNascimentoConta.value.replace(/\D/g, "").slice(0, 8);
        dataNascimentoConta.value = digitos
            .replace(/^(\d{2})(\d)/, "$1/$2")
            .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2");
    });

    const camposConta = {
        nascimento: dataNascimentoConta,
        nome: document.getElementById("nome"),
        email: document.getElementById("email"),
        telefone: document.getElementById("telefone"),
        cpf: document.getElementById("cpf")
    };
    const preencherConta = usuario => {
        if (!usuario) return;
        if (camposConta.nome) camposConta.nome.value = usuario.nome || "";
        if (camposConta.email) camposConta.email.value = usuario.email || "";
        if (camposConta.telefone) camposConta.telefone.value = usuario.telefone || "";
        if (camposConta.cpf) camposConta.cpf.value = usuario.cpf || "";
        if (camposConta.nascimento) {
            const partes = String(usuario.data_nascimento || "").slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
            camposConta.nascimento.value = partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : "";
        }
    };
    preencherConta(lerUsuario());
    if (token()) {
        fetch(`${API}/usuarios/me`, { headers: { "X-Session-Token": token() } })
            .then(async resposta => {
                const usuario = await resposta.json();
                if (resposta.status === 401) {
                    localStorage.removeItem("boatourSessionToken");
                    return;
                }
                if (!resposta.ok) throw new Error(usuario.error || "Não foi possível carregar seus dados.");
                localStorage.setItem("boatourUsuario", JSON.stringify(usuario));
                preencherConta(usuario);
                window.atualizarMenuUsuario?.();
            })
            .catch(erro => avisar(erro.message || "Não foi possível carregar os dados da conta.", "erro"));
    }

    document.getElementById("salvarConta")?.addEventListener("click", async () => {
        const usuario = lerUsuario();
        const sessionToken = token();
        if (!sessionToken || !usuario?.id_usuario) {
            avisar("Entre na sua conta para salvar os dados pessoais.", "erro");
            return;
        }
        const dataDigitada = camposConta.nascimento?.value.trim() || "";
        const partesData = dataDigitada.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        let dataNascimento = null;
        if (partesData) {
            const [, dia, mes, ano] = partesData;
            const dataValidada = new Date(Number(ano), Number(mes) - 1, Number(dia));
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (dataValidada.getFullYear() === Number(ano)
                && dataValidada.getMonth() === Number(mes) - 1
                && dataValidada.getDate() === Number(dia)
                && dataValidada <= hoje) {
                dataNascimento = `${ano}-${mes}-${dia}`;
            }
        }
        if (dataDigitada && !dataNascimento) return avisar("Informe uma data de nascimento válida em dd/mm/aaaa.", "erro");

        const dados = {
            nome: camposConta.nome?.value.trim().replace(/\s+/g, " ") || "",
            email: camposConta.email?.value.trim().toLowerCase() || "",
            telefone: camposConta.telefone?.value.trim() || "",
            cpf: (camposConta.cpf?.value || "").replace(/\D/g, ""),
            data_nascimento: dataNascimento
        };
        const cpfValido = cpf => {
            if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
            const digito = limite => {
                let soma = 0;
                for (let i = 0; i < limite; i++) soma += Number(cpf[i]) * (limite + 1 - i);
                const resto = (soma * 10) % 11;
                return resto === 10 ? 0 : resto;
            };
            return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
        };
        if (dados.nome.split(" ").length < 2) return avisar("Informe nome e sobrenome.", "erro");
        if (!/^\S+@\S+\.\S+$/.test(dados.email)) return avisar("Informe um e-mail válido.", "erro");
        if (!cpfValido(dados.cpf)) return avisar("Informe um CPF válido.", "erro");
        if (dados.telefone && ![10, 11].includes(dados.telefone.replace(/\D/g, "").length)) return avisar("Confira o telefone com DDD.", "erro");

        const botao = document.getElementById("salvarConta");
        botao.disabled = true;
        try {
            const resposta = await fetch(`${API}/usuarios/${usuario.id_usuario}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "X-Session-Token": sessionToken },
                body: JSON.stringify(dados)
            });
            const resultado = await resposta.json();
            if (!resposta.ok || resultado.error) throw new Error(resultado.error || "Não foi possível salvar os dados.");
            localStorage.setItem("boatourUsuario", JSON.stringify(resultado.usuario));
            preencherConta(resultado.usuario);
            window.atualizarMenuUsuario?.();
            avisar("Dados da conta atualizados.");
        } catch (erro) {
            avisar(erro.message || "Não foi possível conectar ao servidor.", "erro");
        } finally {
            botao.disabled = false;
        }
    });

    // Alteração de senha pela API existente.
    const modalSenha = document.getElementById("modalSenhaConfig");
    document.getElementById("abrirAlteracaoSenha")?.addEventListener("click", () => {
        if (!token()) return avisar("Entre na sua conta para alterar a senha.", "erro");
        modalSenha?.showModal();
        document.getElementById("senhaAtualConfig")?.focus();
    });
    modalSenha?.querySelectorAll("[data-fechar-dialog]").forEach(botao => {
        botao.addEventListener("click", () => modalSenha.close());
    });
    modalSenha?.addEventListener("click", evento => {
        if (evento.target === modalSenha) modalSenha.close();
    });
    const modalPrivacidade = document.getElementById("modalAvisoPrivacidade");
    document.getElementById("abrirPoliticaPrivacidade")?.addEventListener("click", () => modalPrivacidade?.showModal());
    modalPrivacidade?.querySelectorAll("[data-fechar-privacidade]").forEach(botao => {
        botao.addEventListener("click", () => modalPrivacidade.close());
    });
    modalPrivacidade?.addEventListener("click", evento => {
        if (evento.target === modalPrivacidade) modalPrivacidade.close();
    });
    document.getElementById("formSenhaConfig")?.addEventListener("submit", async evento => {
        evento.preventDefault();
        const senhaAtual = document.getElementById("senhaAtualConfig").value;
        const novaSenha = document.getElementById("novaSenhaConfig").value;
        const confirmar = document.getElementById("confirmarSenhaConfig").value;
        const erroTela = document.getElementById("erroSenhaConfig");
        erroTela.textContent = "";
        if (novaSenha.length < 6) { erroTela.textContent = "A nova senha precisa ter pelo menos 6 caracteres."; return; }
        if (novaSenha !== confirmar) { erroTela.textContent = "As novas senhas não coincidem."; return; }
        try {
            const resposta = await fetch(`${API}/usuarios/senha`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "X-Session-Token": token() },
                body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha })
            });
            const resultado = await resposta.json();
            if (!resposta.ok || resultado.error) throw new Error(resultado.error || "Não foi possível alterar a senha.");
            modalSenha.close();
            evento.target.reset();
            avisar("Senha alterada com sucesso.");
        } catch (falha) {
            erroTela.textContent = falha.message || "Não foi possível conectar ao servidor.";
        }
    });

    document.getElementById("btnExcluirConta")?.addEventListener("click", async () => {
        if (!token()) return avisar("Entre na sua conta para gerenciar a exclusão.", "erro");
        const senha = window.boatourPrompt
            ? await window.boatourPrompt("Confirme sua senha para excluir a conta.")
            : window.prompt("Confirme sua senha para excluir a conta.");
        if (!senha) return;
        const confirmar = window.boatourConfirm
            ? await window.boatourConfirm("A exclusão é permanente. Deseja continuar?")
            : window.confirm("A exclusão é permanente. Deseja continuar?");
        if (!confirmar) return;
        try {
            const resposta = await fetch(`${API}/usuarios/me`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "X-Session-Token": token() },
                body: JSON.stringify({ senha })
            });
            const resultado = await resposta.json();
            if (!resposta.ok || resultado.error) throw new Error(resultado.error || "Não foi possível excluir a conta.");
            localStorage.removeItem("boatourSessionToken");
            localStorage.removeItem("boatourUsuario");
            window.location.href = "../index.html";
        } catch (erro) {
            avisar(erro.message || "Não foi possível conectar ao servidor.", "erro");
        }
    });
});
