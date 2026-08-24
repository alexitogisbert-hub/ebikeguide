"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EBG_DATA } from "@/data/ebg-data";
import { useFavorites } from "@/lib/favorites-context";
import { CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./icons";

export function Header() {
  const { favoritos } = useFavorites();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const bikeResults = EBG_DATA.bikes
      .filter((b) => `${b.marca} ${b.modelo} ${b.tipo}`.toLowerCase().includes(q))
      .map((b) => ({
        type: "bici" as const,
        href: `/bicicletas-electricas/${b.slug}/`,
        title: `${b.marca} ${b.modelo}`,
        subtitle: b.tipo,
      }));
    const guiaResults = EBG_DATA.guias
      .filter((g) => `${g.titulo} ${g.categoria}`.toLowerCase().includes(q))
      .map((g) => ({
        type: "guía" as const,
        href: `/guias/${g.slug}/`,
        title: g.titulo,
        subtitle: g.categoria,
      }));
    return [...bikeResults, ...guiaResults].slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-[60] border-b border-line bg-white/88 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="whitespace-nowrap text-xl font-extrabold tracking-[-0.03em] text-ink">
          eBike<span className="text-acc">Guide</span>
        </Link>

        <nav className="ml-1.5 hidden items-center gap-6 lg:flex">
          {EBG_DATA.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-ink/80 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Buscar"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-surf"
          >
            <SearchIcon />
          </button>

          <Link
            href="/favoritos/"
            aria-label="Favoritos"
            className="relative flex size-10 items-center justify-center rounded-full text-ink hover:bg-surf"
          >
            <HeartIcon />
            {favoritos.length > 0 && (
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-acc text-[10px] font-bold text-white">
                {favoritos.length}
              </span>
            )}
          </Link>

          <Link
            href="/encontrar-bicicleta/"
            className="ml-1 hidden items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-acc-d sm:flex"
          >
            Encontrar mi e-bike
          </Link>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full text-ink hover:bg-surf lg:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-line bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-4 sm:px-8">
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca una bici, una marca o una guía…"
              className="w-full rounded-2xl border border-line bg-surf px-4 py-3 text-sm outline-none focus-visible:border-acc"
            />
            {results.length > 0 && (
              <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {results.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-surf"
                    >
                      <span>
                        <span className="font-semibold text-ink">{r.title}</span>
                        <span className="ml-2 text-mut">{r.subtitle}</span>
                      </span>
                      <span className="shrink-0 rounded-full bg-acc-s px-2 py-0.5 text-xs font-semibold text-acc-d">
                        {r.type}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {query && results.length === 0 && (
              <p className="mt-3 text-sm text-mut">Sin resultados para “{query}”.</p>
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="mx-auto flex max-w-[1280px] flex-col gap-1 px-5 py-4 sm:px-8">
            {EBG_DATA.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-surf"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/encontrar-bicicleta/"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-white hover:bg-acc-d"
            >
              Encontrar mi e-bike
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
