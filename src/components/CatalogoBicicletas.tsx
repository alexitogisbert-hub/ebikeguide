"use client";

import { useMemo, useState } from "react";
import type { Bike, Categoria } from "@/data/ebg-data";
import { filtrarYOrdenarBikes, type OrdenCriterio } from "@/domain/filters";
import { BikeDealCard } from "./BikeDealCard";

const ORDEN_OPTIONS: Array<{ id: OrdenCriterio; label: string; direccion: "asc" | "desc" }> = [
  { id: "precio", label: "Precio: menor a mayor", direccion: "asc" },
  { id: "autonomia", label: "Autonomía", direccion: "desc" },
  { id: "peso", label: "Peso: menor a mayor", direccion: "asc" },
  { id: "valor", label: "Mejor relación calidad-precio", direccion: "desc" },
];

export function CatalogoBicicletas({
  bikes,
  categorias,
  initialCategoriaId = null,
}: {
  bikes: Bike[];
  categorias: Categoria[];
  initialCategoriaId?: string | null;
}) {
  const precioMaxCatalogo = useMemo(() => Math.max(...bikes.map((b) => b.precio)), [bikes]);
  const precioMinCatalogo = useMemo(() => Math.min(...bikes.map((b) => b.precio)), [bikes]);

  const [categoriaId, setCategoriaId] = useState<string | null>(initialCategoriaId);
  const [precioMax, setPrecioMax] = useState(precioMaxCatalogo);
  const [ordenId, setOrdenId] = useState<OrdenCriterio>("precio");

  const orden = ORDEN_OPTIONS.find((o) => o.id === ordenId) ?? ORDEN_OPTIONS[0];

  const resultado = useMemo(
    () =>
      filtrarYOrdenarBikes(
        bikes,
        { categoriaId: categoriaId ?? undefined, precioMax },
        orden.id,
        orden.direccion,
      ),
    [bikes, categoriaId, precioMax, orden],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCategoriaId(null)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            categoriaId === null ? "border-acc bg-acc-s text-acc-d" : "border-line text-mut hover:border-ink hover:text-ink"
          }`}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategoriaId((current) => (current === cat.id ? null : cat.id))}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              categoriaId === cat.id ? "border-acc bg-acc-s text-acc-d" : "border-line text-mut hover:border-ink hover:text-ink"
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-line p-5 sm:flex-row sm:items-center sm:justify-between">
        <label className="block text-sm sm:max-w-xs sm:flex-1">
          <span className="flex justify-between font-medium text-ink">
            <span>Precio máximo</span>
            <span className="text-mut">{precioMax.toLocaleString("es-ES")} €</span>
          </span>
          <input
            type="range"
            min={precioMinCatalogo}
            max={precioMaxCatalogo}
            step={50}
            value={precioMax}
            onChange={(e) => setPrecioMax(Number(e.target.value))}
            className="mt-1.5 w-full"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-ink">Ordenar por</span>
          <select
            value={ordenId}
            onChange={(e) => setOrdenId(e.target.value as OrdenCriterio)}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus-visible:border-acc sm:w-64"
          >
            {ORDEN_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-5 text-sm text-mut">
        {resultado.length} {resultado.length === 1 ? "modelo encontrado" : "modelos encontrados"}
      </p>

      {resultado.length > 0 ? (
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
          {resultado.map((bike) => (
            <BikeDealCard key={bike.id} bike={bike} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center text-sm text-mut">
          Ningún modelo cumple estos filtros. Prueba a subir el precio máximo o cambiar de categoría.
        </p>
      )}
    </div>
  );
}
