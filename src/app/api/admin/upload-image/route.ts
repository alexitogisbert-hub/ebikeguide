import { NextResponse } from "next/server";

/**
 * Subida de imágenes deshabilitada: este endpoint permitía sustituir la foto de
 * cualquier bici sin autenticación real (la clave admin era opcional). Se bloquea
 * en el servidor en vez de confiar solo en ocultar el panel — así nadie puede editar
 * fotos aunque encuentre la URL directamente.
 */
export async function POST() {
  return NextResponse.json({ error: "La edición de imágenes está deshabilitada" }, { status: 403 });
}
