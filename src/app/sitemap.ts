import type { MetadataRoute } from "next";
import { EBG_DATA } from "@/data/ebg-data";

const BASE_URL = EBG_DATA.meta.dominio;

const STATIC_ROUTES = [
  "",
  "/bicicletas-electricas/",
  "/comparador/",
  "/calculadoras/",
  "/calculadoras/autonomia/",
  "/guias/",
  "/encontrar-bicicleta/",
  "/ofertas/",
  "/mejores-bicicletas-electricas/",
  "/accesorios/",
  "/metodologia/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoriaEntries: MetadataRoute.Sitemap = EBG_DATA.categorias.map((categoria) => ({
    url: `${BASE_URL}/bicicletas-electricas/${categoria.slug}/`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const bikeEntries: MetadataRoute.Sitemap = EBG_DATA.bikes.map((bike) => ({
    url: `${BASE_URL}/bicicletas-electricas/${bike.slug}/`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guiaEntries: MetadataRoute.Sitemap = EBG_DATA.guias.map((guia) => ({
    url: `${BASE_URL}/guias/${guia.slug}/`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const mejorEntries: MetadataRoute.Sitemap = EBG_DATA.mejores.map((mejor) => ({
    url: `${BASE_URL}/mejores-bicicletas-electricas/${mejor.slug}/`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...categoriaEntries, ...bikeEntries, ...guiaEntries, ...mejorEntries];
}
