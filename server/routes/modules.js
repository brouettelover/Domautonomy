var express = require("express");
var auth = require("../auth/auth")

var router = express.Router();

const frigoController = require("../controllers/frigoController");
const arroseurController = require("../controllers/arroseurController");

router.get("/frigo/open",auth.verifyToken, frigoController.OpenTheCase, )
router.get("/frigo/AddCard",auth.verifyToken, frigoController.AddCard)
router.post("/frigo/AddAlarmTempHum",auth.verifyToken, frigoController.AddAlarmTempHum)
router.get("/frigo/AlarmTempHum", auth.verifyToken, frigoController.AlarmTempHum)
router.post("/frigo/RemoveAlarmTempHum", auth.verifyToken, frigoController.RemoveAlarmTempHum)

router.post("/arroseur/delai", auth.verifyToken, arroseurController.AddDelai)
router.post("/arroseur/duree", auth.verifyToken, arroseurController.AddDuree)
router.post("/arroseur/activation", auth.verifyToken, arroseurController.AddActivation)

module.exports = router;