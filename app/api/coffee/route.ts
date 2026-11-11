import { randomUUID } from "node:crypto";
import { Receipt } from "mppx";
import { COMMUNITY, findDev } from "@/lib/devs";
import { saveCoffee } from "@/lib/db";
import { COFFEE_PRICE, coffeeCharge } from "@/lib/mpp";

type Input = { handle?: string; from?: string; message?: string };

async function readInput(req: Request): Promise<Input> {
  const url = new URL(req.url);
  const fromQuery: Input = {
    handle: url.searchParams.get("handle") || undefined,
    from: url.searchParams.get("from") || undefined,
    message: url.searchParams.get("message") || undefined,
  };
  if (req.method !== "POST") return fromQuery;
  try {
    const body = (await req.clone().json()) as Input;
    return { ...fromQuery, ...body };
  } catch {
    return fromQuery;
  }
}

// Paid with MPP: unpaid requests get HTTP 402 + WWW-Authenticate: Payment with the price.
// After payment, the coffee is recorded and returned with a Payment-Receipt.
async function handle(req: Request) {
  const input = await readInput(req);
  const result = await coffeeCharge()(req);
  if (result.status === 402) return result.challenge;

  const dev = findDev(input.handle) ?? COMMUNITY;
  const coffee = {
    id: `cof_${randomUUID().replace(/-/g, "").slice(0, 16)}`,
    handle: dev.handle,
    dev_name: dev.name,
    from_name: (input.from || "An agent").toString().slice(0, 60),
    message: input.message ? input.message.toString().slice(0, 280) : null,
    amount: COFFEE_PRICE,
  };
  const response = result.withReceipt(
    Response.json({
      status: "coffee_sent",
      coffee: { ...coffee, currency: "USD (Tempo testnet)" },
      to: { handle: dev.handle, name: dev.name },
      note:
        input.handle && dev === COMMUNITY
          ? `No developer named "${input.handle}". The coffee went to the community jar.`
          : `☕ ${dev.name} got your coffee. Thank you!`,
    }),
  );
  let receipt: string | null = null;
  try {
    const r = Receipt.fromResponse(response) as { reference?: string };
    receipt = r?.reference ?? null;
  } catch {}
  try {
    await saveCoffee({ ...coffee, receipt });
  } catch (e) {
    console.error("[dev-coffee] could not save coffee", e instanceof Error ? e.message : e);
  }
  return response;
}

export const GET = handle;
export const POST = handle;
