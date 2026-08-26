import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Las mejores bicicletas eléctricas | eBikeGuide",
  description: "Selecciones por categoría y presupuesto, con criterios explicados y preguntas frecuentes.",
  path: "/mejores-bicicletas-electricas/",
});

export default function MejoresBicicletasPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Selecciones"
          title="Las mejores bicicletas eléctricas"
          intro="No hay una única «mejor» e-bike: hay selecciones honestas por categoría y presupuesto, con el motivo explicado."
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
            {EBG_DATA.mejores.map((mejor) => (
              <Link
                key={mejor.id}
                href={`/mejores-bicicletas-electricas/${mejor.slug}/`}
                className="overflow-hidden rounded-2xl border border-line transition-shadow duration-200 hover:shadow-lg"
              >
                <ImagePlaceholder label={mejor.imagenPlaceholder} className="h-[160px] w-full" />
                <div className="p-5">
                  <h2 className="font-bold text-ink">{mejor.titulo}</h2>
                  <p className="mt-2 text-sm text-mut">{mejor.resumen}</p>
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
