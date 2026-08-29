import type { Bike } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";

const TIPO_LABELS: Record<string, string> = {
  urbana: "urbana",
  plegable: "plegable",
  montana: "de montaña",
  trekking: "de trekking",
  cargo: "de carga",
};

export function BikeImage({ bike, className = "" }: { bike: Bike; className?: string }) {
  const tipoLabel = TIPO_LABELS[bike.tipo] ?? bike.tipo;
  const alt = `${bike.marca} ${bike.modelo} — e-bike ${tipoLabel}`;

  if (bike.imagen) {
    return (
      <div className={`relative overflow-hidden bg-surf ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bike.imagen} alt={alt} className="absolute inset-0 h-full w-full object-contain p-2" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <ImagePlaceholder label={bike.imagenPlaceholder} className="h-full w-full" />
    </div>
  );
}
