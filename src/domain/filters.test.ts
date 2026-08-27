import { describe, expect, it } from "vitest";
import { EBG_DATA, type Bike } from "@/data/ebg-data";
import { filtrarBikes, filtrarYOrdenarBikes, ordenarBikes } from "./filters";

const bikes = EBG_DATA.bikes;

describe("filtrarBikes", () => {
  it("sin criterios devuelve el catálogo completo (15 bicis)", () => {
    expect(filtrarBikes(bikes)).toHaveLength(15);
    expect(filtrarBikes(bikes)).toHaveLength(bikes.length);
  });

  it("filtra por precio máximo", () => {
    const resultado = filtrarBikes(bikes, { precioMax: 1000 });
    expect(resultado.every((b) => b.precio <= 1000)).toBe(true);
    expect(resultado.map((b) => b.slug)).toContain("colorway-bk15");
    expect(resultado.map((b) => b.slug)).toContain("touroll-j1");
    expect(resultado.map((b) => b.slug)).not.toContain("eskute-netuno");
  });

  it("filtra por categoría", () => {
    const resultado = filtrarBikes(bikes, { categoriaId: "cargo" });
    expect(resultado).toHaveLength(2);
    expect(resultado.map((b) => b.slug)).toContain("fafrees-ff20-cuv");
  });

  it("filtra por plegable: true devuelve solo las bicis plegables", () => {
    const resultado = filtrarBikes(bikes, { plegable: true });
    expect(resultado.map((b) => b.slug).sort()).toEqual(
      ["engwe-ep2-boost", "hitway-bk6sl1", "ado-air20-pro", "legend-siena", "fafrees-f20-mate", "bodywel-t16pro", "nilox-x8-plus"].sort(),
    );
  });

  it("filtra por plegable: false excluye las bicis plegables", () => {
    const resultado = filtrarBikes(bikes, { plegable: false });
    expect(resultado.some((b) => b.plegable)).toBe(false);
    expect(resultado).toHaveLength(bikes.length - 7);
  });

  it("no excluye por peso máximo cuando el peso no está publicado (no penaliza el dato ausente)", () => {
    const sinPeso: Bike = { ...bikes[0], id: "test-sin-peso", pesoKg: null };
    const resultado = filtrarBikes([...bikes, sinPeso], { pesoMax: 1 });
    expect(resultado.map((b) => b.id)).toContain(sinPeso.id);
  });

  it("excluye por peso máximo cuando el peso sí está confirmado y lo supera", () => {
    const pesada = bikes.find((b) => b.pesoKg !== null && b.pesoKg > 35)!;
    const resultado = filtrarBikes(bikes, { pesoMax: 35 });
    expect(resultado.map((b) => b.id)).not.toContain(pesada.id);
  });

  it("excluye por autonomía mínima cuando la autonomía no está confirmada (no puede garantizarla)", () => {
    const sinAutonomia: Bike = { ...bikes[0], id: "test-sin-autonomia", autonomiaMin: null, autonomiaMax: null };
    const resultado = filtrarBikes([...bikes, sinAutonomia], { autonomiaMinKm: 1 });
    expect(resultado.map((b) => b.id)).not.toContain(sinAutonomia.id);
  });

  it("devuelve un array vacío si ningún modelo cumple los criterios", () => {
    expect(filtrarBikes(bikes, { precioMax: 10 })).toHaveLength(0);
  });
});

describe("ordenarBikes", () => {
  it("ordena por precio ascendente", () => {
    const resultado = ordenarBikes(bikes, "precio", "asc");
    for (let i = 1; i < resultado.length; i++) {
      expect(resultado[i].precio).toBeGreaterThanOrEqual(resultado[i - 1].precio);
    }
    expect(resultado[0].slug).toBe("bodywel-t16pro");
  });

  it("ordena por puntuación descendente por defecto", () => {
    const resultado = ordenarBikes(bikes, "puntuacion");
    for (let i = 1; i < resultado.length; i++) {
      expect(resultado[i].puntuacion).toBeLessThanOrEqual(resultado[i - 1].puntuacion);
    }
  });

  it("ordena por valor calidad-precio (puntuación / precio) descendente", () => {
    const resultado = ordenarBikes(bikes, "valor");
    const valores = resultado.map((b) => b.puntuacion / b.precio);
    for (let i = 1; i < valores.length; i++) {
      expect(valores[i]).toBeLessThanOrEqual(valores[i - 1]);
    }
  });

  it("no muta el array original", () => {
    const copia = [...bikes];
    ordenarBikes(bikes, "precio", "asc");
    expect(bikes).toEqual(copia);
  });
});

describe("filtrarYOrdenarBikes", () => {
  it("combina filtro y orden en una sola llamada", () => {
    const resultado = filtrarYOrdenarBikes(bikes, { plegable: false }, "precio", "asc");
    expect(resultado.every((b) => !b.plegable)).toBe(true);
    expect(resultado[0].slug).toBe("colorway-bk15");
  });
});
