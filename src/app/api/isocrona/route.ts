import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "El mapa de alcance no está configurado (falta ORS_API_KEY)." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const lat = Number(body?.lat);
  const lon = Number(body?.lon);
  const rangeMeters = Number(body?.rangeMeters);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(rangeMeters) || rangeMeters <= 0) {
    return NextResponse.json({ error: "Parámetros inválidos." }, { status: 400 });
  }

  const res = await fetch("https://api.openrouteservice.org/v2/isochrones/cycling-regular", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      locations: [[lon, lat]],
      range: [rangeMeters],
      range_type: "distance",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json(
      { error: `openrouteservice devolvió un error (${res.status}).`, detail },
      { status: 502 },
    );
  }

  const geojson = await res.json();
  return NextResponse.json({ geojson });
}
