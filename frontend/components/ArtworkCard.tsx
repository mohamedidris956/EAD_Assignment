"use client";

type Artwork = {
  _id: string;
  title: string;
  artist: string;
  year?: number;
  price: number;
};

export default function ArtworkCard({ art }: { art: Artwork }) {
  const handleBuy = async () => {
    await fetch("http://localhost:3001/api/purchases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: "test-user",
        artworkId: art._id
      })
    });

    alert("Purchased!");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <h2 className="text-lg font-semibold mb-2">{art.title}</h2>
      <p className="text-gray-600">{art.artist}</p>
      <p className="text-sm text-gray-500">{art.year}</p>
      <p className="mt-3 font-bold text-blue-600">€{art.price}</p>

      <button
        onClick={handleBuy}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Buy
      </button>
    </div>
  );
}