"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BookOpen, CreditCard, Printer, Save, Smartphone, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, STATUS_STYLE } from "@/components/ui/status-badge";
import { FitDiagram } from "./fit-diagram";
import { fmtIn, cn } from "@/lib/utils";
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

export function ResultPanel({
  appliance,
  result,
  product,
  space,
  canSave,
  saved,
  saving,
  onSave,
  loggedIn,
  locked = false,
  onCheckout,
  checkoutLoading = false,
  paymentChecking = false,
  paymentNotice = "",
  onCheckPayment,
  userIdAvailable = true,
}) {
  const reduce = useReducedMotion();
  const s = STATUS_STYLE[result.status];
  const hasCompleteMeasurements = result.hasCompleteMeasurements ?? ["height", "width", "depth"].every(
    (dimension) => Number.isFinite(product[dimension]) && Number.isFinite(space[dimension])
  );

  return (
    <motion.div
      key={result.status}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="print-card relative overflow-hidden rounded-2xl border border-line bg-white shadow-soft"
    >
      {locked ? (
        <div aria-hidden className="flex min-h-[28rem] flex-col justify-center space-y-6 p-8 blur-md sm:min-h-[32rem] sm:p-10">
          <div className="h-8 w-40 rounded-full bg-mist" />
          <div className="h-8 w-3/4 rounded-lg bg-mist" />
          <div className="h-4 w-full rounded bg-mist" />
          <div className="h-px bg-line" />
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-mist" />
              <div className="h-4 flex-1 rounded bg-mist" />
            </div>
          ))}
        </div>
      ) : (
      <div>
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
          {result.dimensions.length > 0 ? (
            <ul className="mt-2 divide-y divide-line" aria-label="Per-dimension results">
              {result.dimensions.map((d) => (
                <ClearanceRow key={d.key} d={d} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Dimension details are unavailable for this saved fit check.</p>
          )}
        </div>
        {hasCompleteMeasurements && (
          <FitDiagram product={product} space={space} status={result.status} className="mx-auto w-full max-w-xs self-start" />
        )}
      </div>

      {appliance.checklist?.length > 0 && <div className="border-t border-line bg-paper p-6 sm:p-7">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted">Dimensions can’t tell you everything — also check</h3>
        <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {appliance.checklist.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass-deep" aria-hidden />
              {c}
            </li>
          ))}
        </ul>
      </div>}

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
        {appliance.guide && <Button asChild variant="ghost" size="sm">
          <Link href={`/guides/${appliance.guide}`}>
            <BookOpen className="size-4" /> {appliance.name} guide
          </Link>
        </Button>}
        <Button asChild variant="ghost" size="sm" className="sm:ml-auto">
          <a href={site.appStoreUrl}>
            <Smartphone className="size-4" /> Full app
          </a>
        </Button>
      </div>

      </div>
      )}
      {locked && (
        <div className="no-print absolute inset-0 z-10 flex items-center justify-center bg-white/35 p-6 backdrop-blur-[1px] sm:p-10">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-white/95 px-6 py-9 text-center shadow-lift sm:px-8 sm:py-11">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-mist text-ink">
              <LockKeyhole className="size-6" aria-hidden />
            </div>
            <h2 className="mt-4 font-display text-2xl">Your result is ready</h2>
            <p className="mt-2 text-sm text-muted">Complete payment to reveal the fit result and dimension-by-dimension details.</p>
            {!loggedIn ? (
              <Button asChild className="mt-5 w-full" size="lg">
                <Link href="/login?next=/check">Sign in to unlock your result</Link>
              </Button>
            ) : userIdAvailable ? (
              <Button className="mt-5 w-full" size="lg" onClick={onCheckout} loading={checkoutLoading}>
                <CreditCard className="size-4" /> Pay and view result
              </Button>
            ) : (
              <p role="alert" className="mt-4 text-sm text-no">Your account ID is missing. Refresh your profile and try again.</p>
            )}
            {paymentNotice && <p role="status" className="mt-4 text-sm text-muted">{paymentNotice}</p>}
            {loggedIn && userIdAvailable && (
              <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={onCheckPayment} loading={paymentChecking}>
                I’ve paid — check status
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
