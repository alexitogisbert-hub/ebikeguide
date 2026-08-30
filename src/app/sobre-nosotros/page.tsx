import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre Nosotros y Transparencia | eBikeGuide",
  description:
    "Quiénes hay detrás de eBikeGuide, cómo puntuamos cada bicicleta eléctrica con nuestro propio algoritmo y cómo nos financiamos de forma transparente a través de Amazon Associates.",
  path: "/sobre-nosotros/",
});

const PILARES = [
  {
    emoji: "🔋",
    titulo: "Autonomía real",
    texto: "Para que sepas cuántos kilómetros puedes hacer sin quedarte tirado.",
  },
  {
    emoji: "⚡",
    titulo: "Potencia y par motor (Nm)",
    texto: "Evaluamos la fuerza real para subir cuestas empinadas.",
  },
  {
    emoji: "🪶",
    titulo: "Peso",
    texto: "Crucial si tienes que subir la bici a casa o meterla en el transporte público.",
  },
  {
    emoji: "💶",
    titulo: "Relación calidad-precio",
    texto: "Penalizamos los sobreprecios injustificados y premiamos los verdaderos chollos.",
  },
];

export default function SobreNosotrosPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Quiénes somos" title="Sobre eBikeGuide: nuestra misión y transparencia" />

        <article className="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
          <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-ink">
            <section>
              <p>
                Bienvenido a eBikeGuide. Sabemos que comprar una bicicleta eléctrica es una inversión
                importante. Hoy en día hay cientos de modelos, especificaciones técnicas difíciles de
                entender y precios que cambian constantemente.
              </p>
              <p className="mt-4">
                Por eso nació eBikeGuide: para ser tu copiloto en esta decisión. Nuestra misión es
                simple:{" "}
                <strong className="font-semibold text-ink">
                  ayudarte a encontrar la e-bike perfecta para tus necesidades, al mejor precio posible
                  y sin dolores de cabeza.
                </strong>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Quiénes somos y por qué confiar en nosotros</h2>
              <p className="mt-2 text-mut">
                Detrás de eBikeGuide hay apasionados de la movilidad urbana sostenible, la tecnología y
                el ciclismo. No somos una tienda física intentando venderte el stock que nos sobra en el
                almacén. Somos un proyecto 100% independiente. Nuestro objetivo no es venderte la
                bicicleta más cara, sino la que mejor se adapte a ti. Si buscas algo barato para ir a
                trabajar, te recomendaremos la mejor opción económica; si buscas potencia para la
                montaña, te mostraremos las bestias del mercado.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">¿Cómo analizamos y puntuamos las bicicletas?</h2>
              <p className="mt-2 text-mut">
                En internet hay muchas comparativas donde las notas se ponen "a ojo". Nosotros no
                hacemos eso. Hemos desarrollado un{" "}
                <strong className="font-semibold text-ink">algoritmo de evaluación propio</strong> que
                juzga cada bicicleta de forma justa y rigurosa según su categoría.
              </p>
              <p className="mt-3 text-mut">
                No le exigimos lo mismo a una bici plegable (donde premiamos la ligereza y
                portabilidad) que a una e-MTB de montaña (donde la potencia del motor es vital). En
                cada análisis evaluamos cuatro pilares fundamentales:
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {PILARES.map((pilar) => (
                  <li key={pilar.titulo} className="flex items-start gap-3 rounded-2xl border border-line p-4">
                    <span className="text-xl" aria-hidden="true">
                      {pilar.emoji}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{pilar.titulo}</p>
                      <p className="mt-0.5 text-sm text-mut">{pilar.texto}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-mut">
                Consulta el detalle completo de los pesos por categoría en nuestra{" "}
                <Link href="/metodologia/" className="font-semibold text-acc-d hover:text-ink">
                  página de metodología
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Transparencia total (cómo nos financiamos)</h2>
              <p className="mt-2 text-mut">
                Creemos que la honestidad es la base de cualquier recomendación. Para mantener
                eBikeGuide activa, actualizada y libre de molestos banners de publicidad, participamos
                en el programa de afiliados de Amazon.
              </p>
              <p className="mt-3 text-mut">
                ¿Qué significa esto? Que si decides comprar una bicicleta a través de nuestros botones
                de compra, nosotros nos llevamos una pequeña comisión por parte de la tienda.{" "}
                <strong className="font-semibold text-ink">
                  Esto no tiene absolutamente ningún coste adicional para ti.
                </strong>{" "}
                Tú pagas exactamente el mismo precio (o incluso menos, si cazamos una oferta), y a
                nosotros nos ayudas a pagar los servidores y seguir trabajando en la web.
              </p>
              <p className="mt-3 text-sm text-mut">
                Más detalles en nuestro{" "}
                <Link href="/aviso-legal/" className="font-semibold text-acc-d hover:text-ink">
                  aviso legal
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">¿Tienes dudas? Hablemos</h2>
              <p className="mt-2 text-mut">
                Si has revisado nuestras comparativas pero sigues sin tener claro qué bicicleta
                eléctrica comprar, no te preocupes. Estamos aquí para ayudarte. Cuéntanos cuál es tu
                presupuesto, para qué vas a usar la bici y te daremos nuestra recomendación sincera.
              </p>
              <p className="mt-3 text-mut">
                Escríbenos a:{" "}
                <a
                  href="mailto:alexgisbertsalminen@gmail.com"
                  className="font-bold text-acc-d hover:underline"
                >
                  alexgisbertsalminen@gmail.com
                </a>{" "}
                y te responderemos lo antes posible.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
