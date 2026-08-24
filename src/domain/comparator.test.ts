import { describe, expect, it } from "vitest";
import { EBG_DATA } from "@/data/ebg-data";
import { compararBikes, MAX_BIKES_COMPARADOR } from "./comparator";

const bikes = EBG_DATA.bikes;

describe("compararBikes", () => {
  it("construye una fila por campo comparado, con un valor por bici seleccionada", () => {
    const ids = [bikes[0].id, bikes[1].id, bikes[2].id];
    const comparativa = compararBikes(bikes, ids);

    expect(comparativa.bikes.map((b) => b.id)).toEqual(ids);
    comparativa.filas.forEach((fila) => {
      expect(fila.valores).toHaveLength(ids.length);
    });
  });

  it("limita la selección a un máximo de 4 bicis", () => {
    const ids = bikes.slice(0, 6).map((b) => b.id);
    const comparativa = compararBikes(bikes, ids);
    expect(comparativa.bikes).toHaveLength(MAX_BIKES_COMPARADOR);
  });

  it("ignora ids duplicados", () => {
    const comparativa = compararBikes(bikes, [bikes[0].id, bikes[0].id, bikes[1].id]);
    expect(comparativa.bikes).toHaveLength(2);
  });

  it("ignora ids que no existen en el catálogo", () => {
    const comparativa = compararBikes(bikes, [bikes[0].id, "no-existe"]);
    expect(comparativa.bikes).toHaveLength(1);
    expect(comparativa.bikes[0].id).toBe(bikes[0].id);
  });

  it("incluye la fila de autonomía formateada como rango en km", () => {
    const comparativa = compararBikes(bikes, [bikes[0].id]);
    const filaAutonomia = comparativa.filas.find((f) => f.campo === "autonomia")!;
    expect(filaAutonomia.valores[0]).toBe(`${bikes[0].autonomiaMin}-${bikes[0].autonomiaMax} km`);
  });

  it("compara las alternativas cruzadas b01/b02 con sentido (mismo grupo compacto/urbano)", () => {
    const comparativa = compararBikes(bikes, ["b01", "b02", "b09"]);
    expect(comparativa.bikes.map((b) => b.id)).toEqual(["b01", "b02", "b09"]);
  });

  it("con una selección vacía devuelve filas con valores vacíos", () => {
    const comparativa = compararBikes(bikes, []);
    expect(comparativa.bikes).toHaveLength(0);
    comparativa.filas.forEach((fila) => expect(fila.valores).toHaveLength(0));
  });
});
