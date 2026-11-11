"use client";

import { useEffect, useState } from "react";

type Coffee = { id: string; handle: string; dev_name: string; from_name: string; message: string | null; amount: string; created_at: string; receipt: string | null };

function ago(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function CoffeeWall() {
  const [coffees, setCoffees] = useState<Coffee[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/coffees", { cache: "no-store" });
        const j = await r.json();
        if (alive) setCoffees(j.coffees || []);
      } catch {
        if (alive) setCoffees((c) => c ?? []);
      }
    };
    const first = setTimeout(load, 0);
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  if (coffees === null) return <p className="text-sm text-muted">Pouring the latest coffees…</p>;
  if (coffees.length === 0)
    return (
      <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
        No coffees yet. Be the first: send one with your agent or the command above.
      </p>
    );

  return (
    <ul className="space-y-2">
      {coffees.map((c) => (
        <li key={c.id} className="pop flex items-start gap-3 rounded-2xl bg-panel px-4 py-3 ring-1 ring-line">
          <span className="text-xl" aria-hidden>☕</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm">
              <span className="font-semibold">{c.from_name}</span> bought <span className="font-semibold">{c.dev_name}</span> a ${c.amount} coffee
            </p>
            {c.message && <p className="truncate text-sm text-muted">“{c.message}”</p>}
            {c.receipt && (
              <a
                href={`https://explore.testnet.tempo.xyz/receipt/${c.receipt}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-mint underline-offset-2 hover:underline"
              >
                receipt {c.receipt.slice(0, 10)}…
              </a>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted">{ago(c.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}
