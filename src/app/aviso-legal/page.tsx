import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Aviso legal | eBikeGuide",
  description: "Titularidad del sitio, relación con tiendas y marcas, y cómo funcionan nuestros enlaces de afiliación.",
});

export default function AvisoLegalPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Legal" title="Aviso legal" />
        <article className="mx-auto max-w-[760px] px-5 pb-16 sm:px-8">
          <div className="mb-8 rounded-2xl border border-line bg-surf p-5 text-sm text-mut">
            {EBG_DATA.meta.nombre} es, por ahora, un proyecto demo en construcción: los datos del catálogo son de
            muestra (marcados como <code className="rounded bg-white px-1.5 py-0.5">meta.demo: true</code>) y la
            titularidad legal y datos de contacto de esta página son placeholders pendientes de completar antes de
            un lanzamiento real.
          </div>

          <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-ink">
            <section>
              <h2 className="text-lg font-bold">Titularidad</h2>
              <p className="mt-2 text-mut">
                {EBG_DATA.meta.nombre} ({EBG_DATA.meta.dominio}) es un comparador independiente de bicicletas
                eléctricas. Contacto: <span className="font-medium text-ink">contacto@ebikeguide.es</span> (dirección
                de contacto de muestra).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Objeto del sitio</h2>
              <p className="mt-2 text-mut">
                Comparamos especificaciones, precios y puntuaciones de bicicletas eléctricas de distintas marcas y
                tiendas para ayudarte a elegir. No vendemos bicicletas directamente: cada ficha enlaza a las tiendas
                donde puedes comprarlas.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Relación con marcas y tiendas</h2>
              <p className="mt-2 text-mut">
                Ganamos comisión de las tiendas cuando compras a través de nuestros enlaces, nunca de las marcas.
                Ninguna marca ni tienda puede pagar por una puntuación más alta: el cálculo se hace siempre con la
                misma tabla de pesos, pública en{" "}
                <Link href="/metodologia/" className="underline hover:text-acc-d">
                  nuestra metodología
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Enlaces de afiliación</h2>
              <p className="mt-2 text-mut">
                Algunos enlaces hacia tiendas son enlaces de afiliado: si compras a través de ellos, podemos recibir
                una comisión sin ningún coste adicional para ti. Estos enlaces se marcan técnicamente con{" "}
                <code className="rounded bg-surf px-1.5 py-0.5">rel=&quot;sponsored nofollow&quot;</code>, tal y como
                recomiendan Google y los propios programas de afiliación, y se aplica automáticamente a cualquier
                enlace de este tipo en el sitio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Propiedad intelectual</h2>
              <p className="mt-2 text-mut">
                El diseño, los textos editoriales y el código de este sitio son propiedad de {EBG_DATA.meta.nombre}.
                Los nombres, logotipos e imágenes de las marcas y bicicletas mencionadas pertenecen a sus respectivos
                titulares y se usan únicamente con fines informativos y comparativos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold">Limitación de responsabilidad</h2>
              <p className="mt-2 text-mut">
                Precios, disponibilidad y especificaciones pueden cambiar sin previo aviso por parte de las tiendas y
                fabricantes. Verifica siempre el precio y las condiciones finales en la web de la tienda antes de
                comprar.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
