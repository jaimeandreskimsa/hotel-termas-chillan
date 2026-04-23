import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq, and, gte, sql } from "drizzle-orm";

// GET /api/admin/logs — superadmin only
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string })?.role;
  if (role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'guest' | 'admin' | null (all)
  const module = searchParams.get("module");
  const since = searchParams.get("since"); // ISO date string
  const limitParam = searchParams.get("limit");
  const limit = Math.min(parseInt(limitParam ?? "100", 10), 500);

  const conditions = [];
  if (type === "guest" || type === "admin") conditions.push(eq(activityLogs.type, type));
  if (module) conditions.push(eq(activityLogs.module, module));
  if (since) {
    const sinceDate = new Date(since);
    if (!isNaN(sinceDate.getTime())) conditions.push(gte(activityLogs.createdAt, sinceDate));
  }

  const logs = await db
    .select()
    .from(activityLogs)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);

  // Summary counts
  const [guestCount] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(activityLogs)
    .where(eq(activityLogs.type, "guest"));

  const [adminCount] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(activityLogs)
    .where(eq(activityLogs.type, "admin"));

  return NextResponse.json({ logs, summary: { guests: guestCount.value, admins: adminCount.value } });
}

// POST /api/admin/logs — used internally by admin API routes to log actions
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { action, module, details } = body;
    const sanitize = (v: unknown, max = 255) =>
      typeof v === "string" ? v.slice(0, max) : null;

    await db.insert(activityLogs).values({
      type: "admin",
      action: sanitize(action, 100) ?? "unknown",
      module: sanitize(module, 100),
      actorName: sanitize(session.user?.name),
      actorEmail: sanitize(session.user?.email),
      details: sanitize(details, 1000),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/logs]", err);
    return NextResponse.json({ error: "Error saving log" }, { status: 500 });
  }
}
