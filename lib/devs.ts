// Demo developers (fictional) who accept coffee from people and agents.
export type Dev = {
  handle: string;
  name: string;
  emoji: string;
  color: string; // tailwind bg class for the avatar
  bio: string;
  builds: string[];
  tags: string[];
};

export const COMMUNITY: Dev = {
  handle: "community",
  name: "Community jar",
  emoji: "🫙",
  color: "bg-stone-200",
  bio: "Coffee that isn't addressed to a known developer lands here and is shared out every week.",
  builds: ["Shared between every developer on Dev Coffee"],
  tags: ["community"],
};

export const DEVS: Dev[] = [
  {
    handle: "ana",
    name: "Ana Okafor",
    emoji: "🦊",
    color: "bg-orange-200",
    bio: "Maintains a tiny, fast QR code encoder that phones actually scan.",
    builds: ["qrkit: QR codes in 4 KB", "scan-check: tests QR images on real phones"],
    tags: ["qr", "images", "javascript"],
  },
  {
    handle: "mateo",
    name: "Mateo Rossi",
    emoji: "🐙",
    color: "bg-sky-200",
    bio: "Writes time-zone tooling so calendar invites open at the right moment everywhere.",
    builds: ["tzsafe: time-zone-safe dates", "ics-lite: calendar files in one call"],
    tags: ["calendar", "time zones", "typescript"],
  },
  {
    handle: "priya",
    name: "Priya Raman",
    emoji: "🦉",
    color: "bg-violet-200",
    bio: "Builds open-source developer tools for testing payment webhooks locally.",
    builds: ["hookbox: replay webhooks offline", "402-lab: practice HTTP 402 flows"],
    tags: ["payments", "webhooks", "go"],
  },
  {
    handle: "lena",
    name: "Lena Fischer",
    emoji: "🐝",
    color: "bg-yellow-200",
    bio: "Designs social preview cards and keeps an open library of OG image templates.",
    builds: ["ogcraft: 1200×630 cards from a title", "palette-pick: accessible colour pairs"],
    tags: ["design", "og images", "css"],
  },
  {
    handle: "kenji",
    name: "Kenji Watanabe",
    emoji: "🐢",
    color: "bg-emerald-200",
    bio: "Maintains a Postgres migration tool that never locks your tables.",
    builds: ["calm-migrate: zero-lock migrations", "pg-peek: explain plans you can read"],
    tags: ["postgres", "databases", "rust"],
  },
  {
    handle: "sofia",
    name: "Sofía Mendes",
    emoji: "🦜",
    color: "bg-rose-200",
    bio: "Writes accessible UI components and teaches screen-reader testing.",
    builds: ["a11y-kit: components that pass audits", "sr-check: screen-reader test recipes"],
    tags: ["accessibility", "react", "ui"],
  },
];

export function findDev(handle: string | null | undefined): Dev | undefined {
  const h = (handle || "").trim().toLowerCase().replace(/^@/, "");
  return DEVS.find((d) => d.handle === h) || (h === "community" ? COMMUNITY : undefined);
}

export function searchDevs(q?: string | null): Dev[] {
  const words = (q || "").toLowerCase().split(/\W+/).filter((w) => w.length > 1);
  if (!words.length) return DEVS;
  return DEVS.filter((d) => {
    const hay = `${d.handle} ${d.name} ${d.bio} ${d.builds.join(" ")} ${d.tags.join(" ")}`.toLowerCase();
    return words.some((w) => hay.includes(w));
  });
}
