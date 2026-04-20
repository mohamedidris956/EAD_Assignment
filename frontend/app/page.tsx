"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchArtworks } from "../lib/api";
import ArtworkCard from "../components/ArtworkCard";

type Artwork = {
  _id: string;
  title: string;
  artist: string;
  year?: number;
  price: number;
  category?: string;
};

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [artistFilter, setArtistFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const itemsPerPage = 12;

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchArtworks();
        setArtworks(data);
      } catch {
        setError("Unable to load artworks right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworks();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const filteredArtworks = useMemo(() => {
    const filtered = artworks.filter((art) => {
      return (
        art.title.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        (artistFilter ? art.artist === artistFilter : true) &&
        (categoryFilter ? art.category === categoryFilter : true)
      );
    });

    if (sortOrder === "low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [artworks, debouncedSearch, artistFilter, categoryFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredArtworks.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(startIndex, startIndex + itemsPerPage);

  const artists = [...new Set(artworks.map((a) => a.artist))];
  const categories = [...new Set(artworks.map((a) => a.category).filter(Boolean))];

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setArtistFilter("");
    setCategoryFilter("");
    setSortOrder("");
    setCurrentPage(1);
  };

  return (
    <main className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-700 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight">Discover Curated Artwork</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-100 sm:text-base">
          Browse the collection, filter by artist or category, and purchase your favorite pieces.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Search by title..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={artistFilter}
            onChange={(e) => {
              setArtistFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Artists</option>
            {artists.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Sort by Price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>

          <button
            onClick={resetFilters}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Reset
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-52 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
      )}

      {!isLoading && !error && paginatedArtworks.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">No artworks found</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try adjusting search text or clearing filters to see more results.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Clear filters
          </button>
        </div>
      )}

      {!isLoading && !error && paginatedArtworks.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedArtworks.map((art) => (
              <ArtworkCard key={art._id} art={art} />
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}