import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { EBG_DATA } from "@/data/ebg-data";

const VALID_SLUGS = new Set(EBG_DATA.bikes.map((b) => b.slug));
const BIKES_DIR = join(process.cwd(), "public", "bikes");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  if (adminKey) {
    const auth = request.headers.get("x-admin-key");
    if (auth !== adminKey) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const formData = await request.formData();
  const slug = formData.get("slug") as string | null;
  const file = formData.get("file") as File | null;

  if (!slug || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Slug no válido" }, { status: 400 });
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No se ha enviado ningún archivo" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen supera los 5 MB" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo no es una imagen" }, { status: 400 });
  }

  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
  const filename = `${slug}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await mkdir(BIKES_DIR, { recursive: true });
  await writeFile(join(BIKES_DIR, filename), buffer);

  return NextResponse.json({ ok: true, path: `/bikes/${filename}` });
}
