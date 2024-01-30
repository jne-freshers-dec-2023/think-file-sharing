const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error("Not Authenticated.");
    error.status = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  console.log(token);
  let decodedToken;
  try {
    console.log(process.env.SECRETE_KEY);
    decodedToken = jwt.verify(token, process.env.SECRETE_KEY); // decode + verify
  } catch (err) {
    err.status = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not Autheticated.");
    error.statusCode = 401;
    throw error;
  }
  console.log(decodedToken.userId);
  req.userId = decodedToken.userId;
  next();
};
