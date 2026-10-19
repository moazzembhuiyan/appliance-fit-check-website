"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BookOpen, Printer, Save, Smartphone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, STATUS_STYLE } from "@/components/ui/status-badge";
import { FitDiagram } from "./fit-diagram";
import { fmtIn, cn } from "@/lib/utils";
import { RULES_ARE_PLACEHOLDERS } from "@/lib/fit/rules.config";
import { site } from "@/lib/config";

function ClearanceRow({ d }) {
  const s = STATUS_STYLE[d.status];
  const Icon = s.icon;
  return (
    <li className="flex items-start gap-3 py-3">
      <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", s.bg, s.text)}>
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-medium">{d.label}</p>
          <p className="text-sm tabular-nums text-muted">
            Product {fmtIn(d.product)} · Space {fmtIn(d.space)}
          </p>
        </div>
        <p className="text-sm text-muted">{d.message}</p>
      </div>
    </li>
  );
}

export function ResultPanel({ appliance, result, product, space, canSave, saved, saving, onSave, loggedIn }) {
  const reduce = useReducedMotion();
  const s = STATUS_STYLE[result.status];

  return (
    <motion.div
      key={result.status}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="print-card overflow-hidden rounded-2xl border border-line bg-white shadow-soft"
    >
      <div className={cn("flex flex-col gap-3 p-6 sm:p-7", s.bg)}>
        <StatusBadge status={result.status} label={result.label} className="self-start bg-white/70" />
        <h2 className="text-2xl sm:text-3xl">
          {appliance.name}: {result.label.toLowerCase()}
        </h2>
        <p className="text-ink/80">{result.summary}</p>
      </div>

      <div className="grid gap-6 p-6 sm:p-7 lg:grid-cols-[1fr_minmax(0,16rem)]">
        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted">Dimensions comparison</h3>
          <ul className="mt-2 divide-y divide-line" aria-label="Per-dimension results">
            {result.dimensions.map((d) => (
              <ClearanceRow key={d.key} d={d} />
            ))}
          </ul>
        </div>
        <FitDiagram product={product} space={space} status={result.status} className="mx-auto w-full max-w-xs self-start" />
      </div>

      <div className="border-t border-line bg-paper p-6 sm:p-7">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted">Dimensions can’t tell you everything — also check</h3>
        <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {appliance.checklist.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass-deep" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="no-print flex flex-wrap items-center gap-3 border-t border-line p-6 sm:px-7">
        {canSave &&
          (loggedIn ? (
            <Button variant="primary" size="sm" onClick={onSave} loading={saving} disabled={saved}>
              <Save className="size-4" /> {saved ? "Saved to your checks" : "Save this check"}
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href="/login?next=/check">
                <Save className="size-4" /> Sign in to save
              </Link>
            </Button>
          ))}
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="size-4" /> Export as PDF
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/guides/${appliance.guide}`}>
            <BookOpen className="size-4" /> {appliance.name} guide
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="sm:ml-auto">
          <a href={site.appStoreUrl}>
            <Smartphone className="size-4" /> Full app
          </a>
        </Button>
      </div>

      {RULES_ARE_PLACEHOLDERS && (
        <p className="no-print flex gap-2 border-t border-line bg-tight-soft px-6 py-3 text-xs text-tight sm:px-7">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Preview build: the tolerances behind these results are placeholders until the production fit rules are connected.
        </p>
      )}
    </motion.div>
  );
}
