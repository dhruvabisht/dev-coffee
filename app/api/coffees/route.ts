import { connection } from "next/server";
import { recentCoffees } from "@/lib/db";

// Free: the public coffee wall.
export async function GET() {
  await connection();
  try {
    return Response.json({ coffees: await recentCoffees() });
  } catch {
    return Response.json({ coffees: [], error: "Coffee wall is unavailable right now" }, { status: 503 });
  }
}
