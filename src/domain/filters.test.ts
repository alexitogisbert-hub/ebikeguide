import { describe, expect, it } from "vitest";
import { EBG_DATA } from "@/data/ebg-data";
import { filtrarBikes, filtrarYOrdenarBikes, ordenarBikes } from "./filters";

const bikes = EBG_DATA.bikes;

describe("filtrarBikes", () => {
  it("sin criterios devuelve el catálogo completo", () => {
    expect(filtrarBikes(bikes)).toHaveLength(bikes.length);
  });

  it("filtra por precio máximo", () => {
    const resultado = filtrarBikes(bikes, { precioMax: 3300 });
    expect(resultado.every((b) => b.precio <= 3300)).toBe(true);
    expect(resultado.map((b) => b.slug)).toContain("moma-e16-city");
    expect(resultado.map((b) => b.slug)).not.toContain("tern-gsd-s10");
  });

  it("filtra por categoría", () => {
    const resultado = filtrarBikes(bikes, { categoriaId: "montana" });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].slug).toBe("orbea-rise-m20");
  });

  it("filtra por plegable: true devuelve solo la categoría plegables", () => {
    const resultado = filtrarBikes(bikes, { plegable: true });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].slug).toBe("brompton-electric-c-line");
  });

  it("filtra por plegable: false excluye la categoría plegables", () => {
    const resultado = filtrarBikes(bikes, { plegable: false });
    expect(resultado.some((b) => b.categoriaId === "plegables")).toBe(false);
    expect(resultado).toHaveLength(bikes.length - 1);
  });

  it("filtra por peso máximo y batería mínima combinados", () => {
    const resultado = filtrarBikes(bikes, { pesoMax: 25, bateriaWhMin: 400 });
    resultado.forEach((b) => {
      expect(b.pesoKg).toBeLessThanOrEqual(25);
      expect(b.bateriaWh).toBeGreaterThanOrEqual(400);
    });
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
    expect(resultado[0].slug).toBe("moma-e16-city");
  });

  it("ordena por puntuación descendente por defecto", () => {
    const resultado = ordenarBikes(bikes, "puntuacion");
    for (let i = 1; i < resultado.length; i++) {
      expect(resultado[i].puntuacion).toBeLessThanOrEqual(resultado[i - 1].puntuacion);
    }
    expect(resultado[0].slug).toBe("orbea-rise-m20");
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
    expect(resultado.every((b) => b.categoriaId !== "plegables")).toBe(true);
    expect(resultado[0].slug).toBe("moma-e16-city");
  });
});
