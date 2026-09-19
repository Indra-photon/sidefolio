import { makeRouteHandler } from "@keystatic/next/route-handler";

import config from "../../../../../keystatic.config";

const handler = makeRouteHandler({ config });

function guard(fn: (req: Request, ctx: { params: Promise<{ params: string[] }> }) => Promise<Response>) {
  return async (req: Request, ctx: { params: Promise<{ params: string[] }> }) => {
    // Local-mode API writes to disk; never expose it from a deployed build.
    if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
    return fn(req, ctx);
  };
}

export const GET = guard(handler.GET as never);
export const POST = guard(handler.POST as never);
