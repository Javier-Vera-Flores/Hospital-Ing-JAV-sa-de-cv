localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual
//Configuración dinámica del boton de iniciar/cerrar sesion
document.addEventListener("DOMContentLoaded", () => {
  // Obtener la URL base desde el atributo del body
  const dataURL = document.body.getAttribute("data-url");

  //Se carga el header
  const headerContainer = document.getElementById("divHeader");
  if (headerContainer) {
    fetch("../header.html").then(response => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el header.");
        }
        return response.text();
      }).then(data => {
        headerContainer.innerHTML = data;

        const userGreeting = document.getElementById("userGreeting");
        const logoutButton = document.getElementById("logoutButton");
        const username = localStorage.getItem("loggedInUser");
      
        // Configurar el saludo y el texto del botón de manera dinámica
        if (username) {
          userGreeting.textContent = `Bienvenido, ${username}!`;
          logoutButton.textContent = "Cerrar Sesión";
          logoutButton.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser"); // Eliminar el usuario almacenado
            alert("Has cerrado sesión exitosamente.");
            window.location.href = dataURL; // Redirigir al login
          });
        } else {
          userGreeting.textContent = "Bienvenido, invitado!";
          logoutButton.textContent = "Iniciar Sesión";
          logoutButton.addEventListener("click", () => {
            window.location.href = "../pages/login.html"; // Redirigir al login
          });
        }
      }).catch(error => {
        console.error("Error al cargar el header:", error);
      });
  } else {
    console.error("El contenedor del header con id 'divHeader' no se encontró en el DOM.");
  }
  //Se carga el footer
  const footerContainer = document.getElementById("divFooter");
  if (footerContainer) {
    fetch("../footer.html").then(response => {
        if (!response.ok) {
          throw new Error("No se pudo cargar el footer.");
        }
        return response.text();
      }).then(data => {
        footerContainer.innerHTML = data;
      }).catch(error => {
        console.error("Error al cargar el footer:", error);
      });
  } else {
    console.error("El contenedor del footer con id 'divFooter' no se encontró en el DOM.");
  }
});
