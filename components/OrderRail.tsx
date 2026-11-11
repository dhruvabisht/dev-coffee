"use client";

import { useEffect, useRef, useState } from "react";

type Coffee = { id: string; handle: string; dev_name: string; from_name: string; message: string | null; amount: string; created_at: string; receipt: string | null };

function ago(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Live order rail: every paid coffee is a receipt ticket.
export default function OrderRail({ onCount }: { onCount?: (n: number) => void }) {
  const [coffees, setCoffees] = useState<Coffee[] | null>(null);
  const seen = useRef<Set<string>>(new Set());
  const [fresh, setFresh] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/coffees", { cache: "no-store" });
        const j = await r.json();
        if (!alive) return;
        const list: Coffee[] = j.coffees || [];
        const newIds = list.filter((c) => !seen.current.has(c.id)).map((c) => c.id);
        if (seen.current.size) setFresh(new Set(newIds));
        list.forEach((c) => seen.current.add(c.id));
        setCoffees(list);
        onCount?.(list.length);
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
  }, [onCount]);

  if (coffees === null)
    return <p className="text-sm text-muted">Warming up the espresso machine…</p>;
  if (coffees.length === 0)
    return (
      <div className="rounded-3xl border-2 border-dashed border-line px-6 py-10 text-center">
        <p className="text-3xl" aria-hidden>🧾</p>
        <p className="mt-2 font-semibold">The rail is empty</p>
        <p className="mt-1 text-sm text-muted">The first coffee bought by a person or an agent will hang here, with its receipt.</p>
      </div>
    );

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-2 rounded-full bg-gradient-to-r from-line via-muted/40 to-line" aria-hidden />
      <ul className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-3">
        {coffees.map((c, i) => (
          <li
            key={c.id}
            className={`ticket drop px-5 pb-7 pt-4 shadow-[0_14px_30px_-18px_rgba(42,26,18,0.6)] ${fresh.has(c.id) ? "ring-2 ring-crema" : ""}`}
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms`, rotate: `${((i * 37) % 5) - 2}deg` }}
          >
            <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wide text-[#7a6a5f]">
              <span>Order {c.id.slice(4, 10)}</span>
              <span>{ago(c.created_at)}</span>
            </div>
            <div className="my-2 border-t border-dashed border-[#d8cbbb]" />
            <p className="font-display text-xl leading-tight">1 × Coffee for {c.dev_name}</p>
            <p className="mt-1 text-sm">
              from <span className="font-semibold">{c.from_name}</span>
            </p>
            {c.message && <p className="mt-2 text-sm italic text-[#5c4a3e]">“{c.message}”</p>}
            <div className="my-3 border-t border-dashed border-[#d8cbbb]" />
            <div className="flex items-baseline justify-between font-mono text-sm">
              <span>TOTAL</span>
              <span className="font-semibold">${c.amount}.00</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-2 font-mono text-[11px] text-[#7a6a5f]">
              <span>PAID · MPP · TEMPO TESTNET</span>
            </div>
            {c.receipt && (
              <a
                href={`https://explore.testnet.tempo.xyz/receipt/${c.receipt}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block truncate font-mono text-[11px] text-[#2f9e7a] underline-offset-2 hover:underline"
              >
                receipt {c.receipt}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
