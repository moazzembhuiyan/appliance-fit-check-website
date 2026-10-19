import { Container, PageHeader } from "@/components/ui/section";
import { GuideBrowser } from "@/components/guides/guide-browser";
import { GUIDES } from "@/lib/content/guides";

export const metadata = {
  title: "Appliance fit guides",
  description: "Measuring guides and answers for refrigerators, wall ovens, dishwashers, cooktops, microwaves and range hoods.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage({ searchParams }) {
  const { appliance } = await searchParams;
  const initial = typeof appliance === "string" ? appliance : "all";
  return (
    <>
      <PageHeader eyebrow="Fit guides" title="Measure it right. Check the fit. Buy with confidence.">
        Practical guides for the appliances most likely to cause installation surprises.
      </PageHeader>
      <Container className="py-12 sm:py-16">
        <GuideBrowser key={initial} guides={GUIDES} initial={initial} />
      </Container>
    </>
  );
}
