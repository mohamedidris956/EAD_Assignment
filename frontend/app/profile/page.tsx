"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [purchases, setPurchases] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    fetch(`http://localhost:3001/api/purchases/${userId}`)
      .then((res) => res.json())
      .then((data) => setPurchases(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Purchases</h1>

      {purchases.map((p) => (
        <div key={p._id} className="border p-4 mb-3 rounded">
          <h3 className="font-semibold">{p.artworkTitle}</h3>
          <p className="text-gray-600">{p.artworkArtist}</p>
          <p className="text-sm text-gray-500">
            Purchased on {new Date(p.purchaseDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}