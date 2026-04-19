const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
  title: String,
  artist: String,
  year: Number,
  category: String,
  imageUrl: String,
  price: Number
});

module.exports = mongoose.model("Artwork", artworkSchema);