import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { CatalogoBicicletas } from "@/components/CatalogoBicicletas";
import { EBG_DATA } from "@/data/ebg-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Bicicletas eléctricas — catálogo completo | eBikeGuide",
    description: "Compara e-bikes reales por categoría, precio, autonomía y puntuación calculada a partir de sus especificaciones.",
  }),
  alternates: { canonical: "/bicicletas-electricas/" },
};

export default async function BicicletasElectricasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  return (
    <>
      <Header />
      <main>
        <PageHeader
          eyebrow="Catálogo"
          title="Todas las bicicletas eléctricas"
          intro="Filtra por categoría y precio máximo, y ordena por lo que más te importe: puntuación, autonomía, peso o relación calidad-precio."
        />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <CatalogoBicicletas bikes={EBG_DATA.bikes} categorias={EBG_DATA.categorias} initialCategoriaId={categoria ?? null} />
        </div>
      </main>
      <Footer />
    </>
  );
}
