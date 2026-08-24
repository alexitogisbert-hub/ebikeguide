import Link from "next/link";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { StarIcon } from "./icons";

const AVATAR_INITIALS = ["MA", "JL", "SR", "PC"];

export function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="animate-ebg-in">
          <span className="inline-flex items-center rounded-full border border-line bg-surf px-3 py-1 text-xs font-semibold text-mut">
            DEMO · Datos de muestra · plataforma independiente
          </span>

          <h1 className="mt-5 text-[clamp(42px,5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Encuentra tu e-bike ideal
          </h1>

          <p className="mt-5 max-w-[46ch] text-lg text-mut">
            Comparamos autonomía, motor, confort y precio de decenas de bicicletas
            eléctricas para que elijas con datos, no con marketing.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/encontrar-bicicleta/"
              className="inline-flex items-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white hover:bg-acc-d"
            >
              Comenzar ahora →
            </Link>
            <Link
              href="/metodologia/"
              className="inline-flex items-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink"
            >
              Ver cómo funciona
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <div className="flex -space-x-2">
              {AVATAR_INITIALS.map((initials) => (
                <span
                  key={initials}
                  className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-acc-s text-xs font-bold text-acc-d"
                >
                  {initials}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 font-semibold text-ink">
                4,9/5
                <span className="flex text-acc">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-3.5" />
                  ))}
                </span>
              </div>
              <p className="text-mut">+12.500 ciclistas ya han encontrado su e-bike (dato demo)</p>
            </div>
          </div>
        </div>

        <ImagePlaceholder
          label="Fotografía editorial de una persona pedaleando una e-bike urbana al atardecer"
          className="aspect-[4/5] w-full rounded-[28px] lg:aspect-[3/4]"
        />
      </div>
    </section>
  );
}
