import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ComparadorClient } from "@/components/ComparadorClient";

export const metadata: Metadata = {
  title: "Comparador de e-bikes | eBikeGuide",
  description: "Compara hasta 4 bicicletas eléctricas lado a lado: precio, batería, autonomía, motor, peso y puntuación.",
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
          <Suspense fallback={<p className="text-sm text-mut">Cargando comparador…</p>}>
            <ComparadorClient />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
