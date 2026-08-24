import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { BikeDealCard } from "@/components/BikeDealCard";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ofertas en e-bikes | eBikeGuide",
  description: "Bicicletas eléctricas con descuento en el catálogo demo, ordenadas por porcentaje de rebaja.",
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
          intro={`${bikesConDescuento.length} modelos con precio rebajado en el catálogo demo, de mayor a menor descuento.`}
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
            {bikesConDescuento.map((bike) => (
              <BikeDealCard key={bike.id} bike={bike} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
