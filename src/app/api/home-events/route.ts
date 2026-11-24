import { NextRequest } from "next/server";
import { getHomeEventsFromDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get("all") === "1";
    const events = await getHomeEventsFromDb(!showAll);
    return Response.json(
      { ok: true, events },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    return Response.json(
      {
        ok: false,
        events: [],
        error:
          err instanceof Error
            ? err.message
            : "Failed to load homepage events.",
      },
      { status: 500 }
    );
  }
}

