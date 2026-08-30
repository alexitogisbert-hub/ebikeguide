import { CATEGORY_INTENT_CONTENT } from "@/lib/seoContent";

/** Bloques de contenido con encabezados de intención de búsqueda, solo para categorías con datos que los respalden. */
export function CategoriaIntentContent({ categoriaId }: { categoriaId: string }) {
  const bloques = CATEGORY_INTENT_CONTENT[categoriaId];
  if (!bloques || bloques.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
      <div className="flex flex-col gap-8">
        {bloques.map((bloque) => (
          <div key={bloque.heading}>
            <h2 className="text-lg font-bold text-ink">{bloque.heading}</h2>
            <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-mut">{bloque.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
