import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { CatalogoBicicletas } from "@/components/CatalogoBicicletas";
import { BicicletaDetalle } from "@/components/BicicletaDetalle";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

function getCategoria(slug: string) {
  return EBG_DATA.categorias.find((c) => c.slug === slug);
}

function getBike(slug: string) {
  return EBG_DATA.bikes.find((b) => b.slug === slug);
}

export function generateStaticParams() {
  return [
    ...EBG_DATA.categorias.map((categoria) => ({ slug: categoria.slug })),
    ...EBG_DATA.bikes.map((bike) => ({ slug: bike.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const categoria = getCategoria(slug);
  if (categoria) {
    return pageMetadata({
      title: `E-bikes ${categoria.nombre.toLowerCase()} — ${categoria.claim} | eBikeGuide`,
      description: `Compara las bicicletas eléctricas ${categoria.nombre.toLowerCase()} de nuestro catálogo: ${categoria.claim.toLowerCase()}.`,
      path: `/bicicletas-electricas/${categoria.slug}/`,
    });
  }

  const bike = getBike(slug);
  if (bike) {
    return pageMetadata({
      title: `${bike.marca} ${bike.modelo} — análisis y precio | eBikeGuide`,
      description: bike.porQue,
      path: `/bicicletas-electricas/${bike.slug}/`,
    });
  }

  return {};
}

export default async function BicicletasElectricasSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const categoria = getCategoria(slug);
  if (categoria) {
    return (
      <>
        <Header />
        <main>
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Bicicletas", href: "/bicicletas-electricas/" },
              { label: categoria.nombre },
            ]}
          />
          <PageHeader
            eyebrow="Categoría"
            title={`E-bikes ${categoria.nombre.toLowerCase()}`}
            intro={`${categoria.claim}. ${categoria.modelosCount} modelos investigados en esta categoría, con precios orientativos.`}
          />
          <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
            <CatalogoBicicletas bikes={EBG_DATA.bikes} categorias={EBG_DATA.categorias} initialCategoriaId={categoria.id} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const bike = getBike(slug);
  if (!bike) notFound();

  return (
    <>
      <Header />
      <main>
        <BicicletaDetalle bike={bike} />
      </main>
      <Footer />
    </>
  );
}
