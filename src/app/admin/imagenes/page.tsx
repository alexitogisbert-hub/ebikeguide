export default function AdminImagenesPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 text-center">
      <h1 className="text-xl font-bold text-ink">Edición de imágenes deshabilitada</h1>
      <p className="mt-2 text-sm text-mut">
        Las fotos de las bicis no se pueden editar desde la web. Para cambiar una, súbela directamente al
        repositorio en <code className="rounded bg-surf px-1.5 py-0.5">/public/bikes/</code>.
      </p>
    </div>
  );
}
