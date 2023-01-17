const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secret = process.env.SECRET

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
        
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;