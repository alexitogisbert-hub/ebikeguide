import Image from "next/image";
import type { Bike } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";

const TIPO_LABELS: Record<string, string> = {
  urbana: "urbana",
  plegable: "plegable",
  montana: "de montaña",
  trekking: "de trekking",
  cargo: "de carga",
};

/**
 * Foto de una bici, con fallback automático al placeholder de texto mientras
 * `bike.imagen` esté vacío (ver el comentario de ese campo en ebg-data.ts).
 */
export function BikeImage({ bike, className = "" }: { bike: Bike; className?: string }) {
  if (!bike.imagen) {
    return <ImagePlaceholder label={bike.imagenPlaceholder} className={className} />;
  }

  const tipoLabel = TIPO_LABELS[bike.tipo] ?? bike.tipo;
  const alt = `${bike.marca} ${bike.modelo} — e-bike ${tipoLabel}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={bike.imagen} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
    </div>
  );
}
