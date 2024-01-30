const { body } = require("express-validator/check");

const postValidation = [
  body("title").trim().isLength({ min: 5 }),
  // body("content").trim().isLength({ min: 5 }),
];

module.exports = { postValidation };
