import type { Bike } from "@/data/ebg-data";

export const MAX_BIKES_COMPARADOR = 4;

export type FilaComparativa = {
  campo: string;
  label: string;
  valores: Array<string | number>;
};

export type Comparativa = {
  bikes: Bike[];
  filas: FilaComparativa[];
};

const SIN_DATO = "Dato no publicado";

export function formatAutonomia(bike: Bike): string {
  if (bike.autonomiaMin === null || bike.autonomiaMax === null) return SIN_DATO;
  if (bike.autonomiaMin === bike.autonomiaMax) return `${bike.autonomiaMin} km`;
  return `${bike.autonomiaMin}-${bike.autonomiaMax} km`;
}

function formatNumero(valor: number | null, sufijo: string): string {
  return valor === null ? SIN_DATO : `${valor}${sufijo}`;
}

export function compararBikes(bikes: Bike[], ids: string[]): Comparativa {
  const idsUnicos = Array.from(new Set(ids)).slice(0, MAX_BIKES_COMPARADOR);
  const seleccion = idsUnicos
    .map((id) => bikes.find((bike) => bike.id === id))
    .filter((bike): bike is Bike => Boolean(bike));

  const filas: FilaComparativa[] = [
    { campo: "precio", label: "Precio", valores: seleccion.map((b) => b.precio) },
    { campo: "bateriaWh", label: "Batería", valores: seleccion.map((b) => b.bateriaWh) },
    { campo: "autonomia", label: "Autonomía", valores: seleccion.map(formatAutonomia) },
    { campo: "motor", label: "Motor", valores: seleccion.map((b) => b.motor) },
    { campo: "parNm", label: "Par motor", valores: seleccion.map((b) => formatNumero(b.parNm, " Nm")) },
    { campo: "pesoKg", label: "Peso", valores: seleccion.map((b) => formatNumero(b.pesoKg, " kg")) },
    { campo: "puntuacion", label: "Puntuación", valores: seleccion.map((b) => b.puntuacion) },
  ];

  return { bikes: seleccion, filas };
}
