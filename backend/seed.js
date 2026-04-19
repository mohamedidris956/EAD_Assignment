const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
const data = require("./data/artworks.json");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // clear existing data
    await Artwork.deleteMany();

    // map dataset → your schema
    const formattedData = data.slice(0, 100).map(item => {
  // FIX ARTIST
  let artist = "Unknown";
  if (Array.isArray(item.Artist)) {
    artist = item.Artist.join(", ");
  } else if (item.Artist) {
    artist = item.Artist;
  }

  // FIX YEAR
  let year = null;
  if (item.Date) {
    const parsed = parseInt(item.Date);
    year = isNaN(parsed) ? null : parsed;
  }

  return {
    title: item.Title || "Untitled",
    artist,
    year,
    category: item.Classification || "Other",
    imageUrl: "",
    price: Math.floor(Math.random() * 1000) + 100
  };
});

    await Artwork.insertMany(formattedData);

    console.log("Data inserted!");
    process.exit();
  })
  .catch(err => console.error(err));