"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Bike } from "@/data/ebg-data";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { useAdminMode } from "@/hooks/useAdminMode";

const TIPO_LABELS: Record<string, string> = {
  urbana: "urbana",
  plegable: "plegable",
  montana: "de montaña",
  trekking: "de trekking",
  cargo: "de carga",
};

export function BikeImage({ bike, className = "" }: { bike: Bike; className?: string }) {
  const [src, setSrc] = useState<string | null>(bike.imagen || null);
  const [checked, setChecked] = useState(!!bike.imagen);
  const [uploading, setUploading] = useState(false);
  const admin = useAdminMode();

  useEffect(() => {
    if (bike.imagen) return;
    let cancelled = false;
    fetch(`/api/bike-image/${bike.slug}`, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setSrc(`/api/bike-image/${bike.slug}?t=${Date.now()}`);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setChecked(true); });
    return () => { cancelled = true; };
  }, [bike.imagen, bike.slug]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setUploading(true);
      const form = new FormData();
      form.append("slug", bike.slug);
      form.append("file", file);

      const adminKey = typeof window !== "undefined" ? localStorage.getItem("ebg-admin-key") : null;
      try {
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: adminKey ? { "x-admin-key": adminKey } : {},
          body: form,
        });
        const data = await res.json();
        if (data.ok) {
          setSrc(`/api/bike-image/${bike.slug}?t=${Date.now()}`);
        }
      } catch {}
      setUploading(false);
    },
    [bike.slug],
  );

  const tipoLabel = TIPO_LABELS[bike.tipo] ?? bike.tipo;
  const alt = `${bike.marca} ${bike.modelo} — e-bike ${tipoLabel}`;

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-surf ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain p-2" />
        {admin && <DropOverlay uploading={uploading} onFile={handleUpload} />}
      </div>
    );
  }

  if (!checked) {
    return <ImagePlaceholder label={bike.imagenPlaceholder} className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      <ImagePlaceholder label={bike.imagenPlaceholder} className="h-full w-full" />
      {admin && <DropOverlay uploading={uploading} onFile={handleUpload} showHint />}
    </div>
  );
}

function DropOverlay({
  uploading,
  onFile,
  showHint = false,
}: {
  uploading: boolean;
  onFile: (file: File) => void;
  showHint?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div
        className="absolute inset-0 z-10"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) onFile(file);
        }}
      >
        {(dragOver || uploading) && (
          <div className="flex h-full w-full items-center justify-center bg-acc/30 text-sm font-bold text-white backdrop-blur-sm">
            {uploading ? "Subiendo..." : "Soltar imagen"}
          </div>
        )}
        {!dragOver && !uploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`flex h-full w-full cursor-pointer items-center justify-center transition-opacity ${
              showHint ? "bg-black/20 opacity-100" : "bg-black/0 opacity-0 hover:bg-black/40 hover:opacity-100"
            }`}
          >
            <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow">
              {showHint ? "Arrastra o haz clic" : "Cambiar imagen"}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
    </>
  );
}
