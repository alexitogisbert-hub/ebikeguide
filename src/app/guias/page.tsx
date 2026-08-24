import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { EBG_DATA } from "@/data/ebg-data";

export const metadata: Metadata = {
  title: "Guías y consejos sobre e-bikes | eBikeGuide",
  description: "Guías de compra, mantenimiento y normativa sobre bicicletas eléctricas.",
};

export default function GuiasPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Guías" title="Guías y consejos" intro="Todo lo que conviene saber antes y después de comprar una e-bike." />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            {EBG_DATA.guias.map((guia) => (
              <Link
                key={guia.id}
                href={`/guias/${guia.slug}/`}
                className="overflow-hidden rounded-2xl border border-line transition-shadow duration-200 hover:shadow-lg"
              >
                <ImagePlaceholder label={guia.imagenPlaceholder} className="h-[160px] w-full" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-acc-d">{guia.categoria}</p>
                  <h2 className="mt-1.5 font-bold text-ink">{guia.titulo}</h2>
                  <p className="mt-2 text-sm text-mut">{guia.resumen}</p>
                  <p className="mt-3 text-xs font-medium text-mut">{guia.minutosLectura} min de lectura</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
