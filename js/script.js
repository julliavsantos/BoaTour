// SLIDER
document.addEventListener("DOMContentLoaded", () => {

    const slidesContainer = document.querySelector(".slides");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    if (!slidesContainer || !prevBtn || !nextBtn) {
        return;
    }

    let currentIndex = 0;
    const visibleCards = 3;

    function atualizarSlider() {

        const slides = document.querySelectorAll(".slide");
        if (slides.length === 0) {
            return;
        }

        const slideWidth = slides[0].clientWidth;
        if (currentIndex > slides.length - visibleCards) {
            currentIndex = 0;
        }

        slidesContainer.style.transform =
            `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {

        const slides = document.querySelectorAll(".slide");
        if (slides.length === 0) {
            return;
        }
        if (currentIndex < slides.length - visibleCards) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }

        atualizarSlider();

    });

    prevBtn.addEventListener("click", () => {

        const slides = document.querySelectorAll(".slide");
        if (slides.length === 0) {
            return;
        }
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.max(
                0,
                slides.length - visibleCards
            );
        }
        atualizarSlider();
    });


    window.addEventListener("resize", atualizarSlider);

    const verificarCards = setInterval(() => {

        const slides = document.querySelectorAll(".slide");
        if (slides.length > 0) {
            clearInterval(verificarCards);
            atualizarSlider();
        }
    }, 100);

});


// AEROPORTOS
let aeroportos = [];

// Busca os aeroportos no servidor
async function carregarAeroportos() {

    try {

        const resposta = await fetch("http://localhost:3000/aeroportos");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar aeroportos");
        }

        const dados = await resposta.json();
        aeroportos = Array.isArray(dados) ? dados : [];

        console.log("Aeroportos carregados:", aeroportos);

        configurarAutocomplete(
            document.getElementById("partida"),
            document.getElementById("sugestoesPartida")
        );

        configurarAutocomplete(
            document.getElementById("destino"),
            document.getElementById("sugestoesDestino")
        );

    } catch (erro) {

        console.error("Erro ao carregar aeroportos:", erro);

    }
}

// iniciar
carregarAeroportos();

const linkBuscaVoosHome = document.getElementById("linkBuscaVoosHome");
if (linkBuscaVoosHome) {
    const buscarVoosDaHome = evento => {
        evento.preventDefault();
        const parametros = new URLSearchParams();
        const origem = document.getElementById("partida")?.value.trim();
        const destino = document.getElementById("destino")?.value.trim();
        const data = document.getElementById("dataPartida")?.value.trim();

        try {
            if (origem) localStorage.setItem("boatour_aeroporto_origem", origem);
        } catch (_) {}
        if (origem) parametros.set("origem", origem);
        if (destino) parametros.set("destino", destino);
        if (data) parametros.set("data", data);

        const query = parametros.toString();
        window.location.href = `VOOS/index.html${query ? `?${query}` : ""}`;
    };

    linkBuscaVoosHome.addEventListener("click", buscarVoosDaHome);
    ["partida", "destino", "dataPartida"].forEach(id => {
        document.getElementById(id)?.addEventListener("keydown", evento => {
            if (evento.key === "Enter") buscarVoosDaHome(evento);
        });
    });
}

function configurarAutocomplete(input, lista) {
    if (!input || !lista) return;

    input.addEventListener("input", function () {
        const normalizar = valor => String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR")
            .trim();
        const texto = normalizar(input.value);
        lista.innerHTML = "";
        if (texto === "") {
            return;
        }
        const resultados = aeroportos.filter(function (aeroporto) {
            return [aeroporto.nome, aeroporto.cidade, aeroporto.pais,
                aeroporto.codigo_iata || aeroporto.iata]
                .some(valor => normalizar(valor).includes(texto));
        });


        resultados.forEach(function (aeroporto) {

            const opcao =
                document.createElement("div");

            opcao.classList.add("sugestao");

            const nome = String(aeroporto.nome || aeroporto.cidade || "Aeroporto");
            const cidade = String(aeroporto.cidade || "");
            const codigo = String(aeroporto.codigo_iata || aeroporto.iata || "");
            opcao.textContent = `${nome}${cidade && cidade !== nome ? ` — ${cidade}` : ""}${codigo ? ` (${codigo})` : ""}`;


            opcao.addEventListener("click", function () {

                input.value = cidade || nome;

                lista.innerHTML = "";

            });


            lista.appendChild(opcao);

        });

    });

}

// CALENDÁRIO PERSONALIZADO

//data de hoje
const hoje = new Date();

//mes visualizado
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

//elementos
const dataPartida = document.getElementById("dataPartida");
const dataRetorno = document.getElementById("dataRetorno");
const calendarioPartida = document.getElementById("calendarioPartida");
const calendarioRetorno = document.getElementById("calendarioRetorno");
const abrirPartida = document.getElementById("abrirPartida");
const abrirRetorno = document.getElementById("abrirRetorno");

//meses
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

//formatar data
function formatarData(data) {

    const dia =
        String(data.getDate()).padStart(2, "0");

    const mes =
        String(data.getMonth() + 1).padStart(2, "0");

    const ano =
        data.getFullYear();

    return `${dia}/${mes}/${ano}`;

}

//converter data
function converterData(texto) {
    const partes = texto.split("/");
    if (partes.length !== 3) {
        return null;
    }

    const dia = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const ano = Number(partes[2]);


    if (
        !dia ||
        !Number.isInteger(mes) ||
        !ano
    ) {

        return null;

    }


    const data = new Date(
        ano,
        mes,
        dia
    );


    // Verifica se a data realmente existe
    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes ||
        data.getDate() !== dia
    ) {

        return null;

    }


    return data;

}

//datas iguais
function mesmaData(data1, data2) {

    return (

        data1.getDate() === data2.getDate() &&
        data1.getMonth() === data2.getMonth() &&
        data1.getFullYear() === data2.getFullYear()

    );

}

//data1 antes da data2
function antesDe(data1, data2) {
    return data1.getTime() < data2.getTime();

}

// criar calendário
function criarCalendario(tipo) {
    let calendario;
    let input;

//identificar calendário
    if (tipo === "partida") {

        calendario = calendarioPartida;
        input = dataPartida;

    } else {

        calendario = calendarioRetorno;
        input = dataRetorno;

    }


    if (!calendario || !input) return;

    //mes atual
    const dataVisualizada =
        calendarioAtual[tipo];

    const ano =
        dataVisualizada.getFullYear();

    const mes =
        dataVisualizada.getMonth();

    //limpar
    calendario.innerHTML = "";

    //cabeçalho
    const cabecalho =
        document.createElement("div");

    cabecalho.classList.add(
        "cabecalho-calendario"
    );

    const titulo =
        document.createElement("div");
    titulo.classList.add("mes-ano");
    titulo.textContent =
        `${meses[mes]} de ${ano}`;

    const navegacao =
        document.createElement("div");
    navegacao.classList.add(
        "navegacao-calendario"
    );

    //botão anterios
    const anterior =
        document.createElement("button");
    anterior.type = "button";
    anterior.innerHTML = "‹";


    anterior.addEventListener("click", function (evento) {
        evento.stopPropagation();
        calendarioAtual[tipo].setMonth(
            calendarioAtual[tipo].getMonth() - 1
        );
        criarCalendario(tipo);
        calendario.classList.add("aberto");
    });

    //botão próximo
    const proximo =
        document.createElement("button");

    proximo.type = "button";
    proximo.innerHTML = "›";

    proximo.addEventListener("click", function (evento) {
        evento.stopPropagation();
        calendarioAtual[tipo].setMonth(
            calendarioAtual[tipo].getMonth() + 1
        );
        criarCalendario(tipo);
        calendario.classList.add("aberto");
    });


    navegacao.appendChild(anterior);
    navegacao.appendChild(proximo);
    cabecalho.appendChild(titulo);
    cabecalho.appendChild(navegacao);
    calendario.appendChild(cabecalho);

    //dias da semana
    const semana =
        document.createElement("div");
    semana.classList.add("dias-semana");

    const nomesDias = [

        "D",
        "S",
        "T",
        "Q",
        "Q",
        "S",
        "S"

    ];


    nomesDias.forEach(function (dia) {
        const elemento =
            document.createElement("span");
        elemento.textContent = dia;
        semana.appendChild(elemento);
    });

    calendario.appendChild(semana);

    //dias
    const dias =
        document.createElement("div");

    dias.classList.add("dias");


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

    //dias anterior
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

        botao.type = "button";

        botao.classList.add(
            "dia",
            "outro-mes"
        );

        botao.textContent = dia;

        botao.disabled = true;

        dias.appendChild(botao);

    }

    //dias do mês atual
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
            document.createElement("button");

        botao.type = "button";
        botao.classList.add("dia");
        botao.textContent = dia;

        //destacar hoje
        if (
            mesmaData(
                data,
                hoje
            )
        ) {
            botao.classList.add("hoje");
        }

        //data marcada
        const valorInput =
            converterData(input.value);


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

        //regra do retorno
        if (tipo === "retorno") {

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

                botao.disabled = true;
            }
        }

        //selecionar data
        botao.addEventListener(
            "click",
            function (evento) {

                evento.stopPropagation();
                input.value =
                    formatarData(data);
                
                //regra de partida
                if (tipo === "partida") {

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

                        dataRetorno.value = "";
                        calendarioRetorno.innerHTML = "";
                    }
                }


                calendario.classList.remove(
                    "aberto"
                );

            }
        );

        dias.appendChild(botao);

    }

    //dias do próximo mês
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
            document.createElement("button");
        botao.type = "button";
        botao.classList.add(
            "dia",
            "outro-mes"
        );

        botao.textContent = dia;
        botao.disabled = true;
        dias.appendChild(botao);
    }

    calendario.appendChild(dias);

//RODAPÉ
    const rodape =
        document.createElement("div");
    rodape.classList.add(
        "rodape-calendario"
    );

    //limpar
    const limpar =
        document.createElement("button");

    limpar.type = "button";
    limpar.textContent = "Limpar";

    limpar.addEventListener(
        "click",
        function (evento) {
            evento.stopPropagation();
            input.value = "";
            criarCalendario(tipo);
            calendario.classList.add(
                "aberto"
            );
        }
    );

    //botão hoje
    const botaoHoje =
        document.createElement("button");

    botaoHoje.type = "button";
    botaoHoje.textContent = "Hoje";


    botaoHoje.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

            //regra de retorno
            if (tipo === "retorno") {

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

                    window.boatourFieldError(
                        dataRetorno,
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

    rodape.appendChild(limpar);
    rodape.appendChild(botaoHoje);
    calendario.appendChild(rodape);

}

// abrir calendário de partida
if (abrirPartida) {

    abrirPartida.addEventListener(
        "click",
        function (evento) {
            evento.stopPropagation();
            calendarioRetorno.classList.remove(
                "aberto"
            );
            if (
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
            criarCalendario("partida");
            calendarioPartida.classList.add(
                "aberto"
            );
        }
    );
}

// abrir calendário de retorno
if (abrirRetorno) {

    abrirRetorno.addEventListener(
        "click",
        function (evento) {

            // Não permite abrir o calendário se estiver em "Somente ida"
            if (soIda && soIda.checked) {
                evento.preventDefault();
                evento.stopPropagation();
                return;
            }

            evento.stopPropagation();

            calendarioPartida.classList.remove(
                "aberto"
            );

            if (
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

            criarCalendario("retorno");

            calendarioRetorno.classList.add(
                "aberto"
            );
        }
    );
}

// digitação da data
function configurarDigitacao(input, tipo) {

    if (!input) return;
    input.addEventListener(
        "input",
        function () {

            // Remove tudo que não for número
            let valor =
                input.value.replace(
                    /\D/g,
                    ""
                );

            // Máximo de 8 números
            if (valor.length > 8) {

                valor =
                    valor.substring(
                        0,
                        8
                    );

            }

            // dd/mm/aaaa
            if (valor.length >= 5) {

                valor =
                    valor.substring(0, 2) +
                    "/" +
                    valor.substring(2, 4) +
                    "/" +
                    valor.substring(4);

            }

            // dd/mm
            else if (valor.length >= 3) {

                valor =
                    valor.substring(0, 2) +
                    "/" +
                    valor.substring(2);

            }


            input.value = valor;

        }
    );


    /* -------------------------
       VALIDAR AO SAIR
    ------------------------- */

    input.addEventListener(
        "blur",
        function () {

            if (input.value === "") {
                return;
            }


            const data =
                converterData(
                    input.value
                );


            /* -------------------------
               DATA INVÁLIDA
            ------------------------- */

            if (!data) {

                window.boatourFieldError(input, "Digite uma data válida.");

                return;

            }


            /* -------------------------
               REGRA DO RETORNO
            ------------------------- */

            if (tipo === "retorno") {

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

                    window.boatourFieldError(
                        input,
                        "A data de retorno não pode ser anterior à data de partida."
                    );

                    return;

                }

            }


            /* -------------------------
               REGRA DA PARTIDA
            ------------------------- */

            if (tipo === "partida") {

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

                    dataRetorno.value = "";

                    alert(
                        "A data de retorno foi limpa porque ficou anterior à nova data de partida."
                    );

                }

            }


            /* -------------------------
               ATUALIZAR CALENDÁRIO
            ------------------------- */

            calendarioAtual[tipo] =
                new Date(
                    data.getFullYear(),
                    data.getMonth(),
                    1
                );

        }
    );

}

// ativar digitação
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

// clicar no input de partida
if (dataPartida) {

    dataPartida.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();
            calendarioRetorno.classList.remove(
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

            criarCalendario("partida");
            calendarioPartida.classList.add(
                "aberto"
            );

        }
    );

}

// clicar no input de retorno
if (dataRetorno) {

    dataRetorno.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();


            calendarioPartida.classList.remove(
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


            criarCalendario("retorno");

            calendarioRetorno.classList.add(
                "aberto"
            );

        }
    );

}

// clicar fora do calendário
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

// ida / ida e volta
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

        // Desativa visualmente todo o campo de retorno
        campoRetorno.classList.add("desativado");

        // Desativa o input
        if (dataRetorno) {
            dataRetorno.value = "";
            dataRetorno.disabled = true;
        }

        // Desativa o botão/ícone do calendário
        if (abrirRetorno) {
            abrirRetorno.classList.add("desativado");

            // Se for um <button>, também desabilita de verdade
            if (
                abrirRetorno.tagName === "BUTTON" ||
                abrirRetorno.tagName === "INPUT"
            ) {
                abrirRetorno.disabled = true;
            }
        }

        // Fecha o calendário de retorno
        if (calendarioRetorno) {
            calendarioRetorno.classList.remove("aberto");
        }

    } else {

        // Volta ao estado normal
        campoRetorno.classList.remove("desativado");

        if (dataRetorno) {
            dataRetorno.disabled = false;
        }

        // Reativa o botão/ícone do calendário
        if (abrirRetorno) {
            abrirRetorno.classList.remove("desativado");

            if (
                abrirRetorno.tagName === "BUTTON" ||
                abrirRetorno.tagName === "INPUT"
            ) {
                abrirRetorno.disabled = false;
            }
        }
    }
}

if (soIda && idaVolta) {

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
document.addEventListener("DOMContentLoaded", () => {

    const inputPassageiros =
        document.getElementById("passageiros");

    const menuPassageiros =
        document.getElementById("passageirosMenu");

    const confirmar =
        document.getElementById("confirmarPassageiros");

    const adultosQtd =
        document.getElementById("adultosQtd");

    const criancasQtd =
        document.getElementById("criancasQtd");

    const bebesQtd =
        document.getElementById("bebesQtd");


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

    let classeSelecionada = "Econômica";

    menuPassageiros.classList.remove("aberto");
    inputPassageiros.addEventListener("click", (event) => {

        event.stopPropagation();

        menuPassageiros.classList.toggle("aberto");

    });

    menuPassageiros.addEventListener("click", (event) => {

        event.stopPropagation();

    });

    document.querySelectorAll(".mais").forEach((botao) => {
        botao.addEventListener("click", (event) => {
            event.stopPropagation();
            const tipo = botao.dataset.tipo;
            const total =
                passageiros.adultos +
                passageiros.criancas +
                passageiros.bebes;

            if (total >= 9) {
                return;
            }
            passageiros[tipo]++;
            atualizarContadores();

        });

    });

    document.querySelectorAll(".menos").forEach((botao) => {
        botao.addEventListener("click", (event) => {
            event.stopPropagation();
            const tipo = botao.dataset.tipo;
            if (
                tipo === "adultos" &&
                passageiros.adultos <= 1
            ) {
                return;
            }
         if (passageiros[tipo] > 0) {
              passageiros[tipo]--;
            }
            atualizarContadores();
        });
    });

    function atualizarContadores() {
        adultosQtd.textContent =
            passageiros.adultos;
        criancasQtd.textContent =
            passageiros.criancas;
        bebesQtd.textContent =
            passageiros.bebes;

    }

    document
        .querySelectorAll(".classe-option")
        .forEach((opcao) => {
            opcao.addEventListener("click", (event) => {
                event.stopPropagation();
              document
                  .querySelectorAll(".classe-option")
                  .forEach((item) => {
                      item.classList.remove("ativa");
                    });
                opcao.classList.add("ativa");
             classeSelecionada =
                    opcao.dataset.classe;
            });
        });

    confirmar.addEventListener("click", (event) => {
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
        texto += ` — ${classeSelecionada}`;
        inputPassageiros.value = texto;
        menuPassageiros.classList.remove("aberto");

    });

    document.addEventListener("click", (event) => {
        if (
            !menuPassageiros.contains(event.target) &&
            event.target !== inputPassageiros
        ) {
            menuPassageiros.classList.remove("aberto");
        }
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            menuPassageiros.classList.remove("aberto");
        }
    });

    atualizarContadores();

});

const btnTodasOfertas = document.getElementById("btnTodasOfertas");

btnTodasOfertas.addEventListener("click", () => {
    window.location.href = "OFERTAS/index.html";
});


// MODAL DE BOAS-VINDAS
document.addEventListener("DOMContentLoaded", () => {

    const parametros = new URLSearchParams(window.location.search);
    const cadastroSucesso = parametros.get("cadastro");
    const usuarioSalvo = localStorage.getItem("boatourUsuario");
    const modal = document.getElementById("modalBoasVindas");
    const mensagem = document.getElementById("mensagemBoasVindas");
    const btnIrPerfil = document.getElementById("btnIrPerfil");
    const btnNavegar = document.getElementById("btnNavegar");
    const fechar = document.getElementById("fecharBoasVindas");

    // abrir somente pós cadastro
    if (cadastroSucesso === "sucesso" && usuarioSalvo) {

        const usuario = JSON.parse(usuarioSalvo);

        mensagem.innerHTML = `
            Seja bem-vindo(a), <strong>${usuario.nome}</strong>!
            Você ainda tem algumas configurações para ajustar
            no seu perfil. Deseja finalizá-las agora?
        `;
        modal.classList.add("ativo");
    }

    // ir para o perfil
    btnIrPerfil.addEventListener("click", () => {
        window.location.href = "PERFIL/index.html";
    });

    // continuar navegando
    btnNavegar.addEventListener("click", () => {

        modal.classList.remove("ativo");
        limparURL();

    });

    // fechar
    fechar.addEventListener("click", () => {

        modal.classList.remove("ativo");
        limparURL();

    });

    // limpar parâmetro
    function limparURL() {

        window.history.replaceState(
            {}, document.title, window.location.pathname );

    }

});


// MODAL - CONTA ENCERRADA
document.addEventListener("DOMContentLoaded", () => {

    const params =
        new URLSearchParams(window.location.search);

    const saiu = params.get("saiu");

    const modalSaidaConta =
        document.getElementById("modalSaidaConta");

    const fecharSaidaConta =
        document.getElementById("fecharSaidaConta");

    const continuarSaidaConta =
        document.getElementById("continuarSaidaConta");

    //abrir somente depois do logout
    if (saiu === "sucesso" && modalSaidaConta) {

        modalSaidaConta.classList.add("ativo");

        // Remove ?saiu=sucesso da URL
        history.replaceState(
            null,
            "",
            window.location.pathname
        );
    }

    //fechar
    if (fecharSaidaConta) {

        fecharSaidaConta.addEventListener("click", () => {

            modalSaidaConta.classList.remove("ativo");

        });

    }

    //continuar
    if (continuarSaidaConta) {

        continuarSaidaConta.addEventListener("click", () => {

            modalSaidaConta.classList.remove("ativo");

        });

    }

    //clicar fora
    if (modalSaidaConta) {

        modalSaidaConta.addEventListener("click", (e) => {

            if (e.target === modalSaidaConta) {

                modalSaidaConta.classList.remove("ativo");

            }

        });

    }

});
