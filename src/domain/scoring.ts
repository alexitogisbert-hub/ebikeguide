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

export function tierAutonomia(km: number | null): number | null {
  if (km === null) return null;
  if (km >= 120) return 10;
  if (km >= 100) return 9;
  if (km >= 80) return 8.5;
  if (km >= 60) return 8;
  if (km >= 40) return 7;
  return 6;
}

export function tierMotor(nm: number | null): number | null {
  if (nm === null) return null;
  if (nm >= 75) return 10;
  if (nm >= 65) return 9;
  if (nm >= 45) return 8;
  if (nm >= 35) return 7;
  return 6;
}

export function tierPeso(kg: number | null): number | null {
  if (kg === null) return null;
  if (kg <= 19) return 10;
  if (kg <= 24) return 9;
  if (kg <= 29) return 8;
  if (kg <= 31) return 7;
  return 6;
}

export function tierPrecio(euros: number): number {
  if (euros <= 699) return 10;
  if (euros <= 999) return 9;
  if (euros <= 1499) return 8;
  if (euros <= 1999) return 7;
  return 6;
}

export type MetricasBike = {
  autonomiaKm: number | null;
  parNm: number | null;
  pesoKg: number | null;
  precio: number;
};

export function calcularSubsTier(metricas: MetricasBike[]): SubPuntuaciones[] {
  return metricas.map((m) => ({
    autonomia: tierAutonomia(m.autonomiaKm),
    potencia: tierMotor(m.parNm),
    peso: tierPeso(m.pesoKg),
    precio: tierPrecio(m.precio),
  }));
}

export const PESOS_POR_TIPO: Record<string, PesoPuntuacion[]> = {
  urbana: [
    { id: "autonomia", label: "Autonomía", peso: 30, que: "Nota por tramos de la autonomía estimada (km)." },
    { id: "potencia", label: "Motor", peso: 15, que: "Nota por tramos del par motor (Nm)." },
    { id: "peso", label: "Peso", peso: 25, que: "Nota por tramos inversos del peso (menos kg, mejor)." },
    { id: "precio", label: "Precio", peso: 30, que: "Nota por tramos inversos del precio (más barata, mejor)." },
  ],
  plegable: [
    { id: "autonomia", label: "Autonomía", peso: 25, que: "Nota por tramos de la autonomía estimada (km)." },
    { id: "potencia", label: "Motor", peso: 15, que: "Nota por tramos del par motor (Nm)." },
    { id: "peso", label: "Peso", peso: 35, que: "Nota por tramos inversos del peso (menos kg, mejor)." },
    { id: "precio", label: "Precio", peso: 25, que: "Nota por tramos inversos del precio (más barata, mejor)." },
  ],
  montana: [
    { id: "autonomia", label: "Autonomía", peso: 30, que: "Nota por tramos de la autonomía estimada (km)." },
    { id: "potencia", label: "Motor", peso: 40, que: "Nota por tramos del par motor (Nm)." },
    { id: "peso", label: "Peso", peso: 15, que: "Nota por tramos inversos del peso (menos kg, mejor)." },
    { id: "precio", label: "Precio", peso: 15, que: "Nota por tramos inversos del precio (más barata, mejor)." },
  ],
  trekking: [
    { id: "autonomia", label: "Autonomía", peso: 45, que: "Nota por tramos de la autonomía estimada (km)." },
    { id: "potencia", label: "Motor", peso: 25, que: "Nota por tramos del par motor (Nm)." },
    { id: "peso", label: "Peso", peso: 15, que: "Nota por tramos inversos del peso (menos kg, mejor)." },
    { id: "precio", label: "Precio", peso: 15, que: "Nota por tramos inversos del precio (más barata, mejor)." },
  ],
  cargo: [
    { id: "autonomia", label: "Autonomía", peso: 30, que: "Nota por tramos de la autonomía estimada (km)." },
    { id: "potencia", label: "Motor", peso: 30, que: "Nota por tramos del par motor (Nm)." },
    { id: "peso", label: "Peso", peso: 10, que: "Nota por tramos inversos del peso (menos kg, mejor)." },
    { id: "precio", label: "Precio", peso: 30, que: "Nota por tramos inversos del precio (más barata, mejor)." },
  ],
};

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

export function pesosParaBike(bike: Bike): PesoPuntuacion[] {
  return PESOS_POR_TIPO[bike.tipo] ?? PESOS_POR_TIPO.urbana;
}

export function scoreBikes(bikes: Bike[], _pesos?: PesoPuntuacion[]): BikeScore[] {
  return bikes.map((bike) => scoreBikeBreakdown(bike, pesosParaBike(bike)));
}

export type BadgeBici = {
  emoji: string;
  etiqueta: string;
  criterio: "autonomia" | "motor" | "peso" | "precio" | "familiar" | "equilibrada" | "rutera";
};

export function obtenerBadgePrincipal(bike: Bike): BadgeBici {
  if (bike.tipo === "cargo" || bike.tipo === "familiar") {
    return { emoji: "📦", etiqueta: "Familiar", criterio: "familiar" };
  }

  const subs = bike.subs;
  type Candidato = { criterio: "autonomia" | "motor" | "peso" | "precio"; valor: number | null; emoji: string; etiqueta: string };
  const candidatos: Candidato[] = [
    { criterio: "motor", valor: subs.potencia, emoji: "⚡", etiqueta: "Motor potente" },
    { criterio: "precio", valor: subs.precio, emoji: "🏅", etiqueta: "Calidad-precio" },
    { criterio: "autonomia", valor: subs.autonomia, emoji: "🔋", etiqueta: "Larga autonomía" },
    { criterio: "peso", valor: subs.peso, emoji: "🪶", etiqueta: "Ligera" },
  ];
  const conDato = candidatos.filter((c): c is Candidato & { valor: number } => c.valor !== null);
  if (conDato.length === 0) return { emoji: "📊", etiqueta: "En análisis", criterio: "precio" };

  const valores = conDato.map((c) => c.valor);
  const rango = Math.max(...valores) - Math.min(...valores);
  if (rango < 1) return { emoji: "⚖️", etiqueta: "Equilibrada", criterio: "equilibrada" };

  if (bike.tipo === "trekking" && subs.autonomia !== null && subs.autonomia >= 10) {
    return { emoji: "🗺️", etiqueta: "Rutera Premium", criterio: "rutera" };
  }

  const mejor = conDato.reduce((a, b) => (b.valor > a.valor ? b : a));
  return { emoji: mejor.emoji, etiqueta: mejor.etiqueta, criterio: mejor.criterio };
}
