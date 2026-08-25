"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ebg:cookies-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deliberately deferred to after mount: reading localStorage during render would
    // desync the client's first render from the server-rendered HTML.
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      // localStorage no disponible: no mostramos el banner en vez de romper la página.
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Si no se puede guardar, el banner volverá a aparecer en la próxima visita — no es grave.
    }
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-3 px-5 py-4 sm:flex-row sm:justify-between sm:px-8">
        <p className="text-sm text-mut">
          Guardamos tus favoritos solo en este navegador (almacenamiento local, no cookies de terceros). Al seguir un
          enlace hacia una tienda, esa tienda puede usar sus propias cookies.{" "}
          <Link href="/cookies/" className="underline hover:text-ink">
            Más información sobre cookies
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-acc-d"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
