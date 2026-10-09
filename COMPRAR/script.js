const fotoPerfil = document.querySelector(".foto-viajante");

if (fotoPerfil) {
    fotoPerfil.addEventListener("click", () => {
        window.location.href = "../PERFIL/index.html";
    });
}