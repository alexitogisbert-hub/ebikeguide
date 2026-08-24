"use client";

import { useMemo, useState } from "react";
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

export function AutonomyCalculator() {
  const [bateriaWh, setBateriaWh] = useState(500);
  const [pesoKg, setPesoKg] = useState(80);
  const [assistId, setAssistId] = useState<NivelAsistencia>("medio");
  const [terrainId, setTerrainId] = useState<TipoTerreno>("mixto");

  const { minKm: min, maxKm: max, estimadoKm: estimado } = useMemo(
    () => calcularAutonomia({ bateriaWh, pesoKg, asistencia: assistId, terreno: terrainId }),
    [bateriaWh, pesoKg, assistId, terrainId],
  );

  const curveWidth = 280;
  const curveHeight = 100;
  const curvePath = `M 6 10 Q ${curveWidth * 0.55} 30 ${curveWidth - 6} ${curveHeight - 10}`;

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
          className="w-full max-w-[220px] sm:ml-auto"
          role="img"
          aria-label={`Curva de descarga estimada hasta ${estimado} kilómetros`}
        >
          <line x1={6} y1={curveHeight - 10} x2={curveWidth - 6} y2={curveHeight - 10} stroke="#e7eae9" strokeWidth={1} />
          <path d={curvePath} fill="none" stroke="#0fb5a0" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={6} cy={10} r={3} fill="#0fb5a0" />
          <circle cx={curveWidth - 6} cy={curveHeight - 10} r={3} fill="#0fb5a0" />
        </svg>
      </div>

      <p className="mt-4 text-xs text-mut">
        Modelo DEMO: consumo base 8,5 Wh/km ajustado por peso, terreno y asistencia.
      </p>
    </div>
  );
}
