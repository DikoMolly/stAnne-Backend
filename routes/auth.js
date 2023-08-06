const express = require("express");
const router = express.Router()
const loginLimiter = require("../middleware/loginLimiter");
const { register, login } = require("../controllers/auth")

// router.route("/register").post(register)
// router.route("/login").post(login, loginLimiter)

router.post("/signup", register)
router.post("/login", loginLimiter, login)

module.exports = router