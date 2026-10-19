import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/section";
import { FitDiagram } from "@/components/calculator/fit-diagram";
import { StatusBadge } from "@/components/ui/status-badge";

export function Hero() {
  return (
    <section className="on-dark relative overflow-hidden bg-ink text-white  ">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full bg-plum/70 blur-3xl" aria-hidden />
      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow className="text-brass">Check before you buy</Eyebrow>
          <h1 className="mt-4 text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Will this appliance <em className="text-brass not-italic">fit?</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">
            Compare your appliance dimensions with your actual installation space before you buy. Catch fit problems before delivery or installation — not after.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="brass" size="lg"><Link href="#check">Check my appliance fit <ArrowRight className="size-4" /></Link></Button>
            <Button asChild variant="outline-light" size="lg"><Link href="/guides">Browse fit guides</Link></Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <ShieldCheck className="size-4" aria-hidden /> Takes about a minute • Measures against your real opening, not advertised sizes
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white p-5 text-ink shadow-lift">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">36&Prime; refrigerator</p>
              <StatusBadge status="tight" label="Tight Fit" />
            </div>
            <FitDiagram product={{ width: 35.75, height: 69.9 }} space={{ width: 36, height: 70 }} status="tight" className="mt-3 w-full" />
            <p className="mt-1 text-center text-xs text-muted">Illustrative example — enter your own measurements below</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
