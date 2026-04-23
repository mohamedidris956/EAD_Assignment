const Purchase = require("../models/Purchase");
const Artwork = require("../models/Artwork");
const User = require("../models/User");

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

// GET purchases with artwork details
exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      userId: req.params.userId
    });

    const result = await Promise.all(
      purchases.map(async (p) => {
        const artwork = await Artwork.findById(p.artworkId);

        return {
          _id: p._id,
          purchaseDate: p.purchaseDate,
          artworkTitle: artwork?.title || "Unknown",
          artworkArtist: artwork?.artist || "Unknown"
        };
      })
    );

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE purchases for one user
exports.deleteUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await Purchase.deleteMany({ userId });

    res.json({
      message: `Deleted ${deleted.deletedCount} purchase(s) for user ${userId}`,
      deletedCount: deleted.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET top users by purchase count
exports.getTopUsersStats = async (req, res) => {
  try {
    const [users, artworks, purchases] = await Promise.all([
      User.find().select("_id name email"),
      Artwork.find().select("_id price"),
      Purchase.find().select("userId artworkId")
    ]);

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    const artworkPriceMap = new Map(artworks.map((a) => [a._id.toString(), Number(a.price) || 0]));
    const statsMap = new Map();

    for (const purchase of purchases) {
      const key = String(purchase.userId);
      const existing = statsMap.get(key) || { purchaseCount: 0, totalSpent: 0 };
      existing.purchaseCount += 1;
      existing.totalSpent += artworkPriceMap.get(String(purchase.artworkId)) || 0;
      statsMap.set(key, existing);
    }

    const rankedUsers = Array.from(statsMap.entries())
      .map(([userId, stats]) => {
        const user = userMap.get(userId);

        return {
          userId,
          name: user?.name || null,
          email: user?.email || null,
          purchaseCount: stats.purchaseCount,
          totalSpent: Number(stats.totalSpent.toFixed(2))
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent || b.purchaseCount - a.purchaseCount);

    res.json(rankedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};