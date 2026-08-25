"use client";

import { useMemo } from "react";
import { calcularAutonomia, type NivelAsistencia, type TipoTerreno } from "@/domain/autonomy";

const BATTERY_OPTIONS = [300, 375, 500, 625, 750];

const ASSIST_LEVELS: Array<{ id: NivelAsistencia; label: string }> = [
  { id: "eco", label: "Eco" },
  { id: "medio", label: "Medio" },
  { id: "alto", label: "Alto" },
  { id: "turbo", label: "Turbo" },
];

const TERRAIN_OPTIONS: Array<{ id: TipoTerreno; label: string }> = [
  { id: "llano", label: "Llano" },
  { id: "mixto", label: "Mixto" },
  { id: "montanoso", label: "Montañoso" },
];

export function AutonomyCalculator({
  bateriaWh,
  setBateriaWh,
  pesoKg,
  setPesoKg,
  assistId,
  setAssistId,
  terrainId,
  setTerrainId,
}: {
  bateriaWh: number;
  setBateriaWh: (wh: number) => void;
  pesoKg: number;
  setPesoKg: (kg: number) => void;
  assistId: NivelAsistencia;
  setAssistId: (id: NivelAsistencia) => void;
  terrainId: TipoTerreno;
  setTerrainId: (id: TipoTerreno) => void;
}) {
  const { minKm: min, maxKm: max, estimadoKm: estimado } = useMemo(
    () => calcularAutonomia({ bateriaWh, pesoKg, asistencia: assistId, terreno: terrainId }),
    [bateriaWh, pesoKg, assistId, terrainId],
  );

  const curveWidth = 280;
  const curveHeight = 130;
  const padX = 8;
  const padTop = 12;
  const padBottom = 24;
  const plotWidth = curveWidth - padX * 2;
  const plotHeight = curveHeight - padTop - padBottom;
  const baselineY = padTop + plotHeight;

  const chart = useMemo(() => {
    const axisMaxKm = Math.max(max, 1);
    const xForKm = (km: number) => padX + (Math.min(km, axisMaxKm) / axisMaxKm) * plotWidth;
    const yForPct = (pct: number) => padTop + (1 - pct / 100) * plotHeight;

    const startX = xForKm(0);
    const startY = yForPct(100);
    const endX = xForKm(estimado);
    const endY = yForPct(0);
    const controlX = xForKm(estimado * 0.55);
    const controlY = padTop + plotHeight * 0.62;

    const curvePath = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
    const areaPath = `${curvePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;

    return {
      axisMaxKm,
      startX,
      startY,
      endX,
      endY,
      curvePath,
      areaPath,
      bandX1: xForKm(min),
      bandX2: xForKm(max),
    };
  }, [min, max, estimado, plotWidth, plotHeight, baselineY]);

  return (
    <div className="animate-ebg-in flex h-full flex-col rounded-3xl border border-line p-8 sm:p-10">
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
        Calcula tu autonomía
      </h2>
      <p className="mt-2 text-sm text-mut">
        Ajusta la batería, tu peso, el nivel de asistencia y el terreno.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Capacidad de batería</span>
          <select
            value={bateriaWh}
            onChange={(e) => setBateriaWh(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus-visible:border-acc"
          >
            {BATTERY_OPTIONS.map((wh) => (
              <option key={wh} value={wh}>
                {wh} Wh
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-ink">Terreno</span>
          <select
            value={terrainId}
            onChange={(e) => setTerrainId(e.target.value as typeof terrainId)}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus-visible:border-acc"
          >
            {TERRAIN_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block text-sm">
        <span className="flex justify-between font-medium text-ink">
          <span>Peso del ciclista + carga</span>
          <span className="text-mut">{pesoKg} kg</span>
        </span>
        <input
          type="range"
          min={45}
          max={140}
          value={pesoKg}
          onChange={(e) => setPesoKg(Number(e.target.value))}
          className="mt-1.5 w-full"
        />
      </label>

      <div className="mt-5">
        <span className="text-sm font-medium text-ink">Nivel de asistencia</span>
        <div className="mt-1.5 grid grid-cols-4 gap-2">
          {ASSIST_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => setAssistId(level.id)}
              aria-pressed={assistId === level.id}
              className={`rounded-full border px-2 py-2 text-xs font-semibold sm:text-sm ${
                assistId === level.id
                  ? "border-acc bg-acc-s text-acc-d"
                  : "border-line text-mut hover:border-ink hover:text-ink"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-4xl font-extrabold text-ink">{estimado}</span>
          <span className="ml-1 text-sm font-semibold text-mut">km estimados</span>
          <p className="mt-1 text-sm text-mut">
            Rango probable: {min}–{max} km
          </p>
        </div>

        <svg
          viewBox={`0 0 ${curveWidth} ${curveHeight}`}
          className="w-full max-w-[240px] sm:ml-auto"
          role="img"
          aria-label={`Descarga estimada de la batería: de 100% a 0% en ${estimado} km, rango probable ${min}-${max} km`}
        >
          <defs>
            <linearGradient id="autonomyFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0fb5a0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0fb5a0" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect
            x={chart.bandX1}
            y={padTop}
            width={Math.max(chart.bandX2 - chart.bandX1, 1)}
            height={plotHeight}
            fill="#0fb5a0"
            opacity={0.1}
          />

          <line x1={padX} y1={baselineY} x2={curveWidth - padX} y2={baselineY} stroke="#e7eae9" strokeWidth={1} />

          <path d={chart.areaPath} fill="url(#autonomyFade)" stroke="none" />
          <path d={chart.curvePath} fill="none" stroke="#0fb5a0" strokeWidth={2.5} strokeLinecap="round" />

          <circle cx={chart.startX} cy={chart.startY} r={3} fill="#0fb5a0" />
          <circle cx={chart.endX} cy={chart.endY} r={3.5} fill="#0fb5a0" stroke="#fff" strokeWidth={1.5} />

          <text x={padX} y={curveHeight - 6} fill="#6b7773" fontSize={9}>
            0 km
          </text>
          <text x={curveWidth - padX} y={curveHeight - 6} fill="#6b7773" fontSize={9} textAnchor="end">
            {chart.axisMaxKm} km
          </text>
        </svg>
      </div>

      <p className="mt-4 text-xs text-mut">
        Modelo DEMO: consumo base 8,5 Wh/km ajustado por peso, terreno y asistencia.
      </p>
    </div>
  );
}
