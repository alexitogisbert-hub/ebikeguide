import Image from "next/image";
import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";

const MARCAS_ANALIZADAS = Array.from(new Set(EBG_DATA.bikes.map((bike) => bike.marca)));

export function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="animate-ebg-in">
          <h1 className="text-[clamp(42px,5vw,68px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            <span className="block">Encuentra tu</span>
            <span className="block">
              e-bike <span className="text-acc-d">ideal</span>
            </span>
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
              Descubre mi e-bike →
            </Link>
            <Link
              href="/metodologia/"
              className="inline-flex items-center rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink hover:border-ink"
            >
              Ver cómo funciona
            </Link>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-mut">
            Marcas que analizamos: <span className="normal-case text-ink">{MARCAS_ANALIZADAS.join(" · ")}</span>
          </p>

          <p className="mt-5 max-w-[46ch] text-sm text-mut">{EBG_DATA.trustItems[0]}.</p>
        </div>

        <div className="relative hidden aspect-[3/2] w-full overflow-hidden rounded-[32px] lg:block">
          <Image
            src="/hero.webp"
            alt="Persona pedaleando una e-bike urbana al atardecer"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
