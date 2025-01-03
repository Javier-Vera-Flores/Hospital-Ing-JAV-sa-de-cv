// Simulación del estado del usuario
const usuarioLogeado = false; // Cambia a true si el usuario está logeado

// Selecciona el div donde se gestionará el contenido dinámico
// const containerCita = document.querySelector('.container-cita');
const listaBusqueda = document.querySelector('.listado-busqueda');

// Función para mostrar el formulario de búsqueda por ID
function mostrarBusquedaPorID() {
    listaBusqueda.innerHTML = `
        <p class="parrafo-form">realiza una busqueda</p>
    `;


    // Manejar el evento del formulario
    const formulario = document.getElementById('buscar-cita');
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idCita = document.getElementById('idCita').value;
        console.log(`Buscando cita con ID: ${idCita}`);

        // Mostrar spinner
        mostrarSpinner();

        // Simular un retraso para obtener los datos (por ejemplo, llamando a un backend)
        await simularRetraso(2000); // 2 segundos

        // Reemplazar el spinner con la vista final
        mostrarResultadoBusqueda(idCita);
 
    });
}

// Función para mostrar el listado de citas del usuario logeado
function mostrarListadoCitas() {
    // Ejemplo de citas obtenidas (pueden venir de un backend)
    const citas = [
        { id: 1, fecha: '2025-01-05', hora: '10:00 AM', doctor: 'Dr. Pérez' },
        { id: 2, fecha: '2025-01-10', hora: '02:00 PM', doctor: 'Dra. López' }
    ];

    // Generar el listado dinámicamente
    listaBusqueda.innerHTML = '<h2>Mis Citas</h2>';
    const ul = document.createElement('ul');
    citas.forEach(cita => {
        const li = document.createElement('li');
        li.textContent = `ID: ${cita.id} - Fecha: ${cita.fecha} - Hora: ${cita.hora} - Doctor: ${cita.doctor}`;
        ul.appendChild(li);
    });
    listaBusqueda.appendChild(ul);
}
// Función para mostrar el spinner de carga
function mostrarSpinner() {
    // listaBusqueda.innerHTML = `
    //     <div class="d-flex justify-content-center">
    //         <div class="spinner-border text-primary" role="status">
    //             <span class="visually-hidden">Loading...</span>
    //         </div>
    //     </div>
    // `;
    listaBusqueda.innerHTML = `
        <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-light" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    `;

}
// Función para mostrar el resultado de la búsqueda
function mostrarResultadoBusqueda(idCita) {
    // agregar la lógica para buscar la cita en un backend
    // Simular la cita encontrada
    const cita = { id: idCita, fecha: '2025-01-05', hora: '10:00 AM', doctor: 'Dr. Pérez' };

    if (cita) {
        listaBusqueda.innerHTML = `
            <h2>Resultado de la Búsqueda</h2>
            <p>ID: ${cita.id}</p>
            <p>Fecha: ${cita.fecha}</p>
            <p>Hora: ${cita.hora}</p>
            <p>Doctor: ${cita.doctor}</p>
        `;
    } else {
        listaBusqueda.innerHTML = `<p>No se encontró ninguna cita con el ID proporcionado.</p>`;
    }
}
// Función para simular un retraso (puedes reemplazarla con una llamada a fetch)
function simularRetraso(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Verificar el estado del usuario
if (usuarioLogeado) {
    mostrarListadoCitas();
} else {
    mostrarBusquedaPorID();
}
