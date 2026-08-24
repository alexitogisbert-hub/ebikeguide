export type NivelAsistencia = "eco" | "medio" | "alto" | "turbo";
export type TipoTerreno = "llano" | "mixto" | "montanoso";

export const BASE_WH_POR_KM = 8.5;

export const FACTOR_ASISTENCIA: Record<NivelAsistencia, number> = {
  eco: 0.7,
  medio: 1.0,
  alto: 1.3,
  turbo: 1.65,
};

export const FACTOR_TERRENO: Record<TipoTerreno, number> = {
  llano: 0.85,
  mixto: 1.0,
  montanoso: 1.4,
};

const PESO_REFERENCIA_KG = 75;
const PESO_AJUSTE_MAX = 0.3;
const FACTOR_PESO_MIN = 0.6;
const RANGO_INCERTIDUMBRE = 0.12;

export type EstimacionAutonomia = {
  consumoWhKm: number;
  estimadoKm: number;
  minKm: number;
  maxKm: number;
};

export function calcularFactorPeso(pesoKg: number): number {
  return Math.max(1 + ((pesoKg - PESO_REFERENCIA_KG) / PESO_REFERENCIA_KG) * PESO_AJUSTE_MAX, FACTOR_PESO_MIN);
}

export function calcularAutonomia(params: {
  bateriaWh: number;
  pesoKg: number;
  asistencia: NivelAsistencia;
  terreno: TipoTerreno;
}): EstimacionAutonomia {
  const { bateriaWh, pesoKg, asistencia, terreno } = params;

  if (bateriaWh <= 0) {
    return { consumoWhKm: 0, estimadoKm: 0, minKm: 0, maxKm: 0 };
  }

  const factorPeso = calcularFactorPeso(pesoKg);
  const consumoWhKm = BASE_WH_POR_KM * FACTOR_ASISTENCIA[asistencia] * FACTOR_TERRENO[terreno] * factorPeso;
  const estimado = bateriaWh / consumoWhKm;

  return {
    consumoWhKm,
    estimadoKm: Math.round(estimado),
    minKm: Math.round(estimado * (1 - RANGO_INCERTIDUMBRE)),
    maxKm: Math.round(estimado * (1 + RANGO_INCERTIDUMBRE)),
  };
}
