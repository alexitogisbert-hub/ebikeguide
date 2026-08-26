import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metodología | eBikeGuide",
  description: "Cómo calculamos la puntuación de cada e-bike: los criterios, sus pesos y de dónde sale la evidencia.",
  path: "/metodologia/",
});

export default function MetodologiaPage() {
  const { pesosPuntuacion } = EBG_DATA.meta;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Metodología"
          title="Cómo puntuamos cada e-bike"
          intro="Esta es la misma tabla de pesos que usa nuestro motor de puntuación — si cambia aquí, cambia en toda la web, nunca al revés."
        />

        <section className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-8">
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead className="bg-surf text-xs font-semibold uppercase tracking-wide text-mut">
                <tr>
                  <th className="px-5 py-3">Criterio</th>
                  <th className="px-5 py-3">Peso</th>
                  <th className="px-5 py-3">Qué mide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pesosPuntuacion.map((peso) => (
                  <tr key={peso.id}>
                    <td className="px-5 py-4 font-semibold text-ink">{peso.label}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-acc-s px-2.5 py-1 text-xs font-bold text-acc-d">
                        {peso.peso}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-mut">{peso.que}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-mut">
            Los pesos suman {pesosPuntuacion.reduce((sum, p) => sum + p.peso, 0)}%. Cada bici tiene una nota de 0 a
            10 en cada criterio, calculada automáticamente como el percentil de esa especificación dentro del
            catálogo (no una opinión editorial ni una prueba física); la puntuación final es la media ponderada de
            esas notas.
          </p>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-8">
          <div className="rounded-2xl border border-line p-6">
            <h2 className="text-lg font-bold text-ink">De dónde sale la evidencia</h2>
            <p className="mt-2 text-sm text-mut">
              {EBG_DATA.meta.pruebasPropias
                ? "Las notas se basan en pruebas propias sobre cada bici."
                : "Las notas se calculan automáticamente a partir de especificaciones publicadas por cada fabricante, no en pruebas propias todavía — evidencia declarada por defecto: "}
              <span className="font-semibold text-ink">{EBG_DATA.meta.evidenciaPorDefecto}</span>.
            </p>
            <p className="mt-3 text-sm text-mut">
              Antes ponderábamos también «Comodidad» y «Componentes» de forma editorial. Los hemos retirado del
              motor de puntuación: sin pruebas propias no teníamos una especificación numérica objetiva de la que
              derivarlos, y mantenerlos habría significado seguir asignándolos a mano — justo lo que queríamos
              evitar en un catálogo de productos reales. Cuando el fabricante no publica el dato que necesita un
              criterio (por ejemplo, el par motor en Nm), esa bici muestra «N/D» en ese criterio en vez de un
              número inventado, y su puntuación final se calcula solo con los criterios de los que sí hay dato.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <h2 className="text-lg font-bold text-ink">Por qué puedes fiarte</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {EBG_DATA.trustItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-acc-s text-[10px] font-bold text-acc-d">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
