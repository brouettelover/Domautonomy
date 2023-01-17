var express = require("express");
var auth = require("../auth/auth")

var router = express.Router();

const userController = require("../controllers/userController");

router.post("/register", userController.registerNewUser);
router.post("/remove", userController.removeUser);
router.post("/login", userController.loginUser);
router.put("/lost", userController.lostUser);
router.post("/modify", auth.verifyToken, userController.getUserDetails);
router.get("/me", auth.verifyToken, userController.getUserDetails);
router.get("/isOn", async (req, res) => {
    res.status(200).json({'health':'ok'})
});

module.exports = router;