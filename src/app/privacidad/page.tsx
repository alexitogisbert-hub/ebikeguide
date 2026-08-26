import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de privacidad | eBikeGuide",
  description: "Qué datos guardamos, dónde se guardan y qué pasa cuando sigues un enlace hacia una tienda.",
  path: "/privacidad/",
});

export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Legal" title="Política de privacidad" />
        <article className="mx-auto max-w-[760px] px-5 pb-16 sm:px-8">
          <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-ink">
            <section>
              <h2 className="text-lg font-bold">Resumen corto</h2>
              <p className="mt-2 text-mut">
                No tienes que crear una cuenta para usar {EBG_DATA.meta.nombre}. Tus favoritos se guardan solo en tu
                propio navegador, no en un servidor nuestro, y no usamos cookies de analítica ni de publicidad de
                terceros en esta demo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Qué guardamos</h2>
              <ul className="mt-2 flex flex-col gap-2 text-mut">
                <li>
                  <span className="font-medium text-ink">Favoritos</span> — las bicis que marcas con el corazón se
                  guardan en el almacenamiento local (<code className="rounded bg-surf px-1.5 py-0.5">localStorage</code>)
                  de tu navegador. Nunca llegan a nuestros servidores ni se comparten con terceros.
                </li>
                <li>
                  <span className="font-medium text-ink">Preferencia de cookies</span> — si cierras el aviso de
                  cookies, guardamos esa elección igualmente en tu navegador para no volver a mostrártelo.
                </li>
                <li>
                  <span className="font-medium text-ink">Formulario de newsletter</span> — en esta demo, el
                  formulario de suscripción del Home no envía tu email a ningún servidor: es una simulación visual.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold">Enlaces a terceros</h2>
              <p className="mt-2 text-mut">
                Cuando sigues un enlace hacia una tienda o fabricante (incluidos los{" "}
                <Link href="/aviso-legal/" className="underline hover:text-acc-d">
                  enlaces de afiliado
                </Link>
                ), sales de {EBG_DATA.meta.nombre} y pasas a estar sujeto a la política de privacidad y cookies de
                ese sitio, que no controlamos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Tus derechos</h2>
              <p className="mt-2 text-mut">
                Como no recogemos datos personales identificables en nuestros propios servidores, no hay un perfil
                tuyo que solicitar, rectificar o eliminar: basta con borrar los datos del sitio desde los ajustes de
                tu navegador para eliminar tus favoritos y preferencias guardadas. Si en el futuro añadimos registro
                de usuarios o analítica, actualizaremos esta página antes de activarlo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Contacto</h2>
              <p className="mt-2 text-mut">
                Para cualquier duda sobre privacidad: <span className="font-medium text-ink">contacto@ebikeguide.es</span>{" "}
                (dirección de contacto de muestra).
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
