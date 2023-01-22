//Import des dépendances
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var params = require("./params/params");
const morgan = require('morgan');
const winston = require('./params/log');
var cors = require("cors");
const helmet = require("helmet");
const https = require('https');
const fs = require('fs');
var auth = require("./auth/auth")

// Configuration HTTPS
const options = {
  cert: fs.readFileSync('./certs/https/fullchain.pem'),
  key: fs.readFileSync('./certs/https/privkey.pem')
};

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
  
app.use(cors({
  origin: ['https://domautonomy.one', 'https://192.168.0.150'],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization','x-access-token','Access-Control-Allow-Origin']
}))

// routes
app.use("/api", require("./routes"));

//lancement du serveur
const server = https.createServer(options, app).listen(port);

// WebSocket Serveur
const io = require('socket.io')(server);

io.on('connection', auth.verifyToken, (socket) => {
  console.log(socket.id)

  socket.on('message', data => {
    socket.broadcast.emit('message:received', data)
  })

});

module.exports = app