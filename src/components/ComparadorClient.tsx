"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EBG_DATA } from "@/data/ebg-data";
import { compararBikes, MAX_BIKES_COMPARADOR } from "@/domain/comparator";
import { AffiliateLink, ofertaCtaLabel } from "./AffiliateLink";
import { BikeImage } from "./BikeImage";
import { FavoriteButton } from "./FavoriteButton";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  const validIds = new Set(EBG_DATA.bikes.map((b) => b.id));
  return Array.from(new Set(raw.split(",").filter((id) => validIds.has(id)))).slice(0, MAX_BIKES_COMPARADOR);
}

export function ComparadorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedIds = parseIds(searchParams.get("ids"));

  const comparativa = useMemo(() => compararBikes(EBG_DATA.bikes, selectedIds), [selectedIds]);

  function setIds(ids: string[]) {
    const params = ids.length > 0 ? `?ids=${ids.join(",")}` : "";
    router.replace(`/comparador/${params}`, { scroll: false });
  }

  function toggleBike(id: string) {
    if (selectedIds.includes(id)) {
      setIds(selectedIds.filter((current) => current !== id));
    } else if (selectedIds.length < MAX_BIKES_COMPARADOR) {
      setIds([...selectedIds, id]);
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-line p-5">
        <p className="text-sm font-semibold text-ink">
          Elige hasta {MAX_BIKES_COMPARADOR} bicis ({selectedIds.length}/{MAX_BIKES_COMPARADOR})
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EBG_DATA.bikes.map((bike) => {
            const selected = selectedIds.includes(bike.id);
            const disabled = !selected && selectedIds.length >= MAX_BIKES_COMPARADOR;
            return (
              <button
                key={bike.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleBike(bike.id)}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "border-acc bg-acc-s text-acc-d"
                    : disabled
                      ? "cursor-not-allowed border-line text-line"
                      : "border-line text-mut hover:border-ink hover:text-ink"
                }`}
              >
                {bike.marca} {bike.modelo}
              </button>
            );
          })}
        </div>
      </div>

      {comparativa.bikes.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-mut">
          Selecciona al menos una bici arriba para empezar a comparar.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40" />
                {comparativa.bikes.map((bike) => (
                  <th key={bike.id} className="min-w-[200px] px-3 pb-4 text-left align-bottom">
                    <div className="relative">
                      <BikeImage bike={bike} className="h-28 w-full rounded-xl" />
                      <FavoriteButton
                        bikeId={bike.id}
                        className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
                      />
                    </div>
                    <Link href={`/bicicletas-electricas/${bike.slug}/`} className="mt-2 block font-semibold text-ink hover:text-acc-d">
                      {bike.marca} {bike.modelo}
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleBike(bike.id)}
                      className="mt-1 text-xs font-medium text-mut hover:text-ink"
                    >
                      Quitar
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparativa.filas.map((fila) => (
                <tr key={fila.campo} className="border-t border-line">
                  <td className="px-3 py-3 text-sm font-medium text-mut">{fila.label}</td>
                  {fila.valores.map((valor, i) => (
                    <td key={comparativa.bikes[i].id} className="px-3 py-3 text-sm font-semibold text-ink">
                      {fila.campo === "precio" ? priceFormatter.format(Number(valor)) : valor}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line">
                <td className="px-3 py-3 text-sm font-medium text-mut">Comprar</td>
                {comparativa.bikes.map((bike) => {
                  const oferta = bike.ofertas[0];
                  const merchant = EBG_DATA.merchants.find((m) => m.id === oferta?.merchantId);
                  return (
                    <td key={bike.id} className="px-3 py-3">
                      {oferta ? (
                        <AffiliateLink
                          oferta={oferta}
                          merchantName={merchant?.nombre ?? oferta.merchantId}
                          className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-acc-d"
                        >
                          {ofertaCtaLabel(oferta)}
                        </AffiliateLink>
                      ) : (
                        <span className="text-xs text-mut">Sin oferta</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
