
const API_PUBLICACOES = "http://localhost:3000/publicacoes";
const API_BASE = "http://localhost:3000";


function confirmarExclusaoPublicacao() {
    return new Promise((resolve) => {
        const overlay = document.createElement("div");
        overlay.className = "confirmacao-exclusao-overlay";

        overlay.innerHTML = `
            <div class="confirmacao-exclusao-modal"
                 role="alertdialog"
                 aria-modal="true"
                 aria-labelledby="tituloConfirmacaoExclusao"
                 aria-describedby="textoConfirmacaoExclusao">

                <div class="confirmacao-exclusao-icone">
                    <span>!</span>
                </div>

                <h2 id="tituloConfirmacaoExclusao">
                    Excluir publicação?
                </h2>

                <p id="textoConfirmacaoExclusao">
                    Tem certeza de que deseja excluir esta publicação?
                    Essa ação não poderá ser desfeita.
                </p>

                <div class="confirmacao-exclusao-acoes">
                    <button type="button" class="btn-cancelar-exclusao">
                        Cancelar
                    </button>

                    <button type="button" class="btn-confirmar-exclusao">
                        Excluir publicação
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const botaoCancelar = overlay.querySelector(
            ".btn-cancelar-exclusao"
        );

        const botaoExcluir = overlay.querySelector(
            ".btn-confirmar-exclusao"
        );

        function finalizar(resultado) {
            document.removeEventListener("keydown", teclaEscape);
            overlay.classList.add("fechando");

            setTimeout(() => overlay.remove(), 200);

            resolve(resultado);
        }

        function teclaEscape(evento) {
            if (evento.key === "Escape") {
                finalizar(false);
            }
        }

        botaoCancelar.addEventListener("click", () => {
            finalizar(false);
        });

        botaoExcluir.addEventListener("click", () => {
            finalizar(true);
        });

        overlay.addEventListener("click", (evento) => {
            if (evento.target === overlay) {
                finalizar(false);
            }
        });

        document.addEventListener("keydown", teclaEscape);

        botaoCancelar.focus();
    });
}

document.addEventListener("DOMContentLoaded", carregarGaleria);

function caminhoImagem(caminho) {
    if (!caminho) return "";

    // Aceita caminhos relativos ou URLs completas.
    if (/^https?:\/\//i.test(caminho)) {
        return caminho;
    }

    return `${API_BASE}/${caminho.replace(/^\/+/, "")}`;
}

function textoNotaExperiencia(valor) {
    const nota = Number(valor);
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        return "Nota ainda não informada";
    }

    return `${"★".repeat(nota)}${"☆".repeat(5 - nota)} ${nota}/5`;
}

async function carregarGaleria() {
    const holder = document.querySelector(".galeria-holder");
    if (!holder) return;

    holder.innerHTML = "<p>Carregando publicações...</p>";

    try {
        const token = localStorage.getItem("boatourSessionToken");
        const headers = token ? { "x-session-token": token } : {};
        const [resposta, respostaUsuario] = await Promise.all([
            fetch(API_PUBLICACOES, { headers }),
            token ? fetch(`${API_BASE}/usuarios/me`, { headers }) : Promise.resolve(null)
        ]);

        let idUsuarioAtual = null;
        if (respostaUsuario?.ok) {
            const usuarioAtual = await respostaUsuario.json();
            idUsuarioAtual = Number(usuarioAtual.id_usuario || usuarioAtual.id) || null;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as publicações.");
        }

        const publicacoes = await resposta.json();
        holder.innerHTML = "";

        if (!Array.isArray(publicacoes) || publicacoes.length === 0) {
            holder.innerHTML = `
                <p class="galeria-vazia">
                    Ainda não há viagens publicadas.
                    Seja o primeiro a compartilhar!
                </p>
            `;
            return;
        }

        publicacoes.forEach(publicacao => {
            // A comparação pelo ID mantém as ações disponíveis caso uma versão
            // antiga da API ainda não envie o indicador minha_publicacao.
            publicacao.minha_publicacao = Boolean(publicacao.minha_publicacao || (
                idUsuarioAtual && Number(publicacao.id_usuario) === idUsuarioAtual
            ));
            const card = document.createElement("article");
            card.className = "viajante-card";
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute(
                "aria-label",
                `Ver publicação de ${publicacao.nome_usuario || "Viajante"}`
            );

            const imagem = document.createElement("img");
            imagem.alt = `Viagem para ${publicacao.cidade || "um destino"}`;
            imagem.loading = "lazy";

            // A listagem não inclui as fotos da viagem.
            // Usamos a foto de perfil como imagem inicial.
           // Busca os detalhes da publicação para obter a foto da viagem.
imagem.src = "img/icones/perfil.png";

fetch(`${API_PUBLICACOES}/${publicacao.id_publicacao}`)
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao buscar fotos da publicação.");
        }

        return resposta.json();
    })
    .then(detalhes => {
        if (detalhes.fotos && detalhes.fotos.length > 0) {
            imagem.src = caminhoImagem(
                detalhes.fotos[0].caminho_foto
            );
            imagem.alt = `Viagem para ${publicacao.cidade || "um destino"}`;
        }
    })
    .catch(erro => {
        console.error("Erro ao carregar foto do card:", erro);
    });

imagem.onerror = () => {
    imagem.onerror = null;
    imagem.src = "img/icones/perfil.png";
};

imagem.loading = "lazy";
            imagem.onerror = () => {
                imagem.onerror = null;
                imagem.src = "img/icones/perfil.png";
            };

            const info = document.createElement("div");
            info.className = "viajante-info";

            const nome = document.createElement("h3");
            nome.textContent = publicacao.nome_usuario || "Viajante";

            const nota = document.createElement("p");
            nota.className = "nota-experiencia-publicada";
            nota.textContent = textoNotaExperiencia(publicacao.nota_experiencia);

            const local = document.createElement("p");
            const cidadePais = [
                publicacao.cidade,
                publicacao.pais
            ].filter(Boolean).join(", ");

            local.textContent = `● ${cidadePais || "Local não informado"}`;

            info.append(nome, local, nota);
            card.append(imagem, info);

            const abrirModal = () => mostrarDetalhesPublicacao(publicacao);

            card.addEventListener("click", abrirModal);

            card.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrirModal();
                }
            });

            holder.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar a galeria:", erro);

        holder.innerHTML = `
            <p class="galeria-vazia">
                Não foi possível carregar as viagens.
                Verifique se o servidor BoaTour está ligado.
            </p>
        `;
    }
}

async function mostrarDetalhesPublicacao(publicacao) {
    // Fecha o modal anterior, se existir.
    const modalAnterior = document.querySelector("#modalDetalhePublicacao");
    if (modalAnterior) {
        modalAnterior.classList.add("fechando");
        await new Promise(resolve => setTimeout(resolve, 240));
        modalAnterior.remove();
    }

    const modal = document.createElement("div");
    modal.id = "modalDetalhePublicacao";
    modal.className = "modal-publicacao";

    const conteudo = document.createElement("div");
    conteudo.className = "modal-publicacao-conteudo";
    conteudo.setAttribute("role", "dialog");
    conteudo.setAttribute("aria-modal", "true");
    conteudo.setAttribute(
        "aria-label",
        `Publicação de ${publicacao.nome_usuario || "Viajante"}`
    );

    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "modal-publicacao-fechar";
    fechar.textContent = "×";
    fechar.setAttribute("aria-label", "Fechar publicação");

    const titulo = document.createElement("h2");
    titulo.textContent = publicacao.titulo || "Viagem compartilhada";

    const autor = document.createElement("p");
    autor.className = "modal-publicacao-autor";
    autor.textContent = publicacao.nome_usuario || "Viajante";

    const local = document.createElement("p");
    local.textContent = [
        publicacao.cidade,
        publicacao.pais
    ].filter(Boolean).join(", ");

    const descricao = document.createElement("p");
    descricao.className = "modal-publicacao-descricao";
    descricao.textContent = publicacao.descricao || "Sem descrição.";

    const notaExperiencia = document.createElement("p");
    notaExperiencia.className = "nota-experiencia-publicada";
    notaExperiencia.textContent = `Nota de quem publicou: ${textoNotaExperiencia(publicacao.nota_experiencia)}`;

    const galeriaFotos = document.createElement("div");
    galeriaFotos.className = "modal-publicacao-fotos";
    galeriaFotos.textContent = "Carregando fotos...";

    conteudo.append(
        fechar,
        titulo,
        autor,
        local,
        descricao,
        notaExperiencia,
        galeriaFotos
    );

    const acoesAutor = document.createElement("div");
    acoesAutor.className = "acoes-publicacao-propria";
    const formularioEdicao = document.createElement("form");
    formularioEdicao.className = "form-editar-publicacao";
    formularioEdicao.hidden = true;
    formularioEdicao.innerHTML = `
        <label>Título<input name="titulo" type="text" maxlength="150" required></label>
        <label>Descrição<textarea name="descricao" rows="4" required></textarea></label>
        <label>Avaliação da experiência
            <select name="nota_experiencia" required>
                <option value="">Selecione a nota</option>
                <option value="1">1 estrela</option><option value="2">2 estrelas</option>
                <option value="3">3 estrelas</option><option value="4">4 estrelas</option>
                <option value="5">5 estrelas</option>
            </select>
        </label>
        <p class="mensagem-editar-publicacao" role="status" aria-live="polite"></p>
        <div class="acoes-editar-publicacao">
            <button type="button" class="cancelar-edicao-publicacao">Cancelar edição</button>
            <button type="submit">Salvar alterações</button>
        </div>`;
    let fecharModal = () => {};

    if (publicacao.minha_publicacao) {
        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "editar-publicacao-propria";
        editar.textContent = "Editar publicação";
        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.className = "excluir-publicacao-propria";
        excluir.textContent = "Excluir publicação";
        acoesAutor.append(editar, excluir);
        conteudo.append(acoesAutor, formularioEdicao);

        editar.addEventListener("click", () => {
            formularioEdicao.elements.titulo.value = publicacao.titulo || "";
            formularioEdicao.elements.descricao.value = publicacao.descricao || "";
            formularioEdicao.elements.nota_experiencia.value = publicacao.nota_experiencia ? String(publicacao.nota_experiencia) : "";
            formularioEdicao.hidden = !formularioEdicao.hidden;
            if (!formularioEdicao.hidden) formularioEdicao.elements.titulo.focus();
        });
        formularioEdicao.querySelector(".cancelar-edicao-publicacao").addEventListener("click", () => {
            formularioEdicao.hidden = true;
            formularioEdicao.querySelector(".mensagem-editar-publicacao").textContent = "";
        });
        formularioEdicao.addEventListener("submit", async evento => {
            evento.preventDefault();
            const token = localStorage.getItem("boatourSessionToken");
            if (!token) {
                formularioEdicao.querySelector(".mensagem-editar-publicacao").textContent = "Entre novamente para editar sua publicação.";
                return;
            }
            const botaoSalvar = formularioEdicao.querySelector('button[type="submit"]');
            const aviso = formularioEdicao.querySelector(".mensagem-editar-publicacao");
            botaoSalvar.disabled = true;
            aviso.textContent = "Salvando alterações...";
            try {
                const respostaEdicao = await fetch(`${API_PUBLICACOES}/${encodeURIComponent(publicacao.id_publicacao)}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "x-session-token": token },
                    body: JSON.stringify({
                        titulo: formularioEdicao.elements.titulo.value,
                        descricao: formularioEdicao.elements.descricao.value,
                        nota_experiencia: Number(formularioEdicao.elements.nota_experiencia.value)
                    })
                });
                const resultado = await respostaEdicao.json();
                if (!respostaEdicao.ok) throw new Error(resultado.error || "Não foi possível salvar as alterações.");
                await carregarGaleria();
                fecharModal();
            } catch (erro) {
                aviso.textContent = erro.message;
            } finally { botaoSalvar.disabled = false; }
        });
        excluir.addEventListener("click", async () => {
            const confirmou = await confirmarExclusaoPublicacao();
            if (!confirmou) return;
            const token = localStorage.getItem("boatourSessionToken");
            if (!token) {
                window.alert("Entre novamente para excluir sua publicação.");
                return;
            }
            excluir.disabled = true;
            try {
                const respostaExclusao = await fetch(`${API_PUBLICACOES}/${encodeURIComponent(publicacao.id_publicacao)}`, {
                    method: "DELETE",
                    headers: { "x-session-token": token }
                });
                const resultado = await respostaExclusao.json();
                if (!respostaExclusao.ok) throw new Error(resultado.error || "Não foi possível excluir a publicação.");
                await carregarGaleria();
                fecharModal();
            } catch (erro) {
                window.alert(erro.message);
                excluir.disabled = false;
            }
        });
    }

    modal.appendChild(conteudo);
    document.body.appendChild(modal);

    fecharModal = function () {
        if (modal.classList.contains("fechando")) return;
        modal.classList.add("fechando");
        document.removeEventListener("keydown", teclaEscape);
        setTimeout(() => modal.remove(), 240);
    }

    function teclaEscape(evento) {
        if (evento.key === "Escape") fecharModal();
    }

    fechar.addEventListener("click", fecharModal);

    modal.addEventListener("click", evento => {
        if (evento.target === modal) fecharModal();
    });

    document.addEventListener("keydown", teclaEscape);
    fechar.focus();

    try {
        const resposta = await fetch(
            `${API_PUBLICACOES}/${encodeURIComponent(publicacao.id_publicacao)}`,
            { headers: localStorage.getItem("boatourSessionToken") ? { "x-session-token": localStorage.getItem("boatourSessionToken") } : {} }
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as fotos.");
        }

        const detalhes = await resposta.json();

        // Se o modal tiver sido fechado durante a consulta, não altera nada.
        if (!modal.isConnected) return;

        notaExperiencia.textContent = `Nota de quem publicou: ${textoNotaExperiencia(detalhes.nota_experiencia)}`;

        galeriaFotos.innerHTML = "";

        const fotos = Array.isArray(detalhes.fotos)
            ? detalhes.fotos
            : [];

        if (fotos.length === 0) {
            galeriaFotos.textContent = "Esta viagem ainda não tem fotos.";
            return;
        }

        fotos.forEach((foto, indice) => {
            const imagem = document.createElement("img");
            imagem.src = caminhoImagem(foto.caminho_foto);
            imagem.alt = `Foto ${indice + 1} da viagem`;
            imagem.loading = "lazy";

            imagem.onerror = () => {
                imagem.remove();
            };

            galeriaFotos.appendChild(imagem);
        });

        if (galeriaFotos.children.length === 0) {
            galeriaFotos.textContent = "Não foi possível exibir as fotos.";
        }
    } catch (erro) {
        console.error("Erro ao carregar fotos da publicação:", erro);

        if (modal.isConnected) {
            galeriaFotos.textContent =
                "Não foi possível carregar as fotos desta viagem.";
        }
    }
}
