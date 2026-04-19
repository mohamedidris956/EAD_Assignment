const express = require("express");
const router = express.Router();

const {
  createPurchase,
  getUserPurchases
} = require("../controllers/purchaseController");

router.post("/", createPurchase);
router.get("/:userId", getUserPurchases);

module.exports = router;