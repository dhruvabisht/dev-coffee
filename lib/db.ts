import { neon } from "@neondatabase/serverless";

// Postgres (Neon) when configured; an in-memory fallback for local development.
const url = () => (process.env.NEON_POSTGRES_CONNECTION_STRING || process.env.DATABASE_URL || "").replace(/^['"]|['"]$/g, "");

let client: ReturnType<typeof neon> | null = null;
export function sql() {
  const u = url();
  if (!u) return null;
  if (!client) client = neon(u);
  return client;
}

export type Coffee = {
  id: string;
  handle: string;
  dev_name: string;
  from_name: string;
  message: string | null;
  amount: string;
  receipt: string | null;
  created_at: string;
};

const memory: Coffee[] = [];
let ready: Promise<void> | null = null;

async function ensure() {
  const db = sql();
  if (!db) return;
  if (!ready)
    ready = db
      .query(
        `create table if not exists coffees (
          id text primary key, handle text not null, dev_name text not null, from_name text not null,
          message text, amount text not null, receipt text, created_at timestamptz not null default now())`,
      )
      .then(() => undefined)
      .catch((e) => {
        ready = null;
        throw e;
      });
  return ready;
}

export async function saveCoffee(c: Omit<Coffee, "created_at">) {
  const db = sql();
  if (!db) {
    memory.unshift({ ...c, created_at: new Date().toISOString() });
    return;
  }
  await ensure();
  await db.query(
    `insert into coffees (id, handle, dev_name, from_name, message, amount, receipt) values ($1,$2,$3,$4,$5,$6,$7)`,
    [c.id, c.handle, c.dev_name, c.from_name, c.message, c.amount, c.receipt],
  );
}

export async function recentCoffees(limit = 30): Promise<Coffee[]> {
  const db = sql();
  if (!db) return memory.slice(0, limit);
  await ensure();
  return (await db.query(`select * from coffees order by created_at desc limit $1`, [limit])) as Coffee[];
}
