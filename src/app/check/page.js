import { Container, PageHeader } from "@/components/ui/section";
import { FitChecker } from "@/components/calculator/fit-checker";

export const metadata = {
  title: "Appliance fit calculator",
  description: "Enter your appliance dimensions and your actual installation space to see whether it fits perfectly, is a tight fit, requires modification, or does not fit.",
  alternates: { canonical: "/check" },
};

export default async function CheckPage({ searchParams }) {
  const { appliance } = await searchParams;
  return (
    <>
      <PageHeader eyebrow="Fit calculator" title="Check appliance fit before you buy">
        Compare your new appliance with your actual installation space. Measure the opening itself — not the old appliance.
      </PageHeader>
      <Container className="py-12 sm:py-16">
        <FitChecker initialAppliance={typeof appliance === "string" ? appliance : undefined} />
      </Container>
    </>
  );
}
