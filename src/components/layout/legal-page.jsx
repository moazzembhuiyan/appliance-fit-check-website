import { TriangleAlert } from "lucide-react";
import { Container, PageHeader } from "@/components/ui/section";
import { LEGAL_IS_DRAFT } from "@/lib/config";

export function LegalPage({ title, sections }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} />
      <Container className="max-w-3xl py-14 sm:py-20">
        {LEGAL_IS_DRAFT && (
          <div role="note" className="mb-10 flex gap-3 rounded-xl border border-tight/30 bg-tight-soft p-4 text-sm text-tight">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>Placeholder structure only — replace with your own reviewed legal text, then set <code>LEGAL_IS_DRAFT = false</code> in <code>src/lib/config.js</code>.</p>
          </div>
        )}
        <div className="space-y-9">
          {sections.map((s) => (
            <section key={s}>
              <h2 className="text-2xl">{s}</h2>
              <p className="mt-2 text-muted">[Add your {s.toLowerCase()} text here.]</p>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
