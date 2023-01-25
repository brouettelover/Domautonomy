const transporter = require('../params/mail')
const winston = require('../params/log');

exports.sendNewPasswordEmail =  (email, motdepasse) => {}
exports.sendRegisterMail = (email, username) => {}
exports.sendAlarmTemperatureMail = (email, temperature) => {}
exports.sendAlarmLockerMail = (email) => {}
exports.sendWaterMail = (email) => {}

//Envoie d'un nouveau mot de passe
exports.sendNewPasswordEmail = (email, motdepasse) => {
    transporter.sendMail({
        from: '"Reinitialisation mot de passe" <project.autonomy.app@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Reinitialisation du mot de passe", // Subject line
        text: "votre nouveau mot de passe est le : " + motdepasse, // plain text body
        html: "votre nouveau mot de passe est le : " + motdepasse, // html body
    }).then(info => {
        winston.info({info});
    }).catch(console.error);
}

exports.sendRegisterMail = (email, username) => {
    transporter.sendMail({
        from: '"Project autonomy" <project.autonomy.app@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Bienvenue sur project autonomy", // Subject line
        text: "Bienvenue sur l'application " + username, // plain text body
        html: "Bienvenue sur l'application " + username, // html body
    }).then(info => {
        winston.info({info});
    }).catch(console.error);

}

exports.sendAlarmTemperatureMail = (email, temperature) => {
    transporter.sendMail({
        from: '"Project autonomy" <project.autonomy.app@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Alarme Température détecté sur le Frigo", // Subject line
        text: "La température détecté à déclenché l'alarme. Température :" + temperature, // plain text body
        html: "La température détecté à déclenché l'alarme. Température :" + temperature, // html body
    }).then(info => {
        winston.info({info});
    }).catch(console.error);
}

exports.sendAlarmLockerMail = (email) => {
    transporter.sendMail({
        from: '"Project autonomy" <project.autonomy.app@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Alarme RFID détecté sur le Frigo", // Subject line
        text: "Trop de tentatives ont été réalisé sur le verrou du frigo", // plain text body
        html: "Trop de tentatives ont été réalisé sur le verrou du frigo", // html body
    }).then(info => {
        winston.info({info});
    }).catch(console.error);
}

exports.sendWaterMail = (email) => {
    transporter.sendMail({
        from: '"Project autonomy" <project.autonomy.app@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Alarme RFID détecté sur le Frigo", // Subject line
        text: "Il n'y a plus assez d'eau dans le système d'arrosage", // plain text body
        html: "Il n'y a plus assez d'eau dans le système d'arrosage", // html body
    }).then(info => {
        winston.info({info});
    }).catch(console.error);
}