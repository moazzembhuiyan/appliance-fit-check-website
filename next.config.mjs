import { GUIDES } from "./src/lib/content/guides.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the development client to connect when this app is opened via LAN IP.
  allowedDevOrigins: ["10.10.10.27"],
  // Keep the original WordPress URLs working: /<slug>/ -> /guides/<slug>
  async redirects() {
    return [
      ...GUIDES.map((g) => ({ source: `/${g.slug}`, destination: `/guides/${g.slug}`, permanent: true })),
      { source: "/about-appliance-fit-check", destination: "/about", permanent: true },
    ];
  },
};
export default nextConfig;
