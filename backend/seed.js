const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Artwork = require("./models/Artwork");

require("dotenv").config();

const dataDir = path.join(__dirname, "data");
const candidateFiles = [
  "artswork_1000.json",
  "artworks_1000.json",
  "artwork_1000.json",
  "artworks.json"
];

const dataPath = candidateFiles
  .map((fileName) => path.join(dataDir, fileName))
  .find((candidatePath) => fs.existsSync(candidatePath));

if (!dataPath) {
  throw new Error(
    `No seed JSON file found in ${dataDir}. Expected one of: ${candidateFiles.join(", ")}`
  );
}

const data = require(dataPath);

const pickImageUrl = (item) => {
  const directImageCandidates = [item.ImageURL, item.ImageUrl, item.imageUrl];
  const directImage = directImageCandidates.find(
    (value) => typeof value === "string" && value.trim().length > 0
  );

  if (directImage) {
    return directImage.trim();
  }

  const genericUrlCandidates = [item.URL, item.Url, item.url];
  const genericUrl = genericUrlCandidates.find(
    (value) => typeof value === "string" && value.trim().length > 0
  );

  if (!genericUrl) {
    return "";
  }

  const normalized = genericUrl.trim();
  const isLikelyImage = /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(normalized);
  return isLikelyImage ? normalized : "";
};

const parseYear = (item) => {
  if (typeof item.Date === "number") {
    return item.Date;
  }

  if (typeof item.Date === "string") {
    const yearMatch = item.Date.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
    if (yearMatch) {
      return Number(yearMatch[0]);
    }
  }

  if (Array.isArray(item.BeginDate)) {
    const firstValidBeginDate = item.BeginDate.find((value) => Number.isFinite(Number(value)));
    if (firstValidBeginDate !== undefined) {
      return Number(firstValidBeginDate);
    }
  }

  if (Number.isFinite(Number(item.BeginDate))) {
    return Number(item.BeginDate);
  }

  return null;
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    console.log(`Using seed file: ${dataPath}`);
    console.log(`Loaded ${data.length} records from JSON`);

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

      return {
        title: item.Title || "Untitled",
        artist,
        year: parseYear(item),
        category: item.Classification || "Other",
        imageUrl: pickImageUrl(item),
        price: Math.floor(Math.random() * 1000) + 100
      };
    });

    await Artwork.insertMany(formattedData);

    console.log(`Data inserted: ${formattedData.length} artworks`);
    process.exit();
  })
  .catch(err => console.error(err));