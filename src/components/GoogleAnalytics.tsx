"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const STORAGE_KEY = "ebg:cookies-consent";

/**
 * Carga gtag.js solo si el usuario ha aceptado el aviso de cookies — nunca antes. Escucha el
 * evento "ebg:consent-changed" para activarse en la misma sesión sin recargar la página cuando
 * el usuario acepta desde el banner.
 */
export function GoogleAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    function checkConsent() {
      try {
        setConsent(window.localStorage.getItem(STORAGE_KEY) === "granted");
      } catch {
        // localStorage no disponible: no cargamos analítica.
      }
    }
    checkConsent();
    window.addEventListener("ebg:consent-changed", checkConsent);
    return () => window.removeEventListener("ebg:consent-changed", checkConsent);
  }, []);

  if (!consent) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
