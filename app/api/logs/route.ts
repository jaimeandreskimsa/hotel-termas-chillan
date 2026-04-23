import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

// POST /api/logs — called by guest pages to log activity
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, module, actorName, actorEmail, details } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json({ error: "action required" }, { status: 400 });
    }

    // Sanitise inputs
    const sanitize = (v: unknown, max = 255) =>
      typeof v === "string" ? v.slice(0, max) : null;

    await db.insert(activityLogs).values({
      type: "guest",
      action: sanitize(action, 100) ?? "unknown",
      module: sanitize(module, 100),
      actorName: sanitize(actorName),
      actorEmail: sanitize(actorEmail),
      details: sanitize(details, 1000),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/logs]", err);
    return NextResponse.json({ error: "Error saving log" }, { status: 500 });
  }
}
