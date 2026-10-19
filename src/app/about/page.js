import Link from "next/link";
import { Container, PageHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Appliance Fit Check",
  description: "Appliance Fit Check was created from real-world appliance installation experience to help homeowners avoid costly fit problems before they buy.",
  alternates: { canonical: "/about" },
};

const WHY = ["Cabinet openings that are too small", "Countertop cutout mismatches", "Tight side or height clearances", "Venting and ductwork conflicts", "Appliance-door swing problems", "Appliance depth extending too far outward", "Electrical, gas, water, or drain connection conflicts", "Delivery-path and doorway clearance problems"];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title="Built from real appliance installation experience" />
      <Container className="grid gap-14 py-14 sm:py-20 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-ink/85">
          <p>Appliance Fit Check was created from real-world appliance installation experience to help homeowners avoid costly fit problems before they buy.</p>
          <p>Many installation issues happen because a new appliance does not properly match the available cabinet opening, countertop cutout, venting layout, or installation space. These problems can cause installation delays, expensive modifications, appliance returns, and additional labor costs.</p>
          <p>Appliance Fit Check helps homeowners compare a new appliance with the actual installation space before making a purchase.</p>
          <h2 className="pt-6 text-3xl">Designed around real-world installation problems</h2>
          <p>Appliance Fit Check is based on common problems encountered during real appliance installations — not merely advertised appliance sizes. It helps homeowners evaluate dishwashers, wall ovens, cooktops, refrigerators, over-the-range microwaves, and range hoods before installation day.</p>
          <p>The goal is to help homeowners identify possible fit problems before purchasing an appliance, when there is still time to select a different model or prepare for necessary modifications.</p>
          <Button asChild size="lg" className="mt-4"><Link href="/check">Start my free website fit check</Link></Button>
        </div>
        <div>
          <h2 className="text-3xl">Why appliance fit matters</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {WHY.map((w, i) => (
              <li key={w} className="flex items-baseline gap-4 py-4">
                <span className="font-display text-brass-deep">{String(i + 1).padStart(2, "0")}</span>{w}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  );
}
