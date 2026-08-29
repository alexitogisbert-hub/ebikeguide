/** ID de medición de la propiedad de Google Analytics 4 de eBikeGuide. */
export const GA_MEASUREMENT_ID = "G-CFC3BT5K5V";

type Gtag = (...args: unknown[]) => void;

/** Envía un evento a GA4 si el usuario ha dado su consentimiento y gtag ya está cargado. */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
