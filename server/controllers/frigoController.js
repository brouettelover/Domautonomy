const fs = require('fs');
const mqtt = require('mqtt');
const transporter = require('../params/mail')
const winston = require('../params/log');
const User = require("../models/User");
const validator = require('validator');


exports.OpenTheCase = async (req, res) => {}
exports.AddCard = async (req, res) => {}
exports.AddAlarm = async (req, res) => {}
exports.TemperatureData = async () => {}
exports.HumidityData = async () => {}

const options = {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
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

let TempMin = -15
let TempMax = 15
let HumidityMax = 95
exports.AddAlarmTempHum = async (req, res) => {
    try {
        TempMin = validator.escape(req.body.TempMin);
        TempMax = validator.escape(req.body.TempMax);
        HumidityMax = validator.escape(req.body.HumidityMax);
        res.status(200).json({'TempMin': TempMin, 'TempMax': TempMax, 'HumidityMax': HumidityMax})
    } catch (e) {
        console.error(e)
        res.status(400).json({ "error": e });
    }
}
exports.TemperatureData = () => {
    return new Promise((resolve, reject) => {
        client.subscribe('temperature');
        client.once('message', (topic, message, packet) => {
            if (topic !== "temperature") { return }
            let temperatureData = message.toString('ascii');
            client.unsubscribe('temperature');
            if(temperatureData >= TempMax || temperatureData <= TempMin){
                transporter.sendAlarmTemperatureMail(User.mail, temperatureData)
            }
            resolve(temperatureData);
        });
    });
}
exports.HumidityData = () => {
    return new Promise((resolve, reject) => {
        client.subscribe('humidity');
        client.once('message', (topic, message, packet) => {
            if (topic !== "humidity") { return }
            let humidityData = message.toString('ascii');
            client.unsubscribe('humidity');
            if(humidityData >= HumidityMax){
                transporter.sendAlarmHumidityMail(User.mail, humidityData)
            }
            resolve(humidityData);
        });
    });
}
exports.SendAlarmMail = async () => {
    client.subscribe('RFID');
    client.on('message', (topic, message, packet) => {
        if (topic !== "RFID") { return }
        let RFIDData = message.toString('ascii')
        if (RFIDData === 'alarm'){
            SendEmailEvery24H()
        }
        client.unsubscribe('RFID')
        return
    });
}

// Function to be executed every 24 hours
function SendEmailEvery24H() {
    transporter.SendAlarmLockerMail(User.mail)
    setTimeout(repeatAction, 24 * 60 * 60 * 1000);
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
