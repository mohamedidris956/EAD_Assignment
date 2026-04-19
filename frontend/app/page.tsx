import { fetchArtworks } from "../lib/api";
import ArtworkCard from "../components/ArtworkCard";

type Artwork = {
  _id: string;
  title: string;
  artist: string;
  year?: number;
  price: number;
};

export default async function Home() {
  const artworks: Artwork[] = await fetchArtworks();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎨 Art Marketplace</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {artworks.map((art: Artwork) => (
          <ArtworkCard key={art._id} art={art} />
        ))}
      </div>
    </main>
  );
}