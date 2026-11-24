import { NextRequest } from "next/server";
import { DEFAULT_HOME_EVENTS, getHomeEventsFromDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const showAll = request.nextUrl.searchParams.get("all") === "1";
  try {
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
    const fallbackEvents = showAll
      ? DEFAULT_HOME_EVENTS
      : DEFAULT_HOME_EVENTS.filter((ev) => ev.active);
    return Response.json(
      {
        ok: true,
        fallback: true,
        events: fallbackEvents,
        warning:
          err instanceof Error
            ? err.message
            : "Database unavailable; serving default homepage events.",
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
