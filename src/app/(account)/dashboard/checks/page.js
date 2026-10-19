"use client";
import { useState } from "react";
import Link from "next/link";
import { useFitChecks } from "@/hooks/use-fit-checks";
import { ChecksList, EmptyChecks, ChecksSkeleton } from "@/components/dashboard/checks-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = [["all", "All"], ["fits", "Fits Perfectly"], ["tight", "Tight Fit"], ["modify", "Requires Modification"], ["no", "Does Not Fit"]];

export default function ChecksPage() {
  const { items, error, reload, remove } = useFitChecks();
  const [f, setF] = useState("all");
  const shown = items?.filter((c) => f === "all" || c.result.status === f);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl">My fit checks</h1>
        <Button asChild><Link href="/check">New fit check</Link></Button>
      </header>
      <div role="group" aria-label="Filter by result" className="flex flex-wrap gap-2">
        {FILTERS.map(([id, l]) => (
          <button key={id} type="button" aria-pressed={f === id} onClick={() => setF(id)}
            className={cn("h-10 rounded-full border px-4 text-sm font-medium", f === id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40")}>{l}</button>
        ))}
      </div>
      {error ? (
        <div role="alert" className="rounded-2xl bg-no-soft p-6 text-no"><p className="font-medium">{error}</p><Button variant="outline" size="sm" className="mt-3" onClick={reload}>Try again</Button></div>
      ) : items === null ? <ChecksSkeleton /> : items.length === 0 ? <EmptyChecks /> : shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/25 p-8 text-center text-muted">No saved checks with that result.</p>
      ) : <ChecksList items={shown} onRemove={remove} />}
    </div>
  );
}
