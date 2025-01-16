const SERVER_URL = "http://127.0.0.1:3000"; // URL del servidor

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Por favor, ingresa usuario y contraseña.");
      return;
    }

    await iniciarSesion(username, password);
  });

  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newUsername = document.getElementById("newUsername").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!newUsername || !newPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    await agregarUsuario(newUsername, newPassword);
  });
});

async function iniciarSesion(username, password) {
  try {
    const response = await fetch(`${SERVER_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    const messageElement = document.getElementById("loginMessage");
    messageElement.textContent = ""; // Limpiar mensaje anterior
    if (result.success) {
      messageElement.textContent = "Inicio de sesión exitoso";
      messageElement.style.color = "green";
      localStorage.setItem("loggedInUser", username);
      //window.location.href = "../index.html";
      //Si existe una pagina anterior o diferente de inicio, redirigimos a ella,
      //de otra forma redirigir a index
      const paginaPrevia = localStorage.getItem('previousPage');
      if(paginaPrevia){
        window.location.href = paginaPrevia;
      }else{
        window.location.href = "../index.html";
      }

    } else {
      messageElement.textContent = "Usuario o contraseña incorrectos";
      messageElement.style.color = "red";
    }
  } catch (error) {
    console.error("Error al procesar el login:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
}

async function agregarUsuario(newUsername, newPassword) {
  try {
    const response = await fetch(`${SERVER_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const result = await response.json();
    const messageElement = document.getElementById("registerMessage");
    messageElement.textContent = ""; // Limpiar mensaje anterior
    if (result.success) {
      messageElement.textContent = "Usuario registrado exitosamente";
      messageElement.style.color = "green";
    } else {
      messageElement.textContent = `Error al registrar usuario: ${result.message}`;
      messageElement.style.color = "red";
    }
  } catch (error) {
    console.error("Error al procesar el registro:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
}

const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});
