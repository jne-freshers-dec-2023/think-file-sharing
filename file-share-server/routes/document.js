const express = require("express");
const { body } = require("express-validator/check");
const { postValidation } = require("../validations/file");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// router.use(isAuth)
router.get("/docs", feedController.getPosts);

router.put("/doc/:docId", feedController.updatePost);

router.delete("/doc/:docId", isAuth, feedController.deletePost);

module.exports = router;
