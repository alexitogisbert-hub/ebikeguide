import { describe, expect, it } from "vitest";
import { EBG_DATA } from "@/data/ebg-data";
import { filtrarBikes, filtrarYOrdenarBikes, ordenarBikes } from "./filters";

const bikes = EBG_DATA.bikes;

describe("filtrarBikes", () => {
  it("sin criterios devuelve el catálogo completo (12 bicis)", () => {
    expect(filtrarBikes(bikes)).toHaveLength(12);
    expect(filtrarBikes(bikes)).toHaveLength(bikes.length);
  });

  it("filtra por precio máximo", () => {
    const resultado = filtrarBikes(bikes, { precioMax: 1000 });
    expect(resultado.every((b) => b.precio <= 1000)).toBe(true);
    expect(resultado.map((b) => b.slug)).toContain("moma-e16-city");
    expect(resultado.map((b) => b.slug)).toContain("vent-city-basic-36");
    expect(resultado.map((b) => b.slug)).not.toContain("granith-trail-emtb-29");
  });

  it("filtra por categoría", () => {
    const resultado = filtrarBikes(bikes, { categoriaId: "cargo" });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].slug).toBe("portea-cargo-family-l");
  });

  it("filtra por plegable: true devuelve solo las bicis plegables", () => {
    const resultado = filtrarBikes(bikes, { plegable: true });
    expect(resultado.map((b) => b.slug).sort()).toEqual(
      ["brompton-electric-c-line", "kompaq-mini-fold-16"].sort(),
    );
  });

  it("filtra por plegable: false excluye las bicis plegables", () => {
    const resultado = filtrarBikes(bikes, { plegable: false });
    expect(resultado.some((b) => b.plegable)).toBe(false);
    expect(resultado).toHaveLength(bikes.length - 2);
  });

  it("filtra por peso máximo y batería mínima combinados", () => {
    const resultado = filtrarBikes(bikes, { pesoMax: 20, bateriaWhMin: 300 });
    resultado.forEach((b) => {
      expect(b.pesoKg).toBeLessThanOrEqual(20);
      expect(b.bateriaWh).toBeGreaterThanOrEqual(300);
    });
    expect(resultado.map((b) => b.slug)).toContain("sable-gravel-e-road-320");
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
    expect(resultado[0].slug).toBe("vent-city-basic-36");
  });

  it("ordena por puntuación descendente por defecto", () => {
    const resultado = ordenarBikes(bikes, "puntuacion");
    for (let i = 1; i < resultado.length; i++) {
      expect(resultado[i].puntuacion).toBeLessThanOrEqual(resultado[i - 1].puntuacion);
    }
    expect(resultado[0].slug).toBe("granith-trail-emtb-29");
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
    expect(resultado[0].slug).toBe("vent-city-basic-36");
  });
});
