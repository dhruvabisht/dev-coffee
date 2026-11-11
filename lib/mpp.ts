// MPP setup: one paid action, "buy a developer a coffee" ($3), payable two ways:
//  1. Tempo testnet stablecoin (free test money)
//  2. A Stripe card via Shared Payment Token, in Stripe test mode (no real money)
import Stripe from "stripe";
import { Mppx, Store, stripe, tempo } from "mppx/server";
import { sql } from "./db";

export const COFFEE_PRICE = "3"; // US dollars
export const COFFEE_DESCRIPTION = "Buy a developer a coffee ($3)";

// Stripe's documented sandbox seller profile, used when the account has no Business Network profile yet.
const SANDBOX_NETWORK_ID = "profile_test_61TU90nIeGjU7NNVXA6TU90m7ISQWsBxpcx9lASWWXTk";

function clean(name: string) {
  return (process.env[name] || "").trim().replace(/^['"]|['"]$/g, "");
}
function env(name: string) {
  const v = clean(name);
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

// Only ever test-mode Stripe keys: this service must never take real card payments.
export function stripeEnabled() {
  const k = clean("STRIPE_SECRET_KEY");
  return k.startsWith("sk_test_") || k.startsWith("rk_test_");
}

function create() {
  const db = sql();
  // A shared Postgres store keeps replay protection consistent across Vercel instances.
  const store = db ? Store.postgres(db as never) : Store.memory();
  const tempoMethod = tempo.charge({ recipient: env("TEMPO_RECIPIENT") as `0x${string}`, testnet: true, store });
  const methods: unknown[] = [tempoMethod];
  if (stripeEnabled())
    methods.push(
      stripe.spt({
        client: new Stripe(clean("STRIPE_SECRET_KEY")),
        networkId: clean("STRIPE_NETWORK_ID") || SANDBOX_NETWORK_ID,
        paymentMethodTypes: ["card"],
      }),
    );
  return Mppx.create({
    methods: methods as [typeof tempoMethod],
    secretKey: env("MPP_SECRET_KEY"),
    // Public hostname agents call (must match the Host they see). Falls back to auto-detection.
    realm: clean("MPP_REALM") || undefined,
  });
}

let instance: ReturnType<typeof create> | null = null;
export function mppx() {
  if (!instance) instance = create();
  return instance;
}

type PayResult = { status: number; challenge: Response; withReceipt: (r: Response) => Response };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = ((request: Request) => Promise<PayResult>) & { _internal?: any };

// One price, two ways to pay. The 402 lists both; the buyer picks the rail it supports.
export function coffeeCharge(): Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = mppx() as any;
  if (!stripeEnabled() || !m.stripe) return m.charge({ amount: COFFEE_PRICE, description: COFFEE_DESCRIPTION });
  return m.compose(
    [m.tempo.charge, { amount: COFFEE_PRICE, description: COFFEE_DESCRIPTION }],
    [m.stripe.charge, { amount: COFFEE_PRICE, currency: "usd", decimals: 2, description: COFFEE_DESCRIPTION }],
  );
}
