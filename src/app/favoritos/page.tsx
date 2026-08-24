import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { FavoritosClient } from "@/components/FavoritosClient";

export const metadata: Metadata = {
  title: "Tus favoritos | eBikeGuide",
  description: "Las e-bikes que has guardado como favoritas, guardadas en este navegador.",
};

export default function FavoritosPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeader eyebrow="Favoritos" title="Tus bicis guardadas" intro="Se guardan en este navegador — no necesitas registrarte." />
        <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <FavoritosClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
