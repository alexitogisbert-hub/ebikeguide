"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SearchIcon } from "./icons";

const RangoMapaCanvas = dynamic(() => import("./RangoMapaCanvas").then((m) => m.RangoMapaCanvas), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-dark" />,
});

type CityResult = { label: string; lat: number; lon: number };

export function RangoMapa({ estimadoKm }: { estimadoKm: number }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [selected, setSelected] = useState<CityResult | null>(null);
  const [roundTrip, setRoundTrip] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [shownRangeKm, setShownRangeKm] = useState<number | null>(null);
  useEffect(() => {
    const shouldClear = query.trim().length < 3 || selected !== null;

    const timer = setTimeout(async () => {
      if (shouldClear) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/geocode/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.results ?? []);
      } catch {
        setSuggestions([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, selected]);

  function selectCity(city: CityResult) {
    setSelected(city);
    setQuery(city.label);
    setSuggestions([]);
    setGeojson(null);
    setError(null);
  }

  async function calcularAlcance(city: CityResult) {
    setLoading(true);
    setError(null);
    const rangeKm = roundTrip ? estimadoKm / 2 : estimadoKm;
    try {
      const res = await fetch("/api/isocrona/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: city.lat, lon: city.lon, rangeMeters: rangeKm * 1000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setGeojson(data.geojson);
      setShownRangeKm(Math.round(rangeKm));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo calcular el alcance.");
      setGeojson(null);
    } finally {
      setLoading(false);
    }
  }

  function verAlcance() {
    if (selected) calcularAlcance(selected);
  }

  async function handleMapClick(lat: number, lon: number) {
    setError(null);
    setSuggestions([]);
    setGeojson(null);
    setQuery("Buscando lugar…");
    setSelected({ label: "Ubicación seleccionada", lat, lon });

    let label = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
    try {
      const res = await fetch(`/api/geocode-inverso/?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.label) label = data.label;
    } catch {
      // Sin etiqueta de lugar: seguimos con las coordenadas.
    }

    const city: CityResult = { label, lat, lon };
    setSelected(city);
    setQuery(label);
    await calcularAlcance(city);
  }

  return (
    <div className="animate-ebg-in flex h-full flex-col rounded-3xl border border-line bg-dark p-6 text-white sm:p-8">
      <h2 className="text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">Alcance real en el mapa</h2>
      <p className="mt-2 text-sm text-white/60">
        Elige una ciudad y verás la zona que podrías cubrir con los {estimadoKm} km estimados, siguiendo carreteras
        reales — no un simple círculo.
      </p>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            placeholder="Busca una ciudad de España…"
            className="w-full rounded-full border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/40 focus-visible:border-acc"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-white/15 bg-[#171d1c] shadow-lg">
              {suggestions.map((s) => (
                <li key={`${s.lat}-${s.lon}`}>
                  <button
                    type="button"
                    onClick={() => selectCity(s)}
                    className="block w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/10"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex overflow-hidden rounded-full border border-white/15 text-xs font-semibold">
          <button
            type="button"
            aria-pressed={roundTrip}
            onClick={() => setRoundTrip(true)}
            className={`px-3 py-2.5 transition-colors ${roundTrip ? "bg-acc text-dark" : "text-white/60 hover:text-white"}`}
          >
            Ida y vuelta
          </button>
          <button
            type="button"
            aria-pressed={!roundTrip}
            onClick={() => setRoundTrip(false)}
            className={`px-3 py-2.5 transition-colors ${!roundTrip ? "bg-acc text-dark" : "text-white/60 hover:text-white"}`}
          >
            Solo ida
          </button>
        </div>

        <button
          type="button"
          onClick={verAlcance}
          disabled={!selected || loading}
          className="rounded-full bg-acc px-4 py-2.5 text-xs font-semibold text-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Calculando…" : "Ver alcance"}
        </button>
      </div>

      <div className="relative z-0 mt-5 h-[280px] overflow-hidden rounded-2xl border border-white/10 sm:h-[340px]">
        <RangoMapaCanvas center={selected} geojson={geojson} onMapClick={handleMapClick} />
      </div>
      <p className="mt-2 text-xs text-white/40">O haz clic en cualquier punto del mapa para ver su alcance.</p>

      {error && (
        <p role="alert" className="mt-3 text-xs text-red-300">
          {error}
        </p>
      )}

      {geojson && shownRangeKm !== null && selected && (
        <p className="mt-4 flex items-center gap-2 text-sm text-white/80">
          <span className="size-2.5 rounded-full bg-acc" aria-hidden="true" />
          {estimadoKm} km estimados · {roundTrip ? "ida y vuelta" : "solo ida"} → {shownRangeKm} km desde{" "}
          {selected.label.split(",")[0]}
        </p>
      )}

      <p className="mt-3 text-xs text-white/40">
        En «ida y vuelta» la zona se calcula con la mitad de la autonomía (para poder regresar); en «solo ida», con
        la autonomía completa. Estimada sobre la red de carreteras (isócrona vía openrouteservice); la autonomía
        real varía según el modo, el terreno, el peso y el viento.
      </p>
    </div>
  );
}
