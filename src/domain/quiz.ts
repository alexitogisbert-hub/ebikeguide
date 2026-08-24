import type { Bike, PerfilUso } from "@/data/ebg-data";
import { filtrarBikes } from "./filters";

export type QuizUso = "ciudad" | "trekking" | "montana" | "cargo" | "multimodal";
export type QuizTerreno = "llano" | "mixto" | "montanoso";
export type QuizKmDiarios = "corto" | "medio" | "largo";
export type QuizPrioridad = "autonomia" | "precio" | "comodidad";
export type QuizNecesidad = "ninguna" | "plegable" | "cargo";

export type QuizAnswers = {
  uso: QuizUso;
  terreno: QuizTerreno;
  kmDiarios: QuizKmDiarios;
  presupuestoMax: number;
  pesoImportante: boolean;
  prioridad: QuizPrioridad;
  necesidad: QuizNecesidad;
};

const USO_PERFIL_KEY: Record<QuizUso, keyof PerfilUso> = {
  ciudad: "llano",
  trekking: "largaDistancia",
  montana: "offroad",
  cargo: "carga",
  multimodal: "transporte",
};

const KM_DIARIOS_PERFIL_KEY: Record<QuizKmDiarios, keyof PerfilUso> = {
  corto: "transporte",
  medio: "llano",
  largo: "largaDistancia",
};

function terrenoFit(bike: Bike, terreno: QuizTerreno): number {
  if (terreno === "llano") return bike.perfil.llano;
  if (terreno === "montanoso") return (bike.perfil.cuestas + bike.perfil.offroad) / 2;
  return (bike.perfil.llano + bike.perfil.cuestas) / 2;
}

export function calcularAjusteQuiz(bike: Bike, respuestas: QuizAnswers): number {
  let score = 0;

  score += terrenoFit(bike, respuestas.terreno) * 35;
  score += bike.perfil[USO_PERFIL_KEY[respuestas.uso]] * 20;
  score += bike.perfil[KM_DIARIOS_PERFIL_KEY[respuestas.kmDiarios]] * 15;

  const prioridadKey = respuestas.prioridad === "autonomia" ? "autonomia" : respuestas.prioridad === "precio" ? "precio" : "confort";
  score += (bike.subs[prioridadKey] / 10) * 20;

  if (respuestas.pesoImportante) {
    score += (bike.subs.peso / 10) * 10;
  }

  return Math.round(score * 10) / 10;
}

export function recomendarBikes(bikes: Bike[], respuestas: QuizAnswers, limite = 3): Bike[] {
  const filtroNecesidad = respuestas.necesidad === "cargo" ? { categoriaId: "cargo" } : respuestas.necesidad === "plegable" ? { plegable: true } : {};

  const dentroDePresupuesto = filtrarBikes(bikes, { precioMax: respuestas.presupuestoMax, ...filtroNecesidad });
  const pool = dentroDePresupuesto.length > 0 ? dentroDePresupuesto : filtrarBikes(bikes, filtroNecesidad);
  const candidatos = pool.length > 0 ? pool : bikes;

  return [...candidatos]
    .sort((a, b) => calcularAjusteQuiz(b, respuestas) - calcularAjusteQuiz(a, respuestas))
    .slice(0, limite);
}
