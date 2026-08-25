import { NextResponse } from "next/server";

export const runtime = "nodejs";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("countrycodes", "es");
  url.searchParams.set("limit", "5");

  const res = await fetch(url, {
    headers: {
      // Nominatim's usage policy requires a descriptive User-Agent identifying the app.
      "User-Agent": "eBikeGuide-demo/1.0 (contacto@ebikeguide.es)",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo buscar la ciudad." }, { status: 502 });
  }

  const data = (await res.json()) as NominatimResult[];
  const results = data.map((r) => ({
    label: r.display_name,
    lat: Number(r.lat),
    lon: Number(r.lon),
  }));

  return NextResponse.json({ results });
}
