import { headers } from "next/headers";
import CoffeeWall from "@/components/CoffeeWall";
import DevDirectory from "@/components/DevDirectory";
import { DEVS } from "@/lib/devs";
import { COFFEE_PRICE } from "@/lib/mpp";

const STEPS = [
  ["Ask", "Your agent calls POST /api/coffee with the developer's handle."],
  ["402", "Dev Coffee answers Payment Required and names the price: $3."],
  ["Pay", "The agent pays on Tempo and retries with proof of payment."],
  ["Receipt", "The coffee lands on the wall, with an on-chain receipt."],
];

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3200";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function Home() {
  const origin = await getOrigin();
  const agentPrompt = `Buy a developer a coffee for me on Dev Coffee. Read ${origin}/llms.txt, find the developer who built what I mention, tell me who it is, and after I say yes, pay with MPP.`;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:pt-10">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl" aria-hidden>
            ☕
          </span>
          <span className="font-display text-2xl text-espresso">Dev Coffee</span>
        </div>
        <nav className="flex gap-2 text-sm">
          <a href="/llms.txt" className="rounded-full px-3 py-1.5 ring-1 ring-line hover:bg-panel">llms.txt</a>
          <a href="/openapi.json" className="rounded-full px-3 py-1.5 ring-1 ring-line hover:bg-panel">OpenAPI</a>
        </nav>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <h1 className="font-display text-5xl leading-[1.05] text-espresso sm:text-6xl">
            Thank the developers your agents rely on.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Any person or AI agent can buy an independent developer a ${COFFEE_PRICE} coffee in a single HTTP request,
            paid with the Machine Payments Protocol. No account, no API key, no checkout page.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-crema/20 px-3 py-1 text-sm font-semibold text-espresso">
            Running on Tempo testnet: free test money only
          </p>
        </div>
        <ol className="grid grid-cols-2 gap-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="rounded-2xl bg-panel p-4 ring-1 ring-line">
              <span className="font-mono text-xs text-muted">step {i + 1}</span>
              <p className="font-display text-2xl text-espresso">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="font-display text-3xl text-espresso">Developers</h2>
          <p className="mb-4 mt-1 text-muted">Find the person behind the tool, then send them a coffee.</p>
          <DevDirectory devs={DEVS} origin={origin} />
        </section>

        <aside className="space-y-8">
          <section className="rounded-3xl bg-espresso p-6 text-paper">
            <h2 className="font-display text-2xl">Send one with your agent</h2>
            <p className="mt-2 text-sm opacity-80">Paste this into Claude, ChatGPT or any agent that can pay with MPP:</p>
            <p className="mt-3 rounded-2xl bg-paper/10 p-4 text-sm leading-relaxed">{agentPrompt}</p>
            <p className="mt-4 text-sm opacity-80">Or from a terminal, with a free testnet wallet:</p>
            <pre className="mt-2 overflow-x-auto rounded-2xl bg-black/30 p-3 font-mono text-xs leading-relaxed">
{`npx mppx account create
npx mppx "${origin}/api/coffee?handle=ana&from=me"`}
            </pre>
          </section>

          <section>
            <h2 className="font-display text-2xl text-espresso">Coffee wall</h2>
            <p className="mb-3 text-sm text-muted">Every coffee, live, with its on-chain receipt.</p>
            <CoffeeWall />
          </section>
        </aside>
      </div>

      <footer className="mt-16 border-t border-line pt-6 text-sm text-muted">
        Paid endpoint: <span className="font-mono">POST {origin}/api/coffee</span>. Discovery:{" "}
        <a className="underline" href="/openapi.json">/openapi.json</a> and <a className="underline" href="/llms.txt">/llms.txt</a>. The developers
        listed here are demo profiles.
      </footer>
    </div>
  );
}
