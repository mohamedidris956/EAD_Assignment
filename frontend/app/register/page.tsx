"use client";

import Link from "next/link";
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      setFeedback({ type: "error", text: "Name, email, and password are required." });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFeedback({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      setFeedback({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    try {
      setIsLoading(true);
      setFeedback(null);

      const res = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data._id) {
        throw new Error(data.message || "Registration failed");
      }

      setFeedback({ type: "success", text: "Registered successfully! You can now login." });
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-600">Join to save and view your purchases.</p>

      <div className="mt-5 space-y-3">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <button
        onClick={handleRegister}
        disabled={isLoading}
        className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {isLoading ? "Creating account..." : "Register"}
      </button>

      {feedback && (
        <p className={`mt-3 text-sm ${feedback.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
          {feedback.text}
        </p>
      )}

      <p className="mt-4 text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}