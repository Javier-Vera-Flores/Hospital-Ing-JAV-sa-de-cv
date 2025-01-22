const HOST = "192.168.100.15"
const SERVER_URL = `http://${HOST}:3000`; // URL del servidor
const SOAP_URL = `${SERVER_URL}/historial?wsdl`;

localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual

const username = localStorage.getItem('loggedInUser');
// Simulación del estado del usuario
//const usuarioLogeado = false; // Cambia a true si el usuario está logeado
const usuarioLogeado = localStorage.getItem('loggedInUser');
// Selecciona el div donde se gestionará el contenido dinámico
// const containerCita = document.querySelector('.container-cita');
const formHistorial = document.getElementById("div_historial");

//Configuración dinámica del boton de iniciar/cerrar sesion
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("redireccionSesion").addEventListener("click", () => {
        window.location.href = "../pages/login.html"; // Redirigir al login
      });
    const username = localStorage.getItem('loggedInUser');
    if(username){
        loadHistorial(username);
    } 
});

// Función para mostrar el spinner de carga
function mostrarSpinner() {
    document.getElementById("div_default").style.display = "none";
    document.getElementById("div_carga").style.display = "block";
}
// Función para simular un retraso 
function simularRetraso(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Interacción Servicios SOAP */
async function loadHistorial(user) {
    // Mostrar spinner
    mostrarSpinner();

    // Simular un retraso para obtener los datos (por ejemplo, llamando a un backend)
    await simularRetraso(2000); // 2 segundos

    try {
        const response = await fetch(`${SERVER_URL}/buscarHistorial?user=${user}`);
        const data = await response.json();
    
        /*Muestra formulario*/
        document.getElementById("div_carga").style.display = "none";
        formHistorial.style.display = "flex";

        console.log(data.result.paciente);

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