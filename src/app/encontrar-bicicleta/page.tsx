import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { EncontrarBicicletaQuiz } from "@/components/EncontrarBicicletaQuiz";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Encuentra tu e-bike ideal | eBikeGuide",
  description: "Responde 7 preguntas rápidas sobre tu uso, terreno y presupuesto y te recomendamos las e-bikes de nuestro catálogo que mejor encajan.",
});

export default function EncontrarBicicletaPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Quiz · 7 preguntas"
          title="Encuentra tu e-bike ideal"
          intro="Sin registro ni datos personales: solo 7 preguntas sobre cómo vas a usarla."
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <EncontrarBicicletaQuiz />
        </div>
      </main>
      <Footer />
    </>
  );
}
