import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Security: only allow image MIME types
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }

  // Max 15 MB
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "El archivo supera los 15 MB" }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const filename = `act-${Date.now()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "images");
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(dest, Buffer.from(bytes));

  return NextResponse.json({ url: `/images/${filename}` });
}
