const express = require("express");
const downloadController = require("../controllers/download");
const { registerValidation } = require("../validations/register");

const router = express.Router();

router.get("/:token", downloadController.downloadSharedDocs);

// module.exports = router;
export default router;
