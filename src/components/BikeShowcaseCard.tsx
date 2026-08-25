"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EBG_DATA } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const ROTATE_MS = 3200;

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

  function goTo(next: number) {
    setIndex((next + bikes.length) % bikes.length);
  }

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Bici anterior"
            onClick={() => goTo(index - 1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-acc hover:text-acc"
          >
            <ChevronLeftIcon className="size-4" />
          </button>

          <Link
            key={bike.id}
            href={`/bicicletas-electricas/${bike.slug}/`}
            className="animate-ebg-in group flex flex-1 items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-acc/50 hover:bg-white/[0.08]"
          >
            <div className="relative shrink-0">
              <ImagePlaceholder
                label={bike.imagenPlaceholder}
                className="h-24 w-32 rounded-xl !border-white/10 !bg-white/10 !text-white/60"
              />
              <span className="absolute -right-2 -top-2 rounded-full bg-acc px-2 py-0.5 text-[11px] font-bold text-dark shadow-sm">
                {bike.puntuacion.toFixed(1)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">{bike.marca}</p>
              <p className="truncate font-semibold text-white group-hover:text-acc">{bike.modelo}</p>
              <p className="mt-1 font-bold text-acc">{priceFormatter.format(bike.precio)}</p>
              <p className="mt-1 text-xs text-white/60">{bike.autonomiaMin}-{bike.autonomiaMax} km de autonomía</p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Siguiente bici"
            onClick={() => goTo(index + 1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-acc hover:text-acc"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center">
          {bikes.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Ver ${b.marca} ${b.modelo}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className="group flex size-6 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-acc" : "w-1.5 bg-white/25 group-hover:bg-white/40"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
