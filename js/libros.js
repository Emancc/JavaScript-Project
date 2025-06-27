let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indiceEditar = null;
let ordenAscendente = false;

const agregarLibro = () => {
    const titulo = document.getElementById('titulo').value.trim()
    const autor = document.getElementById('autor').value.trim()
    const anio = document.getElementById('anio').value
    const genero = document.getElementById('genero').value

    if (titulo !== '' && autor !== '' && anio !== '' && genero !== '') {

        if (editando) {
            libros[indiceEditar] = { titulo, autor, anio, genero }
            editando = false
            indiceEditar = null
            document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
        } else {
            const yaExiste = libros.some(libro =>
                libro.titulo.toLowerCase() === titulo.toLowerCase() &&
                libro.autor.toLowerCase() === autor.toLowerCase()
            )
            if (yaExiste) {
                alert('Este Libro ya se encuentra cargado en el listado')
                return
            }
            // Guardamos en nuestro array local autos que vamos creando
            libros.push({ titulo, autor, anio, genero })
        }

        // Guardamos dentro de la local storage los autos que vamos creando - Utilizos autos que es nuestro array local
        localStorage.setItem('libros', JSON.stringify(libros))

        renderizarLibros()
        mostrarResumen()
        actualizarSelectGenero()

        document.getElementById('titulo').value = ''
        document.getElementById('autor').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''
    }
}

const filtrarLibros = () => {
    const texto = document.getElementById('busqueda').value.toLowerCase()

    const librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(texto))

    renderizarLibros(librosFiltrados)
}

const renderizarLibros = (lista = libros) => {

    const tabla = document.getElementById('tablaLibros').querySelector('tbody')

    tabla.innerText = ''

    lista.forEach(libro => {
        const indexReal = libros.indexOf(libro) // obtener indice real del array original

        const fila = document.createElement('tr')

        fila.innerHTML = `
            <td>${indexReal + 1}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.anio}</td>
            <td>${libro.genero}</td>
            <td>
                <button onclick="editarLibro(${indexReal})">Editar</button>
                <button onclick="eliminarLibro(${indexReal})">Eliminar</button>
            </td>
            `

        tabla.appendChild(fila)

    })
}

const editarLibro = (index) => {
    const libro = libros[index]
    document.getElementById('titulo').value = libro.titulo
    document.getElementById('autor').value = libro.autor
    document.getElementById('anio').value = libro.anio
    document.getElementById('genero').value = libro.genero
    // document.getElementById('buttonForm').innerText='Editar auto'
    document.querySelector('button[type="submit"]').innerText = 'Actualizar Libro'
    editando = true
    indiceEditar = index
}



const eliminarLibro = (index) => {

    // Eliminar el auto del array
    libros.splice(index, 1)

    // Actualizar local storage
    localStorage.setItem('libros', JSON.stringify(libros))
    renderizarLibros()

}

const ordenarPorAnio = () => {
    const autosOrdenados = [...libros].sort((a, b) => {
        return ordenAscendente ? a.anio - b.anio : b.anio - a.anio
    })

    ordenAscendente = !ordenAscendente
    renderizarLibros(autosOrdenados)
}

const mostrarResumen = () => {
    const resumen = document.getElementById('resumenLibros')

    if (libros.length === 0) {
        resumen.innerText = 'No existen libros cargados'
        return;
    }

    // Total de autos
    const total = libros.length

    // promedio de años
    const sumaAnios = libros.reduce((acum, libro) => acum + parseInt(libro.anio), 0)

    const promedio = Math.round(sumaAnios / total)

    // filtro autos posteriores a 2015
    const posterioresA2015 = libros.filter(libro => libro.anio > 2015).length

    //  Filtrar auto mas nuevo
    const libroNuevo = libros.reduce((nuevo, libro) => (libro.anio > nuevo.anio ? libro : nuevo), libros[0])

    // Filtrar auto mas antiguo
    const libroViejo = libros.reduce((nuevo, libro) => (libro.anio < nuevo.anio ? libro : nuevo), libros[0])


    resumen.innerHTML = `
    <p>Total de libros: ${total}</p>
    <p>Promedio: ${promedio}</p>
    <p>Libro posteriores a 2015: ${posterioresA2015}</p>
    <p>Libro mas nuevo: <span>${libroNuevo.titulo}</span> <br> Autor:<span>${libroNuevo.autor}</span> <br> Año:<span>${libroNuevo.anio}</span> <br> Género:<span>${libroNuevo.genero}</span> <br> </p>
    <p>Libro mas viejo: <span>${libroViejo.titulo}</span> <br> Autor:<span>${libroViejo.autor}</span> <br> Año:<span>${libroViejo.anio}</span> <br> Género:<span>${libroViejo.genero}</span> <br> </p>
    `

}


const actualizarSelectGenero = () => {
    const select = document.getElementById('filtroGenero')
    const generosUnicos = [...new Set(libros.map(libro => libro.genero))]

    select.innerHTML = `<option value="todas">Todas</option>`
    generosUnicos.forEach(genero => {
        const option = document.createElement("option")
        option.value = genero
        option.text = genero
        select.appendChild(option) 
    })

}

const filtrarPorGenero = () => {
    const genero = document.getElementById('filtroGenero').value

    if (genero === 'todas') {
        renderizarLibros()
    } else {
        const librosFiltrados = libros.filter(libro => libro.genero === genero)
        renderizarLibros(librosFiltrados)
    }
}

// Evento que sirve para renderizar contenido una vez cardado el dom de la pagina inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarLibros()
    mostrarResumen()
    actualizarSelectGenero()
})