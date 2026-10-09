fetch('http://localhost:3000/destinos/praias-populares')
    .then(response => response.json())
    .then(destinos => {

        var lista = document.getElementById('listaDestinos');

        destinos.forEach(destino => {

            lista.innerHTML += `
                <div class="slide">

                    <div class="card">

                        <img 
                            src="../img/destinos/${destino.imagem}" 
                            alt="${destino.nome}"
                        >

                        <h2>${destino.nome}</h2>

                        <p>${destino.pais}</p>

                        <span class="preco">
                            R$ ${destino.preco_base}
                        </span>

                    </div>

                </div>
            `;

        });

    })
    .catch(error => {
        console.log("Erro ao carregar destinos:", error);
    });