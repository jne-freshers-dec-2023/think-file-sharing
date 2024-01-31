const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docTokenSchema = new Schema({
  documentId: {
    type: String,
    required: true,
  },

  token: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: String,
    required: true,
  },

  createdAt: {
    type: String,
    required: true,
  },

  isVisited: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("DocToken", docTokenSchema);
