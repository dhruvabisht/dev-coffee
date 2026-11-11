"use client";

import { useMemo, useState } from "react";
import type { Dev } from "@/lib/devs";
import { useOrigin } from "./useOrigin";

function CopyCommand({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="w-full rounded-xl bg-espresso px-3 py-2.5 text-sm font-semibold text-paper transition-transform active:scale-[0.98]"
    >
      {done ? "Command copied" : "Copy the coffee command"}
    </button>
  );
}

export default function DevDirectory({ devs }: { devs: Dev[] }) {
  const origin = useOrigin();
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
    if (!words.length) return devs;
    return devs.filter((d) =>
      words.some((w) => `${d.handle} ${d.name} ${d.bio} ${d.builds.join(" ")} ${d.tags.join(" ")}`.toLowerCase().includes(w)),
    );
  }, [q, devs]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search developers</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by what they built: qr, calendar, postgres…"
          className="w-full rounded-2xl border border-line bg-panel px-4 py-3.5 text-base outline-none focus:border-crema"
        />
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {shown.map((d) => (
          <article key={d.handle} className="pop flex flex-col rounded-3xl bg-panel p-5 ring-1 ring-line">
            <div className="flex items-center gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${d.color}`} aria-hidden>
                {d.emoji}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-tight">{d.name}</h3>
                <p className="font-mono text-xs text-muted">@{d.handle}</p>
              </div>
            </div>
            <p className="mt-3 text-sm">{d.bio}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {d.builds.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {d.tags.map((t) => (
                <span key={t} className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted ring-1 ring-line">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <CopyCommand
                text={`npx mppx "${origin}/api/coffee?handle=${d.handle}&from=a%20fan&message=thank%20you"`}
              />
            </div>
          </article>
        ))}
        {shown.length === 0 && <p className="text-sm text-muted">No developer matches that. Coffee sent without a handle goes to the community jar.</p>}
      </div>
    </div>
  );
}
