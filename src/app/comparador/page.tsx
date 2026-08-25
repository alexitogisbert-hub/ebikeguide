import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ComparadorClient } from "@/components/ComparadorClient";
import { ComparadorFallback } from "@/components/ComparadorFallback";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Comparador de e-bikes | eBikeGuide",
    description: "Compara hasta 4 bicicletas eléctricas lado a lado: precio, batería, autonomía, motor, peso y puntuación.",
  }),
  alternates: { canonical: "/comparador/" },
};

export default function ComparadorPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Comparador"
          title="Compara e-bikes lado a lado"
          intro="Elige hasta 4 modelos del catálogo demo y compara sus especificaciones de un vistazo."
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <Suspense fallback={<ComparadorFallback />}>
            <ComparadorClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
