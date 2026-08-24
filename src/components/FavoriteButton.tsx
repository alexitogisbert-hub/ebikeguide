"use client";

import { useFavorites } from "@/lib/favorites-context";
import { HeartIcon } from "./icons";

export function FavoriteButton({ bikeId, className }: { bikeId: string; className?: string }) {
  const { isFavorito, toggleFavorito } = useFavorites();
  const favorited = isFavorito(bikeId);

  return (
    <button
      type="button"
      aria-label={favorited ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-pressed={favorited}
      onClick={() => toggleFavorito(bikeId)}
      className={className}
    >
      <HeartIcon filled={favorited} />
    </button>
  );
}
