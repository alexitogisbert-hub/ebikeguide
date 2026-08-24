import type { Bike, PesoPuntuacion, SubPuntuaciones } from "@/data/ebg-data";

export type ScoreBreakdownItem = {
  id: string;
  label: string;
  valor: number;
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

export function computeWeightedScore(
  subs: SubPuntuaciones | Record<string, number>,
  pesos: PesoPuntuacion[],
): number {
  const sumaPesos = pesos.reduce((sum, p) => sum + p.peso, 0);
  if (sumaPesos === 0) return 0;

  const sumaPonderada = pesos.reduce((sum, p) => {
    const valor = subs[p.id as keyof typeof subs] ?? 0;
    return sum + valor * p.peso;
  }, 0);

  return Math.round((sumaPonderada / sumaPesos) * 10) / 10;
}

export function scoreBikeBreakdown(bike: Bike, pesos: PesoPuntuacion[]): BikeScore {
  const sumaPesos = pesos.reduce((sum, p) => sum + p.peso, 0);

  const desglose: ScoreBreakdownItem[] = pesos.map((peso) => {
    const valor = bike.subpuntuaciones[peso.id as keyof SubPuntuaciones] ?? 0;
    return {
      id: peso.id,
      label: peso.label,
      valor,
      peso: peso.peso,
      aportacion: sumaPesos === 0 ? 0 : Math.round(((valor * peso.peso) / sumaPesos) * 10) / 10,
    };
  });

  return {
    bikeId: bike.id,
    puntuacion: computeWeightedScore(bike.subpuntuaciones, pesos),
    desglose,
  };
}

export function scoreBikes(bikes: Bike[], pesos: PesoPuntuacion[]): BikeScore[] {
  return bikes.map((bike) => scoreBikeBreakdown(bike, pesos));
}
