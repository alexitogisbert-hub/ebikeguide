"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EBG_DATA } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";

const ROTATE_MS = 2800;

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function BikeShowcaseCard() {
  const bikes = EBG_DATA.bikes;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % bikes.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, bikes.length]);

  const bike = bikes[index];

  return (
    <div className="animate-ebg-in flex h-full flex-col justify-between rounded-3xl bg-dark p-8 text-white sm:p-10">
      <div>
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-[28px]">
          Las mejores e-bikes según tu perfil
        </h2>
        <p className="mt-3 max-w-[38ch] text-sm text-white/65">
          Responde 7 preguntas sobre tu uso y presupuesto y te mostramos las bicicletas
          mejor puntuadas para ti, con el desglose completo de la nota.
        </p>
        <Link
          href="/encontrar-bicicleta/"
          className="mt-5 inline-flex items-center rounded-full bg-acc px-5 py-3 text-sm font-semibold text-dark hover:bg-white"
        >
          Hacer el quiz →
        </Link>
      </div>

      <div className="mt-8" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <Link
          href={`/bicicletas-electricas/${bike.slug}/`}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/25"
        >
          <ImagePlaceholder
            label={bike.imagenPlaceholder}
            className="h-20 w-28 shrink-0 rounded-xl !border-white/10 !bg-white/10 !text-white/60"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{bike.marca}</p>
            <p className="truncate font-semibold text-white">{bike.modelo}</p>
            <p className="mt-1 font-bold text-acc">{priceFormatter.format(bike.precio)}</p>
          </div>
        </Link>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {bikes.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Ver ${b.marca} ${b.modelo}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-acc" : "w-1.5 bg-white/25"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
