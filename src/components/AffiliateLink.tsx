import type { ReactNode } from "react";
import type { OfertaBike } from "@/data/ebg-data";

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
  if (!oferta.affiliateUrl) {
    return (
      <span
        className={className}
        aria-disabled="true"
        title={`Enlace de afiliado a ${merchantName} pendiente de activar (demo)`}
      >
        {children}
      </span>
    );
  }

  return (
    <a href={oferta.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
