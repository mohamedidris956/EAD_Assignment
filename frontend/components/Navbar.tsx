"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const baseLinks = [
  { href: "/", label: "Marketplace" },
  { href: "/profile", label: "Profile" },
  { href: "/top-spenders", label: "Top Spenders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const syncAuthState = () => setUserName(localStorage.getItem("userName") || "");

    syncAuthState();

    const onStorage = () => syncAuthState();
    const onAuthChanged = () => syncAuthState();

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const links = useMemo(() => {
    if (userName) {
      return baseLinks;
    }

    return [...baseLinks, { href: "/login", label: "Login" }, { href: "/register", label: "Register" }];
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          🎨 Art Marketplace
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {userName && <span className="text-sm font-medium text-slate-700">Welcome {userName}</span>}

          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {userName && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Log out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}