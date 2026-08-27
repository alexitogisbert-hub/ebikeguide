import { describe, expect, it } from "vitest";
import { EBG_DATA, type Bike } from "@/data/ebg-data";
import { calcularAjusteQuiz, recomendarBikes, type QuizAnswers } from "./quiz";

const bikes = EBG_DATA.bikes;

const baseAnswers: QuizAnswers = {
  uso: "ciudad",
  terreno: "llano",
  kmDiarios: "corto",
  presupuestoMax: 10000,
  pesoImportante: false,
  prioridad: "precio",
  necesidad: "ninguna",
};

describe("calcularAjusteQuiz", () => {
  it("da más ajuste a una bici urbana cuando el perfil es ciudad/llano/precio", () => {
    const urbana = bikes.find((b) => b.slug === "onesport-ot07")!;
    const montana = bikes.find((b) => b.slug === "antgooat-speedy-29")!;
    expect(calcularAjusteQuiz(urbana, baseAnswers)).toBeGreaterThan(calcularAjusteQuiz(montana, baseAnswers));
  });

  it("da más ajuste a una bici de montaña cuando el perfil es montaña/montañoso", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, uso: "montana", terreno: "montanoso", prioridad: "autonomia" };
    const urbana = bikes.find((b) => b.slug === "onesport-ot07")!;
    const montana = bikes.find((b) => b.slug === "antgooat-speedy-29")!;
    expect(calcularAjusteQuiz(montana, respuestas)).toBeGreaterThan(calcularAjusteQuiz(urbana, respuestas));
  });

  it("subir la prioridad de potencia favorece a la bici con más par motor de su categoría", () => {
    // Mismo tipo (montaña) para las dos, así terrenoFit/perfil de uso son idénticos y la
    // única diferencia posible en el ajuste es la sub-puntuación de potencia (percentil dentro
    // de la categoría): la puntuación de potencia ya no se compara contra todo el catálogo.
    const respuestas: QuizAnswers = { ...baseAnswers, prioridad: "potencia" };
    const potente = bikes.find((b) => b.slug === "antgooat-speedy-29")!; // montaña, 80 Nm
    const floja = bikes.find((b) => b.slug === "eskute-netuno")!; // montaña, 45 Nm
    expect(calcularAjusteQuiz(potente, respuestas)).toBeGreaterThan(calcularAjusteQuiz(floja, respuestas));
  });

  it("no falla si el criterio priorizado es null para una bici (dato no publicado)", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, prioridad: "potencia" };
    const sinPar: Bike = { ...bikes[0], id: "test-sin-par", parNm: null };
    expect(() => calcularAjusteQuiz(sinPar, respuestas)).not.toThrow();
    expect(Number.isFinite(calcularAjusteQuiz(sinPar, respuestas))).toBe(true);
  });
});

describe("recomendarBikes", () => {
  it("respeta el presupuesto máximo cuando hay candidatas suficientes", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, presupuestoMax: 1000 };
    const recomendadas = recomendarBikes(bikes, respuestas, 3);
    expect(recomendadas.length).toBeGreaterThan(0);
    recomendadas.forEach((b) => expect(b.precio).toBeLessThanOrEqual(1000));
  });

  it("recomienda solo bicis cargo cuando la necesidad es cargo", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, necesidad: "cargo", presupuestoMax: 10000 };
    const recomendadas = recomendarBikes(bikes, respuestas, 3);
    expect(recomendadas.length).toBeGreaterThan(0);
    recomendadas.forEach((b) => expect(b.categoriaId).toBe("cargo"));
  });

  it("recomienda solo bicis plegables cuando la necesidad es plegable", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, necesidad: "plegable", presupuestoMax: 10000 };
    const recomendadas = recomendarBikes(bikes, respuestas, 3);
    expect(recomendadas.length).toBeGreaterThan(0);
    recomendadas.forEach((b) => expect(b.plegable).toBe(true));
  });

  it("si nada cumple el presupuesto, no devuelve una lista vacía (relaja el filtro)", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, presupuestoMax: 1 };
    const recomendadas = recomendarBikes(bikes, respuestas, 3);
    expect(recomendadas.length).toBeGreaterThan(0);
  });

  it("limita el número de recomendaciones al límite pedido", () => {
    const recomendadas = recomendarBikes(bikes, baseAnswers, 2);
    expect(recomendadas).toHaveLength(2);
  });
});
