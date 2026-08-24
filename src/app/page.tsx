import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Toolbar } from "@/components/Toolbar";
import { Categories } from "@/components/Categories";
import { QuizAndAutonomy } from "@/components/QuizAndAutonomy";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { GuidesNewsletterTrust } from "@/components/GuidesNewsletterTrust";
import { Footer } from "@/components/Footer";

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
      </main>
      <Footer />
    </>
  );
}
