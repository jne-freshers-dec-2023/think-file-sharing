const User = require("../models/user");
const Link = require("../models/docToken");
const { validationResult } = require("express-validator/check");
const Document = require("../models/document");
const { Readable } = require("stream");
const jwt = require("jsonwebtoken");

exports.uploadDoc = async (req, res, next) => {
  const errors = validationResult(req.file);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  try {
    const { originalname, mimetype, size, buffer } = req.file;

    const newDocument = new Document({
      docName: originalname,
      docType: mimetype,
      docSize: size,
      docContent: buffer,
      owner: req.userId,
    });

    newDocument
      .save()
      .then((result) => {
        return User.findById(req.userId);
      })
      .then((user) => {
        owner = user;
        user.docs.push(newDocument);
        return user.save();
      })
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "File uploaded successfully",
          docId: newDocument._id,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.downloadDocs = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.docId);

    if (!document) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", document.docType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.docName}`
    );

    const fileStream = new Readable();
    fileStream.push(Buffer.from(document.docContent, "base64"));
    fileStream.push(null);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteDoc = (req, res, next) => {
  try {
    const docId = req.params.docId;
    Document.findById(docId)
      .then((doc) => {
        if (!doc) {
          const error = new Error("Could not fing post.");
          error.statusCode = 404;
          throw error;
        }

        if (doc.owner.toString() !== req.userId) {
          const error = new Error("Not Authorized.");
          error.status = 403;
          return error;
        }
        return Document.deleteOne({ _id: docId });
      })
      .then((result) => {
        return User.findById(req.userId);
      })
      .then((user) => {
        console.log("docId delete api", docId);
        console.log(user.docs.pull(docId));
        return user.save();
      })
      .then((result) => {
        console.log(result);
        res.status(200).json({ message: "Document is deleted Successfully." });
      });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDocs = (req, res, next) => {
  Document.find({ owner: req.userId })
    .then((docs) => {
      res.status(200).json({
        message: "Fetched All Documents successfully.",
        data: {
          docs: docs.map((doc) => ({
            docId: doc._id,
            docName: doc.docName,
          })),
          statusCode: 200,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.genarateDocLink = async (req, res, next) => {
  try {
    const { docId } = req.query;
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const token = jwt.sign(
      { docId },
      "secret-key",
      {
        expiresIn: 2 * 60,
      },
      { algorithm: "HS256" }
    );

    const newLink = new Link({
      documentId: docId,
      token: token,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // Convert minutes to milliseconds
      createdAt: new Date(Date.now()),
      isVisited: false,
    });

    await newLink.save();
    const url = req.get("host");

    res.status(201).json({
      message: "Link generated successfully",
      data: {
        link: `${req.protocol}://${req.get("host")}/api/download/${token}`,
        expiresAt: newLink.expiresAt,
      },
      statusCode: 201,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
