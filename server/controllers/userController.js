const { type } = require("jquery");
const User = require("../models/User");
const mailController = require("./mailController");
const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const winston = require('../params/log');
const redisClient = redis.createClient({
  enable_offline_queue: false,
});
const validator = require('validator');
const { sendMail } = require("../params/mail");
const { cp } = require("fs");

//Interdit les attaques par bruteforce
const maxWrongAttemptsByIPperDay = 500;
const maxConsecutiveFailsByUsernameAndIP = 100;

const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

async function loginRoute(req, res) {
  const ipAddr = req.ip;
  const usernameIPkey = getUsernameIPkey(req.body.email, ipAddr);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);

  let retrySecs = 0;

  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs));
    res.status(429).send('Too Many Requests');
    winston.err({ip: "Too Many Requests"}) //loging the ip of the potential
  } else {
    const user = authorise(req.body.email, req.body.password); // should be implemented in your project
    if (!user.isLoggedIn) {
      // Consume 1 point from limiters on wrong attempt and block if limits reached
      try {
        const promises = [limiterSlowBruteByIP.consume(ipAddr)];
        if (user.exists) {
          // Count failed attempts by Username + IP only for registered users
          promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
        }

        await Promise.all(promises);

        res.status(400).end('email or password is wrong');
      } catch (rlRejected) {
        if (rlRejected instanceof Error) {
          throw rlRejected;
        } else {
          res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
          res.status(429).send('Too Many Requests');
        }
      }
    }

    if (user.isLoggedIn) {
      if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
        // Reset on successful authorisation
        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
      }

      res.end('authorized');
    }
  }
}


exports.registerNewUser = async (req, res) => {};
exports.loginUser = async (req, res) => {};
exports.getUserDetails = async (req, res) => {};
exports.removeUser = async (req, res) => {};

//méthode d'enregistrement d'un utilisateur
exports.registerNewUser = async (req, res) => {
    const email = validator.escape(req.body.email)
    const username = validator.escape(req.body.name)
    const password = validator.escape(req.body.password)

    validate_register(email, username, res)
    try {
      const user = new User({
        name: username,
        email: email,
        password: password,
        type: "utilisateur"
      });
      let data = await user.save();
      const token = await user.generateAuthToken(); // Génère un token d'authentification
      mailController.sendRegisterMail(email, username) //envoie d'un mail de bienvenue
      res.status(201).json({ data, token });
    } catch (err) {
      console.log(err)
      winston.error(err)
      res.status(400).json({ err: err });
    }
  };

//méthode de login d'un utilisateur
exports.loginUser = async (req, res) => {
    try {
      const email = validator.escape(req.body.email);
      const password = validator.escape(req.body.password);
      const user = await User.findByCredentials(email, password);
      if (typeof user !== "object") {
        return res.status(401).json({ error: user });
      }
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token });
    } catch (err) {
      //winston.error(err)
      res.status(400).json({ "error": err });
    }
  };

//méthode de réinitialisation de mot de passe
exports.lostUser = async (req,res) => {
  try {
    const email = validator.escape(req.body.email);
    const name = validator.escape(req.body.name);

    var userDetails = await User.findByEmail(email, name); //Trouve un utilisateur dans la base de données
    if(Object.keys(userDetails).length === 0){
      return res.status(401).json({ "err": "Pas d'utilisateur trouvé dans la base de données"})
    }
    
    var newPassword = genPassword();
    console.log(newPassword)
    //Update du mot de passe
    const user = await User.findById(userDetails[0]._id); //cherche l'utilisateur ayant fourni l'email et le username
    user.password = newPassword //Change l'ancien mot de passe avec le nouveau
    try {
      let saveUser = await user.save(); //Sauvegarde les changements dans la db (le mot de passe est hashé et salé à la sauvegarde)
      mailController.sendNewPasswordEmail(userDetails[0].email, newPassword)
      res.status(200).json({'passwordIsUpdated':true})
    } 
    catch (err) {
      winston.log('error', err);
      res.status(500).send(err);
    }
  } catch (err) {
    winston.log('error', err);
    res.status(400).json({ err: err})
  }
}

//Supprime l'utilisateur avec son username et son mdp
exports.removeUser = async (req,res) => {
  try {
    const password = validator.escape(req.body.password);
    const email = validator.escape(req.body.email);
    var userDetails = await User.findByCredentials(email, password);
    if(Object.keys(userDetails).length === 0){
      return res.status(401).json({ "err": "Pas d'utilisateur trouvé dans la base de données"})
    }

    try {
      await User.deleteOne({'email': email});
      res.status(200).json({'UserIsRemoved': true})
    } 
    catch (err) {
      winston.log('error', "no id found");
      res.status(500).send(err);
    }
  } catch (err) {
    winston.log('error', err);
    res.status(400).json({ err: err})
  }
}
//Détails de l'utilisateur connecté
  exports.getUserDetails = async (req, res) => {
    const token = validator.escape(req.headers["x-access-token"])
    var userDetails = await User.findByToken(token);
    if(Object.keys(userDetails).length === 0){ 
      return res.status(401).json({ "err": "Pas d'utilisateur trouvé dans la base de données"})
    } else {
      res.status(201).json({ userDetails})
    }
  };

//check si le mail et l'username sont du bon format
function validate_register(mail, username, res){
    if(!mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
        return res.send({"err": "mail non valide"})
    }
    else if (!username.match(/^(?=[a-z]).{4,}/g)){
        return res.send({"err":"username invalide"})
    }
}

//générateur de mot de passe
function genPassword() {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = 12;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber +1);
  }
  return password;
}