import Link from "next/link";
import { Container, PageHeader } from "@/components/ui/section";
import { FaqList } from "@/components/ui/faq-list";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/lib/content/faq";
import { FIT_CHECK_PRICE } from "@/lib/config";

export const metadata = {
  title: "Frequently asked questions",
  description: "Common questions about Appliance Fit Check: how it works, which appliances you can check, what the results mean and how to measure.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow="FAQ" title="Common questions about Appliance Fit Check" />
      <Container className="max-w-3xl py-14 sm:py-20">
        <FaqList items={FAQ} />
        <div className="mt-14 rounded-2xl bg-mist p-8 text-center">
          <h2 className="text-3xl">Ready to check before you buy?</h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Each fit check costs {FIT_CHECK_PRICE}. You’ll see the price before payment.</p>
          <Button asChild size="lg" className="mt-6"><Link href="/check">Check for {FIT_CHECK_PRICE}</Link></Button>
        </div>
      </Container>
    </>
  );
}
