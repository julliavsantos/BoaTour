const fotoPerfil = document.querySelector(".foto-viajante");

if (fotoPerfil) {
    fotoPerfil.addEventListener("click", () => {
        window.location.href = "../PERFIL/index.html";
    });
}

// ===============================
// MODAL DE PAGAMENTO
// ===============================

const modalPagamento = document.getElementById("modalPagamento");

const modalDestino = document.getElementById("modalDestino");
const modalData = document.getElementById("modalData");
const modalForma = document.getElementById("modalForma");
const modalValor = document.getElementById("modalValor");
const modalReserva = document.getElementById("modalReserva");
const modalStatus = document.getElementById("modalStatus");


// ABRIR MODAL

function abrirModal(destino, data, forma, valor, reserva, status) {

    modalDestino.textContent = destino;
    modalData.textContent = data;
    modalForma.textContent = forma;
    modalValor.textContent = valor;
    modalReserva.textContent = reserva;

    if (status === "aprovado") {

        modalStatus.textContent = "✓ Pago";
        modalStatus.className = "status aprovado";

    } else if (status === "pendente") {

        modalStatus.textContent = "! Pendente";
        modalStatus.className = "status pendente";

    } else {

        modalStatus.textContent = "✕ Cancelado";
        modalStatus.className = "status cancelado";

    }

    modalPagamento.classList.add("ativo");
}


// FECHAR MODAL

function fecharModal() {

    modalPagamento.classList.remove("ativo");

}


// FECHAR CLICANDO FORA

modalPagamento.addEventListener("click", function(event) {

    if (event.target === modalPagamento) {
        fecharModal();
    }

});


// ===============================
// FILTRO DOS PAGAMENTOS
// ===============================

const filtroPagamento = document.getElementById("filtroPagamento");

const pagamentos = document.querySelectorAll(".pagamento-card");


filtroPagamento.addEventListener("change", function() {

    const filtro = this.value;

    pagamentos.forEach(function(pagamento) {

        const status = pagamento.dataset.status;

        if (filtro === "todos" || status === filtro) {

            pagamento.style.display = "flex";

        } else {

            pagamento.style.display = "none";

        }

    });

});

