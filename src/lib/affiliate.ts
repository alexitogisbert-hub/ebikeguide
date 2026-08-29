import type { OfertaBike } from "@/data/ebg-data";

/**
 * Texto del CTA para una oferta. La urgencia (descuento, pocas unidades) solo se aplica
 * cuando hay affiliateUrl — es decir, cuando el clic genera comisión. Un enlace sin
 * afiliación se queda con un texto neutro para no sobrevender algo que no nos beneficia.
 */
export function ofertaCtaLabel(oferta: OfertaBike, opts?: { discountPct?: number | null }): string {
  if (oferta.affiliateUrl) {
    if (oferta.disponibilidad === "pocas") return "Comprar antes de que se agote";
    if (opts?.discountPct) return `Comprar con -${opts.discountPct}% de descuento`;
    return "Ver precio y comprar";
  }
  if (oferta.urlProducto) return "Ver precio actual en Amazon";
  return "Enlace pendiente";
}
