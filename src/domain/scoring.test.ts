import { describe, expect, it } from "vitest";
import { EBG_DATA, type Bike } from "@/data/ebg-data";
import {
  calcularSubsCatalogo,
  computeWeightedScore,
  obtenerBadgePrincipal,
  percentil,
  percentilInverso,
  scoreBikeBreakdown,
  scoreBikes,
  validatePesosPuntuacion,
} from "./scoring";

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

describe("percentil", () => {
  it("da 10 al valor más alto y 0 al más bajo de una serie sin empates", () => {
    const valores = [10, 20, 30, 40];
    expect(percentil(valores, 3)).toBe(10);
    expect(percentil(valores, 0)).toBe(0);
  });

  it("reparte el rango medio entre valores empatados", () => {
    const valores = [10, 20, 20, 30];
    // los dos "20" comparten el rango medio entre las posiciones 1 y 2 de 4 -> percentil 5
    expect(percentil(valores, 1)).toBe(5);
    expect(percentil(valores, 2)).toBe(5);
  });

  it("devuelve null si el propio elemento no tiene valor", () => {
    expect(percentil([10, null, 30], 1)).toBeNull();
  });

  it("excluye los null de la comparación en vez de tratarlos como 0", () => {
    // sin el null de en medio, [10, 30] -> el 30 es el valor más alto conocido -> percentil 10
    expect(percentil([10, null, 30], 2)).toBe(10);
  });

  it("devuelve 10 cuando solo hay un valor conocido (nada con qué comparar)", () => {
    expect(percentil([null, 42, null], 1)).toBe(10);
  });
});

describe("percentilInverso", () => {
  it("invierte el orden: el valor más bajo puntúa más alto", () => {
    const valores = [10, 20, 30, 40];
    expect(percentilInverso(valores, 0)).toBe(10);
    expect(percentilInverso(valores, 3)).toBe(0);
  });
});

describe("calcularSubsCatalogo", () => {
  it("calcula autonomia/potencia/peso/precio a partir de métricas objetivas", () => {
    const metricas = [
      { autonomiaKm: 100, parNm: 40, pesoKg: 20, precio: 1000 },
      { autonomiaKm: 50, parNm: 80, pesoKg: 10, precio: 1000 },
    ];
    const subs = calcularSubsCatalogo(metricas);
    expect(subs[0].autonomia).toBe(10); // más km, mejor nota
    expect(subs[1].autonomia).toBe(0);
    expect(subs[0].potencia).toBe(0); // menos Nm, peor nota
    expect(subs[1].potencia).toBe(10);
    expect(subs[0].peso).toBe(0); // más kg, peor nota (percentil inverso)
    expect(subs[1].peso).toBe(10);
  });

  it("deja en null el criterio de una bici que no tiene el dato, sin inventar un valor", () => {
    const metricas = [
      { autonomiaKm: 100, parNm: null, pesoKg: 20, precio: 1000 },
      { autonomiaKm: 50, parNm: 80, pesoKg: null, precio: 1000 },
    ];
    const subs = calcularSubsCatalogo(metricas);
    expect(subs[0].potencia).toBeNull();
    expect(subs[1].peso).toBeNull();
    // la que sí tiene par motor es la única con dato conocido -> percentil 10 (nada con qué comparar)
    expect(subs[1].potencia).toBe(10);
  });

  it("la nota de precio es el percentil inverso del precio: más barata, mejor nota", () => {
    const metricas = [
      { autonomiaKm: null, parNm: null, pesoKg: null, precio: 1000 },
      { autonomiaKm: null, parNm: null, pesoKg: null, precio: 500 },
    ];
    const subs = calcularSubsCatalogo(metricas);
    expect(subs[1].precio).toBeGreaterThan(subs[0].precio!);
  });

  it("el criterio de precio nunca es null, aunque falten todos los demás datos", () => {
    const metricas = [{ autonomiaKm: null, parNm: null, pesoKg: null, precio: 1500 }];
    const subs = calcularSubsCatalogo(metricas);
    expect(subs[0].precio).not.toBeNull();
  });

  it("compara contra todo el catálogo, no solo dentro de la categoría", () => {
    const metricas = [
      { autonomiaKm: 100, parNm: 40, pesoKg: 20, precio: 1000 },
      { autonomiaKm: 50, parNm: 80, pesoKg: 10, precio: 1000 },
      { autonomiaKm: 10, parNm: 10, pesoKg: 50, precio: 100 },
    ];
    const subs = calcularSubsCatalogo(metricas);
    expect(subs[0].autonomia).toBe(10);
    expect(subs[1].autonomia).toBe(5);
    expect(subs[2].autonomia).toBe(0);
    expect(subs[2].precio).toBe(10);
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

  it("renormaliza el peso entre los criterios disponibles en vez de tratar los null como 0", () => {
    const pesos = [
      { id: "a", label: "A", peso: 50, que: "" },
      { id: "b", label: "B", peso: 50, que: "" },
    ];
    // sin dato de "b": la nota final es solo la de "a" (10), no (10*50)/100=5
    expect(computeWeightedScore({ a: 10, b: null }, pesos)).toBe(10);
  });

  it("devuelve 0 si ningún criterio tiene dato", () => {
    expect(computeWeightedScore({ a: null }, [{ id: "a", label: "A", peso: 100, que: "" }])).toBe(0);
  });

  it("coincide con el cálculo manual de una bici real del catálogo", () => {
    const bike = EBG_DATA.bikes[0];
    const sumaPesosDisponibles = PESOS.filter((p) => typeof bike.subs[p.id as keyof typeof bike.subs] === "number").reduce(
      (sum, p) => sum + p.peso,
      0,
    );
    const sumaPonderada = PESOS.reduce((sum, p) => {
      const v = bike.subs[p.id as keyof typeof bike.subs];
      return typeof v === "number" ? sum + v * p.peso : sum;
    }, 0);
    const esperado = sumaPesosDisponibles === 0 ? 0 : Math.round((sumaPonderada / sumaPesosDisponibles) * 10) / 10;
    expect(computeWeightedScore(bike.subs, PESOS)).toBe(esperado);
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

  it("las filas sin dato tienen valor null y aportación 0", () => {
    const bikeSinPar: Bike = { ...EBG_DATA.bikes[0], id: "test-sin-par", subs: { ...EBG_DATA.bikes[0].subs, potencia: null } };
    const resultado = scoreBikeBreakdown(bikeSinPar, PESOS);
    const filaPotencia = resultado.desglose.find((d) => d.id === "potencia")!;
    expect(filaPotencia.valor).toBeNull();
    expect(filaPotencia.aportacion).toBe(0);
  });
});

describe("scoreBikes", () => {
  it("calcula la puntuación de las 14 bicis reales del catálogo, todas entre 0 y 10", () => {
    const resultados = scoreBikes(EBG_DATA.bikes, PESOS);
    expect(resultados).toHaveLength(14);
    expect(resultados).toHaveLength(EBG_DATA.bikes.length);
    resultados.forEach((r) => {
      expect(r.puntuacion).toBeGreaterThanOrEqual(0);
      expect(r.puntuacion).toBeLessThanOrEqual(10);
    });
  });

  it("una bici puede acabar en 0 si es la más cara del catálogo y no tiene ningún otro dato confirmado", () => {
    const precioMasAlto = Math.max(...EBG_DATA.bikes.map((b) => b.precio)) + 1000;
    const metricas = [
      ...EBG_DATA.bikes.map((b) => ({
        autonomiaKm: b.autonomiaMin !== null && b.autonomiaMax !== null ? (b.autonomiaMin + b.autonomiaMax) / 2 : null,
        parNm: b.parNm,
        pesoKg: b.pesoKg,
        precio: b.precio,
      })),
      { autonomiaKm: null, parNm: null, pesoKg: null, precio: precioMasAlto },
    ];
    const subs = calcularSubsCatalogo(metricas);
    const subsSoloPrecio = subs[subs.length - 1];

    expect(subsSoloPrecio.autonomia).toBeNull();
    expect(subsSoloPrecio.potencia).toBeNull();
    expect(subsSoloPrecio.peso).toBeNull();
    expect(subsSoloPrecio.precio).toBe(0);
    expect(computeWeightedScore(subsSoloPrecio, PESOS)).toBe(0);
  });

  it("recalcula la puntuación si cambian los pesos (dar casi todo el peso al precio favorece a la bici más barata)", () => {
    const pesosCentradosEnPrecio = PESOS.map((p) => (p.id === "precio" ? { ...p, peso: 90 } : { ...p, peso: 10 / 3 }));

    const resultados = scoreBikes(EBG_DATA.bikes, pesosCentradosEnPrecio);
    const masBarata = resultados.find((r) => r.bikeId === "b10")!; // Touroll J1, 699 €
    const masCara = resultados.find((r) => r.bikeId === "b14")!; // Fafrees F20 Mate, 2.399 €

    expect(masBarata.puntuacion).toBeGreaterThan(masCara.puntuacion);
  });
});

describe("obtenerBadgePrincipal", () => {
  it("elige el criterio con mayor sub-puntuación", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      subs: { autonomia: 5, potencia: 3, peso: 9, precio: 2 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "🪶", etiqueta: "Ligera", criterio: "peso" });
  });

  it("ignora los criterios sin dato al elegir el mejor", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      subs: { autonomia: null, potencia: 4, peso: null, precio: 10 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "💰", etiqueta: "Calidad-precio", criterio: "precio" });
  });

  it("devuelve el badge 'En análisis' si ningún criterio tiene dato", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      subs: { autonomia: null, potencia: null, peso: null, precio: null },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "📊", etiqueta: "En análisis", criterio: "precio" });
  });

  it("todas las bicis reales del catálogo obtienen un badge válido", () => {
    EBG_DATA.bikes.forEach((bike) => {
      const badge = obtenerBadgePrincipal(bike);
      expect(["autonomia", "motor", "peso", "precio", "familiar", "triciclo"]).toContain(badge.criterio);
      expect(badge.etiqueta.length).toBeGreaterThan(0);
    });
  });

  it("una bici triciclo siempre obtiene el badge de triciclo, sin importar sus sub-puntuaciones", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      esTriciclo: true,
      tipo: "urbana",
      subs: { autonomia: 10, potencia: 10, peso: 10, precio: 10 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "🛺", etiqueta: "Triciclo", criterio: "triciclo" });
  });

  it("una bici cargo (no triciclo) obtiene el badge Familiar, sin importar sus sub-puntuaciones", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      esTriciclo: false,
      tipo: "cargo",
      subs: { autonomia: 10, potencia: 10, peso: 10, precio: 10 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "👨‍👩‍👧", etiqueta: "Familiar", criterio: "familiar" });
  });

  it("el triciclo tiene prioridad sobre el badge Familiar cuando una bici es ambas cosas (caso real: Fafrees F20 Mate)", () => {
    const bike = EBG_DATA.bikes.find((b) => b.slug === "fafrees-f20-mate")!;
    expect(bike.esTriciclo).toBe(true);
    expect(bike.tipo).toBe("cargo");
    expect(obtenerBadgePrincipal(bike).criterio).toBe("triciclo");
  });

  it("una plegable cuyo mejor criterio es el peso obtiene 'Plegable ligera' en vez del genérico 'Ligera'", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      esTriciclo: false,
      tipo: "plegable",
      subs: { autonomia: 3, potencia: 2, peso: 9, precio: 4 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "📦", etiqueta: "Plegable ligera", criterio: "peso" });
  });

  it("una no-plegable cuyo mejor criterio es el peso mantiene el badge genérico 'Ligera'", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      esTriciclo: false,
      tipo: "urbana",
      subs: { autonomia: 3, potencia: 2, peso: 9, precio: 4 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "🪶", etiqueta: "Ligera", criterio: "peso" });
  });
});
