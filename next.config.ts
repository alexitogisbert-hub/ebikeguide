import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every internal href, canonical tag, and sitemap.ts entry in this project
  // uses a trailing slash — this makes that the canonical served form instead
  // of forcing a 308 redirect on every direct load of those URLs.
  trailingSlash: true,
  images: {
    // bike.imagen is empty today (BikeImage falls back to a placeholder), but
    // the agreed next step is stock photos from Unsplash/Pexels — next/image
    // throws at request time for any hostname not listed here, so this has
    // to be in place before the first real image URL lands in ebg-data.ts.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
