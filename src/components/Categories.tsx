import Image from "next/image";
import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ArrowRightIcon } from "./icons";

export function Categories() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">
          Explora por categorías
        </h2>
        <Link
          href="/bicicletas-electricas/"
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-acc-d hover:text-ink"
        >
          Ver todas <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-5">
        {EBG_DATA.categorias.map((cat) => (
          <Link
            key={cat.id}
            href={`/bicicletas-electricas/?categoria=${cat.slug}`}
            className="group overflow-hidden rounded-2xl border border-line transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {cat.imagen ? (
              <div className="relative h-[132px] w-full">
                <Image src={cat.imagen} alt={cat.imagenPlaceholder} fill className="object-cover" />
              </div>
            ) : (
              <ImagePlaceholder label={cat.imagenPlaceholder} className="h-[132px] w-full" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-ink">{cat.nombre}</h3>
              <p className="mt-1 text-sm text-mut">{cat.claim}</p>
              <p className="mt-2 text-xs font-medium text-acc-d">
                {cat.modelosCount} modelos
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
