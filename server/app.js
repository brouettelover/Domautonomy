//Import des dépendances
var express = require("express");
var mongoose = require("mongoose");
var params = require("./params/params");
const morgan = require('morgan');
const winston = require('./params/log');
var cors = require("cors");
const helmet = require("helmet");
const https = require('https');
const fs = require('fs');
var auth = require("./auth/auth")
const frigoController = require("./controllers/frigoController")

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
    console.log(params.DATABASECONNECTION)
    console.error(err)
  });
  
app.use(cors({
  origin: ['https://domautonomy.one', 'https://192.168.0.150', 'https://127.0.0.1','https://192.168.0.100'],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization','x-access-token','Access-Control-Allow-Origin']
}))

// routes
app.use("/api", require("./routes"));

//lancement du serveur
const server = https.createServer(options, app);

// WebSocket Serveur
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', async (socket) => {
  console.log("user is on")
  temperature = await frigoController.TemperatureData();
  humidity = await frigoController.HumidityData();
  io.emit('temperature', 'temperature');
  io.emit('humidity', 'humidity');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
});

server.listen(port), () => {
  console.log("Server listenning on " + port);
}



module.exports = app