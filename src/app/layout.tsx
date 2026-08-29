import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { FavoritesProvider } from "@/lib/favorites-context";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { EBG_DATA } from "@/data/ebg-data";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_TITLE = `${EBG_DATA.meta.nombre} — Encuentra tu e-bike ideal`;
const SITE_DESCRIPTION = `Comparamos ${EBG_DATA.bikes.length} bicicletas eléctricas para el mercado español: autonomía, motor, peso y precio analizados con datos reales. Encuentra tu e-bike ideal en menos de 2 minutos.`;

export const metadata: Metadata = {
  metadataBase: new URL(EBG_DATA.meta.dominio),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: EBG_DATA.meta.nombre,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable}`}>
      <body className="bg-white text-ink font-sans antialiased">
        <FavoritesProvider>{children}</FavoritesProvider>
        <CookieConsentBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
