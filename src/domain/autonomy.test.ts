import { describe, expect, it } from "vitest";
import { BASE_WH_POR_KM, calcularAutonomia, calcularFactorPeso, FACTOR_ASISTENCIA, FACTOR_TERRENO } from "./autonomy";

describe("calcularFactorPeso", () => {
  it("un ciclista de 75 kg (referencia) no ajusta el consumo", () => {
    expect(calcularFactorPeso(75)).toBe(1);
  });

  it("más peso aumenta el factor de consumo", () => {
    expect(calcularFactorPeso(140)).toBeGreaterThan(calcularFactorPeso(75));
  });

  it("menos peso reduce el factor de consumo, con un suelo mínimo", () => {
    expect(calcularFactorPeso(45)).toBeLessThan(1);
    expect(calcularFactorPeso(0)).toBeGreaterThanOrEqual(0.6);
  });
});

describe("calcularAutonomia", () => {
  it("replica el modelo demo: 500 Wh, 75 kg, asistencia media, terreno mixto", () => {
    const resultado = calcularAutonomia({
      bateriaWh: 500,
      pesoKg: 75,
      asistencia: "medio",
      terreno: "mixto",
    });

    // consumo = 8.5 * 1.0 * 1.0 * 1.0 = 8.5 Wh/km -> 500 / 8.5 ≈ 58.8 km
    expect(resultado.consumoWhKm).toBeCloseTo(BASE_WH_POR_KM, 5);
    expect(resultado.estimadoKm).toBe(59);
    expect(resultado.minKm).toBeLessThan(resultado.estimadoKm);
    expect(resultado.maxKm).toBeGreaterThan(resultado.estimadoKm);
  });

  it("más asistencia reduce la autonomía estimada", () => {
    const base = { bateriaWh: 500, pesoKg: 80, terreno: "mixto" as const };
    const eco = calcularAutonomia({ ...base, asistencia: "eco" });
    const turbo = calcularAutonomia({ ...base, asistencia: "turbo" });
    expect(turbo.estimadoKm).toBeLessThan(eco.estimadoKm);
  });

  it("terreno montañoso reduce la autonomía frente a terreno llano", () => {
    const base = { bateriaWh: 500, pesoKg: 80, asistencia: "medio" as const };
    const llano = calcularAutonomia({ ...base, terreno: "llano" });
    const montanoso = calcularAutonomia({ ...base, terreno: "montanoso" });
    expect(montanoso.estimadoKm).toBeLessThan(llano.estimadoKm);
  });

  it("más peso reduce la autonomía estimada", () => {
    const base = { bateriaWh: 500, asistencia: "medio" as const, terreno: "mixto" as const };
    const ligero = calcularAutonomia({ ...base, pesoKg: 50 });
    const pesado = calcularAutonomia({ ...base, pesoKg: 140 });
    expect(pesado.estimadoKm).toBeLessThan(ligero.estimadoKm);
  });

  it("más batería aumenta la autonomía de forma proporcional al consumo", () => {
    const base = { pesoKg: 80, asistencia: "medio" as const, terreno: "mixto" as const };
    const bateriaChica = calcularAutonomia({ ...base, bateriaWh: 300 });
    const bateriaGrande = calcularAutonomia({ ...base, bateriaWh: 600 });
    expect(Math.abs(bateriaGrande.estimadoKm - bateriaChica.estimadoKm * 2)).toBeLessThanOrEqual(1);
  });

  it("una batería de 0 Wh da una autonomía de 0 km sin dividir por cero", () => {
    const resultado = calcularAutonomia({ bateriaWh: 0, pesoKg: 80, asistencia: "medio", terreno: "mixto" });
    expect(resultado).toEqual({ consumoWhKm: 0, estimadoKm: 0, minKm: 0, maxKm: 0 });
  });

  it("expone los factores usados para eco/turbo y llano/montañoso", () => {
    expect(FACTOR_ASISTENCIA.eco).toBeLessThan(FACTOR_ASISTENCIA.turbo);
    expect(FACTOR_TERRENO.llano).toBeLessThan(FACTOR_TERRENO.montanoso);
  });
});
