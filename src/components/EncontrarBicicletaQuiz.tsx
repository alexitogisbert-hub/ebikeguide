"use client";

import { useMemo, useState } from "react";
import { EBG_DATA } from "@/data/ebg-data";
import { recomendarBikes, type QuizAnswers, type QuizKmDiarios, type QuizNecesidad, type QuizPrioridad, type QuizTerreno, type QuizUso } from "@/domain/quiz";
import { BikeDealCard } from "./BikeDealCard";

type StepId = "uso" | "terreno" | "kmDiarios" | "presupuestoMax" | "pesoImportante" | "prioridad" | "necesidad";

type Step<T> = {
  id: StepId;
  pregunta: string;
  opciones: Array<{ value: T; label: string; sublabel?: string }>;
};

const STEPS: [
  Step<QuizUso>,
  Step<QuizTerreno>,
  Step<QuizKmDiarios>,
  Step<number>,
  Step<boolean>,
  Step<QuizPrioridad>,
  Step<QuizNecesidad>,
] = [
  {
    id: "uso",
    pregunta: "¿Para qué la vas a usar sobre todo?",
    opciones: [
      { value: "ciudad", label: "Ciudad y trayectos cortos" },
      { value: "trekking", label: "Rutas largas y cicloturismo" },
      { value: "montana", label: "Montaña / offroad" },
      { value: "cargo", label: "Llevar carga o niños" },
      { value: "multimodal", label: "Combinar con tren o metro" },
    ],
  },
  {
    id: "terreno",
    pregunta: "¿Cómo es el terreno donde más vas a rodar?",
    opciones: [
      { value: "llano", label: "Llano" },
      { value: "mixto", label: "Mixto" },
      { value: "montanoso", label: "Con cuestas o montaña" },
    ],
  },
  {
    id: "kmDiarios",
    pregunta: "¿Cuántos km sueles hacer por salida?",
    opciones: [
      { value: "corto", label: "Menos de 10 km" },
      { value: "medio", label: "Entre 10 y 30 km" },
      { value: "largo", label: "Más de 30 km" },
    ],
  },
  {
    id: "presupuestoMax",
    pregunta: "¿Cuál es tu presupuesto máximo?",
    opciones: [
      { value: 1000, label: "Hasta 1.000 €" },
      { value: 1500, label: "Hasta 1.500 €" },
      { value: 2500, label: "Hasta 2.500 €" },
      { value: 4000, label: "Hasta 4.000 €" },
      { value: 10000, label: "Sin límite estricto" },
    ],
  },
  {
    id: "pesoImportante",
    pregunta: "¿Necesitas subirla a un piso, portal o tren a menudo?",
    opciones: [
      { value: true, label: "Sí, el peso me importa mucho" },
      { value: false, label: "No, se queda aparcada" },
    ],
  },
  {
    id: "prioridad",
    pregunta: "Si tuvieras que priorizar una cosa, ¿cuál sería?",
    opciones: [
      { value: "autonomia", label: "Autonomía" },
      { value: "precio", label: "Precio" },
      { value: "potencia", label: "Potencia del motor" },
    ],
  },
  {
    id: "necesidad",
    pregunta: "¿Necesitas que sea plegable o de carga?",
    opciones: [
      { value: "ninguna", label: "No, una bici normal" },
      { value: "plegable", label: "Sí, plegable" },
      { value: "cargo", label: "Sí, de carga" },
    ],
  },
];

type PartialAnswers = Partial<QuizAnswers>;

export function EncontrarBicicletaQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});

  const isComplete = stepIndex >= STEPS.length;

  const recomendaciones = useMemo(() => {
    if (!isComplete) return [];
    return recomendarBikes(EBG_DATA.bikes, answers as QuizAnswers, 3);
  }, [isComplete, answers]);

  function selectOption(stepId: StepId, value: unknown) {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    setStepIndex((i) => i + 1);
  }

  function reiniciar() {
    setAnswers({});
    setStepIndex(0);
  }

  if (isComplete) {
    return (
      <div>
        <h2 className="text-xl font-bold text-ink">Tus recomendaciones</h2>
        <p className="mt-2 text-sm text-mut">
          Según tus respuestas, estas son las {recomendaciones.length} bicis de nuestro catálogo que mejor encajan.
        </p>
        <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          {recomendaciones.map((bike) => (
            <BikeDealCard key={bike.id} bike={bike} />
          ))}
        </div>
        <button
          type="button"
          onClick={reiniciar}
          className="mt-8 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-ink"
        >
          Volver a empezar
        </button>
      </div>
    );
  }

  const step = STEPS[stepIndex];

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-acc" : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs font-medium text-mut">
        Pregunta {stepIndex + 1} de {STEPS.length}
      </p>

      <h2 className="mt-3 text-2xl font-bold text-ink">{step.pregunta}</h2>

      <div className="mt-6 flex flex-col gap-3">
        {step.opciones.map((opcion) => (
          <button
            key={String(opcion.value)}
            type="button"
            onClick={() => selectOption(step.id, opcion.value)}
            className="rounded-2xl border border-line px-5 py-4 text-left font-medium text-ink hover:border-acc hover:bg-acc-s"
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {stepIndex > 0 && (
        <button
          type="button"
          onClick={() => setStepIndex((i) => i - 1)}
          className="mt-6 text-sm font-medium text-mut hover:text-ink"
        >
          ← Pregunta anterior
        </button>
      )}
    </div>
  );
}
