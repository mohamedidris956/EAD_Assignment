"use client";

import { FormEvent, useState } from "react";

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

type ArtworkFormInput = {
  title: string;
  artist: string;
  year: string;
  category: string;
  price: string;
};

type Props = {
  art: Artwork;
  onUpdate?: (id: string, payload: ArtworkFormInput) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
};

export default function ArtworkCard({ art, onUpdate, onDelete }: Props) {
  const [isBuying, setIsBuying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasImageError, setHasImageError] = useState(false);
  const [editForm, setEditForm] = useState<ArtworkFormInput>({
    title: art.title,
    artist: art.artist,
    year: art.year ? String(art.year) : "",
    category: art.category || "",
    price: String(art.price),
  });

  const rawImageSrc = art.imageUrl || art.imageURL || art.ImageURL || art.image || art.Image;
  const imageSrc = rawImageSrc ? encodeURI(rawImageSrc.trim()) : "";
  const shouldShowImage = Boolean(imageSrc) && !hasImageError;
  const canManage = Boolean(onUpdate || onDelete);

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

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();

    if (!onUpdate) {
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);
      await onUpdate(art._id, editForm);
      setIsEditing(false);
      setFeedback({ type: "success", text: "Artwork updated successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed.";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const confirmed = window.confirm(`Delete \"${art.title}\"?`);

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setFeedback(null);
      await onDelete(art._id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed.";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="group flex h-auto min-h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
        {shouldShowImage ? (
          <img
            src={imageSrc}
            alt={art.title}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <img
            src="/artwork-placeholder.svg"
            alt={`Placeholder for ${art.title}`}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {!isEditing ? (
        <>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {art.category || "Uncategorized"}
          </p>
          <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{art.title}</h2>
          <p className="mt-1 line-clamp-1 text-sm text-slate-600">{art.artist}</p>
          <p className="text-sm text-slate-500">{art.year || "Year unknown"}</p>

          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            <p className="text-xl font-bold text-indigo-600">€{art.price}</p>
            <button
              onClick={handleBuy}
              disabled={isBuying}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isBuying ? "Purchasing..." : "Buy"}
            </button>
          </div>

          {canManage && (
            <div className="mt-3 flex gap-2">
              {onUpdate && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg border border-indigo-300 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <form className="mt-1 space-y-2" onSubmit={handleSave}>
          <input
            required
            value={editForm.title}
            onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="Title"
          />
          <input
            required
            value={editForm.artist}
            onChange={(e) => setEditForm((prev) => ({ ...prev, artist: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="Artist"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={editForm.year}
              onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="Year"
            />
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={editForm.price}
              onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
              placeholder="Price"
            />
          </div>
          <input
            value={editForm.category}
            onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="Category"
          />
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  title: art.title,
                  artist: art.artist,
                  year: art.year ? String(art.year) : "",
                  category: art.category || "",
                  price: String(art.price),
                });
              }}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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