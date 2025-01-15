const SERVER_URL = "http://127.0.0.1:3000"; // URL del servidor

localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual

const username = localStorage.getItem("loggedInUser");
// Simulación del estado del usuario
//const usuarioLogeado = false; // Cambia a true si el usuario está logeado
const usuarioLogeado = localStorage.getItem("loggedInUser");
// Selecciona el div donde se gestionará el contenido dinámico
// const containerCita = document.querySelector('.container-cita');
const listaBusqueda = document.querySelector(".listado-busqueda");
const formBusqueda = document.querySelector(".container-cita");

// Función para mostrar el formulario de búsqueda por ID
function mostrarBusquedaPorID() {
  listaBusqueda.innerHTML = `
        <p class="parrafo-form">realiza una busqueda</p>
    `;

  // Manejar el evento del formulario
  const formulario = document.getElementById("buscar-cita");

  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idCita = document.getElementById("idCita").value;
    console.log(`Buscando cita con ID: ${idCita}`);

    // Mostrar spinner
    mostrarSpinner();

    // Simular un retraso para obtener los datos (por ejemplo, llamando a un backend)
    await simularRetraso(2000); // 2 segundos

    // Reemplazar el spinner con la vista final
    mostrarResultadoBusqueda(idCita);
    //mostrarListadoCitas();
  });
}

// Función para mostrar el listado de citas del usuario logeado
function mostrarListadoCitas() {
  //quitaremos el contenido de
  formBusqueda.innerHTML = `<p style="color:red; font-size: 30px">Hola ${usuarioLogeado}, estas son tus citas</p>`;
  const botonesAcciones = document.createElement("article");
  botonesAcciones.innerHTML = `
    <button type="button" class="btn btn-success" id="nuevaCita">Nueva cita</button>
    <button type="button" class="btn btn-warning">Imprimir</button>
    <button type="button" class="btn btn-info">Recargar</button>
    <button type="button" class="btn btn-dark">Info</button>

    <button type="button" class="btn btn-link">Link</button>
            <form id="buscar-cita" class="form-busqueda">
          <label for="idCita">Ingresa el ID de tu cita:</label>
          <input type="text" id="idCita" name="idCita" required>
          <button type="submit">Buscar</button>
        </form>
    
    `;
  formBusqueda.appendChild(botonesAcciones);
  // Ejemplo de citas obtenidas (pueden venir de un backend)
  const botonNuevaCita = document.querySelector("#nuevaCita");
  botonNuevaCita.addEventListener("click", () => {
    //alert("Agregando nueva cita");
    // Crear contenedor del modal
    const modalContainer = document.createElement("div");
    modalContainer.className = "modal fade";
    modalContainer.id = "dynamicModal";
    modalContainer.tabIndex = -1;
    modalContainer.setAttribute("aria-hidden", "true");

    // Contenido del modal
    modalContainer.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ingresa los datos de la nueva cita</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
                    <form action="#" method="post" class="form-cita">
                        <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" value="Juan Medina Ocampo" class="form-control" required>
                        </div>

                        <div class="mb-3">
                        <label for="edad" class="form-label">Edad:</label>
                        <input type="number" id="edad" name="edad" value="18" class="form-control" required>
                        </div>

                        <div class="mb-3">
                        <label for="fechaCita" class="form-label">Fecha de Cita:</label>
                        <input type="date" id="fechaCita" name="fechaCita" value="2024-12-19" class="form-control" required>
                        </div>

                        <div class="mb-3">
                        <label for="horaCita" class="form-label">Hora de Cita:</label>
                        <input type="time" id="horaCita" name="horaCita" value="08:00" class="form-control" required>
                        </div>

                        <div class="mb-3">
                        <label for="idEspecialidad" class="form-label">Especialidad:</label>
                        <select id="idEspecialidad" name="idEspecialidad" class="form-select" required>
                            <option value="Cardiología" selected>Cardiología</option>
                            <option value="Neurología">Neurología</option>
                            <option value="Pediatría">Pediatría</option>
                            <option value="Ginecología">Ginecología</option>
                            <option value="Dermatología">Dermatología</option>
                        </select>
                        </div>

                        <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción:</label>
                        <textarea id="descripcion" name="descripcion" class="form-control" required>Paciente solicita cita con especialista ya que indicó presentar dolor en el pecho y al valorar sus análisis se determinó necesario.</textarea>
                        </div>

                        <div class="mb-3">
                        <label for="nombreDoctor" class="form-label">Nombre del Doctor:</label>
                        <select id="nombreDoctor" name="nombreDoctor" class="form-select" required>
                            <option value="María López Hernández" selected>María López Hernández</option>
                            <option value="Carlos Rodríguez González">Carlos Rodríguez González</option>
                            <option value="Laura Pérez Fernández">Laura Pérez Fernández</option>
                            <option value="Juan Torres Martínez">Juan Torres Martínez</option>
                        </select>
                        </div>

                        <!--<button type="submit" class="btn btn-primary w-100">Enviar Cita</button>-->
                    </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary">Generar cita</button>
        </div>
      </div>
    </div>
  `;

    // Agregar modal al cuerpo del documento
    document.body.appendChild(modalContainer);

    // Inicializar y mostrar el modal
    const bootstrapModal = new bootstrap.Modal(modalContainer);
    bootstrapModal.show();

    // Eliminar el modal del DOM al cerrarlo
    modalContainer.addEventListener("hidden.bs.modal", function () {
      modalContainer.remove();
    });
  });

  //Llamamos a la función después de que el DOM esté completamente cargado
  document.addEventListener("DOMContentLoaded", () => {
    loadCitas();
  });

  // const citas = [
  //     { id: 1, fecha: '2025-01-05', hora: '10:00 AM', doctor: 'Dr. Pérez' },
  //     { id: 2, fecha: '2025-01-10', hora: '02:00 PM', doctor: 'Dra. López' }
  // ];

  // // Generar el listado dinámicamente
  // listaBusqueda.innerHTML = '<h2>Mis Citas</h2>';
  // const ul = document.createElement('ul');
  // citas.forEach(cita => {
  //     const li = document.createElement('li');
  //     li.textContent = `ID: ${cita.id} - Fecha: ${cita.fecha} - Hora: ${cita.hora} - Doctor: ${cita.doctor}`;
  //     ul.appendChild(li);
  // });
  // listaBusqueda.appendChild(ul);
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
  const cita = {
    id: idCita,
    fecha: "2025-01-05",
    hora: "10:00 AM",
    doctor: "Dr. Pérez",
  };

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
// Función para simular un retraso
function simularRetraso(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//logica de logeo
//Configuración dinámica del boton de iniciar/cerrar sesion
document.addEventListener("DOMContentLoaded", () => {
  const userGreeting = document.getElementById("userGreeting");
  const logoutButton = document.getElementById("logoutButton");
  //const username = localStorage.getItem('loggedInUser');

  // Configurar el saludo y el texto del botón de manera dinámica
  if (username) {
    userGreeting.textContent = `Bienvenido, ${username}!`;
    logoutButton.textContent = "Cerrar Sesión";
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser"); // Eliminar el usuario almacenado
      alert("Has cerrado sesión exitosamente.");
      window.location.href = "consultaCita.html"; // Redirigir al login
    });
  } else {
    userGreeting.textContent = "Bienvenido, invitado!";
    logoutButton.textContent = "Iniciar Sesión";
    logoutButton.addEventListener("click", () => {
      window.location.href = "login.html"; // Redirigir al login
    });
  }
});
async function loadCitas() {
  // contenedor --> listado-busqueda
  //const contenedor = document.querySelector(contenedorSeleccionado);
  // Mostrar spinner
  mostrarSpinner();

  // Simular un retraso para obtener los datos (por ejemplo, llamando a un backend)
  await simularRetraso(2000); // 2 segundos
  try {
    const response = await fetch(`${SERVER_URL}/citasMedicas`);
    if (!response.ok) {
      throw new Error("Error al obtener las citas");
    }
    const citas = await response.json();

    listaBusqueda.innerHTML = ""; //limpiamos contenedor
    // Crear el contenedor principal
    //const mainContainer = document.createElement('div');
    listaBusqueda.className = "container mt-4";
    listaBusqueda.innerHTML = `
        <div class="row">
            <!-- Navegación -->
            <div class="col-4">
            <nav id="navbar-example3" class="h-100 flex-column align-items-stretch pe-4 border-end">
                <nav class="nav nav-pills flex-column" id="nav-items">
                <!-- Elementos del menú serán generados dinámicamente -->
                </nav>
            </nav>
            </div>

            <!-- Contenido -->
            <div class="col-8">
            <div data-bs-spy="scroll" data-bs-target="#navbar-example3" data-bs-smooth-scroll="true" 
                class="scrollspy-example" tabindex="0" id="content-container">
                <!-- Secciones serán generadas dinámicamente -->
            </div>
            </div>
        </div>
        `;
    // Contenedores dinámicos
    const navItems = document.getElementById("nav-items");
    const contentContainer = document.getElementById("content-container");
    citas.forEach((cita) => {
      // Crear enlace en el menú de navegación
      const navLink = document.createElement("a");
      navLink.className = "nav-link";
      navLink.href = `#item-${cita.id}`;
      navLink.textContent = `Consulta ${cita.id}`;
      navItems.appendChild(navLink);
      // const citaDiv = document.createElement("div");
      // citaDiv.classList.add("cita"); //añadimos la clase cita al div
      // Crear contenido en la sección principal
      const citaDiv = document.createElement("div");
      citaDiv.id = `item-${cita.id}`;

      citaDiv.innerHTML = `
            <h4>Consulta ID: ${cita.id}</h4>
            <p><strong>Paciente:</strong> ${cita.paciente}</p>
            <p><strong>Edad:</strong> ${cita.edad}</p>
            <p><strong>Usuario:</strong> ${cita.username}</p>
            <p><strong>Fecha:</strong> ${cita.fecha}</p>
            <p><strong>Hora:</strong> ${cita.hora}</p>
            <p><strong>Especialidad:</strong> ${cita.idEspecialidad}</p>
            <p><strong>Consultorio:</strong> ${cita.consultorio}</p>
            <p><strong>ID Doctor:</strong> ${cita.idDoctor}</p>
            <p><strong>Descripción:</strong> ${cita.descripcion}</p>
            <p><strong>Doctor:</strong> ${cita.nombreDoctor}</p>
            <img src="${cita.imagenDoctor}" alt="Imagen de ${cita.nombreDoctor}" style="width:100px;height:100px;border-radius:50%;"><br><br>
            <div class="botonesCita">
                <button type="button" class="btn btn-outline-primary botonModificar" id="botonModificar-${cita.id}">Modificar</button>
                <button type="button" class="btn btn-outline-danger botonEliminar" id="botonEliminar-${cita.id}">Eliminar</button>
            </div>
            
            <hr></hr>
            
            `;

      contentContainer.appendChild(citaDiv);
      //agregaremos eventos onclick a los botones de modificar y eliminar:
      const botonModificar = citaDiv.querySelector(
        `#botonModificar-${cita.id}`
      );
      const botonEliminar = citaDiv.querySelector(`#botonEliminar-${cita.id}`);
      botonModificar.addEventListener("click", () => {
        //alert("Modificar");
        // Crear contenedor del modal
        const modalContainer = document.createElement("div");
        modalContainer.className = "modal fade";
        modalContainer.id = "dynamicModal";
        modalContainer.tabIndex = -1;
        modalContainer.setAttribute("aria-hidden", "true");

        // Contenido del modal
        modalContainer.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Datos de la cita a modificar</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
                      <form id="formModificarCita">
              <div class="mb-3">
                <label for="paciente" class="form-label">Paciente</label>
                <input type="text" id="paciente" name="paciente" class="form-control" value="${
                  cita.paciente
                }" required>
              </div>
              <div class="mb-3">
                <label for="edad" class="form-label">Edad</label>
                <input type="number" id="edad" name="edad" class="form-control" value="${
                  cita.edad
                }" required>
              </div>
              <div class="mb-3">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" id="fecha" name="fecha" class="form-control" value="${
                  cita.fecha
                }" required>
              </div>
              <div class="mb-3">
                <label for="hora" class="form-label">Hora</label>
                <input type="time" id="hora" name="hora" class="form-control" value="${
                  cita.hora
                }" required>
              </div>
              <div class="mb-3">
                <label for="especialidad" class="form-label">Especialidad</label>
                <select id="especialidad" name="especialidad" class="form-select" required>
                  <option value="Cardiología" ${
                    cita.idEspecialidad === "Cardiología" ? "selected" : ""
                  }>Cardiología</option>
                  <option value="Neurología" ${
                    cita.idEspecialidad === "Neurología" ? "selected" : ""
                  }>Neurología</option>
                  <option value="Pediatría" ${
                    cita.idEspecialidad === "Pediatría" ? "selected" : ""
                  }>Pediatría</option>
                  <option value="Ginecología" ${
                    cita.idEspecialidad === "Ginecología" ? "selected" : ""
                  }>Ginecología</option>
                  <option value="Dermatología" ${
                    cita.idEspecialidad === "Dermatología" ? "selected" : ""
                  }>Dermatología</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea id="descripcion" name="descripcion" class="form-control" required>${
                  cita.descripcion
                }</textarea>
              </div>
              <div class="mb-3">
                <label for="nombreDoctor" class="form-label">Doctor</label>
                <select id="nombreDoctor" name="nombreDoctor" class="form-select" required>
                  <option value="María López Hernández" ${
                    cita.nombreDoctor === "María López Hernández"
                      ? "selected"
                      : ""
                  }>María López Hernández</option>
                  <option value="Carlos Rodríguez González" ${
                    cita.nombreDoctor === "Carlos Rodríguez González"
                      ? "selected"
                      : ""
                  }>Carlos Rodríguez González</option>
                  <option value="Laura Pérez Fernández" ${
                    cita.nombreDoctor === "Laura Pérez Fernández"
                      ? "selected"
                      : ""
                  }>Laura Pérez Fernández</option>
                  <option value="Juan Torres Martínez" ${
                    cita.nombreDoctor === "Juan Torres Martínez"
                      ? "selected"
                      : ""
                  }>Juan Torres Martínez</option>
                </select>
              </div>
              <!--<button type="submit" class="btn btn-primary">Guardar Cambios</button>-->
            </form>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary">Guardar Cambios</button>
        </div>
      </div>
    </div>
  `;

        // Agregar modal al cuerpo del documento
        document.body.appendChild(modalContainer);

        // Inicializar y mostrar el modal
        const bootstrapModal = new bootstrap.Modal(modalContainer);
        bootstrapModal.show();

        // Eliminar el modal del DOM al cerrarlo
        modalContainer.addEventListener("hidden.bs.modal", function () {
          modalContainer.remove();
        });
      });
      botonEliminar.addEventListener("click", () => {
        //alert("Eliminar");
        // Crear contenedor del modal
        const modalContainer = document.createElement("div");
        modalContainer.className = "modal fade";
        modalContainer.id = "dynamicModal";
        modalContainer.tabIndex = -1;
        modalContainer.setAttribute("aria-hidden", "true");

        // Contenido del modal
        modalContainer.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Eliminar cita</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>¿Esta seguro de querer eliminar la cita?.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary">Eliminar cita</button>
        </div>
      </div>
    </div>
  `;

        // Agregar modal al cuerpo del documento
        document.body.appendChild(modalContainer);

        // Inicializar y mostrar el modal
        const bootstrapModal = new bootstrap.Modal(modalContainer);
        bootstrapModal.show();

        // Eliminar el modal del DOM al cerrarlo
        modalContainer.addEventListener("hidden.bs.modal", function () {
          modalContainer.remove();
        });
      });
    });
  } catch (error) {
    console.error(error);
    listaBusqueda.innerHTML = `<p>No se pudo cargar correctamente las citas</p>`;
  }
}
// Verificar el estado del usuario
if (usuarioLogeado) {
  mostrarListadoCitas();
} else {
  mostrarBusquedaPorID();
}
