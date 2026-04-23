// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const artworkRoutes = require("./routes/artworkRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/artworks", artworkRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/users", userRoutes);

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

  const path = require("path");

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/about-this-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public-about.html"));
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});