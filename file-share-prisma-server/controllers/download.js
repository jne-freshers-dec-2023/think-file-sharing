import prisma from "../DB/db.config.js";
import jwt from "jsonwebtoken";

export const downloadSharedDocs = async (req, res, next) => {
  try {
    const { token } = req.params;

    const decodedToken = jwt.verify(token, "secret-key");
    const { docId } = decodedToken;

    const docToken = await prisma.link.findFirst({
      where: { documentId: docId, token: token },
    });

    if (!docToken) {
      return res.status(403).json({ error: "Invalid token" });
    }

    if (docToken.isVisited === true) {
      return res.status(403).json({ error: "Link is expired" });
    }

    if (docToken.isVisited === false) {
      await prisma.link.update({
        where: { id: docToken.id },
        data: { isVisited: true },
      });
    }

    const document = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

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
