export const fetchArtworks = async () => {
  const res = await fetch("http://localhost:3001/api/artworks");

  if (!res.ok) {
    throw new Error("Failed to fetch artworks");
  }
return res.json();
};