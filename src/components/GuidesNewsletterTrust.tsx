import Image from "next/image";
import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { NewsletterForm } from "./NewsletterForm";
import { ArrowRightIcon } from "./icons";

export function GuidesNewsletterTrust() {
  const featured = EBG_DATA.guias.find((g) => g.destacada) ?? EBG_DATA.guias[0];
  const rest = EBG_DATA.guias.filter((g) => g.id !== featured.id).slice(0, 3);

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
        <div>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
              Guías y consejos
            </h2>
            <Link
              href="/guias/"
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-acc-d hover:text-ink"
            >
              Ver todas <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>

          <Link
            href={`/guias/${featured.slug}/`}
            className="mt-6 block overflow-hidden rounded-2xl border border-line transition-shadow duration-200 hover:shadow-lg"
          >
            {featured.imagen ? (
              <div className="relative h-[190px] w-full">
                <Image src={featured.imagen} alt={featured.imagenPlaceholder} fill className="object-cover" />
              </div>
            ) : (
              <ImagePlaceholder label={featured.imagenPlaceholder} className="h-[190px] w-full" />
            )}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-acc-d">
                {featured.categoria}
              </p>
              <h3 className="mt-1.5 text-lg font-bold text-ink">{featured.titulo}</h3>
              <p className="mt-2 text-sm text-mut">{featured.resumen}</p>
              <p className="mt-3 text-xs font-medium text-mut">{featured.minutosLectura} min de lectura</p>
            </div>
          </Link>

          <ul className="mt-4 divide-y divide-line border-t border-line">
            {rest.map((guia) => (
              <li key={guia.id}>
                <Link
                  href={`/guias/${guia.slug}/`}
                  className="flex items-center gap-4 py-4 hover:bg-surf"
                >
                  {guia.imagen ? (
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={guia.imagen} alt={guia.imagenPlaceholder} fill className="object-cover" />
                    </div>
                  ) : (
                    <ImagePlaceholder label={guia.imagenPlaceholder} className="size-14 shrink-0 rounded-xl" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-acc-d">
                      {guia.categoria}
                    </p>
                    <h4 className="truncate text-sm font-semibold text-ink">{guia.titulo}</h4>
                    <p className="mt-0.5 text-xs text-mut">{guia.minutosLectura} min de lectura</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-surf p-8">
            <h3 className="text-lg font-bold text-ink">Únete a la comunidad</h3>
            <p className="mt-2 text-sm text-mut">
              Recibe una guía nueva al mes y avisos cuando bajen de precio las bicis de tu lista.
            </p>
            <NewsletterForm />
          </div>

          <div className="rounded-3xl border border-line p-8">
            <h3 className="text-lg font-bold text-ink">Por qué puedes fiarte</h3>
            <p className="mt-2 text-sm text-mut">
              Ganamos comisión de las tiendas, nunca de las marcas. La puntuación no se compra.
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {EBG_DATA.trustItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-acc-s text-[10px] font-bold text-acc-d">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/metodologia/"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-acc-d hover:text-ink"
            >
              Leer nuestra metodología <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
