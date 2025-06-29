let libros = JSON.parse(localStorage.getItem('libros')) || []

let editando = false;
let indiceEditar = null;
let ordenAscendente = false;

// Funcion para agregar libros
const agregarLibro = () => {
    const titulo = document.getElementById('titulo').value.trim()
    const autor = document.getElementById('autor').value.trim()
    const anio = document.getElementById('anio').value
    const genero = document.getElementById('genero').value

    if (titulo !== '' && autor !== '' && anio !== '' && genero !== '') {

        if (editando) {
            libros[indiceEditar] = { titulo, autor, anio, genero, leido: libros[indiceEditar].leido }
            editando = false
            indiceEditar = null
            document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
        } else {
            const yaExiste = libros.some(libro =>
                libro.titulo.toLowerCase() === titulo.toLowerCase() &&
                libro.autor.toLowerCase() === autor.toLowerCase()
            )
            // Validar que el año esté entre 1900 y 2025
            const validarAnio = (anio) => {
                const anioActual = 2025
                return anio >= 1900 && anio <= anioActual
                }

            if (yaExiste) {
                alert('Este Libro ya se encuentra cargado en el listado')
                return
            }else{
                if (!validarAnio(anio)) {
                    alert('El año debe estar entre 1900 y 2025')
                    return
                }
            }
            // Guardado de Libro en el local storage
            libros.push({ titulo, autor, anio, genero, leido: false })
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

// Funcion para filtrar libros por titulo
const filtrarLibros = () => {
    const texto = document.getElementById('busqueda').value.toLowerCase()

    const librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(texto))

    renderizarLibros(librosFiltrados)
}

// Funcion para renderizar libros
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
            <td style="display:flex;justify-content:center;gap:10px;align-items:center">
                <button onclick="editarLibro(${indexReal})">Editar</button>
                <button onclick="eliminarLibro(${indexReal})">Eliminar</button>
                <input type="checkbox" onclick="marcarLibro(${indexReal})" ${libro.leido ? 'checked' : ''}>¿Leído?</label>
            </td>
            `

        tabla.appendChild(fila)
        mostrarResumen()

    })
}

// Funcion para editar libros
const editarLibro = (index) => {
    const libro = libros[index]
    document.getElementById('titulo').value = libro.titulo
    document.getElementById('autor').value = libro.autor
    document.getElementById('anio').value = libro.anio
    document.getElementById('genero').value = libro.genero
    document.querySelector('button[type="submit"]').innerText = 'Actualizar Libro'
    editando = true
    indiceEditar = index
}


// Funcion para eliminar libros
const eliminarLibro = (index) => {

    // Eliminar el libro del array
    libros.splice(index, 1)

    // Actualizar local storage
    localStorage.setItem('libros', JSON.stringify(libros))
    renderizarLibros()

}

// Funcion para marcar libros como leidos
const marcarLibro = (index) => {
    libros[index].leido = !libros[index].leido
    localStorage.setItem('libros', JSON.stringify(libros))
    renderizarLibros()
}

// Ordenar libros por año de manera ascendente o descendente
const ordenarPorAnio = () => {
    const autosOrdenados = [...libros].sort((a, b) => {
        return ordenAscendente ? a.anio - b.anio : b.anio - a.anio
    })

    ordenAscendente = !ordenAscendente
    renderizarLibros(autosOrdenados)
}

// Mostrar resumen de libros
const mostrarResumen = () => {
    const resumen = document.getElementById('resumenLibros')

    if (libros.length === 0) {
        resumen.innerText = 'No existen libros cargados'
        return;
    }


    // Total de libros
    const total = libros.length

    // Total de libros leidos
    const totalLeidos = libros.filter(libro => libro.leido).length
    
    // Total de libros no leidos
    const totalNoLeidos = libros.filter(libro => !libro.leido).length
    
    // promedio de años
    const sumaAnios = libros.reduce((acum, libro) => acum + parseInt(libro.anio), 0)
    
    // redondeo del promedio
    const promedio = Math.round(sumaAnios / total)

    // filtro de libros posteriores a 2010
    const posterioresA2010 = libros.filter(libro => libro.anio > 2010).length
    
    // Filtrar libro mas antiguo
    const libroViejo = libros.reduce((nuevo, libro) => (libro.anio < nuevo.anio ? libro : nuevo), libros[0])
    
    //  Filtrar libro mas nuevo
    const libroNuevo = libros.reduce((nuevo, libro) => (libro.anio > nuevo.anio ? libro : nuevo), libros[0])


    resumen.innerHTML = `
    <p>Total de libros: <span>${total}</span> <br> 
    Promedio: <span>${promedio}</span> <br> 
    Libro posteriores a 2010: <span>${posterioresA2010}</span> <br> 
    Total de libros leídos: <span>${totalLeidos}</span> <br> 
    Total de libros no leídos: <span>${totalNoLeidos}</span></p>
    <p>Libro mas antiguo<br>
    Titulo:<span>${libroViejo.titulo}</span> <br> 
    Autor:<span>${libroViejo.autor}</span> <br> 
    Año:<span>${libroViejo.anio}</span> <br> 
    Género:<span>${libroViejo.genero}</span></p>
    <p>Libro mas reciente<br>
    Titulo: <span>${libroNuevo.titulo}</span> <br> 
    Autor:<span>${libroNuevo.autor}</span> <br> 
    Año:<span>${libroNuevo.anio}</span> <br> 
    Género:<span>${libroNuevo.genero}</span></p>
    `

}

// Actualizar select de generos
const actualizarSelectGenero = () => {
    const select = document.getElementById('filtroGenero')
    const generosUnicos = [...new Set(libros.map(libro => libro.genero))]

    select.innerHTML = `<option value="todos">Todos</option>`
    generosUnicos.forEach(genero => {
        const option = document.createElement("option")
        option.value = genero
        option.text = genero
        select.appendChild(option) 
    })

}

// Filtrar libros por genero
const filtrarPorGenero = () => {
    const genero = document.getElementById('filtroGenero').value

    if (genero === 'todos') {
        renderizarLibros()
    } else {
        const librosFiltrados = libros.filter(libro => libro.genero === genero)
        renderizarLibros(librosFiltrados)
    }
}

// Actualizar select de estados de lectura
const actualizarSelectLeido = () => {
    const select = document.getElementById('filtroLeido')
    select.innerHTML = `
        <option value="todas">Todos</option>
        <option value="leidos">Leídos</option>
        <option value="no-leidos">No leídos</option>
    `
}

// Filtrar libros por estado de lectura
const filtrarPorLeido = () => {
    const estado = document.getElementById('filtroLeido').value

    if (estado === 'todas') {
        renderizarLibros()
    } else {
        const librosFiltrados = libros.filter(libro => libro.leido === (estado === 'leidos'))
        renderizarLibros(librosFiltrados)
    }
}

// Evento que sirve para renderizar contenido una vez cardado el dom de la pagina inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarLibros()
    mostrarResumen()
    actualizarSelectGenero()
    actualizarSelectLeido()
})