import AgentBox from "@/components/AgentBox";
import LatteCup from "@/components/LatteCup";
import Menu from "@/components/Menu";
import OrderRail from "@/components/OrderRail";
import ServedCounter from "@/components/ServedCounter";
import { DEVS } from "@/lib/devs";
import { COFFEE_PRICE } from "@/lib/mpp";

const STEPS = [
  { title: "Order", text: "A person or agent asks for a coffee for @ana: POST /api/coffee." },
  { title: "Bill", text: "The counter answers 402 Payment Required with the price: $3." },
  { title: "Pay", text: "They pay with Tempo or a Stripe card and ask again with proof." },
  { title: "Receipt", text: "The coffee is served and a receipt hangs on the order rail." },
];

const ENDPOINTS: [string, string, string][] = [
  ["GET", "/api/devs?q=", "Find a developer by what they built (free)"],
  ["POST", "/api/coffee", `Buy a coffee, $${COFFEE_PRICE} via MPP. Body: handle, from, message`],
  ["GET", "/api/coffees", "The order rail (free)"],
  ["GET", "/openapi.json", "OpenAPI 3.1 with x-payment-info"],
  ["GET", "/llms.txt", "Everything an agent needs, including the price"],
];

export default function Home() {
  return (
    <div>
      <section className="hero relative overflow-hidden text-foam">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden />
        <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-6 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-crema text-xl text-espresso" aria-hidden>
              ☕
            </span>
            <span className="font-display text-2xl">Dev Coffee</span>
          </a>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <a href="#menu" className="hidden rounded-full px-3 py-1.5 hover:bg-white/10 sm:inline">Menu</a>
            <a href="#rail" className="hidden rounded-full px-3 py-1.5 hover:bg-white/10 sm:inline">Order rail</a>
            <a href="#agents" className="rounded-full px-3 py-1.5 hover:bg-white/10">For agents</a>
            <a href="/llms.txt" className="rounded-full px-3 py-1.5 ring-1 ring-white/25 hover:bg-white/10">llms.txt</a>
          </nav>
        </header>

        <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pb-24 lg:pt-14">
          <div className="rise">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
              <span className="h-2 w-2 rounded-full bg-mint" aria-hidden />
              Open now: Tempo testnet or a Stripe test card. No real money
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] sm:text-7xl">
              Thank the developers your agents rely on.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-foam/75">
              Buy an independent developer a ${COFFEE_PRICE} coffee in one HTTP request. People and AI agents pay with the
              Machine Payments Protocol: no account, no API key, no checkout page.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#menu" className="rounded-full bg-crema px-6 py-3 font-semibold text-espresso transition-transform hover:-translate-y-0.5">
                See the menu
              </a>
              <a href="#agents" className="rounded-full px-6 py-3 font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/10">
                Send one with your agent
              </a>
            </div>
            <dl className="mt-10 flex gap-8">
              <div>
                <dt className="text-sm text-foam/60">Coffees served</dt>
                <dd className="font-display text-4xl"><ServedCounter /></dd>
              </div>
              <div>
                <dt className="text-sm text-foam/60">Developers</dt>
                <dd className="font-display text-4xl">{DEVS.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-foam/60">Price</dt>
                <dd className="font-display text-4xl">${COFFEE_PRICE}</dd>
              </div>
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-8 rounded-full bg-crema/25 blur-3xl" aria-hidden />
            <LatteCup className="relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section aria-labelledby="how" className="-mt-10 relative">
          <h2 id="how" className="sr-only">How an order works</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rise rounded-[24px] bg-panel p-5 shadow-[0_18px_40px_-28px_rgba(42,26,18,0.55)] ring-1 ring-line" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-espresso font-display text-foam">{i + 1}</span>
                <p className="mt-3 font-display text-2xl">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="menu" className="scroll-mt-6 pt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-5xl">The menu</h2>
              <p className="mt-2 text-muted">Every developer here builds something agents use. Pick one and buy them a coffee.</p>
            </div>
          </div>
          <Menu devs={DEVS} price={COFFEE_PRICE} />
        </section>

        <section id="rail" className="scroll-mt-6 pt-20">
          <h2 className="font-display text-5xl">The order rail</h2>
          <p className="mb-6 mt-2 text-muted">Every coffee bought, live. Each ticket links to its on-chain receipt.</p>
          <OrderRail />
        </section>

        <section id="agents" className="scroll-mt-6 pt-20">
          <h2 className="font-display text-5xl">For agents</h2>
          <p className="mb-6 mt-2 max-w-2xl text-muted">
            Agents find the developer for free, then pay with MPP. Unpaid requests get a 402 with the price; paid ones get
            the coffee and a receipt.
          </p>
          <AgentBox />
          <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[24px] bg-panel ring-1 ring-line">
            {ENDPOINTS.map(([m, path, what]) => (
              <li key={m + path} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                <span className={`w-12 font-mono text-xs font-bold ${m === "GET" ? "text-mint" : "text-crema"}`}>{m}</span>
                <a href={m === "GET" && !path.includes("?") ? path : undefined} className="font-mono text-sm">{path}</a>
                <span className="text-sm text-muted sm:ml-auto sm:text-right">{what}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="mx-auto mt-20 max-w-6xl border-t border-line px-4 py-8 text-sm text-muted sm:px-6">
        Dev Coffee runs on the Machine Payments Protocol (Tempo testnet). The developers listed are demo profiles.{" "}
        <a className="underline" href="/openapi.json">OpenAPI</a> · <a className="underline" href="/llms.txt">llms.txt</a> ·{" "}
        <a className="underline" href="https://github.com/dhruvabisht/dev-coffee">Source</a>
      </footer>
    </div>
  );
}
