import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { EBG_DATA } from "@/data/ebg-data";

const VALID_SLUGS = new Set(EBG_DATA.bikes.map((b) => b.slug));

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const store = getStore("bike-images");

  try {
    const entry = await store.getWithMetadata(slug, { type: "arrayBuffer" });
    if (!entry || !entry.data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contentType = (entry.metadata as { contentType?: string })?.contentType || "image/webp";

    return new NextResponse(entry.data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function HEAD(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!VALID_SLUGS.has(slug)) {
    return new NextResponse(null, { status: 404 });
  }

  const store = getStore("bike-images");

  try {
    const meta = await store.getMetadata(slug);
    if (!meta) {
      return new NextResponse(null, { status: 404 });
    }
    return new NextResponse(null, {
      status: 200,
      headers: { "Content-Type": (meta as { contentType?: string })?.contentType || "image/webp" },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
