import Link from "next/link";
import type { FaqItem } from "@/lib/seoContent";

export function FaqSection({ items, title = "Preguntas frecuentes" }: { items: FaqItem[]; title?: string }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.pregunta,
      acceptedAnswer: { "@type": "Answer", text: item.respuesta },
    })),
  };

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <div className="mt-5 flex flex-col divide-y divide-line rounded-2xl border border-line">
        {items.map((item) => (
          <div key={item.pregunta} className="p-5">
            <h3 className="font-semibold text-ink">{item.pregunta}</h3>
            <p className="mt-1.5 text-sm text-mut">{item.respuesta}</p>
            {item.guiaHref && (
              <Link href={item.guiaHref} className="mt-2 inline-block text-sm font-semibold text-acc-d hover:text-ink">
                Leer la guía completa →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
