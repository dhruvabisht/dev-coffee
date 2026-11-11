import { connection } from "next/server";
import { discovery } from "mppx/nextjs";
import { COFFEE_DESCRIPTION, coffeeCharge, mppx } from "@/lib/mpp";

const coffeeBody = {
  required: false,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          handle: { type: "string", description: "Developer handle from GET /api/devs, e.g. \"ana\". Unknown or missing goes to the community jar." },
          from: { type: "string", description: "Who the coffee is from (your agent or user name)", maxLength: 60 },
          message: { type: "string", description: "A short thank-you note", maxLength: 280 },
        },
      },
    },
  },
};

// MPP discovery: OpenAPI 3.1 with x-payment-info on the paid route.
export async function GET(req: Request) {
  await connection();
  const origin = new URL(req.url).origin;
  const pay = coffeeCharge();
  return discovery(mppx(), {
    info: { title: "Dev Coffee", version: "1.0.0" },
    serviceInfo: {
      categories: ["payments", "developer-tools", "tipping"],
      docs: { homepage: `${origin}/`, apiReference: `${origin}/openapi.json`, llms: `${origin}/llms.txt` },
    },
    routes: [
      { handler: pay, method: "post", path: "/api/coffee", summary: COFFEE_DESCRIPTION, requestBody: coffeeBody },
      { handler: pay, method: "get", path: "/api/coffee", summary: `${COFFEE_DESCRIPTION} (query: handle, from, message)` },
    ],
  })(req);
}
