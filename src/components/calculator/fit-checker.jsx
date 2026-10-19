"use client";
import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Wand2, Ruler, ArrowDown, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ResultPanel } from "./result-panel";
import { APPLIANCES, getAppliance } from "@/lib/fit/appliances";
import { evaluateFit } from "@/lib/fit/evaluate";
import { fitInputSchema } from "@/lib/validation/schemas";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { site } from "@/lib/config";

const blank = { height: "", width: "", depth: "" };
const DIMS = [
  { key: "height", label: "Height", example: "" },
  { key: "width", label: "Width", example: "" },
  { key: "depth", label: "Depth", example: "" },
];

export function FitChecker({ initialAppliance = "refrigerator", compact = false }) {
  const start = getAppliance(initialAppliance) ? initialAppliance : "refrigerator";
  const { user, status: authStatus } = useAuth();
  const resultRef = useRef(null);
  const [savedSig, setSavedSig] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(fitInputSchema),
    mode: "onChange",
    defaultValues: { appliance: start, product: blank, space: blank },
  });

  const values = useWatch({ control });
  const appliance = getAppliance(values.appliance);

  // Live evaluation: runs as soon as all six values are valid.
  const parsed = useMemo(() => fitInputSchema.safeParse(values), [values]);
  const result = useMemo(
    () => (parsed.success ? evaluateFit(parsed.data.appliance, parsed.data.product, parsed.data.space) : null),
    [parsed]
  );

  const signature = parsed.success ? JSON.stringify(parsed.data) : "";
  const saved = !!signature && savedSig === signature;

  const err = (group, key) => (touchedFields?.[group]?.[key] ? errors?.[group]?.[key]?.message : undefined);

  const onSubmit = () => {
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    resultRef.current?.focus({ preventScroll: true });
  };
  const onInvalid = () => toast.error("Please complete all six measurements to check the fit.");

  const useExample = () => {
    reset({ appliance: values.appliance, ...appliance.example });
    toast.message("Example measurements loaded — replace them with your own.");
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.fitChecks.save({
        appliance: parsed.data.appliance,
        product: parsed.data.product,
        space: parsed.data.space,
        result: { status: result.status, label: result.label, summary: result.summary, dimensions: result.dimensions },
      });
      setSavedSig(signature);
      toast.success("Fit check saved to your dashboard.");
    } catch (e) {
      toast.error(e.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const webOff = !appliance.webCheck;

  return (
    <div className={cn("grid gap-8", !compact && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10")}>
      <form onSubmit={(e) => handleSubmit(onSubmit, onInvalid)(e)} noValidate className="space-y-8">
        {/* Step 1 */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-xl">
            <span className="flex size-8 items-center justify-center rounded-full bg-ink font-sans text-sm text-white">1</span>
            Choose your appliance
          </legend>
          <div role="radiogroup" aria-label="Appliance type" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {APPLIANCES.map((a) => {
              const active = values.appliance === a.id;
              return (
                <label
                  key={a.id}
                  className={cn(
                    "relative flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brass-deep",
                    active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"
                  )}
                >
                  <input type="radio" value={a.id} {...register("appliance")} className="sr-only" />
                  <span>{a.short}</span>
                  {a.free && (
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase", active ? "bg-brass text-ink" : "bg-ok-soft text-ok")}>Free</span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Step 2 & 3 */}
        {[
          { n: 2, group: "product", title: "Enter product dimensions", note: "Use the exact manufacturer dimensions (takes less than 60 seconds)." },
          { n: 3, group: "space", title: `Enter space dimensions — ${appliance.spaceLabel.toLowerCase()}`, note: appliance.hint },
        ].map((s) => (
          <fieldset key={s.group}>
            <legend className="flex items-center gap-3 font-display text-xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-sans text-sm text-white">{s.n}</span>
              {s.title}
            </legend>
            <p className="mt-2 flex gap-2 text-sm text-muted">
              <Ruler className="mt-0.5 size-4 shrink-0" aria-hidden />
              {s.note} Use decimals only (example: 30.5).
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {DIMS.map((d) => (
                <Field
                  key={d.key}
                  label={d.label}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={String(appliance.example[s.group][d.key])}
                  suffix="in"
                  error={err(s.group, d.key)}
                  {...register(`${s.group}.${d.key}`)}
                />
              ))}
            </div>
          </fieldset>
        ))}
        <p className="-mt-3 text-xs text-muted">Measure the actual opening or installation space — not the old appliance.</p>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" className="flex-1 sm:flex-none">
            Check my fit
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={useExample}>
            <Wand2 className="size-4" /> Try an example
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => reset({ appliance: values.appliance, product: blank, space: blank })}>
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
        <p className="text-xs text-muted">Takes 30 seconds • Prevents costly installation mistakes</p>
      </form>

      {/* Result */}
      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="scroll-mt-24 outline-none lg:sticky lg:top-24 lg:self-start">
        <AnimatePresence mode="wait">
          {result ? (
            <ResultPanel
              key="result"
              appliance={appliance}
              result={result}
              product={parsed.data.product}
              space={parsed.data.space}
              canSave
              loggedIn={authStatus === "authenticated" && !!user}
              saved={saved}
              saving={saving}
              onSave={save}
            />
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-ink/25 bg-white/60 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-mist"><ArrowDown className="size-5 -rotate-90 lg:rotate-0" aria-hidden /></div>
              <h2 className="mt-4 text-xl">Your fit result appears here</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                Enter all six measurements. You’ll see one of four results: Fits Perfectly, Tight Fit, Requires Modification or Does Not Fit.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {webOff && (
          <p className="mt-3 flex gap-2 rounded-xl bg-mist p-4 text-sm">
            <Smartphone className="mt-0.5 size-4 shrink-0" />
            <span>This appliance is checked in the full app. <a href={site.appStoreUrl} className="font-medium underline">Get the app</a></span>
          </p>
        )}
      </div>
    </div>
  );
}
