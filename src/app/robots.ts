import type { MetadataRoute } from "next";
import { EBG_DATA } from "@/data/ebg-data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/favoritos/"],
    },
    sitemap: `${EBG_DATA.meta.dominio}/sitemap.xml`,
  };
}
