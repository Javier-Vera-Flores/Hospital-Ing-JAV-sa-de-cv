/******************************
 * INICIO - Variables
 *****************************/
const express = require("express");
const fs = require("fs");
const path = require("path");
const soap = require("soap"); //Creo que se va a usar
const http = require("http");
require("dotenv").config(); // Manejar variables de entorno
const app = express();
const cors = require("cors"); // Importar el paquete
const { error } = require("console");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
/******************************
 * FIN - Variables
 *****************************/
//#######################################################################################
/******************************
 * INICIO - Configuración
 *****************************/
// Configurar CORS
app.use(
  cors({
    // origin: "http://127.0.0.1:3000", // Cambia esto al origen donde está tu cliente
    //Si quieres que sea desde cualquier origin sustituy origin por --> origin: '*'
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:58065"], // Cambia esto al origen donde está tu cliente
    //origin: '*',//lo quitamos al final jejeje
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Encabezados permitidos
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos de la carpeta "Cliente"
app.use(express.static(path.join(__dirname, "../Cliente")));
/******************************
 * FIN - Configuración
 *****************************/
//#######################################################################################
/******************************
 * INICIO - Citas Medicas
 *****************************/

app.get("/citasMedicas", (req, res) => {
  const filePath = path.join(__dirname, "./jsonComunicacion/citas.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de citas" });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para actualizar una cita médica (PUT)
app.put("/citasMedicas/:id", (req, res) => {
  const citaId = req.params.id;
  const updatedCita = req.body;

  const filePath = path.join(__dirname, "./jsonComunicacion/citas.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de citas" });
    }

    const citas = JSON.parse(data);
    const citaIndex = citas.findIndex((cita) => cita.id === citaId);

    if (citaIndex === -1) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    // Actualizamos la cita
    citas[citaIndex] = { ...citas[citaIndex], ...updatedCita };

    // Guardamos los cambios en el archivo
    fs.writeFile(filePath, JSON.stringify(citas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al guardar los cambios" });
      }
      res.json({ message: "Cita médica actualizada", cita: citas[citaIndex] });
    });
  });
});

// Ruta para eliminar una cita médica (DELETE)
app.delete("/citasMedicas/:id", (req, res) => {
  const citaId = req.params.id;

  const filePath = path.join(__dirname, "./jsonComunicacion/citas.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de citas" });
    }

    const citas = JSON.parse(data);
    const citaIndex = citas.findIndex((cita) => cita.id === citaId);

    if (citaIndex === -1) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    // Eliminamos la cita
    citas.splice(citaIndex, 1);

    // Guardamos los cambios en el archivo
    fs.writeFile(filePath, JSON.stringify(citas, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al guardar los cambios" });
      }
      res.json({ message: "Cita médica eliminada" });
    });
  });
});

/******************************
 * FIN - Citas Medicas
 *****************************/
//#######################################################################################
/******************************
 * INICIO - Login
 *****************************/
// Rutas REST para login y registro
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile(
    path.join(__dirname, "./jsonComunicacion/users.json"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al leer el archivo de usuarios",
        });
      }

      const users = JSON.parse(data);
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Credenciales incorrectas" });
      }
    }
  );
});

app.post("/register", (req, res) => {
  const { username, name, password } = req.body;
  var minusculas=false;
  var mayusculas=false;
  var numeros=false;
  var caracteres=false;
  var longitud=false;
  var espacios=false;
  // Función para validar la contraseña
  const isValidPassword = (password) => {
    // Define aquí los criterios de la contraseña
    // Una contraseña valida es de al menos 8 caracteres, incluye letras y números
    var i=0;
    while(i<password.length){
      if(password.charAt(i)==" "){
        espacios=true;
      }
      if(password.charAt(i).match(/[a-z]/)){
        minusculas=true;
      }
      if(password.charAt(i).match(/[A-Z]/)){
        mayusculas=true;
      }
      if(password.charAt(i).match(/\d/)){
        numeros=true;
      }
      if(password.charAt(i).match(/[!@#$%^&*(),.?":{}|<>]/)){
        caracteres=true;
      }
      i++;
    }
    if(password.length>=8){
      longitud=true;
    }
    if(minusculas==true && mayusculas==true && numeros==true && caracteres==true && longitud==true && espacios==false){
      return true;
    }
    return false;
  };

  // Función para validar la contraseña
  if (!isValidPassword(password)) {
    return res.json({
      success: false,
      message: "<strong>Los requisitos de la contraseña son:</strong><br>" +
        `${cumple(minusculas)} Al menos una letra minúscula (a-z)<br>` +
        `${cumple(mayusculas)} Al menos una letra mayúscula (A-Z)<br>` +
        `${cumple(numeros)} Al menos un número (0-9)<br>` +
        `${cumple(caracteres)} Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)<br>` +
        `${cumple(longitud)} Longitud mínima de 8 caracteres<br>` +
        `${cumple(!espacios)} Sin espacios en blanco<br>`
    });
  }

  fs.readFile(
    path.join(__dirname, "./jsonComunicacion/users.json"),
    "utf8",
    (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al leer el archivo de usuarios",
        });
      }

      const users = JSON.parse(data);
      const userExists = users.some((user) => user.username === username);

      if (userExists) {
        return res.json({ success: false, message: "El usuario ya existe" });
      }

      users.push({ username, name, password });

      fs.writeFile(
        path.join(__dirname, "./jsonComunicacion/users.json"),
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Error al guardar el usuario" });
          }

          res.json({ success: true });
        }
      );
    }
  );
});

function cumple(condicion) {
  return condicion ? "✅" : "❌";
}

/******************************
 * FIN - Login
 *****************************/
//#######################################################################################
/******************************
 * INICIO - Nuestro equipo médico
 *****************************/
// Ruta para servir el archivo de doctores
app.get("/doctores", (req, res) => {
  const doctoresPath = path.join(__dirname, "./jsonComunicacion/doctores.json");
  const especialidadesPath = path.join(__dirname, "./jsonComunicacion/especialidades.json");

  // Leer ambos archivos
  fs.readFile(doctoresPath, "utf8", (err, doctoresData) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de doctores" });
    }

    fs.readFile(especialidadesPath, "utf8", (err, especialidadesData) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al leer el archivo de especialidades" });
      }

      try {
        // Parsear los datos de los archivos
        const doctores = JSON.parse(doctoresData);
        const especialidades = JSON.parse(especialidadesData);

        // Crear un diccionario para acceder a las especialidades
        const especialidadesDict = {};
        especialidades.forEach((e) => {
          especialidadesDict[e.idEspecialidad] = e.nombre;
        });

        // Combinar la información de doctores con especialidades
        const doctoresConEspecialidad = doctores.map((doctor) => ({
          ...doctor,
          especialidad: especialidadesDict[doctor.idEspecialidad] || "Especialidad no encontrada",
        }));

        // Ordenar por especialidad (alfabéticamente)
        doctoresConEspecialidad.sort((a, b) => {
          if (a.especialidad < b.especialidad) return -1;
          if (a.especialidad > b.especialidad) return 1;
          return 0;
        });

        // Responder con el resultado combinado y ordenado
        res.json(doctoresConEspecialidad);
      } catch (parseError) {
        res
          .status(500)
          .json({ error: "Error al procesar los datos JSON" });
      }
    });
  });
});

/******************************
 * FIN - Nuestro equipo médico
 *****************************/

//#######################################################################################
/******************************
 * INICIO - Servidor
 *****************************/
// Ruta para inicializar en localhost 3000 en inicio.html
app.get("/", (req, res) => {
  //res.sendFile(path.join(__dirname, '../Cliente', 'inicio.html'));
  res.sendFile(path.join(__dirname, "../Cliente", "index.html"));
});

server.listen(PORT, HOST, () => {
  console.log(`Servidor REST ejecutándose en http://${HOST}:${PORT}`);
});
/******************************
 * FIN - Servidor
 *****************************/
//#######################################################################################
