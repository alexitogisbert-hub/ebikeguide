import type { Bike, PesoPuntuacion, SubPuntuaciones } from "@/data/ebg-data";

export type ScoreBreakdownItem = {
  id: string;
  label: string;
  valor: number | null;
  peso: number;
  aportacion: number;
};

export type BikeScore = {
  bikeId: string;
  puntuacion: number;
  desglose: ScoreBreakdownItem[];
};

const PESOS_EPSILON = 0.01;

export function validatePesosPuntuacion(pesos: PesoPuntuacion[]): { valido: boolean; sumaTotal: number } {
  const sumaTotal = pesos.reduce((sum, p) => sum + p.peso, 0);
  return { valido: Math.abs(sumaTotal - 100) <= PESOS_EPSILON, sumaTotal };
}

/**
 * Percentil 0-10 del elemento en `indice` dentro de `valores`, donde un valor RAW más alto
 * puntúa más alto. Los `null` (dato no publicado) no participan como puntos de comparación:
 * el percentil se calcula solo entre los valores conocidos. Empates comparten el mismo rango
 * (rango medio / "fractional ranking"). Con un único valor conocido, devuelve 10 (no hay con
 * qué comparar). Devuelve `null` si el propio elemento no tiene valor conocido.
 */
export function percentil(valores: Array<number | null | undefined>, indice: number): number | null {
  const v = valores[indice];
  if (v === null || v === undefined) return null;

  const conocidos = valores.filter((x): x is number => x !== null && x !== undefined);
  const n = conocidos.length;
  if (n <= 1) return 10;

  const menor = conocidos.filter((x) => x < v).length;
  const menorIgual = conocidos.filter((x) => x <= v).length;
  const rangoMedio = (menor + menorIgual - 1) / 2;

  return Math.round((rangoMedio / (n - 1)) * 100) / 10;
}

/** Igual que `percentil`, pero un valor RAW más bajo puntúa más alto (p. ej. peso). */
export function percentilInverso(valores: Array<number | null | undefined>, indice: number): number | null {
  const invertidos = valores.map((v) => (v === null || v === undefined ? null : -v));
  return percentil(invertidos, indice);
}

export type MetricasBike = {
  /** Categoría (`bike.tipo`): el percentil de cada criterio se calcula solo frente a esta. */
  tipo: string;
  /** Punto medio de autonomiaMin/autonomiaMax, o null si no está confirmada. */
  autonomiaKm: number | null;
  parNm: number | null;
  pesoKg: number | null;
  precio: number;
};

/**
 * Calcula `subs` (0-10) para cada bici del catálogo, de forma puramente algorítmica a partir
 * de especificaciones publicadas — sin opinión editorial, porque `meta.pruebasPropias` es
 * `false` y no hemos probado físicamente ninguna bici real.
 *
 * - autonomia: percentil de autonomiaKm (más km, mejor).
 * - potencia: percentil de parNm (más par, mejor).
 * - peso: percentil inverso de pesoKg (menos kg, mejor).
 * - precio: percentil inverso del precio (más barata dentro del catálogo, mejor).
 *
 * El percentil de cada criterio se calcula frente a las demás bicis de la misma categoría
 * (`tipo`), no frente al catálogo entero: una urbana compite con urbanas, una montaña con
 * montañas, etc. — comparar el peso de una plegable con el de una cargo no aporta nada útil.
 * Si una categoría tiene una sola bici, esa bici obtiene percentil 10 en cada criterio con
 * dato (es la mejor de su categoría por definición, al no haber con qué compararla).
 *
 * `precio` es el único criterio que nunca puede quedar en `null` (el precio siempre existe,
 * aunque sea orientativo) — a propósito: así, aunque a una bici le falten todos los demás
 * datos objetivos, sigue teniendo al menos un criterio con el que calcular una puntuación en
 * vez de quedarse en 0/10, que se leería como "la peor bici" en lugar de "no hay datos
 * suficientes para evaluarla".
 *
 * Si a una bici le falta el dato necesario para autonomia/potencia/peso, ese criterio queda
 * en `null` para ella (no se inventa un valor) y no participa en el percentil de las demás.
 */
export function calcularSubsCatalogo(metricas: MetricasBike[]): SubPuntuaciones[] {
  return metricas.map((m) => {
    const mismaCategoria = metricas.filter((x) => x.tipo === m.tipo);
    const indiceEnCategoria = mismaCategoria.indexOf(m);

    const autonomias = mismaCategoria.map((x) => x.autonomiaKm);
    const potencias = mismaCategoria.map((x) => x.parNm);
    const pesos = mismaCategoria.map((x) => x.pesoKg);
    const precios = mismaCategoria.map((x) => x.precio);

    return {
      autonomia: percentil(autonomias, indiceEnCategoria),
      potencia: percentil(potencias, indiceEnCategoria),
      peso: percentilInverso(pesos, indiceEnCategoria),
      precio: percentilInverso(precios, indiceEnCategoria),
    };
  });
}

/**
 * Media ponderada de `subs` según `pesos`, tratando los `null` como "criterio no aplicable
 * para esta bici" en vez de como 0: su peso se excluye y se renormaliza entre los criterios
 * que sí tienen dato, para no penalizar a una bici solo porque el fabricante no publicó una
 * especificación. Devuelve 0 si ningún criterio tiene dato.
 */
export function computeWeightedScore(
  subs: Partial<Record<string, number | null>>,
  pesos: PesoPuntuacion[],
): number {
  const disponibles = pesos.filter((p) => typeof subs[p.id] === "number");
  const sumaPesos = disponibles.reduce((sum, p) => sum + p.peso, 0);
  if (sumaPesos === 0) return 0;

  const sumaPonderada = disponibles.reduce((sum, p) => sum + (subs[p.id] as number) * p.peso, 0);
  return Math.round((sumaPonderada / sumaPesos) * 10) / 10;
}

export function scoreBikeBreakdown(bike: Bike, pesos: PesoPuntuacion[]): BikeScore {
  const disponibles = pesos.filter((p) => typeof bike.subs[p.id as keyof SubPuntuaciones] === "number");
  const sumaPesosDisponibles = disponibles.reduce((sum, p) => sum + p.peso, 0);

  const desglose: ScoreBreakdownItem[] = pesos.map((peso) => {
    const valor = bike.subs[peso.id as keyof SubPuntuaciones] ?? null;
    const aportacion =
      valor === null || sumaPesosDisponibles === 0
        ? 0
        : Math.round(((valor * peso.peso) / sumaPesosDisponibles) * 10) / 10;
    return { id: peso.id, label: peso.label, valor, peso: peso.peso, aportacion };
  });

  return {
    bikeId: bike.id,
    puntuacion: computeWeightedScore(bike.subs, pesos),
    desglose,
  };
}

export function scoreBikes(bikes: Bike[], pesos: PesoPuntuacion[]): BikeScore[] {
  return bikes.map((bike) => scoreBikeBreakdown(bike, pesos));
}

export type BadgeBici = {
  emoji: string;
  etiqueta: string;
  criterio: "autonomia" | "motor" | "peso" | "precio" | "familiar" | "triciclo";
};

/**
 * Badge principal de una bici para las tarjetas del catálogo. Prioridad, de mayor a menor:
 * 1. Triciclo (`esTriciclo`) — cambia por completo cómo se conduce, es lo más relevante a
 *    comunicar antes que ningún dato de la sub-puntuación.
 * 2. Familiar (categoría cargo) — pensada para llevar carga o niños, no para destacar en
 *    autonomía/potencia/peso/precio frente al resto del catálogo.
 * 3. El criterio con mayor sub-puntuación dentro de su categoría (autonomía/motor/peso/precio),
 *    ignorando los que no tienen dato. Caso especial: si es una plegable y el criterio que gana
 *    es el peso, se etiqueta "Plegable ligera" en vez del genérico "Ligera".
 */
export function obtenerBadgePrincipal(bike: Bike): BadgeBici {
  if (bike.esTriciclo) {
    return { emoji: "🛺", etiqueta: "Triciclo", criterio: "triciclo" };
  }
  if (bike.tipo === "cargo" || bike.tipo === "familiar") {
    return { emoji: "👨‍👩‍👧", etiqueta: "Familiar", criterio: "familiar" };
  }

  const subs = bike.subs;
  type Candidato = { criterio: "autonomia" | "motor" | "peso" | "precio"; valor: number | null; emoji: string; etiqueta: string };
  const candidatos: Candidato[] = [
    { criterio: "autonomia", valor: subs.autonomia, emoji: "🔋", etiqueta: "Larga autonomía" },
    { criterio: "motor", valor: subs.potencia, emoji: "⚡", etiqueta: "Motor potente" },
    { criterio: "peso", valor: subs.peso, emoji: "🪶", etiqueta: "Ligera" },
    { criterio: "precio", valor: subs.precio, emoji: "💰", etiqueta: "Calidad-precio" },
  ];
  const conDato = candidatos.filter((c): c is Candidato & { valor: number } => c.valor !== null);
  if (conDato.length === 0) return { emoji: "📊", etiqueta: "En análisis", criterio: "precio" };
  const mejor = conDato.reduce((a, b) => (b.valor > a.valor ? b : a));

  if (bike.tipo === "plegable" && mejor.criterio === "peso") {
    return { emoji: "📦", etiqueta: "Plegable ligera", criterio: "peso" };
  }

  return { emoji: mejor.emoji, etiqueta: mejor.etiqueta, criterio: mejor.criterio };
}
