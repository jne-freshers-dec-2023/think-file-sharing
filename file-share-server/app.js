const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const docRoutes = require("./routes/document");
const downloadRoutes = require("./routes/download");
const multer = require("multer");

const app = express();
const PORT = 3000;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
        )
      );
    }
    cb(undefined, true); // continue with upload
  },
});

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.use("/api/feed", upload.single("file"), docRoutes);

app.use("/api/download", downloadRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect("mongodb://localhost:27017/file-sharing")
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
