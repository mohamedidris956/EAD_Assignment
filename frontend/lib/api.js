const API_BASE = "http://localhost:3001/api";

const parseError = async (res, fallbackMessage) => {
  try {
    const body = await res.json();
    return body?.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};
export const fetchArtworks = async () => {
  const res = await fetch(`${API_BASE}/artworks`);

  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to fetch artworks"));
  }

  return res.json();
};

export const createArtwork = async (payload) => {
  const res = await fetch(`${API_BASE}/artworks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to create artwork"));
  }

  return res.json();
};

export const updateArtwork = async (id, payload) => {
  const res = await fetch(`${API_BASE}/artworks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to update artwork"));
  }

  return res.json();
};

export const deleteArtwork = async (id) => {
  const res = await fetch(`${API_BASE}/artworks/${id}`, {
    method: "DELETE",
  });


  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to delete artwork"));
  }

  return res.json();
};

export const fetchTopUsers = async () => {
  const res = await fetch(`${API_BASE}/purchases/stats/top-users`);

  if (!res.ok) {
    throw new Error(await parseError(res, "Failed to fetch top users"));
  }

  return res.json();
};