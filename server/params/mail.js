const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'project.autonomy.app@gmail.com',
      pass: process.env.PASSWORD_MAIL
    },
  });
  transporter.verify().then(console.log("Connecter à GMAIL : project.autonomy.app")).catch(console.error);

  module.exports = transporter;