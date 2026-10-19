import Link from "next/link";
import { Lock } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Access denied", robots: { index: false } };
export default function Unauthorized() {
  return (
    <Container className="max-w-lg py-28 text-center">
      <Lock className="mx-auto size-12 text-brass-deep" aria-hidden />
      <h1 className="mt-6 text-4xl">You don’t have access to this page</h1>
      <p className="mt-3 text-muted">Your account doesn’t have permission to view this. If you think that’s a mistake, contact support.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild><Link href="/dashboard">Go to dashboard</Link></Button>
        <Button asChild variant="outline"><Link href="/contact">Contact support</Link></Button>
      </div>
    </Container>
  );
}
