const express = require("express");
const isAuth = require("../middleware/is-auth");
const docController = require("../controllers/document");
const { docsValidation } = require("../validations/document");

const router = express.Router();

router.use(isAuth);

router.post("/upload", docsValidation, docController.uploadDoc);

router.get("/docs", docController.getDocs);

router.get("/download/:docId", docController.downloadDocs);

router.delete("/:docId", docController.deleteDoc);

router.get("/generate-link", docController.genarateDocLink);

module.exports = router;
