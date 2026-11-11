"use client";

import { useOrigin } from "./useOrigin";

export default function AgentBox() {
  const origin = useOrigin();
  const agentPrompt = `Buy a developer a coffee for me on Dev Coffee. Read ${origin}/llms.txt, find the developer who built what I mention, tell me who it is, and after I say yes, pay with MPP.`;
  return (
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
  );
}
