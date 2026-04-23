import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

interface LogParams {
  type: "admin" | "guest";
  action: string;
  module?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  details?: string | null;
}

export async function logAction(params: LogParams) {
  try {
    await db.insert(activityLogs).values({
      type: params.type,
      action: params.action.slice(0, 100),
      module: params.module?.slice(0, 100) ?? null,
      actorName: params.actorName?.slice(0, 255) ?? null,
      actorEmail: params.actorEmail?.slice(0, 255) ?? null,
      details: params.details?.slice(0, 1000) ?? null,
    });
  } catch (err) {
    // Logging is best-effort — never block the main request
    console.error("[logAction]", err);
  }
}
