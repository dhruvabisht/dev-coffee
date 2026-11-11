import { searchDevs } from "@/lib/devs";

// Free: find the right developer. GET /api/devs?q=qr
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q");
  return Response.json({ developers: searchDevs(q) });
}
