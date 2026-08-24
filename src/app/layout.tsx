import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { FavoritesProvider } from "@/lib/favorites-context";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "eBikeGuide — Encuentra tu e-bike ideal",
  description:
    "Comparador y guía de compra de bicicletas eléctricas. Analizamos autonomía, motor, confort y precio para ayudarte a elegir.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable}`}>
      <body className="bg-white text-ink font-sans antialiased">
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
