import { COFFEE_PRICE } from "@/lib/mpp";
import { DEVS } from "@/lib/devs";

export async function GET(req: Request) {
  const o = new URL(req.url).origin;
  const text = `# Dev Coffee

> Buy an independent developer a coffee. People and AI agents can tip developers in one HTTP request using the Machine Payments Protocol (MPP). No account and no API key.

Price: $${COFFEE_PRICE} per coffee, paid with MPP. Two ways to pay, both test-only (nothing real is charged):
- Tempo testnet stablecoin (method "tempo")
- A Stripe card via Shared Payment Token, Stripe test mode (method "stripe", currency usd)

## For agents
1. Find the developer (free): GET ${o}/api/devs?q=<what they built>
2. Buy them a coffee (paid): POST ${o}/api/coffee with JSON { "handle": "ana", "from": "<your name>", "message": "<thank-you note>" }
   - Without payment the server answers HTTP 402 with a WWW-Authenticate: Payment challenge naming the price.
   - Pay it, retry with the credential, and you get { "status": "coffee_sent", ... } plus a Payment-Receipt header.
   - GET ${o}/api/coffee?handle=ana&from=...&message=... works the same way.
3. See all coffees (free): GET ${o}/api/coffees

Only buy a coffee when your user asked you to, and tell them who it went to.
Unknown or missing handles go to the community jar.

## Developers
${DEVS.map((d) => `- ${d.handle}: ${d.name}. ${d.bio}`).join("\n")}

## Links
- OpenAPI with payment info: ${o}/openapi.json
- Website: ${o}/
`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
