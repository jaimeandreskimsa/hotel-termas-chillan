import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { spaSchedules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logAction } from "@/lib/logger";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [schedule] = await db.update(spaSchedules).set({ hours: body.hours }).where(eq(spaSchedules.id, body.id)).returning();
  await logAction({ type: "admin", action: "update_schedule", module: "spa", actorName: session.user?.name, actorEmail: session.user?.email, details: `Actualizó horario ${body.venue}: ${body.hours}` });
  return NextResponse.json({ schedule });
}
