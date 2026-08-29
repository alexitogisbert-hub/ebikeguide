"use client";

import { useEffect, useState } from "react";
import type { OfertaBike } from "@/data/ebg-data";
import { AffiliateLink } from "./AffiliateLink";
import { ofertaCtaLabel } from "@/lib/affiliate";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function StickyBuyCta({
  oferta,
  merchantName,
  precio,
  modelo,
}: {
  oferta: OfertaBike;
  merchantName: string;
  precio: number;
  modelo: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-cta");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show the sticky bar when the hero CTA is NOT intersecting
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white transition-transform duration-300 ease-in-out dark:bg-[var(--color-bg-surf,#1a1a1a)] lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{modelo}</p>
          <p className="text-sm font-semibold text-acc-d">
            {priceFormatter.format(precio)}
          </p>
        </div>
        <AffiliateLink
          oferta={oferta}
          merchantName={merchantName}
          className="shrink-0 rounded-full bg-acc px-5 py-2.5 text-sm font-bold text-dark transition-opacity hover:opacity-90"
        >
          {ofertaCtaLabel(oferta)}
        </AffiliateLink>
      </div>
    </div>
  );
}
