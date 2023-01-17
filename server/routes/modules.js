var express = require("express");
var auth = require("../auth/auth")

var router = express.Router();

const frigoController = require("../controllers/frigoController");

router.get("/frigo/open",auth.verifyToken, frigoController.OpenTheCase, )
router.get("/frigo/AddCard",auth.verifyToken, frigoController.AddCard)
router.get("/frigo/Temperature",auth.verifyToken, frigoController.ShowCurrentTemperature)
router.get("/frigo/Humidity",auth.verifyToken, frigoController.ShowCurrentHumidity)

module.exports = router;