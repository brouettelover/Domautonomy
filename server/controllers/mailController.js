const transporter = require('../params/mail')
const winston = require('../params/log');

//Envoie d'un nouveau mot de passe
exports.sendNewPasswordEmail = function sendlostmailed(email, motdepasse){
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

exports.sendRegisterMail = function sendregistermailed(email, username){
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
