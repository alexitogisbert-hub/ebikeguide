import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("format", "json");
  url.searchParams.set("zoom", "12");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "eBikeGuide-demo/1.0 (contacto@ebikeguide.es)",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo identificar el lugar." }, { status: 502 });
  }

  const data = await res.json();
  const label: string | undefined =
    data.address?.city ?? data.address?.town ?? data.address?.village ?? data.address?.municipality ?? data.display_name;

  return NextResponse.json({ label: label ?? `${lat.toFixed(3)}, ${lon.toFixed(3)}` });
}
