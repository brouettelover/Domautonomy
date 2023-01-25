const fs = require('fs');
const mqtt = require('mqtt');
const mailController = require("./mailController");
const winston = require('../params/log');
const User = require("../models/User");
const AlarmTempHum = require("../models/AlarmTempHum")
const validator = require('validator');


exports.OpenTheCase = async (req, res) => {}
exports.AddCard = async (req, res) => {}
exports.AddAlarm = async (req, res) => {}
exports.TemperatureData = async () => {}
exports.HumidityData = async () => {}
exports.AlarmTempHum = async (req, res) => {}
exports.RemoveAlarmTempHum = async (req, res) => {}

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
exports.AddAlarmTempHum = async (req, res) => {
    let TempMin = validator.escape(req.body.TempMin)
    let TempMax = validator.escape(req.body.TempMax)
    let HumidityMax = validator.escape(req.body.HumidityMax)

    try {
        const alarmtemphum = new AlarmTempHum({
            TempMin: TempMin,
            TempMax: TempMax,
            HumidityMax: HumidityMax
        })
        let data = await alarmtemphum.save()
        res.status(200).json({'TempMin': TempMin, 'TempMax': TempMax, 'HumidityMax': HumidityMax})
    } catch (e) {
        console.error(e)
        res.status(400).json({ "error": e });
    }
}
exports.AlarmTempHum = async (req, res) => {
    try{
        AlarmTempHum.find({}, (err, alarms) => {
            let tempMins = alarms.map(alarm => alarm.TempMin);
            let tempMax = alarms.map(alarm => alarm.TempMax);
            let humidityMax = alarms.map(alarm => alarm.HumidityMax);
            res.status(200).json({'TempMin': tempMins, 'TempMax': tempMax, 'HumidityMax': humidityMax})
        })
    } catch (e) {
            res.status(400).json({'error':e})
    }
}
exports.RemoveAlarmTempHum = async (req, res) => {
    try{
        let TempMinAlarm = req.body.TempMin
        await AlarmTempHum.deleteOne({'TempMin': TempMinAlarm });
        res.status(200).json({'AlarmIsRemoved': true})
        res.status(400).json({'error': e})
    } catch (e) {
        res.status(400).json({'error': e})
    }
}
exports.TemperatureData = () => {
    return new Promise((resolve, reject) => {
        client.subscribe('temperature');
        client.once('message', (topic, message, packet) => {
            if (topic !== "temperature") { return }
            let temperatureData = message.toString('ascii');
            client.unsubscribe('temperature');
            AlarmTempHum.find({}, (err, alarms) => {
                User.find({}, (err,users) => {
                if(temperatureData >= alarms.TempMax || temperatureData <= alarms.TempMin){
                    mailController.sendAlarmTemperatureMail(users.mail, temperatureData)
                    }
                })
            })
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
            AlarmTempHum.find({}, (err, alarms) => {
                User.find({}, (err,users) => {
                    if(humidityData >= alarms.HumidityMax){
                        mailController.sendAlarmHumidityMail(users.mail, humidityData)
                    }
                })
            })
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
