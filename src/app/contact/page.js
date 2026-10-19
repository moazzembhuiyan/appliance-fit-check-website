import { Container, PageHeader } from "@/components/ui/section";
import { ContactForm } from "@/components/layout/contact-form";

export const metadata = { title: "Contact & support", description: "Questions about Appliance Fit Check? Send us a message.", alternates: { canonical: "/contact" } };

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Questions? We’re here to help." />
      <Container className="max-w-2xl py-14 sm:py-20"><ContactForm /></Container>
    </>
  );
}
