const { body } = require("express-validator/check");
const User = require("../models/user");

const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid Email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email is already in use.");
        }
      });
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters."),
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username cannot be empty."),
];


module.exports = { registerValidation };
