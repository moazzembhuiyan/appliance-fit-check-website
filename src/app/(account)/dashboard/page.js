"use client";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useFitChecks } from "@/hooks/use-fit-checks";
import { ChecksList, EmptyChecks, ChecksSkeleton } from "@/components/dashboard/checks-list";
import { Button } from "@/components/ui/button";
import { APPLIANCES } from "@/lib/fit/appliances";
import { fmtDate } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { items, error, reload, remove } = useFitChecks();
  const first = user?.name?.split(" ")[0];

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Member since {user?.createdAt ? fmtDate(user.createdAt) : "—"}</p>
          <h1 className="mt-1 text-4xl sm:text-5xl">Welcome, {first}.</h1>
        </div>
        <Button asChild size="lg"><Link href="/check">New fit check <ArrowRight className="size-4" /></Link></Button>
      </header>

      <section aria-labelledby="quick">
        <h2 id="quick" className="text-2xl">Start a check</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {APPLIANCES.map((a) => (
            <li key={a.id}>
              <Link href={`/check?appliance=${a.id}`} className="group flex min-h-14 items-center justify-between rounded-xl border border-line bg-white px-4 transition-colors hover:border-ink/40">
                <span className="font-medium">{a.name}</span>
                <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent">
        <div className="flex items-center justify-between">
          <h2 id="recent" className="text-2xl">Recent fit checks</h2>
          {items?.length > 0 && <Link href="/dashboard/checks" className="text-sm font-medium underline underline-offset-4">View all</Link>}
        </div>
        <div className="mt-4">
          {error ? (
            <div role="alert" className="rounded-2xl bg-no-soft p-6 text-no">
              <p className="font-medium">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={reload}>Try again</Button>
            </div>
          ) : items === null ? <ChecksSkeleton /> : items.length === 0 ? <EmptyChecks /> : <ChecksList items={items.slice(0, 5)} onRemove={remove} />}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-mist p-6">
        <div>
          <h2 className="text-xl">Not sure how to measure?</h2>
          <p className="text-sm text-muted">Our guides cover refrigerators, wall ovens, dishwashers, cooktops, microwaves and range hoods.</p>
        </div>
        <Button asChild variant="outline"><Link href="/guides"><BookOpen className="size-4" /> Read the guides</Link></Button>
      </section>
    </div>
  );
}
