//Import des dépendances
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var params = require("./params/params");
const morgan = require('morgan');
const winston = require('./params/log');
var cors = require("cors");
const helmet = require("helmet");
const { Server } = require('socket.io')
const http = require('http')

// Configuration du port de l'api
var port = process.env.PORT;

//Création du serveur
const app = express();

//Sécurise les headers HTTP
app.use(helmet());
//limite la taille des requêtes json
app.use(express.json({ limit: "1kb" }));
app.use(express.json())

//Utilisation d'un logger middleware
app.use(morgan('combined', { stream: winston.stream }));
winston.info('App is starting');

//connection à la base de données
mongoose.set('strictQuery', false)
mongoose
  .connect(params.DATABASECONNECTION)
  .then(() => {
    winston.info("Database is connected")
  })
  .catch(err => {
    winston.err({ database_error: err})
  });
  
app.use(cors())

// routes
app.use("/api", require("./routes"));

//lancement du serveur
app.listen(port, "0.0.0.0", function () {
    console.log('App listening on port ' + port + '! Go to http:82.212.158.9/')
  })

module.exports = app