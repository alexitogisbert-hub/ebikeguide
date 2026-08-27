"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
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
  const [loading, setLoading] = useState(!bike.imagen);
  const [uploading, setUploading] = useState(false);
  const admin = useAdminMode();

  useEffect(() => {
    if (bike.imagen) return;
    let cancelled = false;
    fetch(`/api/bike-image/${bike.slug}`, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setSrc(`/api/bike-image/${bike.slug}`);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
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

  if (loading) {
    return <ImagePlaceholder label={bike.imagenPlaceholder} className={className} />;
  }

  if (!src) {
    if (admin) {
      return (
        <DropZone className={className} uploading={uploading} onFile={handleUpload}>
          <ImagePlaceholder label={bike.imagenPlaceholder} className={className} />
        </DropZone>
      );
    }
    return <ImagePlaceholder label={bike.imagenPlaceholder} className={className} />;
  }

  const tipoLabel = TIPO_LABELS[bike.tipo] ?? bike.tipo;
  const alt = `${bike.marca} ${bike.modelo} — e-bike ${tipoLabel}`;

  const imageEl = (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );

  if (admin) {
    return (
      <DropZone className={className} uploading={uploading} onFile={handleUpload}>
        {imageEl}
      </DropZone>
    );
  }

  return imageEl;
}

function DropZone({
  children,
  className,
  uploading,
  onFile,
}: {
  children: React.ReactNode;
  className?: string;
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`group relative ${className}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
    >
      {children}
      {(dragOver || uploading) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-acc/30 text-sm font-bold text-white backdrop-blur-sm">
          {uploading ? "Subiendo..." : "Soltar imagen"}
        </div>
      )}
      {!dragOver && !uploading && (
        <label className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow">Cambiar imagen</span>
        </label>
      )}
    </div>
  );
}
