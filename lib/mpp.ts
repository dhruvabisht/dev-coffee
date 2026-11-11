// MPP setup: one paid action, "buy a developer a coffee", charged on Tempo testnet (free test money).
import { Mppx, Store, tempo } from "mppx/server";
import { sql } from "./db";

export const COFFEE_PRICE = "3"; // US dollars in testnet stablecoin
export const COFFEE_DESCRIPTION = "Buy a developer a coffee ($3)";

function env(name: string) {
  const v = (process.env[name] || "").trim().replace(/^['"]|['"]$/g, "");
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

let instance: ReturnType<typeof create> | null = null;

function create() {
  const db = sql();
  // A shared Postgres store keeps replay protection consistent across Vercel instances.
  const store = db ? Store.postgres(db as never) : Store.memory();
  return Mppx.create({
    methods: [
      tempo.charge({
        recipient: env("TEMPO_RECIPIENT") as `0x${string}`,
        testnet: true,
        store,
      }),
    ],
    secretKey: env("MPP_SECRET_KEY"),
  });
}

export function mppx() {
  if (!instance) instance = create();
  return instance;
}

export function coffeeCharge() {
  return mppx().charge({ amount: COFFEE_PRICE, description: COFFEE_DESCRIPTION });
}
