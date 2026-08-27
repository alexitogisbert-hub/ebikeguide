"use client";

import { useCallback, useEffect, useState } from "react";
import { EBG_DATA } from "@/data/ebg-data";

type BikeStatus = { slug: string; marca: string; modelo: string; hasImage: boolean; path: string | null; uploading: boolean };

export default function AdminImagenesPage() {
  const [bikes, setBikes] = useState<BikeStatus[]>([]);
  const [adminKey, setAdminKey] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ebg-admin-key");
    if (saved) setAdminKey(saved);

    setBikes(
      EBG_DATA.bikes.map((b) => ({
        slug: b.slug,
        marca: b.marca,
        modelo: b.modelo,
        hasImage: !!b.imagen,
        path: b.imagen || null,
        uploading: false,
      })),
    );
  }, []);

  const checkExisting = useCallback(async () => {
    const updated = await Promise.all(
      EBG_DATA.bikes.map(async (b) => {
        for (const ext of ["webp", "jpg", "png"]) {
          const path = `/bikes/${b.slug}.${ext}`;
          try {
            const res = await fetch(path, { method: "HEAD" });
            if (res.ok) return { slug: b.slug, marca: b.marca, modelo: b.modelo, hasImage: true, path, uploading: false };
          } catch {}
        }
        return { slug: b.slug, marca: b.marca, modelo: b.modelo, hasImage: !!b.imagen, path: b.imagen || null, uploading: false };
      }),
    );
    setBikes(updated);
  }, []);

  useEffect(() => {
    checkExisting();
  }, [checkExisting]);

  async function handleUpload(slug: string, file: File) {
    setBikes((prev) => prev.map((b) => (b.slug === slug ? { ...b, uploading: true } : b)));
    setMsg("");

    const form = new FormData();
    form.append("slug", slug);
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: adminKey ? { "x-admin-key": adminKey } : {},
        body: form,
      });
      const data = await res.json();
      if (data.ok) {
        setBikes((prev) => prev.map((b) => (b.slug === slug ? { ...b, hasImage: true, path: data.path + "?t=" + Date.now(), uploading: false } : b)));
        setMsg(`${slug} subida correctamente`);
      } else {
        setMsg(`Error: ${data.error}`);
        setBikes((prev) => prev.map((b) => (b.slug === slug ? { ...b, uploading: false } : b)));
      }
    } catch {
      setMsg("Error de conexión");
      setBikes((prev) => prev.map((b) => (b.slug === slug ? { ...b, uploading: false } : b)));
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-2xl font-bold text-ink">Admin: Imágenes de bicis</h1>
      <p className="mt-2 text-sm text-mut">
        Arrastra una imagen o haz clic para subir. Formatos: JPG, PNG, WebP. Máx 5 MB.
      </p>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink">
          Clave admin (opcional)
          <input
            type="password"
            value={adminKey}
            onChange={(e) => {
              setAdminKey(e.target.value);
              localStorage.setItem("ebg-admin-key", e.target.value);
            }}
            placeholder="Dejar vacío si ADMIN_KEY no está configurada"
            className="mt-1 block w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus-visible:border-acc"
          />
        </label>
      </div>

      {msg && <p className="mt-3 rounded-lg bg-acc-s px-4 py-2 text-sm font-medium text-acc-d">{msg}</p>}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bikes.map((bike) => (
          <BikeUploadCard key={bike.slug} bike={bike} onUpload={handleUpload} />
        ))}
      </div>
    </div>
  );
}

function BikeUploadCard({ bike, onUpload }: { bike: BikeStatus; onUpload: (slug: string, file: File) => void }) {
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    onUpload(bike.slug, file);
  }

  return (
    <div className="rounded-2xl border border-line p-4">
      <p className="font-semibold text-ink">
        {bike.marca} {bike.modelo}
      </p>
      <p className="text-xs text-mut">{bike.slug}</p>

      <div className="mt-3 overflow-hidden rounded-xl">
        {bike.path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bike.path} alt={`${bike.marca} ${bike.modelo}`} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center bg-surf text-xs text-mut">Sin imagen</div>
        )}
      </div>

      <label
        className={`mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center text-sm transition-colors ${
          dragOver ? "border-acc bg-acc-s text-acc-d" : "border-line text-mut hover:border-ink hover:text-ink"
        } ${bike.uploading ? "pointer-events-none opacity-50" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {bike.uploading ? "Subiendo..." : bike.hasImage ? "Cambiar imagen" : "Arrastra o haz clic"}
      </label>
    </div>
  );
}
