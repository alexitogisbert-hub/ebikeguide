import type { Metadata } from "next";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  /** Ruta canónica de la página (p. ej. "/comparador/"). Sin ella no se emite <link rel="canonical">. */
  path?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
    ...(path ? { alternates: { canonical: path } } : {}),
  };
}
