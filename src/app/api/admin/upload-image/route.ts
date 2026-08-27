import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { EBG_DATA } from "@/data/ebg-data";

const VALID_SLUGS = new Set(EBG_DATA.bikes.map((b) => b.slug));
const MAX_SIZE = 5 * 1024 * 1024;

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

  const store = getStore("bike-images");
  await store.set(slug, file, { metadata: { contentType: file.type } });

  return NextResponse.json({ ok: true, path: `/api/bike-image/${slug}` });
}
