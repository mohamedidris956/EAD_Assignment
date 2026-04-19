const Purchase = require("../models/Purchase");

// CREATE purchase
exports.createPurchase = async (req, res) => {
  try {
    const { userId, artworkId } = req.body;

    const purchase = new Purchase({
      userId,
      artworkId
    });

    const saved = await purchase.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET purchases by user
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.params.userId
    });

    res.json(purchases);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};