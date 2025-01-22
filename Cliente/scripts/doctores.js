const HOST = "192.168.0.135";
const SERVER_URL = `http://${HOST}:3000`; // URL del servidor
localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual

// Función para obtener y mostrar doctores en el HTML
// Función para obtener y mostrar doctores agrupados por especialidad
function loadDoctorsBySpecialty(containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`Contenedor no encontrado: ${containerSelector}`);
    return;
  }

  fetch(`${SERVER_URL}/doctores`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los doctores");
      }
      return response.json();
    })
    .then((doctores) => {
      console.log(doctores);
      container.innerHTML = ""; // Limpiamos el contenedor

      // Agrupar doctores por especialidad
      const groupedBySpecialty = doctores.reduce((groups, doctor) => {
        const specialty = doctor.especialidad || "Sin especialidad";
        if (!groups[specialty]) {
          groups[specialty] = [];
        }
        groups[specialty].push(doctor);
        return groups;
      }, {});

      // Generar HTML dinámico por especialidad
      Object.keys(groupedBySpecialty).forEach((specialty) => {
        const specialtySection = document.createElement("section");
        specialtySection.classList.add("specialty-section");

        specialtySection.innerHTML = `<h2>${specialty}</h2>`;

        // Contenedor horizontal para los doctores
        const doctorsContainer = document.createElement("div");
        doctorsContainer.classList.add("doctors-container");

        groupedBySpecialty[specialty].forEach((doctor) => {
          const doctorElement = document.createElement("div");
          doctorElement.classList.add("doctor");

          doctorElement.innerHTML = `
                        <img src="${doctor.imagen}" alt="${doctor.nombre}">
                        <h3>${doctor.nombre}</h3>
                    `;

          doctorsContainer.appendChild(doctorElement);
        });

        specialtySection.appendChild(doctorsContainer);
        container.appendChild(specialtySection);
      });
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = `<p>Error al cargar los doctores.</p>`;
    });
}

async function loadDoctorsBySpecialtySOAP(containerSelector, username) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`Contenedor no encontrado: ${containerSelector}`);
    return;
  }

  try {
    const response = await fetch(
      `http://${HOST}:4000/cargarDoc?user=${username}`
    );
    const data = await response.json();
    const doctores = JSON.parse(data.result.CargarDoctoresResult);

    // Agrupar doctores por especialidad
    const groupedBySpecialty = doctores.reduce((groups, doctor) => {
      const specialty = doctor.especialidad || "Sin especialidad";
      if (!groups[specialty]) {
        groups[specialty] = [];
      }
      groups[specialty].push(doctor);
      return groups;
    }, {});

    // Generar HTML dinámico por especialidad
    Object.keys(groupedBySpecialty).forEach((specialty) => {
      const specialtySection = document.createElement("section");
      specialtySection.classList.add("specialty-section");

      specialtySection.innerHTML = `<h2>${specialty}</h2>`;

      // Contenedor horizontal para los doctores
      const doctorsContainer = document.createElement("div");
      doctorsContainer.classList.add("doctors-container");

      groupedBySpecialty[specialty].forEach((doctor) => {
        const doctorElement = document.createElement("div");
        doctorElement.classList.add("doctor");

        doctorElement.innerHTML = `
                    <img src="${doctor.imagen}" alt="${doctor.nombre}">
                    <h3>${doctor.nombre}</h3>
                `;

        doctorsContainer.appendChild(doctorElement);
      });

      specialtySection.appendChild(doctorsContainer);
      container.appendChild(specialtySection);
    });
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  loadDoctorsBySpecialtySOAP(".doctores", username);
});
