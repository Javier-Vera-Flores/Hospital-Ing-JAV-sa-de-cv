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
const HOST = process.env.HOST || "192.168.100.15";
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
    origin: [`http://${HOST}:${PORT}`, `http://${HOST}:58698`, `http://${HOST}:4000`], // Cambia esto al origen donde está tu cliente
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
// Ruta para crear una nueva cita médica (POST)
app.post("/citasMedicas", (req, res) => {
  const nuevaCita = req.body;

  // Validamos que los campos necesarios estén presentes
  if (
    !nuevaCita.paciente ||
    !nuevaCita.fecha ||
    !nuevaCita.hora ||
    !nuevaCita.idEspecialidad
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const filePath = path.join(__dirname, "./jsonComunicacion/citas.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de citas" });
    }

    const citas = JSON.parse(data);

    // Generar un ID único para la nueva cita (puedes usar cualquier método)
    const nuevaCitaConId = {
      ...nuevaCita,
      id: String(Date.now()), // Genera un ID único basado en la fecha actual
    };

    // Agregamos la nueva cita al arreglo
    citas.push(nuevaCitaConId);

    // Guardamos los cambios en el archivo
    fs.writeFile(filePath, JSON.stringify(citas, null, 2), (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al guardar la nueva cita" });
      }
      res
        .status(201)
        .json({ message: "Cita médica creada", cita: nuevaCitaConId });
    });
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
    });
});

app.post("/register", (req, res) => {
  const { username, name, password } = req.body;
  var minusculas = false;
  var mayusculas = false;
  var numeros = false;
  var caracteres = false;
  var longitud = false;
  var espacios = false;
  // Función para validar la contraseña
  const isValidPassword = (password) => {
    // Define aquí los criterios de la contraseña
    // Una contraseña valida es de al menos 8 caracteres, incluye letras y números
    var i = 0;
    while (i < password.length) {
      if (password.charAt(i) == " ") {
        espacios = true;
      }
      if (password.charAt(i).match(/[a-z]/)) {
        minusculas = true;
      }
      if (password.charAt(i).match(/[A-Z]/)) {
        mayusculas = true;
      }
      if (password.charAt(i).match(/\d/)) {
        numeros = true;
      }
      if (password.charAt(i).match(/[!@#$%^&*(),.?":{}|<>]/)) {
        caracteres = true;
      }
      i++;
    }
    if (password.length >= 8) {
      longitud = true;
    }
    if (
      minusculas == true &&
      mayusculas == true &&
      numeros == true &&
      caracteres == true &&
      longitud == true &&
      espacios == false
    ) {
      return true;
    }
    return false;
  };

  // Función para validar la contraseña
  if (!isValidPassword(password)) {
    return res.json({
      success: false,
      message:
        "<strong>Los requisitos de la contraseña son:</strong><br>" +
        `${cumple(minusculas)} Al menos una letra minúscula (a-z)<br>` +
        `${cumple(mayusculas)} Al menos una letra mayúscula (A-Z)<br>` +
        `${cumple(numeros)} Al menos un número (0-9)<br>` +
        `${cumple(
          caracteres
        )} Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)<br>` +
        `${cumple(longitud)} Longitud mínima de 8 caracteres<br>` +
        `${cumple(!espacios)} Sin espacios en blanco<br>`,
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
  const especialidadesPath = path.join(
    __dirname,
    "./jsonComunicacion/especialidades.json"
  );

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
          especialidad:
            especialidadesDict[doctor.idEspecialidad] ||
            "Especialidad no encontrada",
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
        res.status(500).json({ error: "Error al procesar los datos JSON" });
      }
    });
  });
});

/******************************
 * FIN - Nuestro equipo médico
 *****************************/
//########################################################################################
/******************************
 * Inicio - SOAP Requerimiento Historial
 ******************************/
const SOAP_URL = `http://${HOST}:${PORT}/historial?wsdl`;

app.get('/buscar', async (req, res) => {
  const { user } = req.query;
  try {
    const client = await soap.createClientAsync(SOAP_URL);
    const result = await client.BuscarAsync({ username: user });

    res.json({ result: result[0]});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log(`Servidor escuchando en http://${HOST}:4000`);
})

const service = {
  HistorialService: {
    HistorialPort: {
      Buscar: function (args, callback) {
        const username = args.username;

        const filePath = path.join(__dirname, "./jsonComunicacion/historialMedico.json");
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            return res.status(500).json({ error: "Error al leer el archivo de citas" });
          }
          const listado_historial = JSON.parse(data);

          listado_historial.forEach(historia => {
            if(historia.username == username){
              console.log(historia.id);
              callback(null, {  id: historia.id,
                                paciente: historia.paciente,
                                fechaNaciemiento: historia.fechaNaciemiento,
                                edad: historia.edad,
                                sexo: historia.sexo,
                                lugarOrigen: historia.lugarOrigen,
                                nacionalidad: historia.nacionalidad,
                                religion: historia.religion,
                                estadoCivil: historia.estadoCivil,
                                lugarResidencia: historia.lugarResidencia,
                                escolaridad: historia.escolaridad,
                                seguroMedico: historia.seguroMedico,
                                ocupacion: historia.ocupacion,
                                personaResponsable: historia.personaResponsable,
                                prVinculoconPaciente: historia.prVinculoconPaciente,
                                anteHeredoFamiliares: historia.anteHeredoFamiliares,
                                antePersonalesNP: historia.antePersonalesNP,
                                antePersonalesP: historia.antePersonalesP,
                                anteGineObtetrico: historia.anteGineObtetrico
                            });
            } else {
              userHistoria = "No se encontró Historia clínica"
            }
          });
          //res.json(JSON.parse(data));
        });
        
      }
    }
  }
}

const wsdlPath = path.join(__dirname, './requerimientos/reqHistorial.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');
/******************************
 * FIN - SOAP Requerimiento Historial
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
  soap.listen(app, '/historial', service, wsdl);

  console.log(`Servidor REST ejecutándose en http://${HOST}:${PORT}`);
  console.log(`Servicio SOAP corriendo en http://${HOST}:${PORT}/historial`)
});
/******************************
 * FIN - Servidor
 *****************************/
//#######################################################################################
