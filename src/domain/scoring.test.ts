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
    expect(computeWeightedScore({ a: 10, b: 0 }, pesos)).toBe(5);
    expect(computeWeightedScore({ a: 8, b: 6 }, pesos)).toBe(7);
  });

  it("trata los criterios que faltan como 0", () => {
    const pesos = [
      { id: "a", label: "A", peso: 50, que: "" },
      { id: "b", label: "B", peso: 50, que: "" },
    ];
    expect(computeWeightedScore({ a: 10 }, pesos)).toBe(5);
  });

  it("devuelve 0 si la suma de pesos es 0", () => {
    expect(computeWeightedScore({ a: 10 }, [{ id: "a", label: "A", peso: 0, que: "" }])).toBe(0);
  });

  it("coincide con el cálculo manual para la Nordvik Tour Trekking 625", () => {
    // 25*9.6 + 20*8.4 + 20*9.3 + 15*8.4 + 10*6.9 + 10*7.6 = 865 -> 865/100 = 8.65 -> redondeado a 8.7
    const nordvikTour = EBG_DATA.bikes.find((b) => b.slug === "nordvik-tour-trekking-625")!;
    expect(computeWeightedScore(nordvikTour.subs, PESOS)).toBe(8.7);
  });
});

describe("scoreBikeBreakdown", () => {
  it("devuelve un desglose con una fila por criterio de puntuación", () => {
    const bike = EBG_DATA.bikes[0];
    const resultado = scoreBikeBreakdown(bike, PESOS);

    expect(resultado.bikeId).toBe(bike.id);
    expect(resultado.desglose).toHaveLength(PESOS.length);
    resultado.desglose.forEach((item) => {
      expect(item.valor).toBe(bike.subs[item.id as keyof typeof bike.subs]);
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
  it("recalcula la puntuación de las 12 bicis del catálogo demo", () => {
    const resultados = scoreBikes(EBG_DATA.bikes, PESOS);
    expect(resultados).toHaveLength(12);
    expect(resultados).toHaveLength(EBG_DATA.bikes.length);
    resultados.forEach((r) => {
      expect(r.puntuacion).toBeGreaterThanOrEqual(0);
      expect(r.puntuacion).toBeLessThanOrEqual(10);
    });
  });

  it("recalcula la puntuación si cambian los pesos (dar casi todo el peso al precio favorece a la bici más barata)", () => {
    const pesosCentradosEnPrecio = PESOS.map((p) => (p.id === "precio" ? { ...p, peso: 90 } : { ...p, peso: 10 / 5 }));

    const resultados = scoreBikes(EBG_DATA.bikes, pesosCentradosEnPrecio);
    const moma = resultados.find((r) => r.bikeId === "b01")!;
    const granithTrail = resultados.find((r) => r.bikeId === "b03")!;

    expect(moma.puntuacion).toBeGreaterThan(granithTrail.puntuacion);
  });
});
