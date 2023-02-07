const loadingElement = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container")
const botao = document.querySelector("#butaoBuscar")
const url = "https://jsonplaceholder.typicode.com/posts"

//Pegar url
const urlParametros = new URLSearchParams(window.location.search)
const idPost = urlParametros.get("id")
const comentariosContainer = document.querySelector("#comentarios-container")

const comentarioForm = document.querySelector("#comentario-form")
const emailInput = document.querySelector("#email")
const comentarioInput = document.querySelector("#tcomentario")

if (!idPost) {
    BuscarTodosPosts()
}
else {

    BuscaPostEspecificos(idPost)

    comentarioForm.addEventListener("submit", (e) => {
        e.preventDefault()

        let comentarioInserido = {
            email: emailInput.value,
            body: comentarioInput.value,
        }
        console.log("Comentário antes do tratamento Json: " + comentarioInserido)

        comentarioInserido = JSON.stringify(comentarioInserido)
        console.log("Comentário depois do tratamento Json: " + comentarioInserido)
        postComentario(comentarioInserido) //Chamar a Api de gravar comentario

    })
}

async function BuscarTodosPosts() {
    const resposta = await fetch(url)

    console.log(resposta)

    const data = await resposta.json()
    console.log(data)

    loadingElement.classList.add("hide")

    data.map((postagem) => {
        const div = document.createElement("div")
        const title = document.createElement("h2")
        const body = document.createElement("P")
        const link = document.createElement("a")

        title.innerText = postagem.title
        body.innerText = postagem.body
        link.innerText = "Ler"
        link.setAttribute("href", './post.html?id=' + postagem.id)

        div.appendChild(title)
        div.appendChild(body)
        div.appendChild(link)
        postsContainer.appendChild(div)
    })
}
async function BuscaPostEspecificos(id) {
    // const respostaPost = await fetch(`${url}/${id}`) //ou fetch(url + "/" + id)
    // const respostaComentario = await fetch(`${url}/${id}/comments`)

    const [respostaPost, respostaComentario] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`),
    ])

    const dataPostagem = await respostaPost.json()
    const dataComentario = await respostaComentario.json()
    console.log(dataPostagem)

    const title = document.createElement("h1")
    const body = document.createElement("p")

    title.innerText = dataPostagem.title
    body.innerText = dataPostagem.body

    postsContainer.appendChild(title)
    postsContainer.appendChild(body)

    dataComentario.map((comentario) => {
        criarComentario(comentario)
        loadingElement.classList.add("hide")
    })
}

function criarComentario(comentario) {

    const divComentario = document.createElement("div")
    const email = document.createElement("h3")
    const paragrafoComentario = document.createElement("p")

    email.innerText = comentario.email
    paragrafoComentario.innerText = comentario.body

    divComentario.appendChild(email)
    divComentario.appendChild(paragrafoComentario)
    comentariosContainer.appendChild(divComentario)

}

async function postComentario(comentario) {
    const resposta = await fetch(url, {
        method: "POST",
        body: comentario,
        headers: {
            "Content-type": "application/json",
        }
    })
    const dataResposta = await resposta.json()

    criarComentario(dataResposta)
}
