var express = require("express");
const Joi = require("joi");
//const movie = require("../controllers/movieSQL");
const Movie = require("../models/movie");

const User = require("../models/user");

var router = express.Router();

var HandlerGenerator = require("../handlegenerator.js");
var middleware = require("../middleware.js");

HandlerGenerator = new HandlerGenerator();

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
});

router.get("/movies", middleware.checkToken, function (req, res, next) {
  Movie.findAll().then((movies) => {
    console.log("Movies", movies);
    res.send(movies);
  });
});

router.get("/users", function (req, res, next) {
  User.findAll().then((users) => {
    console.log("Movies", users);
    console.log("Llega");
    res.send(users);
  });
});

router.get("/movies/:id",middleware.checkToken, function (req, res, next) {
  Movie.findByPk(req.params.id).then((movie) => {
    console.log("Movies", movie);
    if (movie === null) {
      res.status(404).send("La película con el id no existe");
    }
    res.send(movie);
  });
});

router.get("/users/:id", function (req, res, next) {
  User.findByPk(req.params.id).then((user) => {
    console.log("User", user);
    if (user === null) {
      res.status(404).send("El usuario con ese ID no existe");
    }
    res.send(user);
  });
});

router.post("/movies",middleware.checkToken, function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(404).send(error);
  }

  Movie.create({
    name: req.body.name,
  }).then((result) => {
    res.send(result);
  });
});

router.post("/users", function (req, res, next) {
  console.log(req.body);
  User.create({
    username: req.body.username,
    password: btoa(req.body.password),
    role: req.body.role,
  }).then((result) => {
    res.send(result);
  });
});

router.put("/movies/:id",middleware.checkToken, function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(404).send(error);
  }

  Movie.update(req.body, { where: { id: req.params.id } }).then((movie) => {
    console.log("movie", movie);
    if (movie.matchedCount === 0) {
      return res.status(404).send("La película con el id no existe");
    }
    res.send("Película actualizada bichoexitósamente");
  });
});

router.put("/users/:id", function (req, res, next) {
  User.update(req.body, { where: { id: req.params.id } }).then((user) => {
    console.log("movie", user);
    if (user.matchedCount === 0) {
      return res.status(404).send("El user no ha sido encontrado");
    }
    res.send("Usuario actualizado bichoexitósamente");
  });
});

router.delete("/movies/:id",middleware.checkToken, function (req, res, next) {
  Movie.destroy({ where: { id: req.params.id } }).then((result) => {
    if (result === 0) {
      res.status(404).send("La bichopelícula que buscas no está disponible.");
    } else {
      res.status(204).send();
    }
  });
});

router.delete("/users/:id", middleware.checkToken,function (req, res, next) {
  User.destroy({ where: { id: req.params.id } }).then((result) => {
    if (result === 0) {
      res.status(404).send("La bichopelícula que buscas no está disponible.");
    } else {
      res.status(204).send();
    }
  });
});

/* GET home page. */
router.post("/login", HandlerGenerator.login);

router.get("/", middleware.checkToken, HandlerGenerator.index);

module.exports = router;
