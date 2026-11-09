import { LegalPage } from "@/components/layout/legal-page";
import { LEGAL_IS_DRAFT } from "@/lib/config";
export const metadata = { title: "Privacy Policy", robots: { index: !LEGAL_IS_DRAFT } };
export default function Privacy() {
  return <LegalPage title="Privacy Policy" contentKey="privacyPolicy" />;
}
