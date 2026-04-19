const express = require("express");
const router = express.Router();

const {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork
} = require("../controllers/artworkController");

// routes
router.get("/", getArtworks);
router.get("/:id", getArtworkById);
router.post("/", createArtwork);
router.put("/:id", updateArtwork);
router.delete("/:id", deleteArtwork);

module.exports = router;