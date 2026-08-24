"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "ebg:favoritos";

type FavoritesContextValue = {
  favoritos: string[];
  isFavorito: (bikeId: string) => boolean;
  toggleFavorito: (bikeId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Deliberately deferred to after mount: reading localStorage during render would
    // desync the client's first render from the server-rendered (localStorage-less) HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavoritos(readStoredFavorites());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch {
      // localStorage no disponible (modo privado, cuota llena, etc.): el estado sigue funcionando en memoria.
    }
  }, [favoritos, hydrated]);

  const toggleFavorito = useCallback((bikeId: string) => {
    setFavoritos((prev) => (prev.includes(bikeId) ? prev.filter((id) => id !== bikeId) : [...prev, bikeId]));
  }, []);

  const isFavorito = useCallback((bikeId: string) => favoritos.includes(bikeId), [favoritos]);

  const value = useMemo(() => ({ favoritos, isFavorito, toggleFavorito }), [favoritos, isFavorito, toggleFavorito]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
