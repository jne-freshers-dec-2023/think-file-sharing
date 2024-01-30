const express = require("express");
const authController = require("../controllers/auth");
const { signUpValidation } = require("../validations/register");

const router = express.Router();

router.post("/register", authController.signUp);

router.post("/login", authController.login);

router.post("/logout", authController.login);

module.exports = router;
