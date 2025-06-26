let autos = JSON.parse(localStorage.getItem('autos')) || []

let editando = false;
let indiceEditar = null;
let ordenAscendente = false;

const agregarAuto = () => {
    const titulo = document.getElementById('titulo').value.trim()
    const autor = document.getElementById('autor').value.trim()
    const anio = document.getElementById('anio').value
    const genero = document.getElementById('genero').value

    if (titulo !== '' && autor !== '' && anio !== '' && genero !== '') {

        if (editando) {
            autos[indiceEditar] = { titulo, autor, anio, genero }
            editando = false
            indiceEditar = null
            document.querySelector('button[type="submit"]').innerText = 'Agregar Libro'
        } else {
            const yaExiste = autos.some(auto =>
                auto.titulo.toLowerCase() === titulo.toLowerCase() &&
                auto.autor.toLowerCase() === autor.toLowerCase()
            )
            if (yaExiste) {
                alert('Este Libro ya se encuentra cargado en el listado')
                return
            }
            // Guardamos en nuestro array local autos que vamos creando
            autos.push({ titulo, autor, anio, genero })
        }

        // Guardamos dentro de la local storage los autos que vamos creando - Utilizos autos que es nuestro array local
        localStorage.setItem('autos', JSON.stringify(autos))

        renderizarAutos()
        mostrarResumen()
        actualizarSelectMarca()

        document.getElementById('marca').value = ''
        document.getElementById('modelo').value = ''
        document.getElementById('anio').value = ''
        document.getElementById('genero').value = ''
    }
}

const filtrarAutos = () => {
    const texto = document.getElementById('busqueda').value.toLowerCase()

    const autosFiltrados = autos.filter(auto => auto.titulo.toLowerCase().includes(texto))

    renderizarAutos(autosFiltrados)
}

const renderizarAutos = (lista = autos) => {

    const tabla = document.getElementById('tablaAutos').querySelector('tbody')

    tabla.innerText = ''

    lista.forEach(auto => {
        const indexReal = autos.indexOf(auto) // obtener indice real del array original

        const fila = document.createElement('tr')

        fila.innerHTML = `
            <td>${indexReal + 1}</td>
            <td>${auto.titulo}</td>
            <td>${auto.autor}</td>
            <td>${auto.anio}</td>
            <td>${auto.genero}</td>
            <td>
                <button onclick="editarAuto(${indexReal})">Editar</button>
                <button onclick="eliminarAuto(${indexReal})">Eliminar</button>
            </td>
            `

        tabla.appendChild(fila)

    })
}

const editarAuto = (index) => {
    const auto = autos[index]
    document.getElementById('titulo').value = auto.titulo
    document.getElementById('autor').value = auto.autor
    document.getElementById('anio').value = auto.anio
    document.getElementById('genero').value = auto.genero
    // document.getElementById('buttonForm').innerText='Editar auto'
    document.querySelector('button[type="submit"]').innerText = 'Actualizar Libro'
    editando = true
    indiceEditar = index
}



const eliminarAuto = (index) => {

    // Eliminar el auto del array
    autos.splice(index, 1)

    // Actualizar local storage
    localStorage.setItem('autos', JSON.stringify(autos))

    renderizarAutos()

}

const ordenarPorAnio = () => {
    const autosOrdenados = [...autos].sort((a, b) => {
        return ordenAscendente ? a.anio - b.anio : b.anio - a.anio
    })

    ordenAscendente = !ordenAscendente
    renderizarAutos(autosOrdenados)
}

const mostrarResumen = () => {
    const resumen = document.getElementById('resumenAutos')

    if (autos.length === 0) {
        resumen.innerText = 'No existen autos cargados'
        return;
    }

    // Total de autos
    const total = autos.length

    // promedio de años
    const sumaAnios = autos.reduce((acum, auto) => acum + parseInt(auto.anio), 0)

    const promedio = Math.round(sumaAnios / total)

    // filtro autos posteriores a 2015
    const posterioresA2015 = autos.filter(auto => auto.anio > 2015).length

    //  Filtrar auto mas nuevo
    const autoNuevo = autos.reduce((nuevo, auto) => (auto.anio > nuevo.anio ? auto : nuevo), autos[0])

    // Filtrar auto mas antiguo
    const autoViejo = autos.reduce((nuevo, auto) => (auto.anio < nuevo.anio ? auto : nuevo), autos[0])


    resumen.innerHTML = `
    <p>Total de libros: ${total}</p>
    <p>Promedio: ${promedio}</p>
    <p>Libro posteriores a 2015: ${posterioresA2015}</p>
    <p>Libro mas nuevo: ${autoNuevo.titulo}  Autor:${autoNuevo.autor} Año:${autoNuevo.anio} Género:${autoNuevo.genero}</p>
    <p>Libro mas viejo: ${autoViejo.titulo}  Autor:${autoViejo.autor} Año:${autoViejo.anio} Género:${autoViejo.genero}</p>
    `

}


const actualizarSelectMarca = () => {
    const select = document.getElementById('filtroMarca')
    const marcasUnicas = [...new Set(autos.map(auto => auto.genero))]

    select.innerHTML = `<option value="todas">Todas</option>`
    marcasUnicas.forEach(marca => {
        const option = document.createElement("option")
        option.value = marca
        option.text = marca
        select.appendChild(option)
    })

}

const filtrarPorMarca = () => {
    const marca = document.getElementById('filtroMarca').value

    if (marca === 'todas') {
        renderizarAutos()
    } else {
        const autosFiltrados = autos.filter(auto => auto.genero === marca)
        renderizarAutos(autosFiltrados)
    }
}

// Evento que sirve para renderizar contenido una vez cardado el dom de la pagina inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarAutos()
    mostrarResumen()
    actualizarSelectMarca()
})