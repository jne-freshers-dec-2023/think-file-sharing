import prisma from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const uploadDoc = async (req, res, next) => {
  try {
    // Extracted from the request
    const { originalname, mimetype, size, buffer } = req.file;

    // Assuming req.userId is available from authentication middleware
    const newDocument = await prisma.document.create({
      data: {
        docName: originalname,
        docType: mimetype,
        docSize: size,
        docContent: buffer,
        owner: req.userId,
      },
    });

    res.status(201).json({
      message: "File uploaded successfully",
      docId: newDocument.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const downloadDocs = async (req, res, next) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(req.params.docId) },
    });

    if (!document) {
      return res.status(404).json({ error: "File not found" });
    }

    res.setHeader("Content-Type", document.docType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${document.docName}`
    );
    res.send(document.docContent);

    // If you want to stream content, you can use the following:
    // const fileStream = new Readable();
    // fileStream.push(Buffer.from(document.docContent, "base64"));
    // fileStream.push(null);
    // fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteDoc = async (req, res, next) => {
  try {
    const docId = Number(req.params.docId);

    // Assuming req.userId is available from authentication middleware
    const doc = await prisma.document.findUnique({
      where: { id: docId },
    });

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    if (doc.owner !== req.userId) {
      return res.status(403).json({ error: "Not Authorized" });
    }

    await prisma.document.delete({
      where: { id: docId },
    });

    res.status(200).json({ message: "Document is deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDocs = async (req, res, next) => {
  try {
    const searchTerm = req.query.docName;
    const query = searchTerm
      ? {
          where: {
            owner: req.userId,
            docName: { contains: searchTerm, mode: "insensitive" },
          },
        }
      : { where: { owner: req.userId } };

    const docs = await prisma.document.findMany(query);

    res.status(200).json({
      message: "Fetched All Documents successfully.",
      data: {
        docs: docs.map((doc) => ({
          docId: doc.id,
          docName: doc.docName,
        })),
        statusCode: 200,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const generateDocLink = async (req, res, next) => {
  try {
    const { docId } = req.query;
    const document = await prisma.document.findUnique({
      where: { id: Number(docId) },
    });

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

    const newLink = await prisma.link.create({
      data: {
        documentId: docId,
        token: token,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        createdAt: new Date(Date.now()),
        isVisited: false,
      },
    });

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
  