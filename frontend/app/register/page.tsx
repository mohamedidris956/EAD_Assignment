"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:3001/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (data._id) {
      alert("Registered successfully!");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Register</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="bg-green-500 text-white w-full py-2 rounded"
      >
        Register
      </button>
    </div>
  );
}