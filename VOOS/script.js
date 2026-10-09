// ==========================================
// FOTO DE PERFIL
// ==========================================

const fotoPerfil = document.querySelector(".foto-viajante");

if (fotoPerfil) {

    fotoPerfil.addEventListener("click", () => {

        window.location.href = "../PERFIL/index.html";

    });

}


// ==========================================
// VARIÁVEIS GERAIS
// ==========================================

let aeroportos = [];

let todosVoos = [];

let quantidadeVisivel = 8;

let filtroPrecoAtual = "todos";


// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const listaVoos =
        document.getElementById("listaVoos");

    const btnBuscar =
        document.querySelector(".btn-buscar");

    const btnVerMais =
        document.querySelector(".btn-ofertas");

    const campoPartida =
        document.getElementById("partida");

    const campoDestino =
        document.getElementById("destino");

    const campoDataPartida =
        document.getElementById("dataPartida");

    const campoDataRetorno =
        document.getElementById("dataRetorno");

    const inputPassageiros =
        document.getElementById("passageiros");


    // ======================================
    // SE NÃO ESTIVER NA PÁGINA DE VOOS
    // ======================================

    if (!listaVoos) {
        return;
    }


    // ======================================
    // BUSCAR VOOS INICIALMENTE
    // ======================================

    carregarVoos();


    // ======================================
    // BOTÃO BUSCAR
    // ======================================

    if (btnBuscar) {

        btnBuscar.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                quantidadeVisivel = 8;

                carregarVoos();

            }
        );

    }


    // ======================================
    // BOTÃO VER MAIS
    // ======================================

    if (btnVerMais) {

        btnVerMais.addEventListener(
            "click",
            function () {

                quantidadeVisivel += 8;

                renderizarVoos();

            }
        );

    }


    // ======================================
    // FILTROS DE PREÇO
    // ======================================

    
const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(botao => {
    botao.addEventListener("click", function () {
        botoesFiltro.forEach(btn => {
            btn.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        // Lê o atributo data-filtro do HTML
        filtroPrecoAtual = botao.dataset.filtro || "todos";

        quantidadeVisivel = 8;

        aplicarFiltrosLocais();
    });
});



    // ======================================
    // SELECIONAR DESTINO/PARTIDA
    // ======================================

    if (campoPartida) {

        campoPartida.addEventListener(
            "change",
            () => {

                quantidadeVisivel = 8;

            }
        );

    }


    if (campoDestino) {

        campoDestino.addEventListener(
            "change",
            () => {

                quantidadeVisivel = 8;

            }
        );

    }


    // ======================================
    // DATA
    // ======================================

    if (campoDataPartida) {

        campoDataPartida.addEventListener(
            "change",
            () => {

                quantidadeVisivel = 8;

            }
        );

    }

});


// ==========================================
// CARREGAR VOOS
// ==========================================

async function carregarVoos() {

    const listaVoos =
        document.getElementById("listaVoos");


    if (!listaVoos) {
        return;
    }


    try {

        // ==================================
        // PEGAR VALORES DOS INPUTS
        // ==================================

        const partida =
            document.getElementById("partida")?.value.trim() || "";

        const destino =
            document.getElementById("destino")?.value.trim() || "";

        const dataTexto =
            document.getElementById("dataPartida")?.value.trim() || "";


        // ==================================
        // CONVERTER DATA
        // ==================================

        const data =
            converterDataParaBanco(dataTexto);


        // ==================================
        // MONTAR PARÂMETROS
        // ==================================

        const parametros =
            new URLSearchParams();


        if (partida !== "") {

            parametros.append(
                "origem",
                partida
            );

        }


        if (destino !== "") {

            parametros.append(
                "destino",
                destino
            );

        }


        if (data !== "") {

            parametros.append(
                "data",
                data
            );

        }


        // ==================================
        // FILTRO DE PREÇO
        // ==================================

        if (filtroPrecoAtual === "500") {

            parametros.append(
                "precoMax",
                "500"
            );

        }


        else if (filtroPrecoAtual === "1000") {

            parametros.append(
                "precoMax",
                "1000"
            );

        }


        else if (filtroPrecoAtual === "3000") {

            parametros.append(
                "precoMax",
                "3000"
            );

        }


        else if (filtroPrecoAtual === "3000+") {

            parametros.append(
                "precoMin",
                "3000.01"
            );

        }


        // ==================================
        // BUSCAR NO SERVIDOR
        // ==================================

        let url =
            "http://localhost:3000/voos";


        const query =
            parametros.toString();


        if (query !== "") {

            url += "?" + query;

        }


        console.log(
            "BUSCANDO VOOS:",
            url
        );


        const resposta =
            await fetch(url);


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar voos."
            );

        }


        todosVoos =
            await resposta.json();


        console.log(
            "VOOS RECEBIDOS:",
            todosVoos
        );


        quantidadeVisivel = 8;


        renderizarVoos();


    } catch (erro) {

        console.error(
            "Erro ao carregar voos:",
            erro
        );


        listaVoos.innerHTML = `
            <div class="sem-voos">

                <h3>
                    Não foi possível carregar os voos.
                </h3>

                <p>
                    Verifique se o servidor está funcionando.
                </p>

            </div>
        `;


        atualizarBotaoVerMais();

    }

}


// ==========================================
// CONVERTER DATA PARA O BANCO
// ==========================================

function converterDataParaBanco(texto) {

    if (!texto) {
        return "";
    }


    // Caso já esteja YYYY-MM-DD

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(texto)
    ) {

        return texto;

    }


    // Caso esteja DD/MM/YYYY

    const partes =
        texto.split("/");


    if (partes.length !== 3) {

        return "";

    }


    const dia =
        partes[0].padStart(2, "0");

    const mes =
        partes[1].padStart(2, "0");

    const ano =
        partes[2];


    if (
        ano.length !== 4 ||
        isNaN(Number(dia)) ||
        isNaN(Number(mes)) ||
        isNaN(Number(ano))
    ) {

        return "";

    }


    return `${ano}-${mes}-${dia}`;

}


// ==========================================
// FORMATAR DATA PARA EXIBIÇÃO
// ==========================================

function formatarDataVoo(data) {
    if (!data) {
        return "";
    }

    const correspondencia = String(data).match(
        /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (!correspondencia) {
        return data;
    }

    const ano = correspondencia[1];
    const mes = correspondencia[2];
    const dia = correspondencia[3];

    return `${dia}/${mes}/${ano}`;
}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(preco) {

    return Number(preco || 0)
        .toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// TEXTO DAS ESCALAS
// ==========================================

function formatarEscalas(escalas) {

    const quantidade =
        Number(escalas || 0);


    if (quantidade === 0) {

        return "Direto";

    }


    if (quantidade === 1) {

        return "1 escala";

    }


    return `${quantidade} escalas`;

}


// ==========================================
// RENDERIZAR VOOS
// ==========================================

function renderizarVoos() {

    const listaVoos =
        document.getElementById("listaVoos");


    if (!listaVoos) {
        return;
    }


    listaVoos.innerHTML = "";


    // ======================================
    // NENHUM RESULTADO
    // ======================================

    if (
        !Array.isArray(todosVoos) ||
        todosVoos.length === 0
    ) {

        listaVoos.innerHTML = `
            <div class="sem-voos">

                <h3>
                    Nenhum voo encontrado
                </h3>

                <p>
                    Tente alterar a origem,
                    destino, data ou faixa de preço.
                </p>

            </div>
        `;


        atualizarBotaoVerMais();

        return;

    }


    // ======================================
    // VOOS VISÍVEIS
    // ======================================

    const voosVisiveis =
        todosVoos.slice(
            0,
            quantidadeVisivel
        );


    // ======================================
    // CRIAR CARDS
    // ======================================

    voosVisiveis.forEach(voo => {


        const card =
            document.createElement("div");


        card.classList.add("oferta");


        // ==================================
        // ORIGEM / DESTINO
        // ==================================

        const origem =
            voo.origem || "Origem";


        const destino =
            voo.destino || "Destino";


        // ==================================
        // DATA
        // ==================================

        const data =
            formatarDataVoo(
                voo.data_saida
            );


        // ==================================
        // ESCALAS
        // ==================================

        const escalas =
            formatarEscalas(
                voo.escalas
            );


        // ==================================
        // PREÇO
        // ==================================

        const preco =
            formatarPreco(
                voo.preco
            );


        // ==================================
        // COMPANHIA
        // ==================================

        const companhia =
            voo.companhia_aerea ||
            "Companhia aérea";


        // ==================================
        // CARD
        // ==================================

        card.innerHTML = `

            <div>

                <strong>
                    ${origem} → ${destino}
                </strong>

                <p>
                    ${data} • ${escalas}
                </p>

                <small>
                    ${companhia}
                </small>

            </div>


            <div class="preco">

                ${
                    voo.preco_anterior
                        ? `
                            <span class="preco-anterior">
                                R$ ${formatarPreco(
                                    voo.preco_anterior
                                )}
                            </span>
                        `
                        : ""
                }

                <strong>
                    R$ ${preco}
                </strong>

                <span>
                    A partir de
                </span>

            </div>

        `;


        // ==================================
        // DADOS DO CARD
        // ==================================

        card.dataset.id =
            voo.id_voo;

        card.dataset.origem =
            voo.origem || "";

        card.dataset.destino =
            voo.destino || "";

        card.dataset.data =
            voo.data_saida || "";

        card.dataset.preco =
            voo.preco || "";

        card.dataset.companhia =
            voo.companhia_aerea || "";


        // ==================================
        // ADICIONAR NA LISTA
        // ==================================

        listaVoos.appendChild(card);

    });


    // ======================================
    // ATUALIZAR BOTÃO
    // ======================================

    atualizarBotaoVerMais();

}


// ==========================================
// BOTÃO VER MAIS
// ==========================================

function atualizarBotaoVerMais() {

    const btnVerMais =
        document.querySelector(".btn-ofertas");


    if (!btnVerMais) {
        return;
    }


    if (
        quantidadeVisivel <
        todosVoos.length
    ) {

        btnVerMais.style.display =
            "block";

    } else {

        btnVerMais.style.display =
            "none";

    }

}


// ==========================================
// AEROPORTOS
// ==========================================

async function carregarAeroportos() {

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/aeroportos"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar aeroportos"
            );

        }


        aeroportos =
            await resposta.json();


        console.log(
            "AEROPORTOS CARREGADOS:",
            aeroportos
        );


        configurarAutocomplete(
            document.getElementById("partida"),
            document.getElementById("sugestoesPartida")
        );


        configurarAutocomplete(
            document.getElementById("destino"),
            document.getElementById("sugestoesDestino")
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar aeroportos:",
            erro
        );

    }

}


carregarAeroportos();


// ==========================================
// AUTOCOMPLETE
// ==========================================

function configurarAutocomplete(
    input,
    lista
) {

    if (!input || !lista) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            const texto =
                input.value
                    .toLowerCase()
                    .trim();


            lista.innerHTML = "";


            if (texto === "") {
                return;
            }


            const resultados =
                aeroportos.filter(
                    function (aeroporto) {

                        const nome =
                            String(
                                aeroporto.nome || ""
                            ).toLowerCase();


                        const cidade =
                            String(
                                aeroporto.cidade || ""
                            ).toLowerCase();


                        const iata =
                            String(
                                aeroporto.iata || ""
                            ).toLowerCase();


                        return (
                            nome.includes(texto) ||
                            cidade.includes(texto) ||
                            iata.includes(texto)
                        );

                    }
                );


            resultados
                .slice(0, 6)
                .forEach(
                    function (aeroporto) {


                        const opcao =
                            document.createElement("div");


                        opcao.classList.add(
                            "sugestao"
                        );


                        opcao.textContent =
                            `${aeroporto.nome} (${aeroporto.iata})`;


                        opcao.addEventListener(
                            "click",
                            function () {

                                input.value =
                                    aeroporto.nome +
                                    ` (${aeroporto.iata})`;


                                lista.innerHTML = "";

                            }
                        );


                        lista.appendChild(
                            opcao
                        );

                    }
                );

        }
    );

}


// ==========================================
// FECHAR SUGESTÕES AO CLICAR FORA
// ==========================================

document.addEventListener(
    "click",
    function (evento) {

        const partida =
            document.getElementById("partida");

        const destino =
            document.getElementById("destino");

        const sugestoesPartida =
            document.getElementById("sugestoesPartida");

        const sugestoesDestino =
            document.getElementById("sugestoesDestino");


        if (
            sugestoesPartida &&
            partida &&
            !partida.contains(evento.target) &&
            !sugestoesPartida.contains(evento.target)
        ) {

            sugestoesPartida.innerHTML = "";

        }


        if (
            sugestoesDestino &&
            destino &&
            !destino.contains(evento.target) &&
            !sugestoesDestino.contains(evento.target)
        ) {

            sugestoesDestino.innerHTML = "";

        }

    }
);


// ==========================================
// CALENDÁRIO PERSONALIZADO
// ==========================================

// Data de hoje

const hoje =
    new Date();


// Mês visualizado

let calendarioAtual = {

    partida: new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
    ),

    retorno: new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
    )

};


// Elementos

const dataPartida =
    document.getElementById("dataPartida");

const dataRetorno =
    document.getElementById("dataRetorno");

const calendarioPartida =
    document.getElementById("calendarioPartida");

const calendarioRetorno =
    document.getElementById("calendarioRetorno");

const abrirPartida =
    document.getElementById("abrirPartida");

const abrirRetorno =
    document.getElementById("abrirRetorno");


// Meses

const meses = [

    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro"

];


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    const dia =
        String(
            data.getDate()
        ).padStart(2, "0");


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");


    const ano =
        data.getFullYear();


    return `${dia}/${mes}/${ano}`;

}


// ==========================================
// CONVERTER DATA
// ==========================================

function converterData(texto) {

    const partes =
        texto.split("/");


    if (
        partes.length !== 3
    ) {

        return null;

    }


    const dia =
        Number(partes[0]);


    const mes =
        Number(partes[1]) - 1;


    const ano =
        Number(partes[2]);


    if (
        !dia ||
        !Number.isInteger(mes) ||
        !ano
    ) {

        return null;

    }


    const data =
        new Date(
            ano,
            mes,
            dia
        );


    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes ||
        data.getDate() !== dia
    ) {

        return null;

    }


    return data;

}


// ==========================================
// MESMA DATA
// ==========================================

function mesmaData(
    data1,
    data2
) {

    return (

        data1.getDate() ===
            data2.getDate() &&

        data1.getMonth() ===
            data2.getMonth() &&

        data1.getFullYear() ===
            data2.getFullYear()

    );

}


// ==========================================
// DATA ANTES
// ==========================================

function antesDe(
    data1,
    data2
) {

    return (
        data1.getTime() <
        data2.getTime()
    );

}


// ==========================================
// CRIAR CALENDÁRIO
// ==========================================

function criarCalendario(tipo) {

    let calendario;
    let input;


    if (tipo === "partida") {

        calendario =
            calendarioPartida;

        input =
            dataPartida;

    } else {

        calendario =
            calendarioRetorno;

        input =
            dataRetorno;

    }


    if (
        !calendario ||
        !input
    ) {

        return;

    }


    const dataVisualizada =
        calendarioAtual[tipo];


    const ano =
        dataVisualizada.getFullYear();


    const mes =
        dataVisualizada.getMonth();


    calendario.innerHTML = "";


    // ======================================
    // CABEÇALHO
    // ======================================

    const cabecalho =
        document.createElement("div");


    cabecalho.classList.add(
        "cabecalho-calendario"
    );


    const titulo =
        document.createElement("div");


    titulo.classList.add(
        "mes-ano"
    );


    titulo.textContent =
        `${meses[mes]} de ${ano}`;


    const navegacao =
        document.createElement("div");


    navegacao.classList.add(
        "navegacao-calendario"
    );


    // ======================================
    // BOTÃO ANTERIOR
    // ======================================

    const anterior =
        document.createElement("button");


    anterior.type =
        "button";


    anterior.innerHTML =
        "‹";


    anterior.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            calendarioAtual[tipo]
                .setMonth(
                    calendarioAtual[tipo]
                        .getMonth() - 1
                );


            criarCalendario(tipo);


            calendario.classList.add(
                "aberto"
            );

        }
    );


    // ======================================
    // BOTÃO PRÓXIMO
    // ======================================

    const proximo =
        document.createElement("button");


    proximo.type =
        "button";


    proximo.innerHTML =
        "›";


    proximo.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            calendarioAtual[tipo]
                .setMonth(
                    calendarioAtual[tipo]
                        .getMonth() + 1
                );


            criarCalendario(tipo);


            calendario.classList.add(
                "aberto"
            );

        }
    );


    navegacao.appendChild(
        anterior
    );


    navegacao.appendChild(
        proximo
    );


    cabecalho.appendChild(
        titulo
    );


    cabecalho.appendChild(
        navegacao
    );


    calendario.appendChild(
        cabecalho
    );


    // ======================================
    // DIAS DA SEMANA
    // ======================================

    const semana =
        document.createElement("div");


    semana.classList.add(
        "dias-semana"
    );


    const nomesDias = [

        "D",
        "S",
        "T",
        "Q",
        "Q",
        "S",
        "S"

    ];


    nomesDias.forEach(
        function (dia) {

            const elemento =
                document.createElement(
                    "span"
                );


            elemento.textContent =
                dia;


            semana.appendChild(
                elemento
            );

        }
    );


    calendario.appendChild(
        semana
    );


    // ======================================
    // DIAS
    // ======================================

    const dias =
        document.createElement("div");


    dias.classList.add(
        "dias"
    );


    const primeiroDia =
        new Date(
            ano,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            ano,
            mes + 1,
            0
        );


    const quantidadeDias =
        ultimoDia.getDate();


    const primeiroDiaSemana =
        primeiroDia.getDay();


    // ======================================
    // DIAS DO MÊS ANTERIOR
    // ======================================

    const mesAnteriorUltimoDia =
        new Date(
            ano,
            mes,
            0
        ).getDate();


    for (
        let i = primeiroDiaSemana - 1;
        i >= 0;
        i--
    ) {

        const dia =
            mesAnteriorUltimoDia - i;


        const botao =
            document.createElement("button");


        botao.type =
            "button";


        botao.classList.add(
            "dia",
            "outro-mes"
        );


        botao.textContent =
            dia;


        botao.disabled =
            true;


        dias.appendChild(
            botao
        );

    }


    // ======================================
    // DIAS DO MÊS
    // ======================================

    for (
        let dia = 1;
        dia <= quantidadeDias;
        dia++
    ) {

        const data =
            new Date(
                ano,
                mes,
                dia
            );


        const botao =
            document.createElement(
                "button"
            );


        botao.type =
            "button";


        botao.classList.add(
            "dia"
        );


        botao.textContent =
            dia;


        // Hoje

        if (
            mesmaData(
                data,
                hoje
            )
        ) {

            botao.classList.add(
                "hoje"
            );

        }


        // Selecionado

        const valorInput =
            converterData(
                input.value
            );


        if (
            valorInput &&
            mesmaData(
                data,
                valorInput
            )
        ) {

            botao.classList.add(
                "selecionado"
            );

        }


        // ==================================
        // RETORNO NÃO PODE SER ANTES
        // ==================================

        if (
            tipo === "retorno"
        ) {

            const partida =
                converterData(
                    dataPartida.value
                );


            if (
                partida &&
                antesDe(
                    data,
                    partida
                )
            ) {

                botao.classList.add(
                    "bloqueado"
                );


                botao.disabled =
                    true;

            }

        }


        // ==================================
        // SELECIONAR DATA
        // ==================================

        botao.addEventListener(
            "click",
            function (evento) {

                evento.stopPropagation();


                input.value =
                    formatarData(data);


                // Partida

                if (
                    tipo === "partida"
                ) {

                    const retorno =
                        converterData(
                            dataRetorno.value
                        );


                    if (
                        retorno &&
                        antesDe(
                            retorno,
                            data
                        )
                    ) {

                        dataRetorno.value =
                            "";

                        calendarioRetorno.innerHTML =
                            "";

                    }

                }


                calendario.classList.remove(
                    "aberto"
                );

            }
        );


        dias.appendChild(
            botao
        );

    }


    // ======================================
    // DIAS DO PRÓXIMO MÊS
    // ======================================

    const totalCelulas =
        dias.children.length;


    const restantes =
        42 - totalCelulas;


    for (
        let dia = 1;
        dia <= restantes;
        dia++
    ) {

        const botao =
            document.createElement(
                "button"
            );


        botao.type =
            "button";


        botao.classList.add(
            "dia",
            "outro-mes"
        );


        botao.textContent =
            dia;


        botao.disabled =
            true;


        dias.appendChild(
            botao
        );

    }


    calendario.appendChild(
        dias
    );


    // ======================================
    // RODAPÉ
    // ======================================

    const rodape =
        document.createElement(
            "div"
        );


    rodape.classList.add(
        "rodape-calendario"
    );


    // LIMPAR

    const limpar =
        document.createElement(
            "button"
        );


    limpar.type =
        "button";


    limpar.textContent =
        "Limpar";


    limpar.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            input.value =
                "";


            criarCalendario(tipo);


            calendario.classList.add(
                "aberto"
            );

        }
    );


    // HOJE

    const botaoHoje =
        document.createElement(
            "button"
        );


    botaoHoje.type =
        "button";


    botaoHoje.textContent =
        "Hoje";


    botaoHoje.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            if (
                tipo === "retorno"
            ) {

                const partida =
                    converterData(
                        dataPartida.value
                    );


                if (
                    partida &&
                    antesDe(
                        hoje,
                        partida
                    )
                ) {

                    alert(
                        "A data de retorno não pode ser anterior à data de partida."
                    );


                    return;

                }

            }


            input.value =
                formatarData(hoje);


            calendarioAtual[tipo] =
                new Date(
                    hoje.getFullYear(),
                    hoje.getMonth(),
                    1
                );


            criarCalendario(tipo);


            calendario.classList.add(
                "aberto"
            );

        }
    );


    rodape.appendChild(
        limpar
    );


    rodape.appendChild(
        botaoHoje
    );


    calendario.appendChild(
        rodape
    );

}


// ==========================================
// ABRIR CALENDÁRIO DE PARTIDA
// ==========================================

if (abrirPartida) {

    abrirPartida.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            if (calendarioRetorno) {

                calendarioRetorno.classList.remove(
                    "aberto"
                );

            }


            if (
                calendarioPartida &&
                calendarioPartida.classList.contains(
                    "aberto"
                )
            ) {

                calendarioPartida.classList.remove(
                    "aberto"
                );


                return;

            }


            const data =
                converterData(
                    dataPartida?.value || ""
                );


            if (data) {

                calendarioAtual.partida =
                    new Date(
                        data.getFullYear(),
                        data.getMonth(),
                        1
                    );

            }


            criarCalendario(
                "partida"
            );


            calendarioPartida.classList.add(
                "aberto"
            );

        }
    );

}


// ==========================================
// ABRIR CALENDÁRIO DE RETORNO
// ==========================================

if (abrirRetorno) {

    abrirRetorno.addEventListener(
        "click",
        function (evento) {

            const soIda =
                document.getElementById(
                    "SoIda"
                );


            if (
                soIda &&
                soIda.checked
            ) {

                evento.preventDefault();
                evento.stopPropagation();


                return;

            }


            evento.stopPropagation();


            calendarioPartida?.classList.remove(
                "aberto"
            );


            if (
                calendarioRetorno &&
                calendarioRetorno.classList.contains(
                    "aberto"
                )
            ) {

                calendarioRetorno.classList.remove(
                    "aberto"
                );


                return;

            }


            const data =
                converterData(
                    dataRetorno?.value || ""
                );


            if (data) {

                calendarioAtual.retorno =
                    new Date(
                        data.getFullYear(),
                        data.getMonth(),
                        1
                    );

            }


            criarCalendario(
                "retorno"
            );


            calendarioRetorno.classList.add(
                "aberto"
            );

        }
    );

}


// ==========================================
// DIGITAÇÃO DAS DATAS
// ==========================================

function configurarDigitacao(
    input,
    tipo
) {

    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            let valor =
                input.value.replace(
                    /\D/g,
                    ""
                );


            if (
                valor.length > 8
            ) {

                valor =
                    valor.substring(
                        0,
                        8
                    );

            }


            if (
                valor.length >= 5
            ) {

                valor =
                    valor.substring(
                        0,
                        2
                    ) +
                    "/" +
                    valor.substring(
                        2,
                        4
                    ) +
                    "/" +
                    valor.substring(
                        4
                    );

            }

            else if (
                valor.length >= 3
            ) {

                valor =
                    valor.substring(
                        0,
                        2
                    ) +
                    "/" +
                    valor.substring(
                        2
                    );

            }


            input.value =
                valor;

        }
    );


    input.addEventListener(
        "blur",
        function () {

            if (
                input.value === ""
            ) {

                return;

            }


            const data =
                converterData(
                    input.value
                );


            if (!data) {

                alert(
                    "Digite uma data válida."
                );


                input.value =
                    "";


                return;

            }


            // RETORNO

            if (
                tipo === "retorno"
            ) {

                const partida =
                    converterData(
                        dataPartida.value
                    );


                if (
                    partida &&
                    antesDe(
                        data,
                        partida
                    )
                ) {

                    alert(
                        "A data de retorno não pode ser anterior à data de partida."
                    );


                    input.value =
                        "";


                    return;

                }

            }


            // PARTIDA

            if (
                tipo === "partida"
            ) {

                const retorno =
                    converterData(
                        dataRetorno.value
                    );


                if (
                    retorno &&
                    antesDe(
                        retorno,
                        data
                    )
                ) {

                    dataRetorno.value =
                        "";


                    alert(
                        "A data de retorno foi limpa porque ficou anterior à nova data de partida."
                    );

                }

            }


            calendarioAtual[tipo] =
                new Date(
                    data.getFullYear(),
                    data.getMonth(),
                    1
                );

        }
    );

}


// Ativar digitação

if (dataPartida) {

    configurarDigitacao(
        dataPartida,
        "partida"
    );

}


if (dataRetorno) {

    configurarDigitacao(
        dataRetorno,
        "retorno"
    );

}


// ==========================================
// CLIQUE NO INPUT DE PARTIDA
// ==========================================

if (dataPartida) {

    dataPartida.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            calendarioRetorno?.classList.remove(
                "aberto"
            );


            const data =
                converterData(
                    dataPartida.value
                );


            if (data) {

                calendarioAtual.partida =
                    new Date(
                        data.getFullYear(),
                        data.getMonth(),
                        1
                    );

            }


            criarCalendario(
                "partida"
            );


            calendarioPartida?.classList.add(
                "aberto"
            );

        }
    );

}


// ==========================================
// CLIQUE NO INPUT DE RETORNO
// ==========================================

if (dataRetorno) {

    dataRetorno.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            calendarioPartida?.classList.remove(
                "aberto"
            );


            const data =
                converterData(
                    dataRetorno.value
                );


            if (data) {

                calendarioAtual.retorno =
                    new Date(
                        data.getFullYear(),
                        data.getMonth(),
                        1
                    );

            }


            criarCalendario(
                "retorno"
            );


            calendarioRetorno?.classList.add(
                "aberto"
            );

        }
    );

}


// ==========================================
// CLICAR FORA DO CALENDÁRIO
// ==========================================

document.addEventListener(
    "click",
    function (evento) {

        if (
            calendarioPartida &&
            abrirPartida &&
            dataPartida
        ) {

            if (
                !calendarioPartida.contains(
                    evento.target
                ) &&
                !abrirPartida.contains(
                    evento.target
                ) &&
                evento.target !== dataPartida
            ) {

                calendarioPartida.classList.remove(
                    "aberto"
                );

            }

        }


        if (
            calendarioRetorno &&
            abrirRetorno &&
            dataRetorno
        ) {

            if (
                !calendarioRetorno.contains(
                    evento.target
                ) &&
                !abrirRetorno.contains(
                    evento.target
                ) &&
                evento.target !== dataRetorno
            ) {

                calendarioRetorno.classList.remove(
                    "aberto"
                );

            }

        }

    }
);


// ==========================================
// IDA / IDA E VOLTA
// ==========================================

const soIda =
    document.getElementById("SoIda");

const idaVolta =
    document.getElementById("IdaVolta");

const campoRetorno =
    document.getElementById("campoRetorno");


function atualizarViagem() {

    if (
        !soIda ||
        !idaVolta ||
        !campoRetorno
    ) {

        return;

    }


    if (soIda.checked) {

        campoRetorno.classList.add(
            "desativado"
        );


        if (dataRetorno) {

            dataRetorno.value =
                "";

            dataRetorno.disabled =
                true;

        }


        if (abrirRetorno) {

            abrirRetorno.classList.add(
                "desativado"
            );


            if (
                abrirRetorno.tagName ===
                    "BUTTON" ||
                abrirRetorno.tagName ===
                    "INPUT"
            ) {

                abrirRetorno.disabled =
                    true;

            }

        }


        calendarioRetorno?.classList.remove(
            "aberto"
        );

    }

    else {

        campoRetorno.classList.remove(
            "desativado"
        );


        if (dataRetorno) {

            dataRetorno.disabled =
                false;

        }


        if (abrirRetorno) {

            abrirRetorno.classList.remove(
                "desativado"
            );


            if (
                abrirRetorno.tagName ===
                    "BUTTON" ||
                abrirRetorno.tagName ===
                    "INPUT"
            ) {

                abrirRetorno.disabled =
                    false;

            }

        }

    }

}


if (
    soIda &&
    idaVolta
) {

    soIda.addEventListener(
        "change",
        atualizarViagem
    );


    idaVolta.addEventListener(
        "change",
        atualizarViagem
    );


    atualizarViagem();

}


// ==========================================
// PASSAGEIROS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const inputPassageiros =
            document.getElementById(
                "passageiros"
            );


        const menuPassageiros =
            document.getElementById(
                "passageirosMenu"
            );


        const confirmar =
            document.getElementById(
                "confirmarPassageiros"
            );


        const adultosQtd =
            document.getElementById(
                "adultosQtd"
            );


        const criancasQtd =
            document.getElementById(
                "criancasQtd"
            );


        const bebesQtd =
            document.getElementById(
                "bebesQtd"
            );


        if (
            !inputPassageiros ||
            !menuPassageiros ||
            !confirmar ||
            !adultosQtd ||
            !criancasQtd ||
            !bebesQtd
        ) {

            return;

        }


        let passageiros = {

            adultos: 1,
            criancas: 0,
            bebes: 0

        };


        let classeSelecionada =
            "Econômica";


        menuPassageiros.classList.remove(
            "aberto"
        );


        // ==================================
        // ABRIR MENU
        // ==================================

        inputPassageiros.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                menuPassageiros.classList.toggle(
                    "aberto"
                );

            }
        );


        menuPassageiros.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );


        // ==================================
        // MAIS
        // ==================================

        document
            .querySelectorAll(".mais")
            .forEach(
                (botao) => {

                    botao.addEventListener(
                        "click",
                        (event) => {

                            event.stopPropagation();


                            const tipo =
                                botao.dataset.tipo;


                            const total =
                                passageiros.adultos +
                                passageiros.criancas +
                                passageiros.bebes;


                            if (
                                total >= 9
                            ) {

                                return;

                            }


                            passageiros[tipo]++;


                            atualizarContadores();

                        }
                    );

                }
            );


        // ==================================
        // MENOS
        // ==================================

        document
            .querySelectorAll(".menos")
            .forEach(
                (botao) => {

                    botao.addEventListener(
                        "click",
                        (event) => {

                            event.stopPropagation();


                            const tipo =
                                botao.dataset.tipo;


                            if (
                                tipo ===
                                    "adultos" &&
                                passageiros.adultos <= 1
                            ) {

                                return;

                            }


                            if (
                                passageiros[tipo] > 0
                            ) {

                                passageiros[tipo]--;

                            }


                            atualizarContadores();

                        }
                    );

                }
            );


        // ==================================
        // ATUALIZAR CONTADORES
        // ==================================

        function atualizarContadores() {

            adultosQtd.textContent =
                passageiros.adultos;


            criancasQtd.textContent =
                passageiros.criancas;


            bebesQtd.textContent =
                passageiros.bebes;

        }


        // ==================================
        // CLASSE
        // ==================================

        document
            .querySelectorAll(
                ".classe-option"
            )
            .forEach(
                (opcao) => {

                    opcao.addEventListener(
                        "click",
                        (event) => {

                            event.stopPropagation();


                            document
                                .querySelectorAll(
                                    ".classe-option"
                                )
                                .forEach(
                                    (item) => {

                                        item.classList.remove(
                                            "ativa"
                                        );

                                    }
                                );


                            opcao.classList.add(
                                "ativa"
                            );


                            classeSelecionada =
                                opcao.dataset.classe;

                        }
                    );

                }
            );


        // ==================================
        // CONFIRMAR
        // ==================================

        confirmar.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                const total =
                    passageiros.adultos +
                    passageiros.criancas +
                    passageiros.bebes;


                let texto =
                    `${total} ${
                        total === 1
                            ? "Passageiro"
                            : "Passageiros"
                    }`;


                texto +=
                    ` — ${classeSelecionada}`;


                inputPassageiros.value =
                    texto;


                menuPassageiros.classList.remove(
                    "aberto"
                );

            }
        );


        // ==================================
        // CLICAR FORA
        // ==================================

        document.addEventListener(
            "click",
            (event) => {

                if (
                    !menuPassageiros.contains(
                        event.target
                    ) &&
                    event.target !==
                        inputPassageiros
                ) {

                    menuPassageiros.classList.remove(
                        "aberto"
                    );

                }

            }
        );


        // ==================================
        // SCROLL
        // ==================================

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY > 500
                ) {

                    menuPassageiros.classList.remove(
                        "aberto"
                    );

                }

            }
        );


        atualizarContadores();

    }
);


function aplicarFiltrosLocais() {
    const listaVoos = document.getElementById("listaVoos");

    if (!listaVoos) return;

    let voosFiltrados = todosVoos;

    const limite = Number(filtroPrecoAtual);

    if (filtroPrecoAtual !== "todos" && Number.isFinite(limite)) {
        if (limite === 10000) {
            voosFiltrados = todosVoos.filter(voo =>
                Number(voo.preco) >= 10000
            );
        } else {
            voosFiltrados = todosVoos.filter(voo =>
                Number(voo.preco) <= limite
            );
        }
    }

    renderizarListaFiltrada(voosFiltrados);
}

function renderizarListaFiltrada(voos) {
    const lista = document.getElementById("listaVoos");

    if (!lista) return;

    const voosAnteriores = todosVoos;
    todosVoos = voos;

    quantidadeVisivel = Math.min(
        quantidadeVisivel,
        todosVoos.length
    );

    renderizarVoos();

    todosVoos = voosAnteriores;
}
