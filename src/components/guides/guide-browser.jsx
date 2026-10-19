"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { APPLIANCES } from "@/lib/fit/appliances";
import { cn } from "@/lib/utils";

export function GuideBrowser({ guides, initial = "all" }) {
  const [appliance, setAppliance] = useState(initial);
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return guides.filter((g) => (appliance === "all" || g.appliance === appliance) && (!t || (g.title + g.summary).toLowerCase().includes(t)));
  }, [guides, appliance, q]);

  const chips = [{ id: "all", name: "All" }, ...APPLIANCES.map((a) => ({ id: a.id, name: a.short }))];
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by appliance" className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button key={c.id} type="button" aria-pressed={appliance === c.id} onClick={() => setAppliance(c.id)}
              className={cn("h-10 rounded-full border px-4 text-sm font-medium transition-colors", appliance === c.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40")}>
              {c.name}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-72">
          <span className="sr-only">Search guides</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides"
            className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10" />
        </label>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? "guide" : "guides"}</p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-ink/25 p-10 text-center">
          <h2 className="text-xl">No guides match</h2>
          <p className="mt-2 text-muted">Try another appliance or a different search.</p>
          <button type="button" className="mt-4 font-medium underline" onClick={() => { setQ(""); setAppliance("all"); }}>Clear filters</button>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {list.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group flex items-start justify-between gap-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
                    {g.kind === "guide" ? "Guide" : "Question"}{g.appliance ? ` · ${APPLIANCES.find((a) => a.id === g.appliance)?.short}` : " · Ranges"}
                  </p>
                  <h2 className="mt-1 font-display text-xl group-hover:underline sm:text-2xl">{g.title}</h2>
                  <p className="mt-1 text-muted">{g.summary}</p>
                </div>
                <ArrowUpRight className="mt-6 size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
