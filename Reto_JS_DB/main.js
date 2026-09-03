const APIBOX_URL = 'https://apibox.vercel.app/fIUD8hyhZAY9rBplPxaIBzR0ksJYyU7Q/api/character_db'
const URL = window.location.hostname.endsWith('netlify.app') ? '/api/characters' : APIBOX_URL
//Cargando datos del API
const cargarCharacter = async () => {
    document.querySelector('#loading').classList.toggle('hidden')
    try {
        const response = await fetch(URL)

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()

        renderCharacter(data)
    } catch (error) {
        console.error('Error al cargar personajes:', error)
        alert('No se pudieron cargar los personajes.')
    } finally {
        document.querySelector('#loading').classList.toggle('hidden')
    }
}
//Colores según raza
const raceColors = {
    'Human': 'bg-yellow-200 text-yellow-900',
    'Saiyan': 'bg-green-200 text-green-900',
    'Frieza Race': 'bg-red-200 text-red-900',
    'Android': 'bg-orange-200 text-orange-900',
    'Namekian': 'bg-purple-200 text-purple-900'
};

//Renderizando los personajes
const renderCharacter = (characters = []) => {
    const lista = document.querySelector('#lista')
    lista.innerHTML=``
    //Contar número de personajes
    const contador=document.querySelector('#contador')
    contador.textContent = characters.length
    // Mostrar/ocultar mensaje de lista vacía
    const vacio = document.querySelector('#vacio')
    vacio.classList.toggle('hidden', characters.length > 0)
    //Cargar los personajes y sus características del API a la lista 
    characters.forEach(character => {
        const li = document.createElement('li')
        li.className = 'flex items-center gap-4 bg-white border border-neutral-200 rounded-xl px-4 py-3 hover:border-neutral-300 transition-colors'
						
        li.innerHTML=`<div class="shrink-0  rounded-lg border border-neutral-200 flex items-center justify-center bg-neutral-50 object-contain">
                        <img class="w-20 h-20 object-contain" src="${character.image}" >
                        </div>
            <div class="flex-1 min-w-0">
              <p class="font-extrabold text-lg truncate">${character.name}</p>
              <div class="flex items-center gap-2 mt-1">
              <span class="text-[11px] ${character.gender === 'Male' ? 'bg-blue-200 text-blue-900':'bg-pink-200 text-pink-700'}  text-sm font-bold px-2 py-1 rounded">${character.gender}</span>
                <span class="text-xs ring-black font-bold px-2 py-1 rounded ${raceColors[character.race]}">${character.race}</span>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0 ">
              <button data-action="editar" data-id="${character.id}" class="text-[0.6rem] font-extrabold px-1 py-1 border border-blue-600 text-blue-600 border-opacity-100 rounded-sm hover:text-white hover:bg-blue-600 transition-colors flex items-center gap-1">
                <span class="pencil"></span> Editar
              </button>
              <button data-action="eliminar" data-id="${character.id}" class="text-[0.6rem] font-extrabold px-1 py-1 border border-red-600 text-red-600 border-opacity-100 rounded-sm hover:text-white hover:bg-red-600 transition-colors flex items-center gap-1">
               <span class="trash"></span> Eliminar
              </button>
            </div>
					</li> `
    lista.appendChild(li)
    })
}
const form = document.querySelector('#form')
const characterForm = document.forms['form']
let idEditar = null

lista.addEventListener('click',async(event)=>{
    if (event.target.closest('button')) {
        
    const {action,id} = event.target.dataset
    if (action ==='eliminar') {
        const confirmar = confirm('¿Elimar personaje? Esta acción no se puede deshacer')
        if (!confirmar) {
            return
        }
        const opciones={
            method : 'DELETE'
        }
        const response = await fetch(`${URL}/${id}`,opciones)
        cargarCharacter()
    }
    if (action === 'editar') {
    const response = await fetch(`${URL}/${id}`)
    const character = await response.json()
    
    characterForm.name.value = character.name
    characterForm.image.value = character.image
    characterForm.race.value = character.race
    characterForm.gender.value = character.gender

    idEditar = id
    submitBtn.textContent = 'Actualizar'
    cancelBtn.classList.remove('hidden')
    }
    }
})

form.addEventListener('submit',async(event)=>{
    event.preventDefault()
    const name = characterForm.name.value
    const image = characterForm.image.value
    const race = characterForm.race.value
    const gender = characterForm.gender.value
        // VALIDAR CAMPOS VACÍOS
    if (!name || !image || !race || !gender) {
        alert('Por favor, completa todos los campos.')
        return
    }

    // VALIDAR NOMBRE DUPLICADO
    const responsePersonajes = await fetch(URL)
    const characters = await responsePersonajes.json()

    const existe = characters.some(character =>
        character.name.toLowerCase() === name.toLowerCase() &&
        character.id !== idEditar
    )

    if (existe) {
        alert('Ya existe un personaje con ese nombre.')
        return
    }
    const nuevo_personaje = {
        name,
        image,
        race,
        gender
    }
    if (idEditar) {
        
    const opciones = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevo_personaje)
    }

    await fetch(`${URL}/${idEditar}`, opciones)
    
    
    idEditar = null
    submitBtn.textContent = '+ Agregar Personaje'
    cancelBtn.classList.add('hidden')

    characterForm.reset()
    cargarCharacter()

    return
}
    const opciones = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(nuevo_personaje)
    }
    try {
        const response = await fetch(URL,opciones)
        if (!response.ok) {
            throw new Error('Problemas para guardar al corredor.')
        }
        console.log("El personaje se guardó correctamente")
        cargarCharacter()
    characterForm.reset()
    } catch (error) {
        console.log(error)
    }
})

cancelBtn.addEventListener('click', (event) => {
    event.preventDefault()

    // Limpiar formulario
    characterForm.reset()

    // Salir del modo edición
    idEditar = null

    // Volver al estado inicial
    submitBtn.textContent = '+ Personaje'
    cancelBtn.classList.add('hidden')
})

cargarCharacter()