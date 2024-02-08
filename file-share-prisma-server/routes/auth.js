import express from "express";
import { register, login } from "../controllers/auth.js";
const { registerValidation } = require("../validations/register");

const router = express.Router();

router.post("/register", registerValidation, register);

router.post("/login", login);

export default router;
