"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Purchase = {
  _id: string;
  artworkTitle: string;
  artworkArtist: string;
  purchaseDate: string;
};

export default function ProfilePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setIsLoading(true);
        setError("");
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setError("Please login to view your purchase history.");
          return;
        }

        const res = await fetch(`http://localhost:3001/api/purchases/${userId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch purchases");
        }

        const data = await res.json();
        setPurchases(data);
      } catch {
        setError("Could not load purchase history right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPurchases();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Purchases</h1>
        <p className="text-sm text-slate-600">A timeline of artworks you have bought.</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p>{error}</p>
          <Link href="/login" className="mt-2 inline-block font-semibold text-indigo-600 hover:underline">
            Go to login
          </Link>
        </div>
      )}

      {!isLoading && !error && purchases.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No purchases yet</h2>
          <p className="mt-1 text-sm text-slate-600">Explore the marketplace and buy your first artwork.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Browse artworks
          </Link>
        </div>
      )}

      {!isLoading && !error && purchases.length > 0 && (
        <div className="space-y-3">
          {purchases.map((p) => (
            <article key={p._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900">{p.artworkTitle}</h3>
              <p className="text-slate-600">{p.artworkArtist}</p>
              <p className="text-sm text-slate-500">
                Purchased on {new Date(p.purchaseDate).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}