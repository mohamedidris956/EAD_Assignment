"use client";

import { useEffect, useState } from "react";
import { fetchTopUsers } from "../../lib/api";

type TopUser = {
  userId: string;
  name?: string | null;
  email?: string | null;
  purchaseCount: number;
  totalSpent?: number;
};

export default function TopSpendersPage() {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTopUsers = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchTopUsers();
        setTopUsers(data);
      } catch {
        setError("Unable to load top spenders right now.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTopUsers();
  }, []);

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Top Spenders</h1>
        <p className="text-sm text-slate-600">See which users have spent the most in the marketplace.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {isLoading && <p className="text-sm text-slate-500">Loading purchase stats...</p>}
        {!isLoading && error && <p className="text-sm text-rose-600">{error}</p>}
        {!isLoading && !error && topUsers.length === 0 && (
          <p className="text-sm text-slate-500">No purchase data yet.</p>
        )}

        {!isLoading && !error && topUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2">Rank</th>
                  <th className="px-2 py-2">User</th>
                  <th className="px-2 py-2">Purchases</th>
                  <th className="px-2 py-2">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user, index) => (
                  <tr key={user.userId} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-semibold text-slate-700">#{index + 1}</td>
                    <td className="px-2 py-2 text-slate-700">{user.name || user.email || user.userId}</td>
                    <td className="px-2 py-2">{user.purchaseCount}</td>
                    <td className="px-2 py-2">€{Number(user.totalSpent || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}