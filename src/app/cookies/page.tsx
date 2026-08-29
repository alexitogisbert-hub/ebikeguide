import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de cookies | eBikeGuide",
  description: "Qué guardamos en tu navegador, por qué, y qué pasa cuando sales hacia una tienda.",
  path: "/cookies/",
});

const STORAGE_ROWS = [
  {
    nombre: "ebg:favoritos",
    tipo: "localStorage (no es una cookie)",
    finalidad: "Recordar qué bicis has marcado como favoritas en este navegador.",
    duracion: "Hasta que borres los datos del sitio o los favoritos manualmente.",
  },
  {
    nombre: "ebg:cookies-consent",
    tipo: "localStorage (no es una cookie)",
    finalidad: "Recordar tu elección sobre este aviso (aceptar o rechazar), para no repetirlo en cada visita.",
    duracion: "Hasta que borres los datos del sitio.",
  },
  {
    nombre: "_ga, _ga_*",
    tipo: "Cookie de analítica (Google Analytics)",
    finalidad: "Medir visitas y qué páginas se leen más, de forma agregada. Solo se instalan si pulsas «Aceptar» en el aviso de cookies.",
    duracion: "Hasta 2 años (gestionado por Google).",
  },
];

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Legal" title="Política de cookies" />
        <article className="mx-auto max-w-[760px] px-5 pb-16 sm:px-8">
          <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-ink">
            <section>
              <h2 className="text-lg font-bold">Lo importante</h2>
              <p className="mt-2 text-mut">
                {EBG_DATA.meta.nombre} usa Google Analytics para saber cuánta gente visita la web y qué páginas
                funcionan mejor — pero solo si aceptas el aviso de cookies; si lo rechazas, no se instala. Aparte de
                eso, lo único que guardamos en tu navegador es almacenamiento local (
                <code className="rounded bg-surf px-1.5 py-0.5">localStorage</code>), que técnicamente no es una
                cookie, pero lo explicamos aquí igualmente por transparencia. No usamos cookies de publicidad.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Qué guardamos</h2>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead className="bg-surf text-xs font-semibold uppercase tracking-wide text-mut">
                    <tr>
                      <th className="px-4 py-3">Clave</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Para qué</th>
                      <th className="px-4 py-3">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {STORAGE_ROWS.map((row) => (
                      <tr key={row.nombre}>
                        <td className="px-4 py-3 font-mono text-xs text-ink">{row.nombre}</td>
                        <td className="px-4 py-3 text-mut">{row.tipo}</td>
                        <td className="px-4 py-3 text-mut">{row.finalidad}</td>
                        <td className="px-4 py-3 text-mut">{row.duracion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold">Cookies de terceros</h2>
              <p className="mt-2 text-mut">
                Cuando sigues un{" "}
                <Link href="/aviso-legal/" className="underline hover:text-acc-d">
                  enlace de afiliado
                </Link>{" "}
                hacia una tienda, esa tienda puede instalar sus propias cookies según su propia política, fuera de
                nuestro control.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Cómo borrarlo</h2>
              <p className="mt-2 text-mut">
                Puedes eliminar los favoritos y preferencias guardadas en cualquier momento borrando los datos del
                sitio desde los ajustes de tu navegador (normalmente en «Configuración → Privacidad → Datos de
                sitios»).
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
