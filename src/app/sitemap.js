import { site } from "@/lib/config";
import { GUIDES } from "@/lib/content/guides";
export default function sitemap() {
  const pages = ["", "/check", "/guides", "/about", "/faq", "/contact", "/login", "/register"].map((p) => ({ url: `${site.url}${p}` }));
  return [...pages, ...GUIDES.map((g) => ({ url: `${site.url}/guides/${g.slug}` }))];
}
