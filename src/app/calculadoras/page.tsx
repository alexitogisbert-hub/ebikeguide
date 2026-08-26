import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Calculadoras para e-bikes | eBikeGuide",
  description: "Herramientas para estimar la autonomía real de una e-bike según tu peso, terreno y nivel de asistencia.",
  path: "/calculadoras/",
});

export default function CalculadorasPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Calculadoras" title="Calculadoras" intro="Herramientas rápidas para decidir con datos." />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <Link
            href="/calculadoras/autonomia/"
            className="block max-w-sm rounded-2xl border border-line p-6 transition-shadow hover:shadow-lg"
          >
            <h2 className="font-bold text-ink">Calculadora de autonomía</h2>
            <p className="mt-2 text-sm text-mut">
              Estima cuántos km puedes hacer según la batería, tu peso, el terreno y el nivel de asistencia.
            </p>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
