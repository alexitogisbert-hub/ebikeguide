"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EBG_DATA } from "@/data/ebg-data";
import { recomendarBikes, type QuizAnswers, type QuizKmDiarios, type QuizNecesidad, type QuizPrioridad, type QuizTerreno, type QuizUso } from "@/domain/quiz";
import { BikeDealCard } from "./BikeDealCard";

type StepId = "uso" | "terreno" | "kmDiarios" | "presupuestoMax" | "pesoImportante" | "prioridad" | "necesidad";

type Step<T> = {
  id: StepId;
  pregunta: string;
  opciones: Array<{ value: T; label: string; emoji: string; sublabel?: string }>;
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
      { value: "ciudad", label: "Ciudad y trayectos cortos", emoji: "🏙️" },
      { value: "trekking", label: "Rutas largas y cicloturismo", emoji: "🚵" },
      { value: "montana", label: "Montaña / offroad", emoji: "⛰️" },
      { value: "cargo", label: "Llevar carga o niños", emoji: "👨‍👩‍👧" },
      { value: "multimodal", label: "Combinar con tren o metro", emoji: "🚆" },
    ],
  },
  {
    id: "terreno",
    pregunta: "¿Cómo es el terreno donde más vas a rodar?",
    opciones: [
      { value: "llano", label: "Llano", emoji: "🛣️" },
      { value: "mixto", label: "Mixto", emoji: "🔀" },
      { value: "montanoso", label: "Con cuestas o montaña", emoji: "⛰️" },
    ],
  },
  {
    id: "kmDiarios",
    pregunta: "¿Cuántos km sueles hacer por salida?",
    opciones: [
      { value: "corto", label: "Menos de 10 km", emoji: "📍" },
      { value: "medio", label: "Entre 10 y 30 km", emoji: "🛣️" },
      { value: "largo", label: "Más de 30 km", emoji: "🗺️" },
    ],
  },
  {
    id: "presupuestoMax",
    pregunta: "¿Cuál es tu presupuesto máximo?",
    opciones: [
      { value: 1000, label: "Hasta 1.000 €", emoji: "💶" },
      { value: 1500, label: "Hasta 1.500 €", emoji: "💶" },
      { value: 2500, label: "Hasta 2.500 €", emoji: "💰" },
      { value: 4000, label: "Hasta 4.000 €", emoji: "💰" },
      { value: 10000, label: "Sin límite estricto", emoji: "🤑" },
    ],
  },
  {
    id: "pesoImportante",
    pregunta: "¿Necesitas subirla a un piso, portal o tren a menudo?",
    opciones: [
      { value: true, label: "Sí, el peso me importa mucho", emoji: "🏋️" },
      { value: false, label: "No, se queda aparcada", emoji: "🅿️" },
    ],
  },
  {
    id: "prioridad",
    pregunta: "Si tuvieras que priorizar una cosa, ¿cuál sería?",
    opciones: [
      { value: "autonomia", label: "Autonomía", emoji: "🔋" },
      { value: "precio", label: "Precio", emoji: "💰" },
      { value: "potencia", label: "Potencia del motor", emoji: "⚡" },
    ],
  },
  {
    id: "necesidad",
    pregunta: "¿Necesitas que sea plegable o de carga?",
    opciones: [
      { value: "ninguna", label: "No, una bici normal", emoji: "🚲" },
      { value: "plegable", label: "Sí, plegable", emoji: "🧳" },
      { value: "cargo", label: "Sí, de carga", emoji: "👨‍👩‍👧" },
    ],
  },
];

type PartialAnswers = Partial<QuizAnswers>;

const SELECCION_FEEDBACK_MS = 220;

export function EncontrarBicicletaQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PartialAnswers>({});
  const [selectedValue, setSelectedValue] = useState<unknown>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isComplete = stepIndex >= STEPS.length;

  const recomendaciones = useMemo(() => {
    if (!isComplete) return [];
    return recomendarBikes(EBG_DATA.bikes, answers as QuizAnswers, 3);
  }, [isComplete, answers]);

  function selectOption(stepId: StepId, value: unknown) {
    if (selectedValue !== null) return;
    setSelectedValue(value);
    timeoutRef.current = setTimeout(() => {
      setAnswers((prev) => ({ ...prev, [stepId]: value }));
      setStepIndex((i) => i + 1);
      setSelectedValue(null);
    }, SELECCION_FEEDBACK_MS);
  }

  function volverAtras() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedValue(null);
    setStepIndex((i) => i - 1);
  }

  function reiniciar() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedValue(null);
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
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recomendaciones.map((bike) => (
            <BikeDealCard key={bike.id} bike={bike} showBuyCta />
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
        {step.opciones.map((opcion) => {
          const selected = selectedValue === opcion.value;
          return (
            <button
              key={String(opcion.value)}
              type="button"
              disabled={selectedValue !== null}
              onClick={() => selectOption(step.id, opcion.value)}
              className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-left font-medium transition-colors ${
                selected
                  ? "border-acc bg-acc text-dark"
                  : "border-line text-ink hover:border-acc hover:bg-acc-s disabled:cursor-default disabled:hover:border-line disabled:hover:bg-transparent"
              }`}
            >
              <span aria-hidden="true" className="text-xl">
                {opcion.emoji}
              </span>
              {opcion.label}
            </button>
          );
        })}
      </div>

      {stepIndex > 0 && (
        <button type="button" onClick={volverAtras} className="mt-6 text-sm font-medium text-mut hover:text-ink">
          ← Pregunta anterior
        </button>
      )}
    </div>
  );
}
