"use client";

import { useState } from "react";
import type { NivelAsistencia, TipoTerreno } from "@/domain/autonomy";
import { BikeShowcaseCard } from "./BikeShowcaseCard";
import { AutonomyCalculator } from "./AutonomyCalculator";

export function QuizAndAutonomy() {
  const [bateriaWh, setBateriaWh] = useState(500);
  const [pesoKg, setPesoKg] = useState(80);
  const [assistId, setAssistId] = useState<NivelAsistencia>("medio");
  const [terrainId, setTerrainId] = useState<TipoTerreno>("mixto");

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-6">
        <BikeShowcaseCard />
        <AutonomyCalculator
          bateriaWh={bateriaWh}
          setBateriaWh={setBateriaWh}
          pesoKg={pesoKg}
          setPesoKg={setPesoKg}
          assistId={assistId}
          setAssistId={setAssistId}
          terrainId={terrainId}
          setTerrainId={setTerrainId}
        />
      </div>
    </section>
  );
}
