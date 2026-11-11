"use client";

import { useEffect, useState } from "react";

export default function ServedCounter() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/coffees", { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => alive && setN((j.coffees || []).length))
        .catch(() => {});
    const first = setTimeout(load, 0);
    const t = setInterval(load, 8000);
    return () => {
      alive = false;
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);
  return (
    <span className="tabular-nums">{n === null ? "…" : n}</span>
  );
}
