# Art Marketplace (EAD Assignment)

A full-stack web application for browsing and managing artwork listings.

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

---

## 1) Prerequisites

Install the following before running the project:

- **Node.js** 20+
- **npm** 10+
- **MongoDB** 

---

## 2) Project structure

```text
EAD_Assignment/
├── backend/      # Express API + MongoDB models + seed utilities
└── frontend/     # Next.js UI
```

---

## 3) Installation

From the repository root, install dependencies for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## 4) Configuration

### Backend environment variables

Create a file named `.env` in `backend/`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/art_marketplace
PORT=3001
```

- `MONGO_URI` is required.
- `PORT` is optional (defaults to `3001`).

### Frontend API target

The frontend currently calls a fixed backend base URL:

- `http://localhost:3001/api`

So during local development, keep the backend running on **port 3001**.

---

## 5) Seed the database (optional but recommended)

If you want sample artwork data:

1. Ensure one of the expected JSON files exists in `backend/data/`:
   - `Artworks.json`
2. Run the seed script:

```bash
cd backend
npm run seed
```

---

## 6) Run the application

You need **two terminals**.

### Terminal A: start backend

```bash
cd backend
node server.js
```

Backend endpoints:
- API root: `http://localhost:3001/`
- About page (served by backend): `http://localhost:3001/about-this-page`

### Terminal B: start frontend

```bash
cd frontend
npm run dev
```

Frontend app:
- `http://localhost:3000`

Use the **"About this page"** button in the top-left of the navbar to open the backend-served informational page.

---

## 7) Useful scripts

### Backend

```bash
npm run seed
```

### Frontend

```bash
npm run dev
```

---
