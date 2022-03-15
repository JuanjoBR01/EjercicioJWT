const sequelize = require("../lib/sequelize");
const ObjectID = require("sequelize").ObjectId;

function getMovies() {
  return sequelize.then((client) => {
    return client.db("prueba").collection("movies").find({}).toArray();
  });
}

function getMovie(id) {
  return sequelize.then((client) => {
    return client
      .db("prueba")
      .collection("movies")
      .findOne({ _id: new ObjectID(id) });
  });
}

function createMovie(movie) {
  return sequelize.then((client) => {
    return client.db("prueba").collection("movies").insertOne(movie);
  });
}

function updateMovie(id, movie) {
  return sequelize.then((client) => {
    return client
      .db("prueba")
      .collection("movies")
      .updateOne({ _id: new ObjectID(id) }, { $set: movie });
  });
}

function deleteMovie(id) {
  return sequelize.then((client) => {
    return client
      .db("prueba")
      .collection("movies")
      .deleteOne({ _id: new ObjectID(id) });
  });
}

const movie = { getMovies, getMovie, createMovie, updateMovie, deleteMovie };

module.exports = movie;
