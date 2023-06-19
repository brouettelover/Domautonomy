const fs = require('fs');
const mqtt = require('mqtt');
const mailController = require("./mailController");
const winston = require('../params/log');
const User = require("../models/User");
const validator = require('validator');


exports.AddDuree = async (req, res) => {}
exports.AddDelai = async (req, res) => {}
exports.AddActivation = async (req, res) => {}

const options = {
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    clean: true,
    key: fs.readFileSync('./certs/mqtt_cert/client_node.key'),
    cert: fs.readFileSync('./certs/mqtt_cert/client_node.crt'),
    ca: [ fs.readFileSync('./certs/mqtt_cert/ca.crt') ]
  }

const client = mqtt.connect('mqtts://localhost:8883', options);

exports.AddDelai = async (req, res) => {
    try {
        let delai = validator.escape(req.body.delai)
        client.publish('pompe/arrosage/temps', delai);
        res.status(200).json({ 'delai':"delai will be added" });
    }
    catch(e){
        res.status(200).json({ 'state':"something went wrong" });
    }
}
exports.AddDuree = async (req, res) => {
    try {
        let duree = validator.escape(req.body.duree)
        client.publish('pompe/arrosage/duree', duree);
        res.status(200).json({ 'duree':"duree will be added" });
    }
    catch(e){
        res.status(200).json({ 'state':"something went wrong" });
    }
}
exports.AddActivation = async (req, res) => {
    try {
        let activation = validator.escape(req.body.activation)
        client.publish('pompe/arrosage/activation', activation);
        res.status(200).json({ 'Activation':"Sending time on" });
    }
    catch(e){
        res.status(200).json({ 'state':"something went wrong" });
    }
}

exports.LevelFlotteur = () => {
    return new Promise((resolve, reject) => {
        client.subscribe('pompe/flotteur');
        client.once('message', (topic, message, packet) => {
            if (topic !== "pompe/flotteur") { return }
            let flotteurData = message.toString('ascii');
            client.unsubscribe('pompe/flotteur');
            AlarmTempHum.find({}, (err, alarms) => {
                User.find({}, (err,users) => {
                if(flotteurData){
                    mailController.sendAlarmFlotteur(users.mail)
                    }
                })
            })
            resolve(temperatureData);
        });
    });
}