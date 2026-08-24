import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${EBG_DATA.meta.dominio}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1280px] px-5 pt-6 text-sm text-mut sm:px-8">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true" className="text-line">/</span>}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-ink">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-ink" : ""} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
