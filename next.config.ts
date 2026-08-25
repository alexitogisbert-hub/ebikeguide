import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every internal href, canonical tag, and sitemap.ts entry in this project
  // uses a trailing slash — this makes that the canonical served form instead
  // of forcing a 308 redirect on every direct load of those URLs.
  trailingSlash: true,
};

export default nextConfig;
