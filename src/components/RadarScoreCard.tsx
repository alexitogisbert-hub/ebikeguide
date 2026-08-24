import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";

const DEMO_SCORES: Record<string, number> = {
  autonomia: 86,
  confort: 90,
  potencia: 88,
  equipamiento: 90,
  frenada: 85,
  peso: 80,
  precio: 85,
};

const SIZE = 220;
const CENTER = SIZE / 2;
const RADIUS = 84;
const RINGS = [0.25, 0.5, 0.75, 1];

function pointFor(index: number, total: number, fraction: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  return {
    x: CENTER + Math.cos(angle) * RADIUS * fraction,
    y: CENTER + Math.sin(angle) * RADIUS * fraction,
  };
}

export function RadarScoreCard() {
  const axes = EBG_DATA.meta.pesosPuntuacion;
  const total = axes.length;

  const dataPoints = axes.map((axis, i) => pointFor(i, total, (DEMO_SCORES[axis.id] ?? 80) / 100));
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const overallScore = Math.round(
    axes.reduce((sum, axis) => sum + (DEMO_SCORES[axis.id] ?? 80) * axis.peso, 0) / 100,
  );

  return (
    <div className="animate-ebg-in flex h-full flex-col justify-between rounded-3xl bg-dark p-8 text-white sm:p-10">
      <div>
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-[28px]">
          Las mejores e-bikes según tu perfil
        </h2>
        <p className="mt-3 max-w-[38ch] text-sm text-white/65">
          Responde 5 preguntas sobre tu uso y presupuesto y te mostramos las bicicletas
          mejor puntuadas para ti, con el desglose completo de la nota.
        </p>
        <Link
          href="/encontrar-bicicleta/"
          className="mt-5 inline-flex items-center rounded-full bg-acc px-5 py-3 text-sm font-semibold text-dark hover:bg-white"
        >
          Hacer el quiz →
        </Link>
      </div>

      <div className="mx-auto mt-8 flex flex-col items-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[240px]" role="img" aria-label={`Puntuación de ejemplo: ${overallScore} sobre 100`}>
          {RINGS.map((f) => (
            <polygon
              key={f}
              points={axes.map((_, i) => {
                const p = pointFor(i, total, f);
                return `${p.x},${p.y}`;
              }).join(" ")}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          ))}

          {axes.map((axis, i) => {
            const p = pointFor(i, total, 1);
            return (
              <line
                key={axis.id}
                x1={CENTER}
                y1={CENTER}
                x2={p.x}
                y2={p.y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
              />
            );
          })}

          <polygon points={dataPath} fill="rgba(15,181,160,0.35)" stroke="#0fb5a0" strokeWidth={2} strokeLinejoin="round" />

          {dataPoints.map((p, i) => (
            <circle key={axes[i].id} cx={p.x} cy={p.y} r={3} fill="#0fb5a0" />
          ))}

          {axes.map((axis, i) => {
            const p = pointFor(i, total, 1.16);
            const anchor = p.x > CENTER + 4 ? "start" : p.x < CENTER - 4 ? "end" : "middle";
            return (
              <text
                key={axis.id}
                x={p.x}
                y={p.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                className="fill-white/60"
                style={{ fontSize: 8 }}
              >
                {axis.label}
              </text>
            );
          })}
        </svg>

        <div className="mt-2 text-center">
          <span className="text-3xl font-extrabold text-acc">{overallScore}</span>
          <span className="text-sm text-white/50">/100 · puntuación de ejemplo</span>
        </div>
      </div>
    </div>
  );
}
