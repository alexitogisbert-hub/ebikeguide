import { describe, expect, it } from "vitest";
import { EBG_DATA, type Bike } from "@/data/ebg-data";
import {
  calcularSubsTier,
  computeWeightedScore,
  obtenerBadgePrincipal,
  PESOS_POR_TIPO,
  pesosParaBike,
  scoreBikeBreakdown,
  scoreBikes,
  tierAutonomia,
  tierMotor,
  tierPeso,
  tierPrecio,
  validatePesosPuntuacion,
} from "./scoring";

describe("validatePesosPuntuacion", () => {
  it("valida que los pesos de cada categoría suman 100", () => {
    for (const [tipo, pesos] of Object.entries(PESOS_POR_TIPO)) {
      const { valido, sumaTotal } = validatePesosPuntuacion(pesos);
      expect(valido, `pesos de ${tipo} no suman 100 (suma: ${sumaTotal})`).toBe(true);
      expect(sumaTotal).toBe(100);
    }
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

describe("tierAutonomia", () => {
  it("devuelve null si no hay dato", () => {
    expect(tierAutonomia(null)).toBeNull();
  });
  it("asigna 10 a ≥120 km", () => {
    expect(tierAutonomia(120)).toBe(10);
    expect(tierAutonomia(200)).toBe(10);
  });
  it("asigna 9 a 100-119 km", () => {
    expect(tierAutonomia(100)).toBe(9);
    expect(tierAutonomia(119)).toBe(9);
  });
  it("asigna 8.5 a 80-99 km", () => {
    expect(tierAutonomia(80)).toBe(8.5);
    expect(tierAutonomia(99)).toBe(8.5);
  });
  it("asigna 8 a 60-79 km", () => {
    expect(tierAutonomia(60)).toBe(8);
    expect(tierAutonomia(79)).toBe(8);
  });
  it("asigna 7 a 40-59 km", () => {
    expect(tierAutonomia(40)).toBe(7);
    expect(tierAutonomia(59)).toBe(7);
  });
  it("asigna 6 a <40 km", () => {
    expect(tierAutonomia(39)).toBe(6);
    expect(tierAutonomia(10)).toBe(6);
  });
});

describe("tierMotor", () => {
  it("devuelve null si no hay dato", () => {
    expect(tierMotor(null)).toBeNull();
  });
  it("asigna 10 a ≥75 Nm", () => {
    expect(tierMotor(75)).toBe(10);
    expect(tierMotor(80)).toBe(10);
  });
  it("asigna 9 a 65-74 Nm", () => {
    expect(tierMotor(65)).toBe(9);
  });
  it("asigna 8 a 45-64 Nm", () => {
    expect(tierMotor(45)).toBe(8);
    expect(tierMotor(55)).toBe(8);
  });
  it("asigna 7 a 35-44 Nm", () => {
    expect(tierMotor(35)).toBe(7);
    expect(tierMotor(42)).toBe(7);
  });
  it("asigna 6 a <35 Nm", () => {
    expect(tierMotor(34)).toBe(6);
  });
});

describe("tierPeso", () => {
  it("devuelve null si no hay dato", () => {
    expect(tierPeso(null)).toBeNull();
  });
  it("asigna 10 a ≤19 kg", () => {
    expect(tierPeso(19)).toBe(10);
    expect(tierPeso(15)).toBe(10);
  });
  it("asigna 9 a 20-24 kg", () => {
    expect(tierPeso(20)).toBe(9);
    expect(tierPeso(24)).toBe(9);
  });
  it("asigna 8 a 25-29 kg", () => {
    expect(tierPeso(25)).toBe(8);
    expect(tierPeso(29)).toBe(8);
  });
  it("asigna 7 a 30-31 kg", () => {
    expect(tierPeso(30)).toBe(7);
    expect(tierPeso(31)).toBe(7);
  });
  it("asigna 6 a ≥32 kg", () => {
    expect(tierPeso(32)).toBe(6);
    expect(tierPeso(40)).toBe(6);
  });
});

describe("tierPrecio", () => {
  it("asigna 10 a ≤699 €", () => {
    expect(tierPrecio(699)).toBe(10);
    expect(tierPrecio(430)).toBe(10);
  });
  it("asigna 9 a 700-999 €", () => {
    expect(tierPrecio(700)).toBe(9);
    expect(tierPrecio(999)).toBe(9);
  });
  it("asigna 8 a 1000-1499 €", () => {
    expect(tierPrecio(1000)).toBe(8);
    expect(tierPrecio(1499)).toBe(8);
  });
  it("asigna 7 a 1500-1999 €", () => {
    expect(tierPrecio(1500)).toBe(7);
    expect(tierPrecio(1999)).toBe(7);
  });
  it("asigna 6 a ≥2000 €", () => {
    expect(tierPrecio(2000)).toBe(6);
    expect(tierPrecio(2399)).toBe(6);
  });
});

describe("calcularSubsTier", () => {
  it("calcula autonomia/potencia/peso/precio por tramos fijos", () => {
    const metricas = [
      { autonomiaKm: 120, parNm: 80, pesoKg: 19, precio: 600 },
      { autonomiaKm: 40, parNm: 35, pesoKg: 32, precio: 2000 },
    ];
    const subs = calcularSubsTier(metricas);
    expect(subs[0]).toEqual({ autonomia: 10, potencia: 10, peso: 10, precio: 10 });
    expect(subs[1]).toEqual({ autonomia: 7, potencia: 7, peso: 6, precio: 6 });
  });

  it("deja en null el criterio de una bici sin dato", () => {
    const metricas = [{ autonomiaKm: null, parNm: null, pesoKg: null, precio: 1000 }];
    const subs = calcularSubsTier(metricas);
    expect(subs[0].autonomia).toBeNull();
    expect(subs[0].potencia).toBeNull();
    expect(subs[0].peso).toBeNull();
    expect(subs[0].precio).toBe(8);
  });

  it("el criterio de precio nunca es null", () => {
    const metricas = [{ autonomiaKm: null, parNm: null, pesoKg: null, precio: 1500 }];
    const subs = calcularSubsTier(metricas);
    expect(subs[0].precio).not.toBeNull();
    expect(subs[0].precio).toBe(7);
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
    expect(computeWeightedScore({ a: 10, b: null }, pesos)).toBe(10);
  });

  it("devuelve 0 si ningún criterio tiene dato", () => {
    expect(computeWeightedScore({ a: null }, [{ id: "a", label: "A", peso: 100, que: "" }])).toBe(0);
  });

  it("coincide con el cálculo manual de una bici real del catálogo", () => {
    const bike = EBG_DATA.bikes[0];
    const pesos = pesosParaBike(bike);
    const sumaPesosDisponibles = pesos
      .filter((p) => typeof bike.subs[p.id as keyof typeof bike.subs] === "number")
      .reduce((sum, p) => sum + p.peso, 0);
    const sumaPonderada = pesos.reduce((sum, p) => {
      const v = bike.subs[p.id as keyof typeof bike.subs];
      return typeof v === "number" ? sum + v * p.peso : sum;
    }, 0);
    const esperado = sumaPesosDisponibles === 0 ? 0 : Math.round((sumaPonderada / sumaPesosDisponibles) * 10) / 10;
    expect(computeWeightedScore(bike.subs, pesos)).toBe(esperado);
  });
});

describe("scoreBikeBreakdown", () => {
  it("devuelve un desglose con una fila por criterio de puntuación", () => {
    const bike = EBG_DATA.bikes[0];
    const pesos = pesosParaBike(bike);
    const resultado = scoreBikeBreakdown(bike, pesos);

    expect(resultado.bikeId).toBe(bike.id);
    expect(resultado.desglose).toHaveLength(pesos.length);
    resultado.desglose.forEach((item) => {
      expect(item.valor).toBe(bike.subs[item.id as keyof typeof bike.subs]);
    });
  });

  it("la suma de aportaciones del desglose coincide con la puntuación total", () => {
    const bike = EBG_DATA.bikes[2];
    const pesos = pesosParaBike(bike);
    const resultado = scoreBikeBreakdown(bike, pesos);
    const sumaAportaciones = resultado.desglose.reduce((sum, item) => sum + item.aportacion, 0);
    expect(Math.abs(Math.round(sumaAportaciones * 10) / 10 - resultado.puntuacion)).toBeLessThanOrEqual(0.15);
  });

  it("las filas sin dato tienen valor null y aportación 0", () => {
    const bikeSinPar: Bike = { ...EBG_DATA.bikes[0], id: "test-sin-par", subs: { ...EBG_DATA.bikes[0].subs, potencia: null } };
    const pesos = pesosParaBike(bikeSinPar);
    const resultado = scoreBikeBreakdown(bikeSinPar, pesos);
    const filaPotencia = resultado.desglose.find((d) => d.id === "potencia")!;
    expect(filaPotencia.valor).toBeNull();
    expect(filaPotencia.aportacion).toBe(0);
  });
});

describe("scoreBikes", () => {
  it("calcula la puntuación de las 14 bicis reales del catálogo, todas entre 6 y 10", () => {
    const resultados = scoreBikes(EBG_DATA.bikes);
    expect(resultados).toHaveLength(14);
    expect(resultados).toHaveLength(EBG_DATA.bikes.length);
    resultados.forEach((r) => {
      expect(r.puntuacion).toBeGreaterThanOrEqual(6);
      expect(r.puntuacion).toBeLessThanOrEqual(10);
    });
  });

  it("los pesos dinámicos por categoría afectan la puntuación final", () => {
    const resultados = scoreBikes(EBG_DATA.bikes);
    const urbana = resultados.find((r) => r.bikeId === "b02")!;
    const plegable = resultados.find((r) => r.bikeId === "b04")!;
    expect(urbana.puntuacion).not.toBe(plegable.puntuacion);
  });
});

describe("obtenerBadgePrincipal", () => {
  it("una bici cargo obtiene el badge Familiar", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "cargo",
      subs: { autonomia: 10, potencia: 10, peso: 10, precio: 10 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "📦", etiqueta: "Familiar", criterio: "familiar" });
  });

  it("elige el criterio con mayor sub-puntuación con desempate potencia > precio > autonomia > peso", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "urbana",
      subs: { autonomia: 5, potencia: 3, peso: 9, precio: 2 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "🪶", etiqueta: "Ligera", criterio: "peso" });
  });

  it("ignora los criterios sin dato al elegir el mejor", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "urbana",
      subs: { autonomia: null, potencia: 4, peso: null, precio: 10 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "🏅", etiqueta: "Calidad-precio", criterio: "precio" });
  });

  it("devuelve el badge 'En análisis' si ningún criterio tiene dato", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "urbana",
      subs: { autonomia: null, potencia: null, peso: null, precio: null },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "📊", etiqueta: "En análisis", criterio: "precio" });
  });

  it("asigna Equilibrada cuando todos los criterios están dentro de un rango < 1", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "urbana",
      subs: { autonomia: 8.5, potencia: 9, peso: 9, precio: 9 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "⚖️", etiqueta: "Equilibrada", criterio: "equilibrada" });
  });

  it("no asigna Equilibrada si el rango es exactamente 1", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "urbana",
      subs: { autonomia: 8, potencia: 9, peso: 8, precio: 9 },
    };
    expect(obtenerBadgePrincipal(bike).criterio).not.toBe("equilibrada");
  });

  it("asigna Rutera Premium a una trekking con autonomía 10", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "trekking",
      subs: { autonomia: 10, potencia: 10, peso: 7, precio: 8 },
    };
    expect(obtenerBadgePrincipal(bike)).toEqual({ emoji: "🗺️", etiqueta: "Rutera Premium", criterio: "rutera" });
  });

  it("no asigna Rutera Premium a una trekking con autonomía < 10", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "trekking",
      subs: { autonomia: 9, potencia: 8, peso: 8, precio: 10 },
    };
    expect(obtenerBadgePrincipal(bike).criterio).not.toBe("rutera");
  });

  it("esTriciclo ya no determina el badge", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      esTriciclo: true,
      tipo: "plegable",
      subs: { autonomia: 8.5, potencia: 9, peso: 6, precio: 6 },
    };
    expect(obtenerBadgePrincipal(bike).criterio).not.toBe("triciclo");
    expect(obtenerBadgePrincipal(bike).criterio).toBe("motor");
  });

  it("el desempate favorece potencia sobre precio sobre autonomía", () => {
    const bike: Bike = {
      ...EBG_DATA.bikes[0],
      tipo: "urbana",
      subs: { autonomia: 9, potencia: 9, peso: 7, precio: 9 },
    };
    expect(obtenerBadgePrincipal(bike).criterio).toBe("motor");
  });

  it("todas las bicis reales del catálogo obtienen un badge válido", () => {
    const criteriosValidos = ["autonomia", "motor", "peso", "precio", "familiar", "equilibrada", "rutera"];
    EBG_DATA.bikes.forEach((bike) => {
      const badge = obtenerBadgePrincipal(bike);
      expect(criteriosValidos).toContain(badge.criterio);
      expect(badge.etiqueta.length).toBeGreaterThan(0);
    });
  });
});
