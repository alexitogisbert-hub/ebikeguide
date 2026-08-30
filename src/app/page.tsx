import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Toolbar } from "@/components/Toolbar";
import { Categories } from "@/components/Categories";
import { QuizAndAutonomy } from "@/components/QuizAndAutonomy";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { GuidesNewsletterTrust } from "@/components/GuidesNewsletterTrust";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { FAQ_GENERAL } from "@/lib/seoContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Las 10 Mejores Bicicletas Eléctricas Calidad-Precio (2026) | eBikeGuide",
  description:
    "Comparamos autonomía, motor, confort y precio de decenas de e-bikes para encontrar las de mejor relación calidad-precio en España. Puntuaciones con datos reales, no marketing.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Toolbar />
        <Categories />
        <QuizAndAutonomy />
        <FeaturedDeals />
        <GuidesNewsletterTrust />
        <FaqSection items={FAQ_GENERAL} />
      </main>
      <Footer />
    </>
  );
}
