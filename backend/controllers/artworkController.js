const Artwork = require("../models/Artwork");

// GET all artworks
exports.getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find().limit(100);
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET artwork by ID
exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE artwork
exports.createArtwork = async (req, res) => {
  try {
    const newArtwork = new Artwork(req.body);
    const saved = await newArtwork.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE artwork
exports.updateArtwork = async (req, res) => {
  try {
    const updated = await Artwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE artwork
exports.deleteArtwork = async (req, res) => {
  try {
    const deleted = await Artwork.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    res.json({ message: "Artwork deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};