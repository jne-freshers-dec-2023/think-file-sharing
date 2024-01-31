const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    docName: {
      type: String,
      required: true,
    },
    docContent: {
      type: Buffer,
      required: true,
    },
    docSize: {
      type: Number,
      required: true,
    },
    docType: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
