import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Accesorios para e-bikes | eBikeGuide",
  description: "Casco, candado, luces, alforjas y otros accesorios recomendados para tu bicicleta eléctrica.",
  path: "/accesorios/",
});

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function AccesoriosPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Accesorios"
          title="Accesorios para tu e-bike"
          intro="Lo esencial para usar tu bicicleta eléctrica con más seguridad y comodidad, con precio aproximado orientativo."
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {EBG_DATA.accesorios.map((acc) => (
              <div key={acc.id} className="overflow-hidden rounded-2xl border border-line">
                <ImagePlaceholder label={acc.imagenPlaceholder} className="h-[140px] w-full" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-acc-d">{acc.categoria}</p>
                  <h2 className="mt-1 font-semibold text-ink">{acc.nombre}</h2>
                  <p className="mt-2 text-sm text-mut">{acc.paraQue}</p>
                  <p className="mt-2 text-xs text-mut">{acc.nota}</p>
                  <p className="mt-3 font-bold text-ink">Desde {priceFormatter.format(acc.precioAprox)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
