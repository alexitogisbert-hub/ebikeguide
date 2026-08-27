"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites-context";
import { EBG_DATA } from "@/data/ebg-data";
import { BikeDealCard } from "./BikeDealCard";

export function FavoritosClient() {
  const { favoritos } = useFavorites();
  const bikes = favoritos
    .map((id) => EBG_DATA.bikes.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  if (bikes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-12 text-center">
        <p className="text-sm text-mut">
          Todavía no has guardado ninguna bici. Pulsa el corazón en cualquier bici del catálogo para añadirla aquí.
        </p>
        <Link
          href="/bicicletas-electricas/"
          className="mt-5 inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-acc-d"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bikes.map((bike) => (
        <BikeDealCard key={bike.id} bike={bike} />
      ))}
    </div>
  );
}
