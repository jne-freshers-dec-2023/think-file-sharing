const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const docRoutes = require("./routes/document");
const downloadRoutes = require("./routes/download");
const multer = require("multer");
const cors = require("cors");
const fileUploadMiddleware = require("./middleware/fileUploadMiddleware");

const app = express();
const PORT = 3200;

app.use(cors());

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 5000000, 
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
//       return cb(
//         new Error(
//           "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
//         )
//       );
//     }
//     cb(undefined, true); // continue with upload
//   },
// });

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

// app.use("/api/feed", upload.single("file"), docRoutes);
app.use("/api/feed", fileUploadMiddleware, docRoutes);

app.use("/api/download", downloadRoutes);

app.use((error, req, res, next) => {
  console.log("Error: ", error)
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  const data = error.data || null;
  res.status(status).json({
    message,
    data,
    statusCode: status,
  });
});
mongoose
  .connect("mongodb+srv://jayesh974:Thinkitive123@atlascluster.hmtdvqn.mongodb.net/")
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
