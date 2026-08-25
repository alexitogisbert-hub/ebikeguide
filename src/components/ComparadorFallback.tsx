import { EBG_DATA } from "@/data/ebg-data";
import { MAX_BIKES_COMPARADOR } from "@/domain/comparator";

/**
 * Mirrors ComparadorClient's markup for the "sin selección" state so the
 * Suspense fallback occupies the same height as the hydrated content —
 * without this, swapping a short loading message for the real UI causes a
 * large layout shift (the footer jumping up/down) on every page load.
 */
export function ComparadorFallback() {
  return (
    <div>
      <div className="rounded-2xl border border-line p-5">
        <p className="text-sm font-semibold text-ink">
          Elige hasta {MAX_BIKES_COMPARADOR} bicis (0/{MAX_BIKES_COMPARADOR})
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EBG_DATA.bikes.map((bike) => (
            <span
              key={bike.id}
              className="rounded-full border border-line px-3.5 py-2 text-sm font-medium text-mut"
            >
              {bike.marca} {bike.modelo}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-mut">
        Selecciona al menos una bici arriba para empezar a comparar.
      </p>
    </div>
  );
}
