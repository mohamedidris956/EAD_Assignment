"use client";

import Link from "next/link";
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setFeedback({ type: "error", text: "Email and password are required." });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFeedback({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setIsLoading(true);
      setFeedback(null);

      const res = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (!res.ok || !data._id) {
        throw new Error(data.message || "Login failed");
      }

    
      localStorage.setItem("userId", data._id);
      localStorage.setItem("userName", data.name || "");
      window.dispatchEvent(new Event("auth-changed"));
      setFeedback({ type: "success", text: "Login successful! You can now purchase artworks." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed. Please check your email and password.";
      setFeedback({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Welcome back to Art Marketplace.</p>

      <div className="mt-5 space-y-3">
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
        onClick={handleLogin}
        disabled={isLoading}
        className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "Signing in..." : "Login"}
      </button>

      {feedback && (
        <p className={`mt-3 text-sm ${feedback.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
          {feedback.text}
        </p>
      )}

      <p className="mt-4 text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}