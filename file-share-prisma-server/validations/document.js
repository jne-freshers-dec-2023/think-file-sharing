const { body } = require("express-validator/check");

const docsValidation = [
  body("docName", "Doc Name should not be Empty").not().isEmpty(),
  body("docContent", "Document content should not be Empty").not().isEmpty(),
];

module.exports = { docsValidation };
