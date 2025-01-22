const HOST = "192.168.0.135";
localStorage.setItem("previousPage", window.location.href); //guardamos la pagina actual

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !correo || !mensaje) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  if (!correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    alert("Por favor, ingresa un correo válido.");
    return;
  }

  // Continúa con el envío del correo
  enviarCorreo(nombre, correo, mensaje);
});

function enviarCorreo(nombre, correo, mensaje) {
  console.log(nombre);
  console.log(correo);
  console.log(mensaje);
  emailjs
    .send("default_service", "template_z1po6kp", {
      nombre: nombre,
      correo: correo,
      mensaje: mensaje,
    })
    .then(function (response) {
      alert("Correo enviado con éxito!");
      window.location.href = "contactanos.html";
    })
    .catch(function (error) {
      alert("Error al enviar el correo: " + JSON.stringify(error));
    });
}
