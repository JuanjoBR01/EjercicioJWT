let jwt = require("jsonwebtoken");
let config = require("./config");
var express = require("express");
const User = require("./models/user");
var router = express.Router();

// Clase encargada de la creación del token
class HandlerGenerator {
  login(req, res) {
    // Extrae el usuario, la contraseña y el rol especificados en el cuerpo de la solicitud

    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;

    // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
    let mockedUsername = "admin";
    let mockedPassword = "password";
    let mockedRole = "role";

    User.findOne({
      where: { username: req.body.username, role: req.body.role },
    }).then((user) => {
      console.log("User", user);
      if (user === null) {
        res.status(404).send("El usuario con ese ID no existe");
      }

      mockedUsername = user.username;
      mockedPassword = user.password;
      mockedRole = user.role;

      // Si se especifico un usuario y contraseña, proceda con la validación
      // de lo contrario, un mensaje de error es retornado
      if (username && password && role) {
        // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
        // de lo contrario, un mensaje de error es retornado
        if (
          username === mockedUsername &&
          btoa(password) === mockedPassword &&
          role === mockedRole
        ) {
          // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
          let token = jwt.sign({ username: username }, config.secret, {
            expiresIn: "24h",
          });

          // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
          res.json({
            success: true,
            message: "Authentication successful!",
            token: token,
          });
        } else {
          // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
          res.send(403).json({
            success: false,
            message: "Incorrect username or password",
          });
        }
      } else {
        // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
        res.send(400).json({
          success: false,
          message: "Authentication failed! Please check the request",
        });
      }
    });

    // Traigo el usuario y la contraseña de la base de datos
  }

  index(req, res) {
    // Retorna una respuesta exitosa con previa validación del token
    res.json({
      success: true,
      message: "Index page",
    });
  }
}

module.exports = HandlerGenerator;
