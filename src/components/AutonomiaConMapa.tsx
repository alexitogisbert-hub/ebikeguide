"use client";

import { useState } from "react";
import { calcularAutonomia, type NivelAsistencia, type TipoTerreno } from "@/domain/autonomy";
import { AutonomyCalculator } from "./AutonomyCalculator";
import { RangoMapa } from "./RangoMapa";

export function AutonomiaConMapa() {
  const [bateriaWh, setBateriaWh] = useState(500);
  const [pesoKg, setPesoKg] = useState(80);
  const [assistId, setAssistId] = useState<NivelAsistencia>("medio");
  const [terrainId, setTerrainId] = useState<TipoTerreno>("mixto");

  const { estimadoKm } = calcularAutonomia({ bateriaWh, pesoKg, asistencia: assistId, terreno: terrainId });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
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
      <RangoMapa estimadoKm={estimadoKm} />
    </div>
  );
}
