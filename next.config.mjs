import { GUIDES } from "./src/lib/content/guides.js";

const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Additional hostnames for LAN access during development.
  allowedDevOrigins,
  // Keep the original WordPress URLs working: /<slug>/ -> /guides/<slug>
  async redirects() {
    return [
      ...GUIDES.map((g) => ({ source: `/${g.slug}`, destination: `/guides/${g.slug}`, permanent: true })),
      { source: "/about-appliance-fit-check", destination: "/about", permanent: true },
    ];
  },
};
export default nextConfig;
