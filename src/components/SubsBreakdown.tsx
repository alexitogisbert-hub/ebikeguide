import type { Bike } from "@/data/ebg-data";
import { scoreBikeBreakdown } from "@/domain/scoring";
import { EBG_DATA } from "@/data/ebg-data";

export function SubsBreakdown({ bike }: { bike: Bike }) {
  const { desglose } = scoreBikeBreakdown(bike, EBG_DATA.meta.pesosPuntuacion);

  return (
    <div className="flex flex-col gap-3">
      {desglose.map((item) => (
        <div key={item.id}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink">{item.label}</span>
            <span className="text-mut">{item.valor.toFixed(1)}/10</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surf">
            <div
              className="h-full rounded-full bg-acc"
              style={{ width: `${Math.max(0, Math.min(100, item.valor * 10))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
