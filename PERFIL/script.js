document.addEventListener("DOMContentLoaded", () => {
    const API = "http://localhost:3000";

    const getUsuario = () => {
        try {
            return JSON.parse(localStorage.getItem("boatourUsuario") || "null");
        } catch {
            return null;
        }
    };

    const getToken = () => localStorage.getItem("boatourSessionToken");

    function salvarLocal(usuario) {
        if (usuario) {
            localStorage.setItem("boatourUsuario", JSON.stringify(usuario));
            window.dispatchEvent(new CustomEvent("boatour:profile-updated", { detail: { usuario } }));
        }
    }

    function fotoUrl(caminho) {
        if (!caminho) return "../img/icones/perfil.png";
        if (caminho.startsWith("http")) return `${caminho}?t=${Date.now()}`;
        return `${API}/${caminho}?t=${Date.now()}`;
    }

    window.atualizarFotosPerfil = function(caminhoFoto) {
        const url = fotoUrl(caminhoFoto);
        document.querySelectorAll(".foto-viajante, .foto-perfil-header, #fotoPerfilMural, #fotoPerfilEditar")
            .forEach(img => img.src = url);
    };

    function preencherPerfil(usuario) {
        if (!usuario) return;

        const nomeMural = document.getElementById("nomePerfilMural");
        const emailMural = document.getElementById("emailPerfilMural");
        const nomeEditar = document.getElementById("nomePerfilEditar");
        const emailEditar = document.getElementById("emailPerfil");
        const cpfEditar = document.getElementById("cpfPerfil");
        const telefoneEditar = document.getElementById("telefonePerfil");
        const nascimentoEditar = document.getElementById("dataNascimentoPerfil");

        if (nomeMural) nomeMural.textContent = usuario.nome || "Viajante";

        if (emailMural) {
            const ano = usuario.data_cadastro
                ? new Date(usuario.data_cadastro).getFullYear()
                : new Date().getFullYear();
            emailMural.innerHTML = `${usuario.email || ""}<br>Cliente desde ${ano}`;
        }

        if (nomeEditar) nomeEditar.value = usuario.nome || "";
        if (emailEditar) emailEditar.value = usuario.email || "";
        if (cpfEditar) cpfEditar.value = window.boatourFormatCpf
            ? window.boatourFormatCpf(usuario.cpf)
            : usuario.cpf || "";
        if (telefoneEditar) telefoneEditar.value = usuario.telefone || "";
        if (nascimentoEditar) nascimentoEditar.value = usuario.data_nascimento
            ? formatarDataExibicao(String(usuario.data_nascimento).slice(0, 10))
            : "";

        if (usuario.foto_perfil) window.atualizarFotosPerfil(usuario.foto_perfil);

        selecionarBanner(usuario.banner_perfil || "../img/ofertas/cancun.jpg");
    }

    async function sincronizarUsuario() {
        const token = getToken();
        if (!token) return getUsuario();

        try {
            const resposta = await fetch(`${API}/usuarios/me`, {
                headers: { "X-Session-Token": token }
            });

            if (resposta.status === 401) {
                localStorage.removeItem("boatourSessionToken");
                localStorage.removeItem("boatourUsuario");
                return null;
            }

            if (!resposta.ok) return getUsuario();

            const usuario = await resposta.json();
            salvarLocal(usuario);
            return usuario;
        } catch {
            return getUsuario();
        }
    }

    // Atualiza o quadro com o mesmo usuário recebido pelo login, sem recarregar a página.
    window.addEventListener("boatour:login", async (evento) => {
        const usuario = evento.detail?.usuario || getUsuario();
        preencherPerfil(usuario);
        await carregarFavoritosPerfil();
    });

    // --- NOTIFICAÇÕES ---
    const btnNotificacoes = document.getElementById("btnNotificacoes");
    const modalNotificacoes = document.getElementById("modalNotificacoes");
    const fecharNotificacoes = document.getElementById("fecharNotificacoes");

    btnNotificacoes?.addEventListener("click", e => {
        e.preventDefault();
        modalNotificacoes?.classList.add("ativo");
    });

    fecharNotificacoes?.addEventListener("click", () => {
        modalNotificacoes?.classList.remove("ativo");
    });

    modalNotificacoes?.addEventListener("click", e => {
        if (e.target === modalNotificacoes) modalNotificacoes.classList.remove("ativo");
    });

    // --- EDITAR PERFIL ---
    const btnEditarPerfil = document.getElementById("btnEditarPerfil");
    const modalEditarPerfil = document.getElementById("modalEditarPerfil");
    const fecharEditarPerfil = document.getElementById("fecharEditarPerfil");
    const cancelarEditarPerfil = document.getElementById("cancelarEditarPerfil");
    const modalGaleriaBanners = document.getElementById("modalGaleriaBanners");
    const abrirGaleriaBanners = document.getElementById("abrirGaleriaBanners");

    // Calendário de nascimento com a mesma aparência dos campos de data de VOOS.
    const campoDataNascimento = document.getElementById("campoDataNascimentoPerfil");
    const inputDataNascimento = document.getElementById("dataNascimentoPerfil");
    const calendarioNascimento = document.getElementById("calendarioNascimentoPerfil");
    const botaoCalendarioNascimento = document.getElementById("abrirCalendarioNascimento");
    const hojeNascimento = new Date();
    let mesCalendarioNascimento = new Date(hojeNascimento.getFullYear(), hojeNascimento.getMonth(), 1);

    // Mantém o calendário fora da área rolável do modal para não alterar seu layout.
    if (calendarioNascimento) document.body.appendChild(calendarioNascimento);

    function formatarDataExibicao(dataIso) {
        const partes = String(dataIso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return partes ? `${partes[3]}/${partes[2]}/${partes[1]}` : "";
    }

    function montarCalendarioNascimento() {
        if (!calendarioNascimento) return;
        const selecionada = inputDataNascimento?.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        const ano = mesCalendarioNascimento.getFullYear();
        const mes = mesCalendarioNascimento.getMonth();
        const primeiroDia = new Date(ano, mes, 1);
        const inicioGrade = new Date(ano, mes, 1 - primeiroDia.getDay());
        const nomesMeses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        const dias = Array.from({ length: 42 }, (_, indice) => {
            const data = new Date(inicioGrade);
            data.setDate(inicioGrade.getDate() + indice);
            const foraDoMes = data.getMonth() !== mes;
            const futura = data > new Date(hojeNascimento.getFullYear(), hojeNascimento.getMonth(), hojeNascimento.getDate());
            const ehHoje = data.toDateString() === hojeNascimento.toDateString();
            const ehSelecionada = selecionada && Number(selecionada[1]) === data.getDate() && Number(selecionada[2]) === data.getMonth() + 1 && Number(selecionada[3]) === data.getFullYear();
            const classes = ["dia", foraDoMes ? "outro-mes" : "", ehHoje ? "hoje" : "", ehSelecionada ? "selecionado" : "", futura ? "bloqueado" : ""].filter(Boolean).join(" ");
            return `<button type="button" class="${classes}" data-data="${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}" ${futura ? "disabled" : ""}>${data.getDate()}</button>`;
        }).join("");

        calendarioNascimento.innerHTML = `
            <div class="cabecalho-calendario">
                <span class="mes-ano">${nomesMeses[mes]} ${ano}</span>
                <div class="navegacao-calendario">
                    <button type="button" data-navegar="-1" aria-label="Mês anterior">‹</button>
                    <button type="button" data-navegar="1" aria-label="Próximo mês">›</button>
                </div>
            </div>
            <div class="dias-semana">${["D", "S", "T", "Q", "Q", "S", "S"].map(dia => `<span>${dia}</span>`).join("")}</div>
            <div class="dias">${dias}</div>
            <div class="rodape-calendario"><button type="button" data-limpar>Limpar</button><button type="button" data-hoje>Hoje</button></div>`;
    }

    botaoCalendarioNascimento?.addEventListener("click", () => {
        const partes = inputDataNascimento?.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        mesCalendarioNascimento = partes
            ? new Date(Number(partes[3]), Number(partes[2]) - 1, 1)
            : new Date(hojeNascimento.getFullYear(), hojeNascimento.getMonth(), 1);
        montarCalendarioNascimento();
        const abrindo = !calendarioNascimento?.classList.contains("aberto");
        calendarioNascimento?.classList.toggle("aberto", abrindo);
        if (abrindo && calendarioNascimento) {
            const retangulo = botaoCalendarioNascimento.getBoundingClientRect();
            const largura = 250;
            const alturaEstimada = 310;
            const espacoAbaixo = window.innerHeight - retangulo.bottom;
            const topo = espacoAbaixo >= alturaEstimada + 8
                ? retangulo.bottom + 8
                : Math.max(8, retangulo.top - alturaEstimada - 8);
            const esquerda = Math.min(retangulo.left, window.innerWidth - largura - 8);
            calendarioNascimento.style.top = `${topo}px`;
            calendarioNascimento.style.left = `${Math.max(8, esquerda)}px`;
        }
    });

    calendarioNascimento?.addEventListener("click", event => {
        const botao = event.target.closest("button");
        if (!botao) return;
        if (botao.dataset.navegar) {
            event.stopPropagation();
            mesCalendarioNascimento.setMonth(mesCalendarioNascimento.getMonth() + Number(botao.dataset.navegar));
            montarCalendarioNascimento();
        } else if (botao.dataset.data && inputDataNascimento) {
            inputDataNascimento.value = formatarDataExibicao(botao.dataset.data);
            calendarioNascimento.classList.remove("aberto");
        } else if (botao.hasAttribute("data-limpar") && inputDataNascimento) {
            inputDataNascimento.value = "";
            calendarioNascimento.classList.remove("aberto");
        } else if (botao.hasAttribute("data-hoje") && inputDataNascimento) {
            inputDataNascimento.value = `${String(hojeNascimento.getDate()).padStart(2, "0")}/${String(hojeNascimento.getMonth() + 1).padStart(2, "0")}/${hojeNascimento.getFullYear()}`;
            calendarioNascimento.classList.remove("aberto");
        }
    });

    document.addEventListener("click", event => {
        if (campoDataNascimento && !campoDataNascimento.contains(event.target) && !calendarioNascimento?.contains(event.target)) {
            calendarioNascimento?.classList.remove("aberto");
        }
    });
    modalEditarPerfil?.addEventListener("scroll", () => calendarioNascimento?.classList.remove("aberto"), true);

    function selecionarBanner(caminho) {
        const normalizar = valor => String(valor || "").replace(/^(\.\.\/)+/, "").replace(/^\/+/, "");
        // Migra automaticamente as escolhas antigas para opções de destinos/ofertas.
        const substitutosAntigos = {
            "img/banners/banner1.jpg": "../img/destinos/riodejaneiro.jpg",
            "img/banners/banner2.jpg": "../img/destinos/fernando.jpg",
            "img/banners/banner3.jpg": "../img/ofertas/bonito.jpg",
            "img/banners/banner4.jpg": "../img/ofertas/santorini2.jpg",
            "img/banners/banner.png": "../img/ofertas/cancun.jpg",
            "img/banners/bannerconsciente.jpg": "../img/ofertas/bonito.jpg",
            "img/banners/fundo.png": "../img/destinos/fernando.jpg",
            "img/banners/fundo02.png": "../img/ofertas/maldivas.jpg",
            "img/banners/fundo03.png": "../img/ofertas/bonito.jpg",
            "img/banners/aviao.png": "../img/ofertas/buenosaires.jpg"
        };
        const caminhoAtualizado = substitutosAntigos[normalizar(caminho)] || caminho;
        const selecionado = normalizar(caminhoAtualizado);
        let opcaoSelecionada;
        document.querySelectorAll(".banner-opcao").forEach(opcao => {
            const ativo = normalizar(opcao.dataset.banner) === selecionado;
            opcao.classList.toggle("ativo", ativo);
            opcao.setAttribute("aria-pressed", String(ativo));
            if (ativo) opcaoSelecionada = opcao;
        });

        const bannerPerfil = document.getElementById("bannerPerfil");
        if (bannerPerfil && caminhoAtualizado) bannerPerfil.style.backgroundImage = `url("${caminhoAtualizado}")`;

        const textoSelecionado = document.getElementById("bannerSelecionadoTexto");
        if (textoSelecionado && opcaoSelecionada) {
            const nome = opcaoSelecionada.dataset.bannerNome
                || opcaoSelecionada.title
                || opcaoSelecionada.querySelector("img")?.alt
                || "Banner escolhido";
            textoSelecionado.textContent = `Selecionado: ${nome}`;
        }
    }

    function fecharGaleriaBanners() {
        modalGaleriaBanners?.classList.remove("ativo");
        modalGaleriaBanners?.setAttribute("aria-hidden", "true");
    }

    abrirGaleriaBanners?.addEventListener("click", () => {
        modalGaleriaBanners?.classList.add("ativo");
        modalGaleriaBanners?.setAttribute("aria-hidden", "false");
        requestAnimationFrame(() => modalGaleriaBanners?.querySelector(".banner-opcao.ativo")?.focus());
    });
    document.getElementById("fecharGaleriaBanners")?.addEventListener("click", fecharGaleriaBanners);
    document.getElementById("concluirGaleriaBanners")?.addEventListener("click", fecharGaleriaBanners);
    modalGaleriaBanners?.addEventListener("click", event => {
        if (event.target === modalGaleriaBanners) fecharGaleriaBanners();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modalGaleriaBanners?.classList.contains("ativo")) fecharGaleriaBanners();
    });

    btnEditarPerfil?.addEventListener("click", () => {
        preencherPerfil(getUsuario());
        modalEditarPerfil?.classList.add("ativo");
    });

    function fecharEdicao() {
        selecionarBanner(getUsuario()?.banner_perfil || "../img/ofertas/cancun.jpg");
        fecharGaleriaBanners();
        modalEditarPerfil?.classList.remove("ativo");
        const input = document.getElementById("inputFotoPerfil");
        if (input) input.value = "";
    }

    fecharEditarPerfil?.addEventListener("click", fecharEdicao);
    cancelarEditarPerfil?.addEventListener("click", fecharEdicao);

    modalEditarPerfil?.addEventListener("click", e => {
        if (e.target === modalEditarPerfil) fecharEdicao();
    });

    // --- BANNERS ---
    document.querySelectorAll(".banner-opcao").forEach(banner => {
        banner.addEventListener("click", () => {
            selecionarBanner(banner.dataset.banner);
            if (modalGaleriaBanners?.contains(banner)) fecharGaleriaBanners();
        });
    });

    // --- FOTO ---
    const btnAlterarFoto = document.getElementById("btnAlterarFoto");
    const inputFotoPerfil = document.getElementById("inputFotoPerfil");
    const fotoPerfilEditar = document.getElementById("fotoPerfilEditar");

    btnAlterarFoto?.addEventListener("click", e => {
        e.preventDefault();
        inputFotoPerfil.value = "";
        inputFotoPerfil.click();
    });

    inputFotoPerfil?.addEventListener("change", () => {
        const arquivo = inputFotoPerfil.files?.[0];
        if (!arquivo) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
            alert("Selecione uma imagem JPG, PNG ou WEBP.");
            inputFotoPerfil.value = "";
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5 MB.");
            inputFotoPerfil.value = "";
            return;
        }

        const leitor = new FileReader();
        leitor.onload = e => {
            if (fotoPerfilEditar) fotoPerfilEditar.src = e.target.result;
        };
        leitor.readAsDataURL(arquivo);
    });

    // --- SALVAR DADOS + FOTO ---
    document.getElementById("salvarEditarPerfil")?.addEventListener("click", async e => {
        e.preventDefault();

        const usuario = getUsuario();
        const token = getToken();
        if (!usuario || !token) {
            alert("Sua sessão expirou. Faça login novamente.");
            return;
        }

        const nome = document.getElementById("nomePerfilEditar")?.value.trim();
        const email = document.getElementById("emailPerfil")?.value.trim();
        const cpf = document.getElementById("cpfPerfil")?.value.replace(/\D/g, "");
        const telefone = document.getElementById("telefonePerfil")?.value.trim() || "";
        const dataNascimentoExibicao = document.getElementById("dataNascimentoPerfil")?.value || "";
        const dataNascimentoPartes = dataNascimentoExibicao.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        const dataNascimento = dataNascimentoPartes
            ? `${dataNascimentoPartes[3]}-${dataNascimentoPartes[2]}-${dataNascimentoPartes[1]}`
            : null;

        const campoNome = document.getElementById("nomePerfilEditar");
        const campoEmail = document.getElementById("emailPerfil");
        const campoCpf = document.getElementById("cpfPerfil");
        if (!nome || nome.length < 3) return window.boatourFieldError(campoNome, "Digite um nome válido.");
        if (!email || !email.includes("@")) return window.boatourFieldError(campoEmail, "Digite um e-mail válido.");
        if (cpf.length !== 11) return window.boatourFieldError(campoCpf, "Digite um CPF válido.");

        const headers = {
            "Content-Type": "application/json",
            "X-Session-Token": token
        };

        try {
            const respostaDados = await fetch(`${API}/usuarios/${usuario.id_usuario}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    nome,
                    email,
                    cpf,
                    telefone,
                    data_nascimento: dataNascimento
                })
            });

            const dados = await respostaDados.json();

            if (!respostaDados.ok || dados.error) {
                const mensagem = dados.error || "Não foi possível salvar seus dados.";
                if (/e-?mail/i.test(mensagem)) return window.boatourFieldError(campoEmail, mensagem);
                if (/cpf/i.test(mensagem)) return window.boatourFieldError(campoCpf, mensagem);
                if (/nome/i.test(mensagem)) return window.boatourFieldError(campoNome, mensagem);
                return alert(mensagem);
            }

            salvarLocal(dados.usuario);

            // Foto, se uma nova foi selecionada
            const arquivo = inputFotoPerfil?.files?.[0];
            if (arquivo) {
                const formData = new FormData();
                formData.append("foto", arquivo);

                const respostaFoto = await fetch(`${API}/upload-foto`, {
                    method: "POST",
                    headers: { "X-Session-Token": token },
                    body: formData
                });

                const resultadoFoto = await respostaFoto.json();

                if (!respostaFoto.ok || resultadoFoto.error) {
                    return alert(resultadoFoto.error || "Os dados foram salvos, mas a foto não pôde ser atualizada.");
                }

                dados.usuario.foto_perfil = resultadoFoto.foto;
                salvarLocal(dados.usuario);
            }

            // Banner selecionado
            const bannerAtivo = document.querySelector(".banner-opcao.ativo");
            if (bannerAtivo) {
                const bannerPath = bannerAtivo.dataset.banner;
                const respostaBanner = await fetch(`${API}/usuarios/${usuario.id_usuario}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({
                        ...dados.usuario,
                        banner_perfil: bannerPath
                    })
                });

                const resultadoBanner = await respostaBanner.json();
                if (respostaBanner.ok && resultadoBanner.usuario) {
                    salvarLocal(resultadoBanner.usuario);
                }
            }

            preencherPerfil(getUsuario());
            if (window.atualizarMenuUsuario) window.atualizarMenuUsuario();

            fecharEdicao();
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Não foi possível conectar ao servidor.");
        }
    });

    // --- ALTERAR SENHA ---
    document.getElementById("btnAlterarSenha")?.addEventListener("click", () => {
        document.getElementById("modalAlterarSenha")?.classList.add("ativo");
        document.getElementById("senhaAtual")?.focus();
    });

    document.getElementById("fecharAlterarSenha")?.addEventListener("click", () => {
        document.getElementById("modalAlterarSenha")?.classList.remove("ativo");
    });

    document.getElementById("cancelarAlterarSenha")?.addEventListener("click", () => {
        document.getElementById("modalAlterarSenha")?.classList.remove("ativo");
    });

    document.getElementById("salvarNovaSenha")?.addEventListener("click", async () => {
        const token = getToken();
        const senhaAtual = document.getElementById("senhaAtual")?.value;
        const novaSenha = document.getElementById("novaSenha")?.value;
        const confirmar = document.getElementById("confirmarNovaSenha")?.value;

        if (!senhaAtual) return window.boatourFieldError("senhaAtual", "Informe sua senha atual.");
        if (!novaSenha) return window.boatourFieldError("novaSenha", "Informe a nova senha.");
        if (novaSenha.length < 6) return window.boatourFieldError("novaSenha", "A nova senha precisa ter pelo menos 6 caracteres.");
        if (novaSenha !== confirmar) return window.boatourFieldError("confirmarNovaSenha", "As novas senhas não são iguais.");

        try {
            const resposta = await fetch(`${API}/usuarios/senha`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Token": token
                },
                body: JSON.stringify({
                    senha_atual: senhaAtual,
                    nova_senha: novaSenha
                })
            });

            const resultado = await resposta.json();
            if (!resposta.ok || resultado.error) {
                if (/senha atual|senha incorreta/i.test(resultado.error || "")) {
                    return window.boatourFieldError("senhaAtual", resultado.error);
                }
                return alert(resultado.error || "Não foi possível alterar a senha.");
            }

            document.getElementById("modalAlterarSenha")?.classList.remove("ativo");
            ["senhaAtual", "novaSenha", "confirmarNovaSenha"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "";
            });
            alert("Senha alterada com sucesso.");
        } catch {
            alert("Não foi possível conectar ao servidor.");
        }
    });

    // --- EXCLUIR CONTA ---
    document.getElementById("btnExcluirConta")?.addEventListener("click", async () => {
        const token = getToken();
        if (!token) return alert("Sua sessão expirou.");

        const senha = await window.boatourPrompt(
            "Para excluir sua conta, confirme sua senha. Esta ação não poderá ser desfeita."
        );
        if (!senha) return;

        if (!await window.boatourConfirm("Deseja realmente excluir sua conta?")) return;

        try {
            const resposta = await fetch(`${API}/usuarios/me`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Token": token
                },
                body: JSON.stringify({ senha })
            });

            const resultado = await resposta.json();
            if (!resposta.ok || resultado.error) return alert(resultado.error || "Não foi possível excluir a conta.");

            localStorage.removeItem("boatourUsuario");
            localStorage.removeItem("boatourSessionToken");
            alert("Sua conta foi excluída.");
            window.setTimeout(() => {
                window.location.href = "../index.html";
            }, 900);
        } catch {
            alert("Não foi possível conectar ao servidor.");
        }
    });

    // --- INICIALIZAÇÃO ---
    (async () => {
        const usuario = await sincronizarUsuario();
        preencherPerfil(usuario);
    })();
});
// --- FAVORITOS NO PERFIL ---

function obterImagemFavorito(caminho) {
    const valor = String(caminho || '').trim();
    if (!valor) return '';
    if (/^(https?:|data:|\/)/i.test(valor)) return valor;
    return `../${valor.replace(/^\.\//, '')}`;
}

async function carregarFavoritosPerfil() {
    const grid = document.getElementById('favoritosGrid');

    if (!grid) return;

    const sessionToken = localStorage.getItem('boatourSessionToken');

    // Usuário não está logado
    if (!sessionToken) {
        grid.innerHTML = `
            <p class="sem-favoritos">
                Entre na sua conta para visualizar seus favoritos.
            </p>
        `;
        return;
    }

    try {
        // Busca os favoritos do usuário
        const respostaFavoritos = await fetch(
            'http://localhost:3000/favoritos',
            {
                method: 'GET',
                headers: {
                    'X-Session-Token': sessionToken
                }
            }
        );

        const dadosFavoritos = await respostaFavoritos.json();

        if (!respostaFavoritos.ok) {
            throw new Error(
                dadosFavoritos.error || 'Erro ao buscar favoritos.'
            );
        }

        const favoritos = dadosFavoritos.favoritos || [];

        // Nenhum favorito
        if (favoritos.length === 0) {
            grid.innerHTML = `
                <p class="sem-favoritos">
                    Você ainda não possui favoritos.
                </p>
            `;
            return;
        }

        // Busca os dados dos quatro tipos de favoritos
        const [respostaDestinos, respostaOfertas, respostaHoteis, respostaAtividades] = await Promise.all([
            fetch('http://localhost:3000/destinos'),
            fetch('http://localhost:3000/ofertas'),
            fetch('http://localhost:3000/hoteis'),
            fetch('http://localhost:3000/atividades')
        ]);

        const destinos = await respostaDestinos.json();
        const ofertas = await respostaOfertas.json();
        const hoteis = await respostaHoteis.json();
        const atividades = await respostaAtividades.json();

        // Apenas os 4 favoritos mais recentes
        const favoritosRecentes = favoritos.slice(0, 4);

        grid.innerHTML = '';

        favoritosRecentes.forEach(favorito => {

            let item = null;
            let imagem = '';
            let nome = '';

            // --- DESTINO ---

            if (favorito.tipo === 'destino') {

                item = destinos.find(
                    destino =>
                        Number(destino.id_destino) === Number(favorito.id_item)
                );

                if (item) {
                    nome = item.nome;
                    imagem = `/img/destinos/${item.imagem}`;
                }
            }

            // --- OFERTA ---

            else if (favorito.tipo === 'oferta') {

                item = ofertas.find(
                    oferta =>
                        Number(oferta.id) === Number(favorito.id_item)
                );

                if (item) {
                    nome = item.titulo;
                    imagem = `/${item.imagem}`;
                }
            }

            else if (favorito.tipo === 'hotel') {
                item = hoteis.find(
                    hotel => Number(hotel.id_hotel) === Number(favorito.id_item)
                );

                if (item) {
                    nome = item.nome_hotel || 'Hotel';
                    imagem = obterImagemFavorito(item.imagem_principal);
                }
            }

            else if (favorito.tipo === 'atividade') {
                item = atividades.find(
                    atividade => Number(atividade.id_atividade) === Number(favorito.id_item)
                );

                if (item) {
                    nome = item.nome_atividade || 'Atividade';
                    imagem = obterImagemFavorito(item.imagem_principal);
                }
            }

            // --- SE O ITEM EXISTIR ---

            if (item) {

                const card = document.createElement('div');

                card.className = 'card-viagem02';

                card.innerHTML = `
                    <div class="imagem-viagem">
                        <img
                            src="${imagem}"
                            alt="${nome}"
                        >
                    </div>

                    <div class="info-viagem02">
                        <h3>${nome}</h3>
                    </div>
                `;

                grid.appendChild(card);
            }
        });

        // Caso existam favoritos, mas nenhum item
        // correspondente tenha sido encontrado
        if (grid.children.length === 0) {
            grid.innerHTML = `
                <p class="sem-favoritos">
                    Não foi possível carregar seus favoritos.
                </p>
            `;
        }

    } catch (erro) {

        console.error(
            'ERRO AO CARREGAR FAVORITOS DO PERFIL:',
            erro
        );

        grid.innerHTML = `
            <p class="sem-favoritos">
                Não foi possível carregar seus favoritos.
            </p>
        `;
    }
}


// Carrega os favoritos quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarFavoritosPerfil();
});

const btnVerTodosFavoritos =
    document.getElementById("btnVerTodosFavoritos");

if (btnVerTodosFavoritos) {
    btnVerTodosFavoritos.addEventListener("click", () => {
        window.location.href = "../FAVORITOS/index.html";
    });
}
