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
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:50245"], // Cambia esto al origen donde está tu cliente
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
      return res.status(500).json({ error: "Error al leer el archivo de citas" });
    }
    res.json(JSON.parse(data));
  }
  );
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

  fs.readFile(path.join(__dirname, "./jsonComunicacion/users.json"), "utf8", (err, data) => {
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
  const { username, password } = req.body;

  // Función para validar la contraseña
  const isValidPassword = (password) => {
    // Define aquí los criterios de la contraseña
    // Una contraseña valida es de al menos 8 caracteres, incluye letras y números
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  // Validar si la contraseña cumple con los criterios
  if (!isValidPassword(password)) {
    return res.json({
      success: false,
      message: "La contraseña no cumple con los requisitos (mínimo 8 caracteres, debe incluir letras y números)"
    });
  }

  fs.readFile(path.join(__dirname, "./jsonComunicacion/users.json"), "utf8", (err, data) => {
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

    users.push({ username, password });

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
  });
});

/******************************
 * FIN - Login
 *****************************/
//#######################################################################################
/******************************
 * INICIO - Nuestro equipo médico
 *****************************/
// Ruta para servir el archivo de doctores
app.get("/doctores", (req, res) => {
  const filePath = path.join(__dirname, "./jsonComunicacion/doctores.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error al leer el archivo de doctores" });
    }
    res.json(JSON.parse(data));
  });
});
/******************************
 * FIN - Nuestro equipo médico
 *****************************/
//########################################################################################
/******************************
 * Inicio - SOAP Requerimiento Historial
 ******************************/
const SOAP_URL = 'http://127.0.0.1:3000/historial?wsdl';

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
  console.log('Servidor escuchando en http://127.0.0.1:4000');
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

const wsdlPath = path.join(__dirname, 'reqHistorial.wsdl');
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
  console.log(`Servicio SOAP corriendo en http://${HOST}:${PORT}/historial`);
});
/******************************
 * FIN - Servidor
 *****************************/
//#######################################################################################

