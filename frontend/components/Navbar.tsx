"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          🎨 Art Marketplace
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
        </div>
      </nav>
    </header>
  );
}