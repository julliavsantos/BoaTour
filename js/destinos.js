fetch('http://localhost:3000/destinos/praias-populares')
    .then(response => response.json())
    .then(destinos => {

        var lista = document.getElementById('listaDestinos');

        destinos.forEach(destino => {

            const slide = document.createElement("div");
            slide.className = "slide";
            slide.tabIndex = 0;
            slide.setAttribute("role", "link");
            slide.setAttribute("aria-label", `Ver destino ${destino.nome}`);
            slide.innerHTML = `

                    <div class="card">

                        <img 
                            src="img/destinos/${destino.imagem}"
                            alt="${destino.nome}"
                        >

                        <h2>${destino.nome}</h2>

                        <p>${destino.pais}</p>

                        <span class="preco">
                            R$ ${destino.preco_base}
                        </span>

                    </div>

            `;
            const abrirDestino = () => {
                window.location.href = `DESTINOS/index.html?destino=${encodeURIComponent(destino.id_destino)}`;
            };
            slide.addEventListener("click", abrirDestino);
            slide.addEventListener("keydown", evento => {
                if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    abrirDestino();
                }
            });
            lista.appendChild(slide);

        });

    })
    .catch(error => {
        console.log("Erro ao carregar destinos:", error);
    });
