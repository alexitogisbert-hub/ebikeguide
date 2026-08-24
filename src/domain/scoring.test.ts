import { describe, expect, it } from "vitest";
import { EBG_DATA } from "@/data/ebg-data";
import { computeWeightedScore, scoreBikeBreakdown, scoreBikes, validatePesosPuntuacion } from "./scoring";

const PESOS = EBG_DATA.meta.pesosPuntuacion;

describe("validatePesosPuntuacion", () => {
  it("valida que los pesos oficiales suman 100", () => {
    const { valido, sumaTotal } = validatePesosPuntuacion(PESOS);
    expect(valido).toBe(true);
    expect(sumaTotal).toBe(100);
  });

  it("detecta pesos que no suman 100", () => {
    const pesosInvalidos = [
      { id: "a", label: "A", peso: 30, que: "" },
      { id: "b", label: "B", peso: 30, que: "" },
    ];
    const { valido, sumaTotal } = validatePesosPuntuacion(pesosInvalidos);
    expect(valido).toBe(false);
    expect(sumaTotal).toBe(60);
  });
});

describe("computeWeightedScore", () => {
  it("calcula la media ponderada exacta para un caso simple", () => {
    const pesos = [
      { id: "a", label: "A", peso: 50, que: "" },
      { id: "b", label: "B", peso: 50, que: "" },
    ];
    expect(computeWeightedScore({ a: 100, b: 0 }, pesos)).toBe(50);
    expect(computeWeightedScore({ a: 80, b: 60 }, pesos)).toBe(70);
  });

  it("trata los criterios que faltan como 0", () => {
    const pesos = [
      { id: "a", label: "A", peso: 50, que: "" },
      { id: "b", label: "B", peso: 50, que: "" },
    ];
    expect(computeWeightedScore({ a: 100 }, pesos)).toBe(50);
  });

  it("devuelve 0 si la suma de pesos es 0", () => {
    expect(computeWeightedScore({ a: 100 }, [{ id: "a", label: "A", peso: 0, que: "" }])).toBe(0);
  });

  it("coincide con el cálculo manual para la Kalkhoff Endeavour (subs elegidas para dar 89.0 exacto)", () => {
    const kalkhoff = EBG_DATA.bikes.find((b) => b.slug === "kalkhoff-endeavour-5b-move")!;
    expect(computeWeightedScore(kalkhoff.subpuntuaciones, PESOS)).toBe(89);
  });
});

describe("scoreBikeBreakdown", () => {
  it("devuelve un desglose con una fila por criterio de puntuación", () => {
    const bike = EBG_DATA.bikes[0];
    const resultado = scoreBikeBreakdown(bike, PESOS);

    expect(resultado.bikeId).toBe(bike.id);
    expect(resultado.desglose).toHaveLength(PESOS.length);
    resultado.desglose.forEach((item) => {
      expect(item.valor).toBe(bike.subpuntuaciones[item.id as keyof typeof bike.subpuntuaciones]);
    });
  });

  it("la suma de aportaciones del desglose coincide con la puntuación total", () => {
    const bike = EBG_DATA.bikes[2];
    const resultado = scoreBikeBreakdown(bike, PESOS);
    const sumaAportaciones = resultado.desglose.reduce((sum, item) => sum + item.aportacion, 0);
    expect(Math.round(sumaAportaciones * 10) / 10).toBeCloseTo(resultado.puntuacion, 1);
  });
});

describe("scoreBikes", () => {
  it("recalcula la puntuación de todas las bicis del catálogo demo", () => {
    const resultados = scoreBikes(EBG_DATA.bikes, PESOS);
    expect(resultados).toHaveLength(EBG_DATA.bikes.length);
    resultados.forEach((r) => {
      expect(r.puntuacion).toBeGreaterThanOrEqual(0);
      expect(r.puntuacion).toBeLessThanOrEqual(100);
    });
  });

  it("recalcula la puntuación si cambian los pesos (dar más peso al precio favorece a la bici más barata)", () => {
    const pesosCentradosEnPrecio = PESOS.map((p) => (p.id === "precio" ? { ...p, peso: 90 } : { ...p, peso: 10 / 6 }));

    const resultados = scoreBikes(EBG_DATA.bikes, pesosCentradosEnPrecio);
    const moma = resultados.find((r) => r.bikeId === "bike-moma-e16-city")!;
    const orbea = resultados.find((r) => r.bikeId === "bike-orbea-rise-m20")!;

    expect(moma.puntuacion).toBeGreaterThan(orbea.puntuacion);
  });
});
