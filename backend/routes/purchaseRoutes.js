const express = require("express");
const router = express.Router();

const {
  createPurchase,
  getUserPurchases,
  getTopUsersStats
} = require("../controllers/purchaseController");

router.post("/", createPurchase);
router.get("/stats/top-users", getTopUsersStats);
router.get("/:userId", getUserPurchases);

module.exports = router;