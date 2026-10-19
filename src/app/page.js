import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { FitChecker } from "@/components/calculator/fit-checker";
import { Container, Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { FaqList } from "@/components/ui/faq-list";
import { StatusBadge } from "@/components/ui/status-badge";
import { APPLIANCES } from "@/lib/fit/appliances";
import { FAQ } from "@/lib/content/faq";
import { GUIDES } from "@/lib/content/guides";
import { site } from "@/lib/config";

export const metadata = {
  title: { absolute: "Appliance Fit Check — Will this appliance fit? Check before you buy" },
  alternates: { canonical: "/" },
};

const STEPS = [
  ["Choose your appliance", "Select the appliance type you want to check."],
  ["Enter measurements", "Enter the appliance dimensions and the measurements of your actual installation space."],
  ["Get your fit result", "See whether the appliance fits perfectly, is a tight fit, requires modification, or does not fit."],
];

const RESULTS = [
  ["fits", "Fits Perfectly", "Comfortable room on every dimension."],
  ["tight", "Tight Fit", "It should fit, but at least one dimension leaves very little room."],
  ["modify", "Requires Modification", "Works only if the opening is modified, or with a different model."],
  ["no", "Does Not Fit", "At least one dimension is too large for the space."],
];

const WHY = [
  "Cabinet openings that are too small",
  "Countertop cutout mismatches",
  "Tight side or height clearances",
  "Venting and ductwork conflicts",
  "Appliance-door swing problems",
  "Appliance depth extending too far outward",
  "Electrical, gas, water or drain connection conflicts",
  "Delivery-path and doorway clearance problems",
];

export default function Home() {
  const featured = ["will-a-36-inch-refrigerator-fit-a-36-inch-opening", "dishwasher-opening-size-guide", "can-a-cooktop-cutout-be-enlarged"].map((s) => GUIDES.find((g) => g.slug === s));
  return (
    <>
      <Hero />

      <section id="check" className="scroll-mt-16 py-16 sm:py-24">
        <Container>
          <div className="mb-10 max-w-2xl">
            <Eyebrow>Free fit check</Eyebrow>
            <h2 className="mt-3 text-4xl sm:text-5xl">Check appliance fit</h2>
            <p className="mt-3 text-lg text-muted">Enter your product and space dimensions. Your result updates as you type.</p>
          </div>
          <FitChecker />
        </Container>
      </section>

      <section className="border-y border-line bg-white py-16 sm:py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-3 text-4xl sm:text-5xl">Three steps. About a minute.</h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="relative border-t-2 border-ink pt-6">
                <span className="font-display text-6xl text-brass-deep/80">{i + 1}</span>
                <h3 className="mt-3 text-2xl">{t}</h3>
                <p className="mt-2 text-muted">{d}</p>
              </Reveal>
            ))}
          </ol>
          <p className="mt-10 text-sm text-muted">Check before you buy to help avoid returns, installation delays, and unexpected modifications.</p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>Your result</Eyebrow>
            <h2 className="mt-3 text-4xl sm:text-5xl">Four possible outcomes</h2>
            <p className="mt-4 text-lg text-muted">Real-world appliance fit logic, summarised in a result you can act on before delivery day.</p>
          </Reveal>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {RESULTS.map(([id, label, d]) => (
              <li key={id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                <StatusBadge status={id} label={label} className="self-start sm:w-56 sm:justify-start" />
                <p className="text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="on-dark bg-plum py-16 text-white sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow className="text-brass">Why appliance fit matters</Eyebrow>
            <h2 className="mt-3 text-4xl sm:text-5xl">Built from real installation experience</h2>
            <p className="mt-5 max-w-lg text-white/75">
              Many installation issues happen because a new appliance doesn’t properly match the available cabinet opening, countertop cutout, venting layout, or installation space. These problems can cause installation delays, expensive modifications, appliance returns, and additional labor costs.
            </p>
            <Button asChild variant="brass" className="mt-8"><Link href="/about">About Appliance Fit Check <ArrowRight className="size-4" /></Link></Button>
          </Reveal>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {WHY.map((w) => (
              <li key={w} className="flex gap-3 border-b border-white/15 py-4 text-white/90">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brass" aria-hidden />
                {w}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Appliances</Eyebrow>
            <h2 className="mt-3 text-4xl sm:text-5xl">Check the appliance you’re buying</h2>
          </div>
          <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
            {APPLIANCES.map((a) => (
              <li key={a.id} className="border-b border-line">
                <Link href={`/check?appliance=${a.id}`} className="group flex min-h-16 items-center justify-between gap-4 py-4">
                  <span>
                    <span className="font-display text-xl">{a.name}</span>
                    <span className="block text-sm text-muted">{a.spaceLabel}</span>
                  </span>
                  <ArrowRight className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow>Fit guides</Eyebrow>
            <h2 className="mt-3 text-4xl sm:text-5xl">Measure it right</h2>
            <p className="mt-4 text-lg text-muted">Practical answers to the questions that come up before an appliance gets ordered.</p>
            <Button asChild variant="outline" className="mt-8"><Link href="/guides">All {GUIDES.length} guides</Link></Button>
          </div>
          <ul className="divide-y divide-line">
            {featured.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="group block py-5">
                  <h3 className="font-display text-2xl group-hover:underline">{g.title}</h3>
                  <p className="mt-1 text-muted">{g.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <h2 className="text-center text-4xl">Common questions</h2>
          <div className="mt-10"><FaqList items={FAQ.slice(0, 4)} /></div>
          <p className="mt-6 text-center"><Link href="/faq" className="font-medium underline underline-offset-4">See all FAQs</Link></p>
        </Container>
      </section>

      {/* <section className="on-dark bg-ink pb-0 pt-16 text-white sm:pt-20">
        <Container className="flex flex-col items-start justify-between gap-8 pb-16 sm:pb-20 md:flex-row md:items-center">
          <div className="max-w-xl">
            <Smartphone className="size-8 text-brass" aria-hidden />
            <h2 className="mt-4 text-4xl">Get the full Appliance Fit Check app</h2>
            <p className="mt-3 text-white/75">Fast fit results before you buy, using your appliance dimensions and actual installation-space measurements. Run 1 free fit check in the app — it takes 30 seconds.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="brass" size="lg"><a href={site.appStoreUrl}>Download on the App Store</a></Button>
            <Button asChild variant="outline-light" size="lg"><a href={site.playStoreUrl}>Get it on Google Play</a></Button>
          </div>
        </Container>
      </section> */}
    </>
  );
}
