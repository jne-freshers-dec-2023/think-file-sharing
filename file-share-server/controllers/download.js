const DocToken = require("../models/docToken");
const Document = require("../models/document");
const jwt = require("jsonwebtoken");

exports.downloadSharedDocs = async (req, res, next) => {
  try {
    const { token } = req.params;

    const decodedToken = jwt.verify(token, "secret-key");
    const { docId } = decodedToken;

    const docToken = await DocToken.findOne({ documentId: docId, token });

    if (docToken.isVisited === true) {
      return res.status(403).json({ error: "Link is expired" });
    }

    if (docToken.isVisited === false) {
      docToken.isVisited = true;
      await docToken.save();
    }

    const document = await Document.findById(docId);

    res.setHeader("Content-Type", document.docType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.docName}`
    );
    res.send(document.docContent);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(403).json({ error: "Link has expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(403).json({ error: "Invalid token" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
