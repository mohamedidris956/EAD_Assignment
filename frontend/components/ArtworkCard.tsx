"use client";

import { useState } from "react";

type Artwork = {
  _id: string;
  title: string;
  artist: string;
  year?: number;
  category?: string;
  price: number;
  imageUrl?: string;
  image?: string;
  imageURL?: string;
  ImageURL?: string;
  Image?: string;
};

export default function ArtworkCard({ art }: { art: Artwork }) {
  const [isBuying, setIsBuying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasImageError, setHasImageError] = useState(false);
  const imageSrc = art.imageUrl || art.imageURL || art.ImageURL || art.image || art.Image;
  const shouldShowImage = Boolean(imageSrc) && !hasImageError;

  const handleBuy = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setFeedback({ type: "error", text: "Please login before purchasing." });
      return;
    }

    try {
      setIsBuying(true);
      setFeedback(null);

      const res = await fetch("http://localhost:3001/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, artworkId: art._id }),
      });

      if (!res.ok) {
        throw new Error("Purchase request failed");
      }

      setFeedback({ type: "success", text: "Purchase successful! Added to your profile." });
    } catch {
      setFeedback({ type: "error", text: "Purchase failed. Please try again." });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
        {shouldShowImage ? (
          <img
            src={imageSrc}
            alt={art.title}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex h-44 items-center justify-center text-sm text-slate-500">
            No image available
          </div>
        )}
      </div>

      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {art.category || "Uncategorized"}
      </p>
      <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{art.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{art.artist}</p>
      <p className="text-sm text-slate-500">{art.year || "Year unknown"}</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-bold text-indigo-600">€{art.price}</p>
        <button
          onClick={handleBuy}
          disabled={isBuying}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isBuying ? "Purchasing..." : "Buy"}
        </button>
      </div>

      {feedback && (
        <p
          className={`mt-3 text-sm ${
            feedback.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </article>
  );
}