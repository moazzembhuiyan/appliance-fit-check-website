import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "@/components/ui/section";
import { APPLIANCES } from "@/lib/fit/appliances";
import { site } from "@/lib/config";

const col = "text-sm text-white/70 hover:text-white";

export function Footer() {
  return (
    <footer className="on-dark border-t border-white/10 bg-ink text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Compare your appliance dimensions with your actual installation space before you buy — and avoid returns, installation delays and unexpected modifications.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {site.appStoreUrl && <a href={site.appStoreUrl} className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">Download on the App Store</a>}
            {site.playStoreUrl && <a href={site.playStoreUrl} className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">Get it on Google Play</a>}
          </div>
        </div>
        <nav aria-label="Appliance guides">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brass">Appliances</h2>
          <ul className="mt-4 space-y-2.5">
            {APPLIANCES.map((a) => (
              <li key={a.id}><Link className={col} href={`/guides?appliance=${a.id}`}>{a.name}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brass">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {[["/check", "Fit calculator"], ["/guides", "All guides"], ["/about", "About"], ["/faq", "FAQ"], ["/contact", "Contact"]].map(([h, l]) => (
              <li key={h}><Link className={col} href={h}>{l}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Account and legal">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brass">Account</h2>
          <ul className="mt-4 space-y-2.5">
            {[["/login", "Sign in"], ["/register", "Create account"], ["/privacy", "Privacy Policy"], ["/terms", "Terms of Service"]].map(([h, l]) => (
              <li key={h}><Link className={col} href={h}>{l}</Link></li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>Copyright © 2026 Appliance Fit Check</p>
          <p>Fit results are guidance only — always confirm with the manufacturer’s installation instructions.</p>
        </Container>
      </div>
    </footer>
  );
}
