import Link from "next/link";
import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="font-display text-7xl text-brass-deep">404</p>
      <h1 className="mt-4 text-4xl">That page doesn’t fit.</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">The page you’re looking for may have moved. Try the calculator or browse our guides.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild><Link href="/check">Fit calculator</Link></Button>
        <Button asChild variant="outline"><Link href="/guides">Guides</Link></Button>
      </div>
    </Container>
  );
}
