const express = require("express");
const dashboardController = require("../controllers/dashboard");
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/user-info", dashboardController.getUserInfo);

module.exports = router;
