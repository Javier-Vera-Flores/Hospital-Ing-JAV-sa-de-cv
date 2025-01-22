const HOST = "192.168.100.15"
const SERVER_URL = `http://${HOST}:3000`; // URL del servidor
const SOAP_URL = `${SERVER_URL}/historial?wsdl`;

const soap = require("soap"); //Creo que se va a usar

localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual

const username = localStorage.getItem('loggedInUser');
// Simulación del estado del usuario
//const usuarioLogeado = false; // Cambia a true si el usuario está logeado
const usuarioLogeado = localStorage.getItem('loggedInUser');

//Configuración dinámica del boton de iniciar/cerrar sesion
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('loggedInUser');
    console.log("En catalogos");

    loadBySOAP(username);

    loadCatalogo(username);
});

function createCardServicio(titulo, precio, descripcion, imagen) {
    let serviceSection = document.createElement("section");
    serviceSection.className = "service-section";

    let serviceTitle = document.createElement("h2");
    serviceTitle.className = "service-title";
    serviceTitle.textContent = titulo;

    let servicePrice = document.createElement("p");
    servicePrice.className = "service-price";
    servicePrice.textContent = `Precio: $${precio} MXN`;

    let serviceContainer = document.createElement("div");
    serviceContainer.className = 'container-section';

    let serviceImage = document.createElement("img");
    serviceImage.src = imagen;
    serviceImage.alt = titulo;
    serviceImage.className = "service-image";

    let descriptionSection = document.createElement("section");
    descriptionSection.className = "description-title";

    let descriptionTitle = document.createElement("h3");
    descriptionTitle.textContent = "Descripción";

    let descriptionP = document.createElement("p");
    descriptionP.textContent = descripcion;

    let buttonConteiner = document.createElement("div");
    buttonConteiner.className = "service-buttons";

    let btnSolicitar = document.createElement("button");
    btnSolicitar.className = "btn btn-primary";
    btnSolicitar.textContent = "Solicitar";

    let btnInformacion = document.createElement("button");
    btnInformacion.className = "btn btn-outline-info";
    btnInformacion.textContent = "Más Información";

    //Construye la sección
    buttonConteiner.appendChild(btnSolicitar);
    buttonConteiner.appendChild(btnInformacion);

    descriptionSection.appendChild(descriptionTitle);
    descriptionSection.appendChild(descriptionP);

    serviceContainer.appendChild(serviceImage);
    serviceContainer.appendChild(descriptionSection);

    serviceSection.appendChild(serviceTitle);
    serviceSection.appendChild(servicePrice);
    serviceSection.appendChild(serviceContainer);
    serviceSection.appendChild(buttonConteiner);

    document.getElementById("divAnalisis").appendChild(serviceSection);
}

async function loadCatalogo(username) {
    try {
        const response = await fetch(`${SERVER_URL}/cargarCat?user=${username}`);
        const data = await response.json();

        data.result.CargarCatalogoResult.forEach(analisis => {
            //console.log(analisis);
            createCardServicio(analisis.nombre, analisis.precio, analisis.descripcion, analisis.img);
        });
    } catch (error) {
        console.error(error);
    }
}

async function loadBySOAP(username) {
    try {
        const client = await soap.createClientAsync(SOAP_URL + '/hospital?wsdl');
        const result = await client.CargarDoctoresAsync({ username: username });
        const catalogo = result.CargarCatalogoResult;

        console.log(catalogo);        
    } catch (error) {
        console.error("Error al cargar el catálogo mediante SOAP:", error);
    }
}