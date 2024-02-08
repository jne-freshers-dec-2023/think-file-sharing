import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// import authRoutes from './routes/auth.js';
import authRoutes from './routes/auth.js';
import docRoutes from './routes/document.js';
import downloadRoutes from './routes/download.js';
import multer from 'multer';
import cors from 'cors';
import fileUploadMiddleware from './middleware/fileUploadMiddleware.js';
import dotenv from 'dotenv';
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

// mongoose.connect(process.env.MONGODB_URL)
//   .then(() => {
//     app.listen(3200, () => {
//       console.log(`Server is listening on port : ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => console.log("Error in catch", err));

app.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT  ${process.env.PORT}`)
);
