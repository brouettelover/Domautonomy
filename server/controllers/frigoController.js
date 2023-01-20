const fs = require('fs');
const mqtt = require('mqtt');
const transporter = require('../params/mail')
const winston = require('../params/log');
const User = require("../models/User");
const { cli } = require('winston/lib/winston/config');
const { time } = require('console');
// const io = require('../app');


exports.OpenTheCase = async (req, res) => {};
exports.AddCard = async (req, res) => {};
exports.ShowCurrentTemperature = async (req, res) => {};
exports.ShowCurrentHumidity = async (req, res) => {};
exports.SetAlarm = async (req, res) => {};
exports.AlarmIsOn = async (req, res) => {};

const options = {
    clientId: 'backendserver1032',
    key: fs.readFileSync('./certs/mqtt_cert/client.key'),
    cert: fs.readFileSync('./certs/mqtt_cert/client.crt'),
    ca: [ fs.readFileSync('./certs/mqtt_cert/ca.crt') ]
  }

const client = mqtt.connect('mqtts://localhost:8883', options);

exports.OpenTheCase = async (req, res) => {
    try {
        client.publish('RFID', 'RFID_OPEN');
        res.status(200).json({ 'case':"opened" });
    }
    catch(e){
        res.status(200).json({ 'state':"something went wrong" });
    }
}

exports.AddCard = async (req, res) => {
    try {
        client.publish('RFID', 'RFID_ADD');
        res.status(200).json({ 'card':"will be added" });
    }
    catch(e){
        res.status(200).json({ 'state':"something went wrong" });
    }
}
let temperatureData = null;
// Function to update temperatureData
function updateTemperatureData() {
    client.subscribe('temperature');
    client.on('message', (topic, message, packet) => {
        if (topic !== "temperature") { return }
        temperatureData = message.toString('ascii');
        client.unsubscribe('temperature');
    });
}
let humidityData = null;
function updateHumidityData() {
    client.subscribe('humidity');
    client.on('message', (topic, message, packet) => {
        if (topic !== "humidity") { return }
        humidityData = message.toString('ascii');
        client.unsubscribe('humidity');
    });
}

// Start interval to update temperatureData every 60 seconds
setInterval(updateTemperatureData, 1000);
setInterval(updateHumidityData, 1000);

exports.ShowCurrentTemperature = async (req, res) => {
    try {
        res.status(200).json({ 'temperature': temperatureData });
    }
    catch (e) {
        res.status(200).json({ 'state': "something went wrong" });
    }
    return
}

exports.ShowCurrentHumidity = async (req, res) => {
    try {
        res.status(200).json({ 'humidity': humidityData });
    }
    catch (e) {
        res.status(200).json({ 'state': "something went wrong" });
    }
    return
}

// exports.AlarmIsOn = async () => {
//     const currentTime = new Date();
//     try {
//         const client = mqtt.connect('mqtts://localhost:8883', options);
//         client.on('connect', () => {
//             console.log('Connected to MQTT server');
//             client.subscribe('RFID');
//           });
//         client.on('message', (message) => { 
//           if (message === "alarm") {
//             SendAlarmMail(email)
//           }
//         })
//     } catch(e) {
//         res.status(200).json({ 'state':"something went wrong" });
//     }
// }

// SendAlarmMail = () => {
//     User.find({}, { email: 1 }, (err, users) => {
//         if (err) {
//             transporter.sendMail({
//                 from: '"Une intrusion à été détecté" <project.autonomy.app@gmail.com>', // sender address
//                 to: email, // list of receivers
//                 subject: "Une intrusion à été détecté", // Subject line
//                 text: "L'alarme s'est enclenché à" + currentTime.toISOString() , // plain text body
//                 html: "L'alarme s'est enclenché à" + currentTime.toISOString(), // html body
//             }).then(info => {
//                 winston.info({info});
//             }).catch(console.error);
//         } else {
//             console.log(users);
//           }
//         });
// }
