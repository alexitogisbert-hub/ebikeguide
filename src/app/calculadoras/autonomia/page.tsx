import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { AutonomiaConMapa } from "@/components/AutonomiaConMapa";
import { FACTOR_ASISTENCIA, FACTOR_TERRENO, BASE_WH_POR_KM } from "@/domain/autonomy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Calculadora de autonomía de e-bikes | eBikeGuide",
  description: "Estima cuántos km puedes hacer con tu e-bike según la batería, tu peso, el terreno y el nivel de asistencia.",
  path: "/calculadoras/autonomia/",
});

const ASISTENCIA_LABELS: Record<keyof typeof FACTOR_ASISTENCIA, string> = {
  eco: "Eco",
  medio: "Medio",
  alto: "Alto",
  turbo: "Turbo",
};

const TERRENO_LABELS: Record<keyof typeof FACTOR_TERRENO, string> = {
  llano: "Llano",
  mixto: "Mixto",
  montanoso: "Montañoso",
};

export default function CalculadoraAutonomiaPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Calculadora"
          title="Calcula la autonomía real de una e-bike"
          intro="La cifra de autonomía de una ficha técnica rara vez coincide con la real. Ajusta batería, peso, terreno y asistencia para ver un rango más realista."
        />

        <div className="mx-auto max-w-[1280px] px-5 pb-10 sm:px-8">
          <AutonomiaConMapa />
        </div>

        <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <div className="rounded-2xl border border-line p-6">
            <h2 className="text-lg font-bold text-ink">Cómo funciona el modelo DEMO</h2>
            <p className="mt-2 text-sm text-mut">
              Partimos de un consumo base de {BASE_WH_POR_KM.toString().replace(".", ",")} Wh/km y lo ajustamos
              multiplicándolo por tres factores: nivel de asistencia, terreno y peso total (ciclista + carga). La
              autonomía estimada es la batería (Wh) dividida entre ese consumo ajustado.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-ink">Factor por nivel de asistencia</h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-mut">
                  {Object.entries(FACTOR_ASISTENCIA).map(([id, factor]) => (
                    <li key={id} className="flex justify-between">
                      <span>{ASISTENCIA_LABELS[id as keyof typeof FACTOR_ASISTENCIA]}</span>
                      <span className="font-medium text-ink">×{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Factor por terreno</h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-mut">
                  {Object.entries(FACTOR_TERRENO).map(([id, factor]) => (
                    <li key={id} className="flex justify-between">
                      <span>{TERRENO_LABELS[id as keyof typeof FACTOR_TERRENO]}</span>
                      <span className="font-medium text-ink">×{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 text-xs text-mut">
              El peso ajusta el consumo de forma proporcional a la desviación respecto a 75 kg de referencia (±0,3 %
              de consumo por cada kg de diferencia, con un suelo del 60 % del consumo base). Es un modelo DEMO
              simplificado, no una medición real por bici.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
