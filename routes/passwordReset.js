const express = require("express");
const router = express.Router()
const {forgotpassword, resetpassword} = require("../controllers/passwordReset")


router.post("/forgot-password", forgotpassword)
router.post("/reset-password/:id/:token", resetpassword)


module.exports = router