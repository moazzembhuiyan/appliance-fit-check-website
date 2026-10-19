import { LegalPage } from "@/components/layout/legal-page";
import { LEGAL_IS_DRAFT } from "@/lib/config";
export const metadata = { title: "Terms of Service", robots: { index: !LEGAL_IS_DRAFT } };
export default function Terms() {
  return <LegalPage title="Terms of Service" sections={["Using the service", "Accounts", "Fit results are guidance only", "Limitation of liability", "Changes to these terms", "Contact"]} />;
}
