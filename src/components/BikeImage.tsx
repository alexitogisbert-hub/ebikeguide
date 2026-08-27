"use client";

import { useState } from "react";
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

const EXTENSIONS = ["webp", "jpg", "png"];

export function BikeImage({ bike, className = "" }: { bike: Bike; className?: string }) {
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const src = bike.imagen || (!failed ? `/bikes/${bike.slug}.${EXTENSIONS[extIdx]}` : null);

  if (!src || failed) {
    return <ImagePlaceholder label={bike.imagenPlaceholder} className={className} />;
  }

  const tipoLabel = TIPO_LABELS[bike.tipo] ?? bike.tipo;
  const alt = `${bike.marca} ${bike.modelo} — e-bike ${tipoLabel}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
        onError={() => {
          if (!bike.imagen && extIdx < EXTENSIONS.length - 1) {
            setExtIdx(extIdx + 1);
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
