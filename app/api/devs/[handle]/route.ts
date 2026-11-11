import { findDev } from "@/lib/devs";

// Free: one developer's profile.
export async function GET(_req: Request, ctx: RouteContext<"/api/devs/[handle]">) {
  const { handle } = await ctx.params;
  const dev = findDev(handle);
  if (!dev) return Response.json({ error: "No developer with that handle" }, { status: 404 });
  return Response.json({ developer: dev });
}
