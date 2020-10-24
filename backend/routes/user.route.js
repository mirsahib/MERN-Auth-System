const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller");
const authCtrl = require("../middleware/auth");

router.route("/").get(authCtrl, userCtrl.getUserId);
router.route("/auth").get(userCtrl.isTokenValid);
router.route("/register").post(userCtrl.userRegistration);
router.route("/login").post(userCtrl.userLogin);

module.exports = router;
