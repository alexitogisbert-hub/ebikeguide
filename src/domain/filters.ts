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

export function filtrarBikes(bikes: Bike[], criterios: FiltroCriterios = {}): Bike[] {
  return bikes.filter((bike) => {
    if (criterios.tipo && bike.tipo !== criterios.tipo) return false;
    if (criterios.categoriaId && bike.categoriaId !== criterios.categoriaId) return false;
    if (criterios.precioMax !== undefined && bike.precio > criterios.precioMax) return false;
    if (criterios.precioMin !== undefined && bike.precio < criterios.precioMin) return false;
    // Peso no publicado: no lo excluimos por no poder confirmar que supera el máximo.
    if (criterios.pesoMax !== undefined && bike.pesoKg !== null && bike.pesoKg > criterios.pesoMax) return false;
    if (criterios.bateriaWhMin !== undefined && (bike.bateriaWh === null || bike.bateriaWh < criterios.bateriaWhMin)) return false;
    // Autonomía no publicada: no podemos confirmar que llega al mínimo pedido, así que se excluye.
    if (
      criterios.autonomiaMinKm !== undefined &&
      (bike.autonomiaMax === null || bike.autonomiaMax < criterios.autonomiaMinKm)
    )
      return false;
    if (criterios.puntuacionMin !== undefined && bike.puntuacion < criterios.puntuacionMin) return false;
    if (criterios.plegable !== undefined && bike.plegable !== criterios.plegable) return false;
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
      // Sin dato: se trata como la autonomía más baja posible, nunca como una ventaja.
      return bike.autonomiaMin !== null && bike.autonomiaMax !== null
        ? (bike.autonomiaMin + bike.autonomiaMax) / 2
        : Number.NEGATIVE_INFINITY;
    case "peso":
      // Sin dato: se trata como el peso más alto posible, nunca como una ventaja.
      return bike.pesoKg ?? Number.POSITIVE_INFINITY;
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
