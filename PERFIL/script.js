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
        if (cpfEditar) cpfEditar.value = usuario.cpf || "";
        if (telefoneEditar) telefoneEditar.value = usuario.telefone || "";
        if (nascimentoEditar) nascimentoEditar.value = usuario.data_nascimento
            ? String(usuario.data_nascimento).slice(0, 10)
            : "";

        if (usuario.foto_perfil) window.atualizarFotosPerfil(usuario.foto_perfil);

        if (usuario.banner_perfil) {
            const bannerPerfil = document.getElementById("bannerPerfil");
            if (bannerPerfil) bannerPerfil.style.backgroundImage = `url("${usuario.banner_perfil}")`;
        }
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

    // ==========================================
    // NOTIFICAÇÕES
    // ==========================================
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

    // ==========================================
    // EDITAR PERFIL
    // ==========================================
    const btnEditarPerfil = document.getElementById("btnEditarPerfil");
    const modalEditarPerfil = document.getElementById("modalEditarPerfil");
    const fecharEditarPerfil = document.getElementById("fecharEditarPerfil");
    const cancelarEditarPerfil = document.getElementById("cancelarEditarPerfil");

    btnEditarPerfil?.addEventListener("click", () => {
        preencherPerfil(getUsuario());
        modalEditarPerfil?.classList.add("ativo");
    });

    function fecharEdicao() {
        modalEditarPerfil?.classList.remove("ativo");
        const input = document.getElementById("inputFotoPerfil");
        if (input) input.value = "";
    }

    fecharEditarPerfil?.addEventListener("click", fecharEdicao);
    cancelarEditarPerfil?.addEventListener("click", fecharEdicao);

    modalEditarPerfil?.addEventListener("click", e => {
        if (e.target === modalEditarPerfil) fecharEdicao();
    });

    // ==========================================
    // BANNERS
    // ==========================================
    document.querySelectorAll(".banner-opcao").forEach(banner => {
        banner.addEventListener("click", () => {
            document.querySelectorAll(".banner-opcao").forEach(item => item.classList.remove("ativo"));
            banner.classList.add("ativo");

            const bannerPerfil = document.getElementById("bannerPerfil");
            if (bannerPerfil) {
                bannerPerfil.style.backgroundImage = `url("${banner.dataset.banner}")`;
            }
        });
    });

    // ==========================================
    // FOTO
    // ==========================================
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

    // ==========================================
    // SALVAR DADOS + FOTO
    // ==========================================
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
        const dataNascimento = document.getElementById("dataNascimentoPerfil")?.value || null;

        if (!nome || nome.length < 3) return alert("Digite um nome válido.");
        if (!email || !email.includes("@")) return alert("Digite um e-mail válido.");
        if (cpf.length !== 11) return alert("Digite um CPF válido.");

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
                return alert(dados.error || "Não foi possível salvar seus dados.");
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

    // ==========================================
    // ALTERAR SENHA
    // ==========================================
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

        if (!senhaAtual || !novaSenha) return alert("Preencha os campos de senha.");
        if (novaSenha.length < 6) return alert("A nova senha deve ter pelo menos 6 caracteres.");
        if (novaSenha !== confirmar) return alert("As novas senhas não são iguais.");

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
            if (!resposta.ok || resultado.error) return alert(resultado.error || "Não foi possível alterar a senha.");

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

    // ==========================================
    // SAIR
    // ==========================================
    const btnSairConta = document.getElementById("btnSairConta");
    const modalSairConta = document.getElementById("modalSairConta");
    const fecharSairConta = document.getElementById("fecharSairConta");
    const cancelarSairConta = document.getElementById("cancelarSairConta");
    const continuarSairConta = document.getElementById("continuarSairConta");

    const modalSenhaSairConta = document.getElementById("modalSenhaSairConta");
    const fecharSenhaSairConta = document.getElementById("fecharSenhaSairConta");
    const confirmarSairConta = document.getElementById("confirmarSairConta");
    const senhaSairConta = document.getElementById("senhaSairConta");

    btnSairConta?.addEventListener("click", () => modalSairConta?.classList.add("ativo"));
    fecharSairConta?.addEventListener("click", () => modalSairConta?.classList.remove("ativo"));
    cancelarSairConta?.addEventListener("click", () => modalSairConta?.classList.remove("ativo"));

    continuarSairConta?.addEventListener("click", () => {
        modalSairConta?.classList.remove("ativo");
        modalSenhaSairConta?.classList.add("ativo");
        if (senhaSairConta) {
            senhaSairConta.value = "";
            senhaSairConta.focus();
        }
    });

    fecharSenhaSairConta?.addEventListener("click", () => {
        modalSenhaSairConta?.classList.remove("ativo");
        if (senhaSairConta) senhaSairConta.value = "";
    });

    confirmarSairConta?.addEventListener("click", async () => {
        const token = getToken();
        const senha = senhaSairConta?.value;

        if (!senha) return alert("Digite sua senha para continuar.");

        try {
            const resposta = await fetch(`${API}/confirmar-senha`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Token": token
                },
                body: JSON.stringify({ senha })
            });

            const resultado = await resposta.json();
            if (!resposta.ok || resultado.error) return alert(resultado.error || "Senha incorreta.");

            await fetch(`${API}/logout`, {
                method: "POST",
                headers: { "X-Session-Token": token }
            });

            localStorage.removeItem("boatourUsuario");
            localStorage.removeItem("boatourSessionToken");
            window.location.href = "../index.html?saiu=sucesso";
        } catch {
            alert("Não foi possível sair da conta.");
        }
    });

    // ==========================================
    // EXCLUIR CONTA
    // ==========================================
    document.getElementById("btnExcluirConta")?.addEventListener("click", async () => {
        const token = getToken();
        if (!token) return alert("Sua sessão expirou.");

        const senha = prompt("Para excluir sua conta, digite sua senha:");
        if (!senha) return;

        if (!confirm("Essa ação excluirá sua conta. Deseja continuar?")) return;

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
            window.location.href = "../index.html";
        } catch {
            alert("Não foi possível conectar ao servidor.");
        }
    });

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================
    (async () => {
        const usuario = await sincronizarUsuario();
        preencherPerfil(usuario);
    })();
});
// ==========================================
// FAVORITOS NO PERFIL
// ==========================================

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

        // Busca destinos e ofertas
        const [respostaDestinos, respostaOfertas] = await Promise.all([
            fetch('http://localhost:3000/destinos'),
            fetch('http://localhost:3000/ofertas')
        ]);

        const destinos = await respostaDestinos.json();
        const ofertas = await respostaOfertas.json();

        // Apenas os 4 favoritos mais recentes
        const favoritosRecentes = favoritos.slice(0, 4);

        grid.innerHTML = '';

        favoritosRecentes.forEach(favorito => {

            let item = null;
            let imagem = '';
            let nome = '';

            // ==============================
            // DESTINO
            // ==============================

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

            // ==============================
            // OFERTA
            // ==============================

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

            // ==============================
            // SE O ITEM EXISTIR
            // ==============================

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