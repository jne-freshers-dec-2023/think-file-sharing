const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use("/auth", authRoutes);   

mongoose
  .connect("mongodb://localhost:27017/file-sharing")
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
