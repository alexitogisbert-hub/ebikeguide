"use client";

import type { ReactNode } from "react";
import type { OfertaBike } from "@/data/ebg-data";
import { trackEvent } from "@/lib/analytics";

/**
 * Every outbound merchant link in the site should go through this component:
 * it's what guarantees rel="sponsored nofollow" is applied automatically to
 * every affiliate link, rather than relying on each call site to remember it.
 */
export function AffiliateLink({
  oferta,
  merchantName,
  children,
  className,
}: {
  oferta: OfertaBike;
  merchantName: string;
  children: ReactNode;
  className?: string;
}) {
  function handleClick() {
    trackEvent("click_buy_button", {
      merchant: merchantName,
      precio: oferta.precio,
    });
  }

  if (oferta.affiliateUrl) {
    return (
      <a
        href={oferta.affiliateUrl}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  // Sin cuenta de afiliado todavía: si investigamos la URL real del producto, enlazamos
  // directamente a ella — sin "sponsored" porque no hay comisión — en vez de dejar el
  // enlace inerte.
  if (oferta.urlProducto) {
    return (
      <a
        href={oferta.urlProducto}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <span className={className} aria-disabled="true" title={`No tenemos una URL de producto en ${merchantName} todavía`}>
      {children}
    </span>
  );
}

