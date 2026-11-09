import "./globals.css";
import { Toaster } from "sonner";
import { AppProviders } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/lib/config";

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Appliance Fit Check — Will this appliance fit? Check before you buy", template: "%s | Appliance Fit Check" },
  description:
    "Compare your appliance dimensions with your actual installation space before you buy. Check refrigerators, wall ovens, dishwashers, cooktops, microwaves and range hoods.",
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport = { themeColor: "#251B25", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <a href="#main" className="skip-link">Skip to content</a>
        <AppProviders>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors closeButton />
        </AppProviders>
      </body>
    </html>
  );
}
