import Link from "next/link";
import type { Bike, OfertaBike } from "@/data/ebg-data";
import { EBG_DATA } from "@/data/ebg-data";
import { BikeImage } from "./BikeImage";
import { FavoriteButton } from "./FavoriteButton";
import { SubsBreakdown } from "./SubsBreakdown";
import { BikeDealCard } from "./BikeDealCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { AffiliateLink, ofertaCtaLabel } from "./AffiliateLink";
import { ArrowRightIcon } from "./icons";

const SIN_DATO = "Dato no publicado por el fabricante";

const SCHEMA_AVAILABILITY: Record<string, string> = {
  disponible: "https://schema.org/InStock",
  pocas: "https://schema.org/LimitedAvailability",
  agotado: "https://schema.org/OutOfStock",
};

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const BATERIA_EXTRAIBLE_LABEL: Record<"true" | "false" | "null", string> = {
  true: "extraíble",
  false: "fija",
  null: "extraíble o fija no confirmado",
};

const SPEC_ROWS = (bike: Bike) => [
  {
    label: "Batería",
    value: `${bike.bateriaWh} Wh · ${BATERIA_EXTRAIBLE_LABEL[String(bike.bateriaExtraible) as "true" | "false" | "null"]}`,
  },
  {
    label: "Autonomía estimada",
    value:
      bike.autonomiaMin === null || bike.autonomiaMax === null
        ? SIN_DATO
        : bike.autonomiaMin === bike.autonomiaMax
          ? `${bike.autonomiaMin} km`
          : `${bike.autonomiaMin}-${bike.autonomiaMax} km`,
  },
  { label: "Motor", value: bike.motor },
  { label: "Par motor", value: bike.parNm === null ? SIN_DATO : `${bike.parNm} Nm` },
  { label: "Velocidad asistida", value: `${bike.velocidad} km/h` },
  { label: "Peso", value: bike.pesoKg === null ? SIN_DATO : `${bike.pesoKg} kg` },
  { label: "Cambios", value: bike.cambios ?? SIN_DATO },
  { label: "Frenos", value: bike.frenos ?? SIN_DATO },
  { label: "Suspensión", value: bike.suspension ?? SIN_DATO },
  { label: "Tallas disponibles", value: bike.tallas.length > 0 ? bike.tallas.join(", ") : SIN_DATO },
  { label: "Carga máxima", value: bike.cargaMaxima === null ? SIN_DATO : `${bike.cargaMaxima} kg` },
  { label: "Dimensiones", value: bike.dimensiones ?? SIN_DATO },
];

const DISPONIBILIDAD_LABEL: Record<string, string> = {
  disponible: "Disponible",
  pocas: "Pocas unidades",
  agotado: "Agotado",
};

export function BicicletaDetalle({ bike }: { bike: Bike }) {
  const alternativas = bike.alternativas
    .map((id) => EBG_DATA.bikes.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const discountPct = bike.precioAnterior ? Math.round((1 - bike.precio / bike.precioAnterior) * 100) : null;
  const categoria = EBG_DATA.categorias.find((c) => c.id === bike.categoriaId);
  const ofertaPrincipal = bike.ofertas[0] as OfertaBike | undefined;
  const merchantPrincipal = ofertaPrincipal
    ? (EBG_DATA.merchants.find((m) => m.id === ofertaPrincipal.merchantId)?.nombre ?? ofertaPrincipal.merchantId)
    : "";
  const criteriosConDato = Object.values(bike.subs).filter((v) => typeof v === "number").length;
  const totalCriterios = Object.keys(bike.subs).length;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${bike.marca} ${bike.modelo}`,
    description: bike.porQue,
    ...(bike.imagen ? { image: `${EBG_DATA.meta.dominio}${bike.imagen}` } : {}),
    sku: bike.id,
    brand: { "@type": "Brand", name: bike.marca },
    // Sin aggregateRating: no tenemos reseñas ni valoraciones reales de usuarios — nuestra
    // puntuación 0-10 es un cálculo propio a partir de especificaciones, no una valoración
    // agregada de clientes, y marcarla como tal en datos estructurados sería engañoso.
    offers: bike.ofertas.map((oferta) => ({
      "@type": "Offer",
      price: oferta.precio,
      priceCurrency: "EUR",
      availability: SCHEMA_AVAILABILITY[oferta.disponibilidad] ?? "https://schema.org/InStock",
      url: `${EBG_DATA.meta.dominio}/bicicletas-electricas/${bike.slug}/`,
      seller: {
        "@type": "Organization",
        name: EBG_DATA.merchants.find((m) => m.id === oferta.merchantId)?.nombre ?? oferta.merchantId,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Bicicletas", href: "/bicicletas-electricas/" },
          { label: categoria?.nombre ?? "Categoría", href: `/bicicletas-electricas/${bike.categoriaId}/` },
          { label: `${bike.marca} ${bike.modelo}` },
        ]}
      />

      <section className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="relative">
            <BikeImage bike={bike} className="aspect-[4/3] w-full rounded-[24px]" />
            <FavoriteButton
              bikeId={bike.id}
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
            />
            {discountPct !== null && (
              <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-white">
                -{discountPct}%
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-mut">{bike.marca}</p>
            <h1 className="mt-1 text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] text-ink">
              {bike.modelo}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="rounded-full bg-acc-s px-2.5 py-1 text-xs font-bold text-acc-d">
                {bike.puntuacion.toFixed(1)}/10 puntuación
              </span>
              {bike.esTriciclo && (
                <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-white">
                  Triciclo de 3 ruedas
                </span>
              )}
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-ink">{priceFormatter.format(bike.precio)}</span>
              {bike.precioAnterior && (
                <span className="text-lg text-mut line-through">{priceFormatter.format(bike.precioAnterior)}</span>
              )}
            </div>

            <p className="mt-4 text-mut">{bike.porQue}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {ofertaPrincipal && (
                <AffiliateLink
                  oferta={ofertaPrincipal}
                  merchantName={merchantPrincipal}
                  className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-acc-d"
                >
                  {ofertaCtaLabel(ofertaPrincipal)}
                </AffiliateLink>
              )}
              {bike.ofertas.length > 1 && (
                <a
                  href="#ofertas"
                  className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-ink"
                >
                  Ver todas las tiendas
                </a>
              )}
              <Link
                href={`/comparador/?ids=${bike.id}`}
                className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-ink"
              >
                Añadir al comparador
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-line pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-acc-d">Ideal para</p>
                <p className="mt-1 text-sm text-ink">{bike.idealPara}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-mut">No es para</p>
                <p className="mt-1 text-sm text-ink">{bike.noEsPara}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-mut">Mejor para</p>
                <p className="mt-1 text-sm text-ink">{bike.mejorPara}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-xl font-bold text-ink">Análisis</h2>
            <p className="mt-3 leading-relaxed text-mut">{bike.analisis}</p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line p-5">
                <h3 className="text-sm font-bold text-ink">Pros</h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-ink">
                  {bike.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-acc-s text-[10px] font-bold text-acc-d">
                        +
                      </span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line p-5">
                <h3 className="text-sm font-bold text-ink">Contras</h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-ink">
                  {bike.contras.map((contra) => (
                    <li key={contra} className="flex items-start gap-2">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-surf text-[10px] font-bold text-mut">
                        −
                      </span>
                      {contra}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className="mt-10 text-xl font-bold text-ink">Ficha técnica</h2>
            <dl className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {SPEC_ROWS(bike).map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                  <dt className="text-mut">{row.label}</dt>
                  <dd className="text-right font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div className="rounded-2xl border border-line p-6">
              <h2 className="text-sm font-bold text-ink">Desglose de la puntuación</h2>
              <p className="mt-1 text-xs text-mut">
                Calculado en vivo con los pesos de{" "}
                <Link href="/metodologia/" className="underline">
                  nuestra metodología
                </Link>
                .
              </p>
              <div className="mt-4">
                <SubsBreakdown bike={bike} />
              </div>
              {criteriosConDato <= 1 && (
                <p className="mt-4 rounded-xl bg-surf px-3 py-2 text-xs text-mut">
                  Puntuación poco representativa: solo tenemos {criteriosConDato} de {totalCriterios} datos
                  objetivos publicados para esta bici, no es un reflejo de mal rendimiento.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="ofertas" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-8 sm:px-8">
        <h2 className="text-xl font-bold text-ink">Dónde comprarla</h2>
        <div className="mt-4 flex flex-col gap-3">
          {bike.ofertas.map((oferta) => {
            const merchant = EBG_DATA.merchants.find((m) => m.id === oferta.merchantId);
            const merchantName = merchant?.nombre ?? oferta.merchantId;
            return (
              <div
                key={oferta.merchantId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-ink">{merchantName}</p>
                  <p className="text-xs text-mut">{DISPONIBILIDAD_LABEL[oferta.disponibilidad]}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-ink">{priceFormatter.format(oferta.precio)}</span>
                  <AffiliateLink
                    oferta={oferta}
                    merchantName={merchantName}
                    className={
                      oferta.affiliateUrl || oferta.urlProducto
                        ? "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-acc-d"
                        : "rounded-full border border-line px-4 py-2 text-sm font-semibold text-mut"
                    }
                  >
                    {ofertaCtaLabel(oferta)}
                  </AffiliateLink>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-mut">
          Todavía no tenemos cuenta de afiliado activa: los enlaces &ldquo;Ver precio actual en Amazon&rdquo; van directamente a la
          ficha del producto, sin comisión para nosotros. Cuando activemos la afiliación, lo indicaremos aquí con claridad.
          Nunca afecta a la puntuación.{" "}
          <Link href="/aviso-legal/" className="underline hover:text-ink">
            Más información sobre afiliación
          </Link>
          .
        </p>
      </section>

      {alternativas.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8">
          <h2 className="text-xl font-bold text-ink">Alternativas a considerar</h2>
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
            {alternativas.map((alt) => (
              <BikeDealCard key={alt.id} bike={alt} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
        <Link href="/bicicletas-electricas/" className="flex items-center gap-1 text-sm font-semibold text-acc-d hover:text-ink">
          Ver todo el catálogo <ArrowRightIcon className="size-3.5" />
        </Link>
      </section>
    </>
  );
}
