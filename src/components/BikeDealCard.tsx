"use client";

import Link from "next/link";
import type { Bike } from "@/data/ebg-data";
import { EBG_DATA } from "@/data/ebg-data";
import { obtenerBadgePrincipal } from "@/domain/scoring";
import { useFavorites } from "@/lib/favorites-context";
import { AffiliateLink, ofertaCtaLabel } from "./AffiliateLink";
import { BikeImage } from "./BikeImage";
import { HeartIcon } from "./icons";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/**
 * `showBuyCta`: además del botón habitual "Ver análisis y precios", añade un botón
 * primario grande que enlaza directo a la oferta — pensado para los resultados del
 * quiz, donde el usuario ya decidió qué quiere y no debería tener que dar un paso
 * más para llegar al precio.
 */
export function BikeDealCard({ bike, showBuyCta = false }: { bike: Bike; showBuyCta?: boolean }) {
  const { isFavorito, toggleFavorito } = useFavorites();
  const favorited = isFavorito(bike.id);
  const discountPct = bike.precioAnterior
    ? Math.round((1 - bike.precio / bike.precioAnterior) * 100)
    : null;
  const badge = obtenerBadgePrincipal(bike);
  const ofertaPrincipal = bike.ofertas[0];
  const merchantPrincipal = ofertaPrincipal
    ? (EBG_DATA.merchants.find((m) => m.id === ofertaPrincipal.merchantId)?.nombre ?? ofertaPrincipal.merchantId)
    : "";

  return (
    <div className="rounded-2xl border border-line transition-shadow duration-200 hover:shadow-lg">
      <div className="relative">
        <BikeImage bike={bike} className="aspect-square w-full rounded-t-2xl" />
        {discountPct !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-sale px-2.5 py-1 text-xs font-bold text-white">
            -{discountPct}%
          </span>
        )}
        <button
          type="button"
          aria-label={favorited ? "Quitar de favoritos" : "Añadir a favoritos"}
          aria-pressed={favorited}
          onClick={() => toggleFavorito(bike.id)}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
        >
          <HeartIcon className="size-4" filled={favorited} />
        </button>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-mut">{bike.marca}</p>
        <h2 className="mt-0.5 font-semibold text-ink">{bike.modelo}</h2>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-acc-s px-2 py-0.5 text-xs font-bold text-acc-d">
            <span aria-hidden="true">{badge.emoji}</span>
            {badge.etiqueta}
          </span>
          {discountPct !== null && (
            <span className="inline-flex items-center rounded-full bg-sale-s px-2 py-0.5 text-xs font-bold text-sale-d">
              En oferta
            </span>
          )}
          {bike.esTriciclo && <span className="text-xs font-medium text-mut">Triciclo</span>}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-ink">{priceFormatter.format(bike.precio)}</span>
          {bike.precioAnterior && (
            <span className="text-sm text-mut line-through">
              {priceFormatter.format(bike.precioAnterior)}
            </span>
          )}
        </div>

        {showBuyCta && ofertaPrincipal ? (
          <div className="mt-4 flex flex-col gap-2">
            <AffiliateLink
              oferta={ofertaPrincipal}
              merchantName={merchantPrincipal}
              className="flex items-center justify-center rounded-full bg-acc py-3 text-sm font-bold text-dark transition-opacity hover:opacity-90"
            >
              {ofertaCtaLabel(ofertaPrincipal)}
            </AffiliateLink>
            <Link
              href={`/bicicletas-electricas/${bike.slug}/`}
              className="flex items-center justify-center rounded-full border border-line py-2.5 text-sm font-semibold text-ink hover:border-ink"
            >
              Leer análisis
            </Link>
          </div>
        ) : (
          <Link
            href={`/bicicletas-electricas/${bike.slug}/`}
            className="mt-4 flex items-center justify-center rounded-full border border-line py-2.5 text-sm font-semibold text-ink hover:border-ink"
          >
            Ver análisis y precios
          </Link>
        )}
      </div>
    </div>
  );
}
