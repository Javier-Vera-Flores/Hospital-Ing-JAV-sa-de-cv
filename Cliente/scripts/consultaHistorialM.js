
const SERVER_URL = "http://127.0.0.1:3000"; // URL del servidor
const SOAP_URL = `${SERVER_URL}/historial?wsdl`;

localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual

const username = localStorage.getItem('loggedInUser');
// Simulación del estado del usuario
//const usuarioLogeado = false; // Cambia a true si el usuario está logeado
const usuarioLogeado = localStorage.getItem('loggedInUser');
// Selecciona el div donde se gestionará el contenido dinámico
// const containerCita = document.querySelector('.container-cita');
const listaBusqueda = document.querySelector('.listado-busqueda');

//logica de logeo
//Configuración dinámica del boton de iniciar/cerrar sesion
document.addEventListener('DOMContentLoaded', () => {
    const userGreeting = document.getElementById('userGreeting');
    const logoutButton = document.getElementById('logoutButton');
    const username = localStorage.getItem('loggedInUser');

    // Configurar el saludo y el texto del botón de manera dinámica
    if (username) {
        userGreeting.textContent = `Bienvenido, ${username}!`;
        logoutButton.textContent = 'Cerrar Sesión';
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // Eliminar el usuario almacenado
            alert('Has cerrado sesión exitosamente.');
            window.location.href = 'consultaHistorialMedico.html'; // Redirigir al login
        });
        document.getElementById("div_default").remove();
        loadHistorial(username);
    } else {
        userGreeting.textContent = 'Bienvenido, invitado!';
        logoutButton.textContent = 'Iniciar Sesión';
        logoutButton.addEventListener('click', () => {
            window.location.href = 'login.html'; // Redirigir al login
        });
        document.getElementById("redireccionSesion").addEventListener('click', () => {
            window.location.href = 'login.html'; // Redirigir al login
        })
    }
});

// Función para mostrar el spinner de carga
function mostrarSpinner() {
    listaBusqueda.innerHTML = `
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>    
    `;

}
// Función para simular un retraso 
function simularRetraso(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function inicializaForm(){
    listaBusqueda.innerHTML = ''; //limpiamos contenedor
    // Crear el contenedor principal
    listaBusqueda.className = 'container-xxl card';
    listaBusqueda.innerHTML = `
        <h1 class="card-header">
            Historial Médico
        </h1>
        <div class="card-body">
            <h3 class="card-title">Ficha de Identificación</h3>
            <form>
                <div class="form-datosPersonales">
                    <div class="form-group">
                        <label>Nombre: </label>
                        <input class="form-control" id="inputNombre" disabled>
                    </div>
                    <div class="form-group">
                        <label>Edad (Años):</label>
                        <input class="form-control" id="inputEdad" disabled>
                    </div>
                    <div class="form-group">
                        <label>Sexo:</label>
                        <input class="form-control" id="inputSexo" disabled>
                    </div>
                    <div class="form-group">
                        <label>Estado Civil:</label>
                        <input class="form-control" id="inputEstadoCivil" disabled>
                    </div>
                    <div class="form-group">
                        <label>Religión:</label>
                        <input class="form-control" id="inputReligion" disabled>
                    </div>
                </div>
                <div class="form-estudios">
                    <div class="form-group">
                        <label>Escolaridad:</label>
                        <input class="form-control" id="inputEscolaridad" disabled>
                    </div>
                    <div class="form-group">
                        <label>Ocupación:</label>
                        <input class="form-control" id="inputOcupacion" disabled>
                    </div>
                    <div class="form-group">
                        <label>Seguro Médico:</label>
                        <input class="form-control" id="inputSeguro" disabled>
                    </div>
                </div>
                <div class="form-nacimiento">
                    <div class="form-group">
                        <label>Fecha de Nacimiento:</label>
                        <input class="form-control" id="inputFNacimiento" disabled>
                    </div>
                    <div class="form-group">
                        <label>Lugar de Nacimiento:</label>
                        <input class="form-control" id="inputLNacimiento" disabled>
                    </div>
                    <div class="form-group">
                        <label>Nacionalidad:</label>
                        <input class="form-control" id="inputNacionalidad" disabled>
                    </div><div class="form-group">
                        <label>Dirección:</label>
                        <input class="form-control" id="inputDireccion" disabled>
                    </div>
                </div>
            </form>

            <h3 class="card-title">Responsable</h3>
            <form>
                <div class="form-responsable">
                    <div class="form-group">
                        <label>Nombre: </label>
                        <input class="form-control" id="inputNombreResponsble" disabled>
                    </div>
                    <div class="form-group">
                        <label>Vínculo</label>
                        <input class="form-control" id="inputVinculo" disabled>
                    </div>
                 </div>
            </form>

            <h3 class="card-title">Antecedentes HeredoFamiliares</h3>
            <form>
                <div class="form-row form-historial">
                    <div class="form-group">
                        <textarea class="form-control" id="txtHeredo" disabled></textarea>
                    </div>
            </form>

            <h3 class="card-title">Antecedentes Personales No Patológicos</h3>
            <form>
                <div class="form-row form-historial">
                    <div class="form-group">
                        <textarea class="form-control" id="txtPersonalesNP" disabled></textarea>
                    </div>
            </form>

            <h3 class="card-title">Antecedentes Personales Patológicos</h3>
            <form>
                <div class="form-row form-historial">
                    <div class="form-group">
                        <textarea class="form-control" id="txtPersonalesP" disabled></textarea>
                    </div>
            </form>

            <h3 class="card-title">Antecedentes GinecoObstétrico</h3>
            <form>
                <div class="form-row form-historial">
                    <div class="form-group">
                        <textarea class="form-control" id="txtGineco" disabled></textarea>
                    </div>
            </form>
        </div>
    `
}

/* Interacción Servicios SOAP */
async function loadHistorial(user) {
    // Mostrar spinner
    mostrarSpinner();

    // Simular un retraso para obtener los datos (por ejemplo, llamando a un backend)
    await simularRetraso(2000); // 2 segundos

    try {
        const response = await fetch(`http://127.0.0.1:4000/buscar?user=${user}`);
        const data = await response.json();

        console.log(data.result.paciente);
        inicializaForm();

        document.getElementById("inputNombre").value = data.result.paciente;
        document.getElementById("inputEdad").value = data.result.edad;
        document.getElementById("inputSexo").value = data.result.sexo;
        document.getElementById("inputEstadoCivil").value = data.result.estadoCivil;
        document.getElementById("inputReligion").value = data.result.religion;
        document.getElementById("inputEscolaridad").value = data.result.escolaridad;
        document.getElementById("inputOcupacion").value = data.result.ocupacion;
        document.getElementById("inputSeguro").value = data.result.seguroMedico;
        document.getElementById("inputFNacimiento").value = data.result.fechaNaciemiento;
        document.getElementById("inputLNacimiento").value = data.result.lugarOrigen;
        document.getElementById("inputNacionalidad").value = data.result.nacionalidad;
        document.getElementById("inputDireccion").value = data.result.lugarResidencia;
        document.getElementById("inputNombreResponsble").value = data.result.personaResponsable;
        document.getElementById("inputVinculo").value = data.result.prVinculoconPaciente;
        document.getElementById("txtHeredo").value = data.result.anteHeredoFamiliares;
        document.getElementById("txtPersonalesNP").value = data.result.antePersonalesNP;
        document.getElementById("txtPersonalesP").value = data.result.antePersonalesP;
        document.getElementById("txtGineco").value = data.result.anteGineObtetrico;
    } catch (error) {
        console.error(error);
    }
}
/* Interacción Servicios SOAP */