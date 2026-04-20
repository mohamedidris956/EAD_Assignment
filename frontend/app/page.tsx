"use client";

import { useEffect, useState } from "react";
import { fetchArtworks } from "../lib/api";
import ArtworkCard from "../components/ArtworkCard";
import Link from "next/link";

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

  const itemsPerPage = 12;

  // fetch data
  useEffect(() => {
    fetchArtworks().then(setArtworks);
  }, []);

  // 🔍 debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // reset page on search
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // 🎨 filter + sort
  let filteredArtworks = artworks.filter((art) => {
    return (
      art.title.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
      (artistFilter ? art.artist === artistFilter : true) &&
      (categoryFilter ? art.category === categoryFilter : true)
    );
  });

  // 💰 sort
  if (sortOrder === "low") {
    filteredArtworks.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    filteredArtworks.sort((a, b) => b.price - a.price);
  }

  // 📄 pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtworks = filteredArtworks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 🎨 dropdown data
  const artists = [...new Set(artworks.map((a) => a.artist))];
  const categories = [
    ...new Set(artworks.map((a) => a.category).filter(Boolean)),
  ];

  return (
    <main className="p-6">

      {/* NAV */}
      <div className="mb-6 flex gap-4">
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
        <Link href="/register" className="text-blue-500 hover:underline">
          Register
        </Link>
        <Link href="/profile" className="text-blue-500 hover:underline">
          Profile
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">🎨 Art Marketplace</h1>

      {/* 🔍 SEARCH + FILTER */}
      <div className="mb-6 flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

      </div>

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginatedArtworks.map((art) => (
          <ArtworkCard key={art._id} art={art} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

    </main>
  );
}