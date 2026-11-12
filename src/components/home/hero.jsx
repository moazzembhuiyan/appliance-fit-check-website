import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { FIT_CHECK_PRICE } from "@/lib/config";

export function Hero() {
  return (
    <section className="on-dark relative overflow-hidden bg-ink text-white  ">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full bg-plum/70 blur-3xl" aria-hidden />
      <Container className="relative grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1fr_1fr]">
        <div className="max-w-2xl">
          <Eyebrow className="text-brass">Check before you buy</Eyebrow>
          <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Will this appliance <em className="text-brass not-italic">fit?</em>
            <span className="mt-3 block text-3xl leading-tight sm:text-4xl lg:text-5xl">Check before you buy.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            Compare your appliance dimensions with your actual installation space before you buy. Get your fit result for {FIT_CHECK_PRICE} per check.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="brass" size="lg"><Link href="#check">Check my appliance fit <ArrowRight className="size-4" /></Link></Button>
            <Button asChild variant="outline-light" size="lg"><Link href="/guides">Browse fit guides</Link></Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <ShieldCheck className="size-4" aria-hidden /> {FIT_CHECK_PRICE} per check • Price shown before payment
          </p>
        </div>

        <div className="w-full rounded-3xl border border-white/15 bg-white p-2 shadow-lift sm:p-3">
          <picture className="block overflow-hidden rounded-2xl">
            <source
              media="(max-width: 767px)"
              srcSet="/images/fit-check-hero-mobile.webp"
              width="351"
              height="702"
            />
            <img
              src="/images/fit-check-hero.webp"
              alt="Installer measuring a kitchen cabinet opening alongside the finished kitchen with its appliances installed"
              width="702"
              height="351"
              fetchPriority="high"
              decoding="async"
              className="h-auto w-full"
            />
          </picture>
        </div>
      </Container>
    </section>
  );
}
