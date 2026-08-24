import { describe, expect, it } from "vitest";
import { EBG_DATA } from "@/data/ebg-data";
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
  it("da más ajuste a una bici urbana ligera cuando el perfil es ciudad/llano/precio", () => {
    const urbana = bikes.find((b) => b.slug === "vent-single-speed-e")!;
    const montana = bikes.find((b) => b.slug === "granith-trail-emtb-29")!;
    expect(calcularAjusteQuiz(urbana, baseAnswers)).toBeGreaterThan(calcularAjusteQuiz(montana, baseAnswers));
  });

  it("da más ajuste a una bici de montaña cuando el perfil es montaña/montañoso", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, uso: "montana", terreno: "montanoso", prioridad: "autonomia" };
    const urbana = bikes.find((b) => b.slug === "vent-single-speed-e")!;
    const montana = bikes.find((b) => b.slug === "granith-trail-emtb-29")!;
    expect(calcularAjusteQuiz(montana, respuestas)).toBeGreaterThan(calcularAjusteQuiz(urbana, respuestas));
  });

  it("subir la prioridad de comodidad favorece a la bici con mejor sub de confort", () => {
    const respuestas: QuizAnswers = { ...baseAnswers, prioridad: "comodidad" };
    const comoda = bikes.find((b) => b.slug === "nordvik-comfort-step-500")!;
    const basica = bikes.find((b) => b.slug === "kompaq-mini-fold-16")!;
    expect(calcularAjusteQuiz(comoda, respuestas)).toBeGreaterThan(calcularAjusteQuiz(basica, respuestas));
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
