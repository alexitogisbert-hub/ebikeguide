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

function formatAutonomia(bike: Bike): string {
  return `${bike.autonomiaKm.min}-${bike.autonomiaKm.max} km`;
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
    { campo: "parNm", label: "Par motor", valores: seleccion.map((b) => b.parNm) },
    { campo: "pesoKg", label: "Peso", valores: seleccion.map((b) => b.pesoKg) },
    { campo: "puntuacion", label: "Puntuación", valores: seleccion.map((b) => b.puntuacion) },
  ];

  return { bikes: seleccion, filas };
}
