"use client";

import Link from "next/link";
import type { Bike } from "@/data/ebg-data";
import { useFavorites } from "@/lib/favorites-context";
import { BikeImage } from "./BikeImage";
import { HeartIcon } from "./icons";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function BikeDealCard({ bike }: { bike: Bike }) {
  const { isFavorito, toggleFavorito } = useFavorites();
  const favorited = isFavorito(bike.id);
  const discountPct = bike.precioAnterior
    ? Math.round((1 - bike.precio / bike.precioAnterior) * 100)
    : null;

  return (
    <div className="rounded-2xl border border-line transition-shadow duration-200 hover:shadow-lg">
      <div className="relative">
        <BikeImage bike={bike} className="h-[160px] w-full rounded-t-2xl" />
        {discountPct !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
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

        <div className="mt-2 flex items-center gap-1.5 text-sm">
          {bike.puntuacion > 0 ? (
            <span className="rounded-full bg-acc-s px-2 py-0.5 text-xs font-bold text-acc-d">
              {bike.puntuacion.toFixed(1)}/10
            </span>
          ) : (
            <span className="rounded-full bg-surf px-2 py-0.5 text-xs font-bold text-mut">Sin datos suficientes</span>
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

        <Link
          href={`/bicicletas-electricas/${bike.slug}/`}
          className="mt-4 flex items-center justify-center rounded-full border border-line py-2.5 text-sm font-semibold text-ink hover:border-ink"
        >
          Ver análisis y precios
        </Link>
      </div>
    </div>
  );
}
