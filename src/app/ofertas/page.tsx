import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { BikeDealCard } from "@/components/BikeDealCard";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ofertas en e-bikes | eBikeGuide",
  description: "Bicicletas eléctricas con descuento, ordenadas por porcentaje de rebaja.",
  path: "/ofertas/",
});

function descuentoPct(precio: number, precioAnterior: number) {
  return Math.round((1 - precio / precioAnterior) * 100);
}

export default function OfertasPage() {
  const bikesConDescuento = EBG_DATA.bikes
    .filter((b): b is typeof b & { precioAnterior: number } => Boolean(b.precioAnterior && b.precioAnterior > b.precio))
    .sort((a, b) => descuentoPct(b.precio, b.precioAnterior) - descuentoPct(a.precio, a.precioAnterior));

  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Ofertas"
          title="E-bikes con descuento"
          intro={
            bikesConDescuento.length > 0
              ? `${bikesConDescuento.length} modelos con precio rebajado, de mayor a menor descuento.`
              : "Todavía no tenemos descuentos verificados que mostrar — los precios de cada ficha son orientativos, investigados por búsqueda web."
          }
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          {bikesConDescuento.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bikesConDescuento.map((bike) => (
                <BikeDealCard key={bike.id} bike={bike} showBuyCta />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-mut">
              Vuelve más adelante, o explora el{" "}
              <Link href="/bicicletas-electricas/" className="underline hover:text-ink">
                catálogo completo
              </Link>
              .
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
