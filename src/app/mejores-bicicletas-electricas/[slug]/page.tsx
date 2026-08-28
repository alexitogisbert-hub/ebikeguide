import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AffiliateLink, ofertaCtaLabel } from "@/components/AffiliateLink";
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
    path: `/mejores-bicicletas-electricas/${mejor.slug}/`,
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

  const comparadorHref = `/comparador/?ids=${ganadores.map((g) => g.bike.id).join(",")}`;

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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Ganadoras</h2>
            <Link
              href={comparadorHref}
              className="inline-flex items-center rounded-full bg-acc px-5 py-2.5 text-sm font-bold text-dark transition-opacity hover:opacity-90"
            >
              Comparar estas {ganadores.length} en el comparador →
            </Link>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {ganadores.map(({ bike, motivo }) => {
              const oferta = bike.ofertas[0];
              const merchantName = oferta
                ? (EBG_DATA.merchants.find((m) => m.id === oferta.merchantId)?.nombre ?? oferta.merchantId)
                : "";
              return (
                <div
                  key={bike.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line p-5 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"
                >
                  <Link href={`/bicicletas-electricas/${bike.slug}/`} className="shrink-0">
                    <ImagePlaceholder label={bike.imagenPlaceholder} className="h-28 w-full rounded-xl sm:w-40" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mut">{bike.marca}</p>
                    <Link href={`/bicicletas-electricas/${bike.slug}/`}>
                      <h3 className="font-bold text-ink hover:text-acc-d">{bike.modelo}</h3>
                    </Link>
                    <p className="mt-1.5 text-sm text-mut">{motivo}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="text-lg font-bold text-ink">{priceFormatter.format(bike.precio)}</span>
                    {oferta && (
                      <AffiliateLink
                        oferta={oferta}
                        merchantName={merchantName}
                        className="inline-flex items-center rounded-full bg-acc px-4 py-2 text-sm font-bold text-dark transition-opacity hover:opacity-90"
                      >
                        {ofertaCtaLabel(oferta)}
                      </AffiliateLink>
                    )}
                  </div>
                </div>
              );
            })}
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
