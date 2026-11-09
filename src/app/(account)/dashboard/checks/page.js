"use client";
import { useState } from "react";
import Link from "next/link";
import { useFitChecks } from "@/hooks/use-fit-checks";
import { ChecksList, EmptyChecks, ChecksSkeleton } from "@/components/dashboard/checks-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS = [["all", "All paid"], ["fits", "Fits Perfectly"], ["tight", "Tight Fit"], ["modify", "Requires Modification"], ["no", "Does Not Fit"]];

export default function ChecksPage() {
  const [page, setPage] = useState(1);
  const { items, meta, error, reload, remove } = useFitChecks({ page, limit: 10 });
  const [f, setF] = useState("all");
  const paidItems = items?.filter((check) => check.isPaid) ?? [];
  const unpaidItems = items?.filter((check) => !check.isPaid) ?? [];
  const shownPaid = paidItems.filter((check) => f === "all" || check.result.status === f);
  const totalPages = meta.totalPage;
  const firstItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const lastItem = Math.min(meta.page * meta.limit, meta.total);
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => Math.max(1, Math.min(meta.page - 2, totalPages - 4)) + index
  );

  const removeCheck = async (id) => {
    await remove(id);
    if (items?.length === 1 && page > 1) setPage((current) => current - 1);
  };

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
      ) : items === null ? <ChecksSkeleton /> : items.length === 0 && page === 1 ? <EmptyChecks /> : shownPaid.length === 0 && unpaidItems.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/25 p-8 text-center text-muted">
          {f === "all" ? "No saved checks on this page." : "No paid fit checks match this result."}
        </p>
      ) : <div className="space-y-8">
        {shownPaid.length > 0 ? (
          <section aria-labelledby="paid-checks-title" className="space-y-4">
            <h2 id="paid-checks-title" className="text-xl font-semibold">Paid fit check results</h2>
            <ChecksList items={shownPaid} onRemove={removeCheck} />
          </section>
        ) : unpaidItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/25 p-8 text-center text-muted">No paid fit checks match this result.</p>
        ) : null}
        {unpaidItems.length > 0 && (
          <section aria-labelledby="payment-required-title" className="space-y-4">
            <div>
              <h2 id="payment-required-title" className="text-xl font-semibold">Payment required</h2>
              <p className="mt-1 text-sm text-muted">These checks are kept separate until payment unlocks their results.</p>
            </div>
            <ChecksList items={unpaidItems} onRemove={removeCheck} />
          </section>
        )}
      </div>}
      {!error && meta.total > 0 && (
        <nav aria-label="Fit check pages" className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-ink">{firstItem}–{lastItem}</span> of{" "}
            <span className="font-semibold text-ink">{meta.total}</span> fit checks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || items === null}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                aria-label={`Page ${pageNumber}`}
                aria-current={pageNumber === meta.page ? "page" : undefined}
                disabled={items === null}
                onClick={() => setPage(pageNumber)}
                className={cn(
                  "size-10 rounded-full border text-sm font-medium disabled:opacity-50",
                  pageNumber === meta.page
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink hover:bg-mist"
                )}
              >
                {pageNumber}
              </button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages || items === null}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}
