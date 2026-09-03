// Estados de una promesa -> pending, fullfilled(OK), rejected (Falló)
const renderPosts = (posts = []) => {
    const divApp = document.querySelector('#app')

    let postList = ''

    posts.forEach(post => {
        postList = postList + `<h2> ${post.id} - ${post.title}</h2>`
    })
    divApp.innerHTML = postList
}

fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
        renderPosts(data)
    })