import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { GUIDES, getGuide } from "@/lib/content/guides";
import { getAppliance } from "@/lib/fit/appliances";
import { site } from "@/lib/config";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.summary, type: "article", url: `${site.url}/guides/${g.slug}` },
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const appliance = g.appliance && getAppliance(g.appliance);
  const related = (g.related || []).map(getGuide).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.summary,
    mainEntityOfPage: `${site.url}/guides/${g.slug}`,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-line bg-white">
        <Container className="max-w-4xl py-12 sm:py-16">
          <Link href="/guides" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" /> All guides</Link>
          <Eyebrow className="mt-6">{g.kind === "guide" ? "Fit guide" : "Question"}</Eyebrow>
          <h1 className="mt-3 text-4xl leading-[1.1] sm:text-5xl">{g.title}</h1>
          <p className="mt-4 text-lg text-muted">{g.summary}</p>
        </Container>
      </div>

      <Container className="grid max-w-4xl gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_17rem] lg:max-w-6xl">
        <div className="max-w-2xl space-y-10">
          {g.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-2xl sm:text-3xl">{s.h}</h2>
              {s.p?.map((p) => <p key={p} className="mt-3 text-lg leading-relaxed text-ink/85">{p}</p>)}
              {s.list && (
                <ul className="mt-4 space-y-2.5">
                  {s.list.map((li) => (
                    <li key={li} className="flex gap-3 text-ink/85"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brass-deep" aria-hidden />{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="border-t border-line pt-6 font-display text-xl">Measure it right. Check the fit. Buy with confidence.</p>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="on-dark rounded-2xl bg-ink p-6 text-white">
            <h2 className="text-xl">{appliance ? `Check your ${appliance.name.toLowerCase()}` : "Check your fit"}</h2>
            <p className="mt-2 text-sm text-white/70">Compare exact dimensions with your actual space in about a minute.</p>
            <Button asChild variant="brass" className="mt-5 w-full"><Link href={appliance ? `/check?appliance=${appliance.id}` : "/check"}>Start my free fit check <ArrowRight className="size-4" /></Link></Button>
          </div>
          {related.length > 0 && (
            <nav aria-label="Related guides">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted">Related</h2>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {related.map((r) => (
                  <li key={r.slug}><Link href={`/guides/${r.slug}`} className="block py-3 text-sm font-medium hover:underline">{r.title}</Link></li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </Container>
    </article>
  );
}
