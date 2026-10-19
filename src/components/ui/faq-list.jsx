import { ChevronDown } from "lucide-react";

export function FaqList({ items }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-1 sm:px-7">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-lg [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="pb-5 pr-8 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
