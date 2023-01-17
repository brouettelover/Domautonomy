var express = require("express");

var router = express.Router();

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    
    next();
});

router.use("/", require("./login"));
router.use("/root", require("./root"));
router.use("/modules",require("./modules"));

module.exports = router;