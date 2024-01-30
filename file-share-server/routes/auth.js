const express = require("express");
const authController = require("../controllers/auth");
const { registerValidation } = require("../validations/register");

const router = express.Router();

router.post("/register", registerValidation, authController.register);

router.post("/login", authController.login);

module.exports = router;
