const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
    return cb(
      new Error(
        "Only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5000000, // max file size 5MB
  },
  fileFilter,
});

const fileUploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(422).json({
        message: "File upload failed.",
        data: err.message,
        statusCode: 422,
      });
    } else if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        data: err.message,
        statusCode: 500,
      });
    }
    next();
  });
};

module.exports = fileUploadMiddleware;
