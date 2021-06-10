const button = document.getElementsByTagName("button")[0]
const form = document.getElementsByTagName("form")[0]
const inputs = document.querySelectorAll("input") //querySelector solo toma el primero que encuenta, querySelectorAll los pone todos en un nodelist
const resultados = document.querySelector("#resultados")
const divDatosUsuario = document.querySelector("#divDatosUsuario")
const divReposUsuario = document.querySelector("#divReposUsuario")

form.addEventListener("submit", async (evt)=>{
    evt.preventDefault();
    let [nombreUsuario, numeroPagina, repositoriosPorPaginas] = [...inputs].map(i => i.value) //inputs es un NodeList, es no iterable por lo que usamos spread para pasar su contenido a un arreglo
    //bloque try-catch para obtener los datos
    try{
        let datosUsuarioRecibido = await getUserData(nombreUsuario) //esta funcion es asíncrona
        if (datosUsuarioRecibido.message =="Not Found") {
            alert("Usuario no encontrado");
            throw "Usuario no encontrado en la API"}
        mostrarContenidoDatosUsuario(datosUsuarioRecibido)

        let repositoriosUsuarioRecibido = await getRepositoriosByNumerodePaginas(nombreUsuario,numeroPagina,repositoriosPorPaginas)
        mostrarContenidoReposUsuario(repositoriosUsuarioRecibido)
    }
    catch(err){
        console.log(err)
    }
})

const getUserData = async(usuario) => {
    let response = await fetch(`https://api.github.com/users/${usuario}`)
    let data = await response.json()
    return data
}

const getRepositoriosByNumerodePaginas = async (usuario, numPaginas, reposPorPaginas) => {
    let response = await fetch(`https://api.github.com/users/${usuario}/repos?page=${numPaginas}&per_page=${reposPorPaginas}`)
    let data = await response.json()
    return data
} //no estaremos usando en realidad el parámetro del número de paginas en este desafío

const mostrarContenidoReposUsuario = (reposUsuario) => { //recibe un arreglo, los atributos que necesitamos de cada elemento son name y html_url
    let insercionHTMLrepos = ""
    reposUsuario.forEach((repositorio)=>{
        let {name: nombreRepositorio, html_url: htmlUrl} = repositorio
        insercionHTMLrepos += `<p><a href="${htmlUrl}">${nombreRepositorio}</a> </p>`
    })
    divReposUsuario.innerHTML = `
    <h2>Nombre de repositorios</h2>
    ${insercionHTMLrepos}
    `
}

const mostrarContenidoDatosUsuario = (datosUsuario) => {
    let {login, avatar_url: avatarUrl, public_repos: numeroRepos, type: tipo, location: ubicacion, name: nombre} = datosUsuario
    let insercionHTMLdatos = `
    <img src="${avatarUrl}" height="250" width="auto">
    <p> Nombre de Usuario: ${nombre}</p>
    <p>Login: ${login}</p>
    <p>Cantidad de repositorios: ${numeroRepos}</p>
    <p>Localidad: ${ubicacion}</p>
    <p>Tipo de usuario: ${tipo}</p>
    `
    divDatosUsuario.innerHTML = `
    <h2>Datos del Usuario</h2>
    ${insercionHTMLdatos}
    `
}