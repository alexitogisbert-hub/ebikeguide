import type { OfertaBike } from "@/data/ebg-data";

/** Texto del CTA para una oferta, según qué enlace tengamos disponible. */
export function ofertaCtaLabel(oferta: OfertaBike): string {
  if (oferta.affiliateUrl) return "Ver oferta";
  if (oferta.urlProducto) return "Ver precio actual en Amazon";
  return "Enlace pendiente";
}
