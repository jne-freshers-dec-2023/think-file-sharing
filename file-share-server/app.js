const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const docRoutes = require("./routes/document");
const downloadRoutes = require("./routes/download");
const multer = require("multer");
const cors = require("cors");
const fileUploadMiddleware = require("./middleware/fileUploadMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use("/api/feed", fileUploadMiddleware, docRoutes);

app.use("/api/download", downloadRoutes);

app.use((error, req, res, next) => {
  console.log("Error: ", error);
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data || null;
  res.status(status).json({
    message,
    data,
    statusCode: status,
  });
});
console.log("testtttt", process.env.MONGODB_URL);
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(3200, () => {
      console.log(`Server is listening on port : ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Error in catch", err));
