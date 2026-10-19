import { site } from "@/lib/config";
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard", "/profile", "/settings", "/verify-otp", "/reset-password"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
