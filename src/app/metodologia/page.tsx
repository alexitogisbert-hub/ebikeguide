import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { EBG_DATA } from "@/data/ebg-data";
import { validatePesosPuntuacion } from "@/domain/scoring";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Metodología | eBikeGuide",
  description: "Cómo calculamos la puntuación de cada e-bike: los criterios, sus pesos y de dónde sale la evidencia.",
  path: "/metodologia/",
});

const CATEGORIA_LABELS: Record<string, { emoji: string; nombre: string }> = {
  urbana: { emoji: "🚲", nombre: "Urbanas" },
  plegable: { emoji: "🗜️", nombre: "Plegables" },
  montana: { emoji: "⛰️", nombre: "Montaña" },
  trekking: { emoji: "🗺️", nombre: "Trekking" },
  cargo: { emoji: "📦", nombre: "Cargo" },
};

export default function MetodologiaPage() {
  const { pesosPorTipo } = EBG_DATA.meta;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Metodología"
          title="Cómo puntuamos cada e-bike"
          intro="Los pesos varían según la categoría de la bici — lo que importa en una plegable no es lo mismo que en una de montaña."
        />

        <section className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(pesosPorTipo).map(([tipo, pesos]) => {
              const cat = CATEGORIA_LABELS[tipo];
              const { sumaTotal } = validatePesosPuntuacion(pesos);
              return (
                <div key={tipo} className="overflow-hidden rounded-2xl border border-line">
                  <div className="bg-surf px-5 py-3">
                    <h2 className="text-sm font-bold text-ink">
                      {cat?.emoji} {cat?.nombre ?? tipo}
                    </h2>
                  </div>
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="text-xs font-semibold uppercase tracking-wide text-mut">
                      <tr>
                        <th className="px-5 py-2">Criterio</th>
                        <th className="px-5 py-2 text-right">Peso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {pesos.map((peso) => (
                        <tr key={peso.id}>
                          <td className="px-5 py-3 font-medium text-ink">{peso.label}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-flex items-center rounded-full bg-acc-s px-2.5 py-1 text-xs font-bold text-acc-d">
                              {peso.peso}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="border-t border-line px-5 py-2 text-xs text-mut">
                    Suma: {sumaTotal}%
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-mut">
            Cada bici tiene una nota de 6 a 10 en cada criterio, asignada por tramos fijos a partir
            de la especificación real (no un percentil entre bicis del catálogo). La puntuación final
            es la media ponderada con los pesos de su categoría.
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
              Cuando el fabricante no publica el dato que necesita un criterio (por ejemplo, el par
              motor en Nm), esa bici muestra «N/D» en ese criterio y su puntuación final se calcula
              solo con los criterios disponibles, renormalizando los pesos.
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
