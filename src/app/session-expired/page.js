import Link from "next/link";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Session expired", robots: { index: false } };
export default function SessionExpired() {
  return (
    <Container className="max-w-lg py-28 text-center">
      <Clock className="mx-auto size-12 text-brass-deep" aria-hidden />
      <h1 className="mt-6 text-4xl">Your session expired</h1>
      <p className="mt-3 text-muted">For your security you’ve been signed out. Sign in again to pick up where you left off.</p>
      <Button asChild size="lg" className="mt-8"><Link href="/login?expired=1">Sign in</Link></Button>
    </Container>
  );
}
