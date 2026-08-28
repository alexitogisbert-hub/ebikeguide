import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { BikeDealCard } from "@/components/BikeDealCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

function getGuia(slug: string) {
  return EBG_DATA.guias.find((g) => g.slug === slug);
}

export function generateStaticParams() {
  return EBG_DATA.guias.map((guia) => ({ slug: guia.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guia = getGuia(slug);
  if (!guia) return {};

  return pageMetadata({
    title: `${guia.titulo} | eBikeGuide`,
    description: guia.resumen,
    path: `/guias/${guia.slug}/`,
  });
}

export default async function GuiaDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guia = getGuia(slug);
  if (!guia) notFound();

  const productos = guia.productos
    .map((id) => EBG_DATA.bikes.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.resumen,
    datePublished: guia.fechaPublicacion,
    dateModified: guia.fechaPublicacion,
    author: { "@type": "Organization", name: EBG_DATA.meta.nombre },
    publisher: { "@type": "Organization", name: EBG_DATA.meta.nombre },
    articleSection: guia.categoria,
    mainEntityOfPage: `${EBG_DATA.meta.dominio}/guias/${guia.slug}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Header />
      <main>
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Guías", href: "/guias/" },
            { label: guia.titulo },
          ]}
        />
        <article className="mx-auto max-w-[760px] px-5 pt-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-acc-d">{guia.categoria}</p>
          <h1 className="mt-1.5 text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] text-ink">
            {guia.titulo}
          </h1>
          <p className="mt-3 text-sm text-mut">{guia.minutosLectura} min de lectura</p>

          {guia.imagen ? (
            <div className="relative mt-8 h-[280px] w-full overflow-hidden rounded-[24px]">
              <Image src={guia.imagen} alt={guia.imagenPlaceholder} fill className="object-cover" />
            </div>
          ) : (
            <ImagePlaceholder label={guia.imagenPlaceholder} className="mt-8 h-[280px] w-full rounded-[24px]" />
          )}

          <div className="mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-ink">
            {guia.cuerpo.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </article>

        {productos.length > 0 && (
          <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
            <h2 className="text-xl font-bold text-ink">Bicis mencionadas en esta guía</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productos.map((bike) => (
                <BikeDealCard key={bike.id} bike={bike} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
