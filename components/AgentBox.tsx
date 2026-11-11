"use client";

import { useState } from "react";
import { useOrigin } from "./useOrigin";

function Copy({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1500);
      }}
      className="shrink-0 rounded-full bg-crema px-4 py-2 text-sm font-semibold text-espresso transition-transform active:scale-95"
    >
      {ok ? "Copied ✓" : "Copy"}
    </button>
  );
}

export default function AgentBox() {
  const origin = useOrigin();
  const prompt = `Buy a developer a coffee for me on Dev Coffee. Read ${origin}/llms.txt, find the developer who built what I mention, tell me who it is, and after I say yes, pay with MPP.`;
  const cli = `npx mppx account create\nnpx mppx "${origin}/api/coffee?handle=ana&from=me&message=thanks"`;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[28px] bg-panel p-6 ring-1 ring-line">
        <p className="text-sm font-semibold text-muted">Ask your agent</p>
        <p className="mt-3 text-[15px] leading-relaxed">{prompt}</p>
        <div className="mt-4 flex justify-end">
          <Copy text={prompt} />
        </div>
      </div>
      <div className="rounded-[28px] bg-espresso p-6 text-foam">
        <p className="text-sm font-semibold opacity-70">Or order from a terminal (free testnet wallet)</p>
        <pre className="mt-3 overflow-x-auto font-mono text-[13px] leading-relaxed">{cli}</pre>
        <div className="mt-4 flex justify-end">
          <Copy text={cli} />
        </div>
      </div>
    </div>
  );
}
