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
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:50926"], // Cambia esto al origen donde está tu cliente
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

app.get("/citasMedicas", (req, res)=> {
  const filePath = path.join(__dirname, "./jsonComunicacion/citas.json");
  fs.readFile(filePath, "utf8",(err, data)=>{
    if(err){
      return res.status(500).json({error: "Error al leer el archivo de citas"});
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

