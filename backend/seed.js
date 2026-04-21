const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Artwork = require("./models/Artwork");

require("dotenv").config();

const preferredDataPath = path.join(__dirname, "data", "artswork_1000.json");
const fallbackDataPath = path.join(__dirname, "data", "artworks.json");
const dataPath = fs.existsSync(preferredDataPath) ? preferredDataPath : fallbackDataPath;
const data = require(dataPath);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // clear existing data
    await Artwork.deleteMany();

    // map dataset → your schema
      const formattedData = data.map((item) => {
      let artist = "Unknown";
      if (Array.isArray(item.Artist)) {
        artist = item.Artist.join(", ");
      } else if (item.Artist) {
        artist = item.Artist;
      }

      let year = null;
      if (item.Date) {
        const parsed = parseInt(item.Date, 10);
        year = Number.isNaN(parsed) ? null : parsed;
      }

      return {
        title: item.Title || "Untitled",
        artist,
        year,
        category: item.Classification || "Other",
        imageUrl: item.ImageURL || item.URL || "",
        price: Math.floor(Math.random() * 1000) + 100
      };
    });

    await Artwork.insertMany(formattedData);

    console.log("Data inserted!");
    process.exit();
  })
  .catch(err => console.error(err));