import Link from "next/link";
import { EBG_DATA } from "@/data/ebg-data";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surf">
      <div className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="text-lg font-extrabold tracking-[-0.03em] text-ink">
              eBike<span className="text-acc-d">Guide</span>
            </Link>
            <p className="mt-3 max-w-[36ch] text-sm text-mut">
              Comparador independiente de bicicletas eléctricas. Contenido de muestra —
              plataforma en construcción.
            </p>
          </div>

          <nav aria-label="Navegación de pie de página" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {EBG_DATA.navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-mut hover:text-ink">
                {link.label}
              </Link>
            ))}
            <Link href="/metodologia/" className="text-mut hover:text-ink">
              Metodología
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-xs text-mut sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} eBikeGuide. Datos de muestra con fines de demostración.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>
              Algunos enlaces son de afiliación.{" "}
              <Link href="/aviso-legal/" className="underline hover:text-ink">
                Más información sobre afiliación
              </Link>
              .
            </p>
            <Link href="/aviso-legal/" className="hover:text-ink">
              Aviso legal
            </Link>
            <Link href="/privacidad/" className="hover:text-ink">
              Privacidad
            </Link>
            <Link href="/cookies/" className="hover:text-ink">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
