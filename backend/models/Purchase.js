const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  artworkId: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Purchase", purchaseSchema);