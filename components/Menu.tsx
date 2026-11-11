"use client";

import { useMemo, useState } from "react";
import type { Dev } from "@/lib/devs";
import { useOrigin } from "./useOrigin";

function CopyButton({ text, label, done }: { text: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className="rounded-full bg-espresso px-4 py-2 text-sm font-semibold text-foam transition-transform hover:-translate-y-0.5 active:scale-95"
    >
      {ok ? done : label}
    </button>
  );
}

// The developer directory, as a café menu.
export default function Menu({ devs, price }: { devs: Dev[]; price: string }) {
  const origin = useOrigin();
  const [q, setQ] = useState("");
  const tags = useMemo(() => Array.from(new Set(devs.flatMap((d) => d.tags))).slice(0, 10), [devs]);
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
    if (!words.length) return devs;
    return devs.filter((d) =>
      words.some((w) => `${d.handle} ${d.name} ${d.bio} ${d.builds.join(" ")} ${d.tags.join(" ")}`.toLowerCase().includes(w)),
    );
  }, [q, devs]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Search the menu</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What did they build? Try qr, calendar, postgres…"
            className="w-full rounded-full border border-line bg-panel px-5 py-3.5 text-base outline-none transition-colors focus:border-crema"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setQ(q === t ? "" : t)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              q === t ? "bg-crema text-espresso" : "bg-panel text-muted ring-1 ring-line hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[28px] bg-panel ring-1 ring-line">
        {shown.map((d) => (
          <li key={d.handle} className="rise group grid gap-4 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6">
            <span className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl transition-transform group-hover:-rotate-6 ${d.color}`} aria-hidden>
              {d.emoji}
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h3 className="font-display text-2xl leading-none">{d.name}</h3>
                <span className="menu-dots hidden h-2 flex-1 text-muted sm:block" aria-hidden />
                <span className="font-display text-2xl text-crema sm:hidden">${price}</span>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">@{d.handle}</p>
              <p className="mt-2 text-[15px]">{d.bio}</p>
              <p className="mt-1 text-sm text-muted">Speciality: {d.builds.join(" · ")}</p>
            </div>
            <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end">
              <span className="hidden font-display text-3xl text-crema sm:block">${price}</span>
              <CopyButton
                text={`npx mppx "${origin}/api/coffee?handle=${d.handle}&from=a%20fan&message=thank%20you"`}
                label="Copy order"
                done="Copied ✓"
              />
            </div>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="p-6 text-sm text-muted">Nothing on the menu matches that. Coffee without a handle goes to the community jar.</li>
        )}
      </ul>
    </div>
  );
}
