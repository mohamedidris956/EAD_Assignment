export const fetchArtworks = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/artworks");
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};