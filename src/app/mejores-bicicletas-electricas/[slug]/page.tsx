import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function getMejor(slug: string) {
  return EBG_DATA.mejores.find((m) => m.slug === slug);
}

export function generateStaticParams() {
  return EBG_DATA.mejores.map((mejor) => ({ slug: mejor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mejor = getMejor(slug);
  if (!mejor) return {};

  return pageMetadata({
    title: `${mejor.titulo} | eBikeGuide`,
    description: mejor.resumen,
  });
}

export default async function MejorDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mejor = getMejor(slug);
  if (!mejor) notFound();

  const ganadores = mejor.ganadores
    .map((g) => ({ ...g, bike: EBG_DATA.bikes.find((b) => b.id === g.bikeId) }))
    .filter((g): g is typeof g & { bike: NonNullable<typeof g.bike> } => Boolean(g.bike));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mejor.faq.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.respuesta,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Header />
      <main>
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mejores bicicletas eléctricas", href: "/mejores-bicicletas-electricas/" },
            { label: mejor.titulo },
          ]}
        />
        <div className="mx-auto max-w-[1280px] px-5 pt-6 sm:px-8">
          <h1 className="mt-4 text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.02em] text-ink">
            {mejor.titulo}
          </h1>
          <p className="mt-3 max-w-[70ch] text-lg text-mut">{mejor.intro}</p>
        </div>

        <ImagePlaceholder
          label={mejor.imagenPlaceholder}
          className="mx-auto mt-8 h-[240px] max-w-[1280px] w-[calc(100%-40px)] rounded-[24px] sm:w-[calc(100%-64px)]"
        />

        <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8">
          <h2 className="text-xl font-bold text-ink">Cómo hemos elegido</h2>
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            {mejor.criterios.map((criterio) => (
              <div key={criterio.titulo} className="rounded-2xl border border-line p-5">
                <h3 className="text-sm font-bold text-ink">{criterio.titulo}</h3>
                <p className="mt-1.5 text-sm text-mut">{criterio.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-12 sm:px-8">
          <h2 className="text-xl font-bold text-ink">Ganadoras</h2>
          <div className="mt-5 flex flex-col gap-4">
            {ganadores.map(({ bike, motivo }) => (
              <Link
                key={bike.id}
                href={`/bicicletas-electricas/${bike.slug}/`}
                className="flex flex-col gap-4 rounded-2xl border border-line p-5 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"
              >
                <ImagePlaceholder label={bike.imagenPlaceholder} className="h-28 w-full shrink-0 rounded-xl sm:w-40" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-mut">{bike.marca}</p>
                  <h3 className="font-bold text-ink">{bike.modelo}</h3>
                  <p className="mt-1.5 text-sm text-mut">{motivo}</p>
                </div>
                <div className="text-left font-bold text-ink sm:text-right">{priceFormatter.format(bike.precio)}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <h2 className="text-xl font-bold text-ink">Preguntas frecuentes</h2>
          <div className="mt-5 flex flex-col divide-y divide-line rounded-2xl border border-line">
            {mejor.faq.map((item) => (
              <div key={item.pregunta} className="p-5">
                <h3 className="font-semibold text-ink">{item.pregunta}</h3>
                <p className="mt-1.5 text-sm text-mut">{item.respuesta}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
