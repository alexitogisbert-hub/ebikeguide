import type { Bike } from "@/data/ebg-data";

export type FiltroCriterios = {
  tipo?: string;
  categoriaId?: string;
  precioMax?: number;
  precioMin?: number;
  pesoMax?: number;
  bateriaWhMin?: number;
  autonomiaMinKm?: number;
  puntuacionMin?: number;
  plegable?: boolean;
};

export type OrdenCriterio = "puntuacion" | "precio" | "autonomia" | "peso" | "valor";
export type OrdenDireccion = "asc" | "desc";

const CATEGORIA_PLEGABLE = "plegables";

export function filtrarBikes(bikes: Bike[], criterios: FiltroCriterios = {}): Bike[] {
  return bikes.filter((bike) => {
    if (criterios.tipo && bike.tipo !== criterios.tipo) return false;
    if (criterios.categoriaId && bike.categoriaId !== criterios.categoriaId) return false;
    if (criterios.precioMax !== undefined && bike.precio > criterios.precioMax) return false;
    if (criterios.precioMin !== undefined && bike.precio < criterios.precioMin) return false;
    if (criterios.pesoMax !== undefined && bike.pesoKg > criterios.pesoMax) return false;
    if (criterios.bateriaWhMin !== undefined && bike.bateriaWh < criterios.bateriaWhMin) return false;
    if (criterios.autonomiaMinKm !== undefined && bike.autonomiaKm.max < criterios.autonomiaMinKm) return false;
    if (criterios.puntuacionMin !== undefined && bike.puntuacion < criterios.puntuacionMin) return false;
    if (criterios.plegable !== undefined) {
      const esPlegable = bike.categoriaId === CATEGORIA_PLEGABLE;
      if (esPlegable !== criterios.plegable) return false;
    }
    return true;
  });
}

function valorPorCriterio(bike: Bike, criterio: OrdenCriterio): number {
  switch (criterio) {
    case "puntuacion":
      return bike.puntuacion;
    case "precio":
      return bike.precio;
    case "autonomia":
      return (bike.autonomiaKm.min + bike.autonomiaKm.max) / 2;
    case "peso":
      return bike.pesoKg;
    case "valor":
      return bike.precio > 0 ? bike.puntuacion / bike.precio : 0;
  }
}

export function ordenarBikes(
  bikes: Bike[],
  criterio: OrdenCriterio,
  direccion: OrdenDireccion = "desc",
): Bike[] {
  const factor = direccion === "asc" ? 1 : -1;
  return [...bikes].sort((a, b) => (valorPorCriterio(a, criterio) - valorPorCriterio(b, criterio)) * factor);
}

export function filtrarYOrdenarBikes(
  bikes: Bike[],
  criterios: FiltroCriterios = {},
  criterioOrden: OrdenCriterio = "puntuacion",
  direccion: OrdenDireccion = "desc",
): Bike[] {
  return ordenarBikes(filtrarBikes(bikes, criterios), criterioOrden, direccion);
}
