"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, CreditCard, RotateCcw, Ruler, Search, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ResultPanel } from "./result-panel";
import { APPLIANCES } from "@/lib/fit/appliances";
import { fitInputSchema } from "@/lib/validation/schemas";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { formatFraction } from "@/lib/measurements";
import { cn } from "@/lib/utils";
import {
  clearPendingFit,
  PENDING_FIT_KEY,
  persistPendingFit as savePendingFit,
} from "@/lib/fit/pending-payment";
import { FIT_CHECK_PRICE } from "@/lib/config";

const blank = { height: "", width: "", depth: "" };
const DIMS = [
  { key: "height", label: "Height" },
  { key: "width", label: "Width" },
  { key: "depth", label: "Depth" },
];
const calculatorSchema = fitInputSchema.extend({
  appliance: z.string().trim().min(1, "Choose an appliance type"),
});

function getLegacyAppliance(type) {
  const normalizedType = type.toLowerCase();
  return APPLIANCES.find((item) =>
    [item.id, item.name, item.short].some((value) => value.toLowerCase() === normalizedType)
  );
}

function persistPendingFit(record) {
  try {
    savePendingFit(record);
    return true;
  } catch {
    toast.error("This browser could not preserve the fit check for the payment return.");
    return false;
  }
}

function restorePendingFit() {
  try {
    const saved = sessionStorage.getItem(PENDING_FIT_KEY);
    if (!saved) return null;
    const record = JSON.parse(saved);
    if (!record?.id) throw new Error("Missing fit check reference.");
    return api.fitChecks.normalizeRecord({ ...record, isPaid: false });
  } catch {
    try {
      sessionStorage.removeItem(PENDING_FIT_KEY);
    } catch {
      toast.error("Browser storage is unavailable; the previous fit check could not be cleared.");
    }
    toast.error("The saved fit check could not be restored. Please run the check again.");
    return null;
  }
}

export function FitChecker({ initialAppliance = "refrigerator", compact = false }) {
  const { user, status: authStatus } = useAuth();
  const resultRef = useRef(null);
  const [types, setTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState("");
  const [modelQuery, setModelQuery] = useState("");
  const [modelLoading, setModelLoading] = useState(false);
  const [modelNotice, setModelNotice] = useState("");
  const [fitRecord, setFitRecord] = useState(null);
  const [checkingFit, setCheckingFit] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentChecking, setPaymentChecking] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState("");

  const {
    register,
    control,
    reset,
    resetField,
    setValue,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(calculatorSchema),
    mode: "onChange",
    defaultValues: { appliance: "", product: blank, space: blank },
  });

  const values = useWatch({ control });
  const applianceField = register("appliance");
  const selectedType = values.appliance || "";
  const legacyAppliance = getLegacyAppliance(selectedType);
  const isWallOven = legacyAppliance?.id === "wall-oven";
  const appliance = legacyAppliance || {
    name: selectedType || "Appliance",
    spaceLabel: "countertop cutout",
    hint: "Measure the installation space carefully and enter its height, width, and depth.",
    guide: "faq",
    checklist: [],
  };
  const err = (group, key) =>
    touchedFields?.[group]?.[key] ? errors?.[group]?.[key]?.message : undefined;

  useEffect(() => {
    let active = true;
    api.applianceModels.listTypes()
      .then((response) => {
        if (!active) return;
        setTypes(response);
        const legacyInitial = getLegacyAppliance(initialAppliance);
        const preferred = response.find((item) =>
          item.type.toLowerCase() === (legacyInitial?.name || initialAppliance).toLowerCase()
        );
        setValue("appliance", preferred?.type || response[0]?.type || "");
      })
      .catch((error) => {
        if (!active) return;
        setTypesError(error.message || "Could not load appliance types.");
      })
      .finally(() => {
        if (active) setTypesLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialAppliance, setValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const restored = restorePendingFit();
      if (restored) setFitRecord(restored);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fitRecord) return undefined;
    const frame = requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [fitRecord]);

  const lookupModel = async () => {
    const model = modelQuery.trim();
    if (!selectedType || !model) {
      setModelNotice("Choose a type and enter a model number to search.");
      return;
    }
    setModelLoading(true);
    setModelNotice("");
    try {
      const found = await api.applianceModels.findByTypeAndModel(selectedType, model);
      setValue("product", {
        height: formatFraction(found.height),
        width: formatFraction(found.width),
        depth: formatFraction(found.depth),
      }, { shouldDirty: true, shouldValidate: true });
      setModelNotice(`${found.model} found. Product dimensions filled in; review them before checking.`);
    } catch (error) {
      setModelNotice(error.code === "APPLIANCE_MODEL_NOT_FOUND" || error.status === 404
        ? "Model not found. Enter the product dimensions manually."
        : error.message || "Model lookup failed. Enter the dimensions manually.");
    } finally {
      setModelLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!user?._id) {
      toast.error("Sign in before checking an appliance fit.");
      return;
    }
    setCheckingFit(true);
    setPaymentNotice("");
    try {
      const record = await api.fitChecks.create({
        author: user._id,
        appliance: data.appliance,
        product: data.product,
        space: data.space,
      });
      setFitRecord(record);
      persistPendingFit(record);
    } catch (error) {
      toast.error(error.message || "Could not check fit. Please try again.");
    } finally {
      setCheckingFit(false);
    }
  };

  const onInvalid = () => toast.error("Please choose an appliance and complete all six measurements.");

  const startCheckout = async () => {
    if (!fitRecord?.id) {
      toast.error("Run a fit check before starting payment.");
      return;
    }
    if (!user?._id) {
      toast.error("Sign in to unlock and pay for this result.");
      return;
    }
    setCheckoutLoading(true);
    setPaymentNotice("");
    try {
      if (!persistPendingFit(fitRecord)) throw new Error("Could not save this fit check for payment.");
      const checkoutUrl = await api.payments.checkout({ user: user._id, reference: fitRecord.id });
      window.location.assign(checkoutUrl);
    } catch (error) {
      setPaymentNotice(error.message || "Could not start checkout.");
      setCheckoutLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!fitRecord?.id || paymentChecking) return;
    setPaymentChecking(true);
    setPaymentNotice("Checking payment confirmation…");
    try {
      const currentFit = await api.fitChecks.get(fitRecord.id);
      if (currentFit.isPaid) {
        setFitRecord(currentFit);
        setPaymentNotice("Payment confirmed. Your result is unlocked.");
        clearPendingFit();
      } else {
        setPaymentNotice("Payment has not been confirmed yet. Please wait a moment and try again.");
      }
    } catch (error) {
      setPaymentNotice(error.message || "Could not check payment status.");
    } finally {
      setPaymentChecking(false);
    }
  };

  const useExample = () => {
    if (!legacyAppliance?.example) return;
    const formatDimensions = (dimensions) => Object.fromEntries(
      Object.entries(dimensions).map(([key, value]) => [key, formatFraction(value)])
    );
    reset({
      appliance: selectedType,
      product: formatDimensions(legacyAppliance.example.product),
      space: formatDimensions(legacyAppliance.example.space),
    });
    toast.message("Example measurements loaded — replace them with your own.");
  };

  return (
    <div className={cn("grid gap-8", !compact && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10")}>
      <form onSubmit={(event) => handleSubmit(onSubmit, onInvalid)(event)} noValidate className="space-y-8">
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-xl">
            <span className="flex size-8 items-center justify-center rounded-full bg-ink font-sans text-sm text-white">1</span>
            Choose your appliance
          </legend>
          <label htmlFor="appliance-type" className="sr-only">Appliance type</label>
          <select
            id="appliance-type"
            className="mt-4 h-12 w-full rounded-xl border border-line bg-white px-4 text-base text-ink focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10"
            disabled={typesLoading || !!typesError}
            {...applianceField}
            onChange={(event) => {
              applianceField.onChange(event);
              resetField("product", { defaultValue: blank });
              setModelQuery("");
              setModelNotice("");
            }}
          >
            <option value="">{typesLoading ? "Loading appliance types…" : "Select appliance type"}</option>
            {types.map(({ type, modelCount }) => (
              <option key={type} value={type}>{type} ({modelCount} models)</option>
            ))}
          </select>
          {typesError && <p role="alert" className="mt-2 text-sm text-no">{typesError}</p>}

          <div className="mt-5 rounded-2xl border border-line bg-white p-4 sm:p-5">
            <h2 className="font-display text-lg">Find your appliance model</h2>
            <p className="mt-1 text-sm text-muted">Search by model number to fill product dimensions automatically.</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Field
                label="Model number"
                value={modelQuery}
                onChange={(event) => setModelQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    lookupModel();
                  }
                }}
                placeholder="e.g. gr364g-ss"
                autoComplete="off"
                className="min-w-0 flex-1"
              />
              <Button type="button" variant="outline" className="self-end" onClick={lookupModel} loading={modelLoading} disabled={!selectedType}>
                <Search className="size-4" /> Find model
              </Button>
            </div>
            {modelNotice && <p role="status" className="mt-3 text-sm text-muted">{modelNotice}</p>}
          </div>
        </fieldset>

        {[
          {
            n: 2,
            group: "product",
            title: isWallOven ? "Enter manufacturer-required cutout dimensions" : "Enter product dimensions",
            note: isWallOven
              ? "Use the required cutout dimensions from the installation instructions, not the oven’s overall outside dimensions. Model search can fill these values for you."
              : "Use the exact manufacturer dimensions. Model search can fill these values for you.",
          },
          { n: 3, group: "space", title: `Enter space dimensions — ${appliance.spaceLabel.toLowerCase()}`, note: appliance.hint },
        ].map((section) => (
          <fieldset key={section.group}>
            <legend className="flex items-center gap-3 font-display text-xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-sans text-sm text-white">{section.n}</span>
              {section.title}
            </legend>
            <p className="mt-2 flex gap-2 text-sm text-muted">
              <Ruler className="mt-0.5 size-4 shrink-0" aria-hidden />
              {section.note} Enter exact fractions or decimals, e.g. 29 7/8 or 29.875.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {DIMS.map((dimension) => (
                <Field
                  key={dimension.key}
                  label={dimension.label}
                  inputMode="text"
                  autoComplete="off"
                  placeholder="e.g. 29 7/8"
                  suffix="in"
                  error={err(section.group, dimension.key)}
                  {...register(`${section.group}.${dimension.key}`)}
                />
              ))}
            </div>
          </fieldset>
        ))}
        <p className="-mt-3 text-xs text-muted">Measure the actual opening or installation space — not the old appliance.</p>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" className="flex-1 sm:flex-none" loading={checkingFit} disabled={typesLoading || !!typesError}>
            Check my fit
          </Button>
          {legacyAppliance?.example && (
            <Button type="button" variant="outline" size="lg" onClick={useExample}>
              <Wand2 className="size-4" /> Try an example
            </Button>
          )}
          <Button type="button" variant="ghost" size="lg" onClick={() => {
            reset({ appliance: selectedType, product: blank, space: blank });
            setFitRecord(null);
            setModelQuery("");
            setPaymentNotice("");
            clearPendingFit();
          }}>
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
        <p className="text-xs text-muted">Submit your measurements to create a fit check. Pay {FIT_CHECK_PRICE} to unlock the result and dimension details.</p>
      </form>

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="scroll-mt-24 outline-none lg:sticky lg:top-24 lg:self-start">
        <AnimatePresence mode="wait">
          {fitRecord ? (
            <ResultPanel
              key={fitRecord.id}
              appliance={{ ...appliance, name: fitRecord.appliance }}
              result={fitRecord.result}
              product={fitRecord.product}
              space={fitRecord.space}
              locked={!fitRecord.isPaid}
              onCheckout={startCheckout}
              checkoutLoading={checkoutLoading}
              paymentChecking={paymentChecking}
              paymentNotice={paymentNotice}
              onCheckPayment={checkPaymentStatus}
              loggedIn={authStatus === "authenticated" && !!user}
              userIdAvailable={!!user?._id}
              canSave={false}
            />
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-ink/25 bg-white/60 p-8 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-mist"><ArrowDown className="size-5 -rotate-90 lg:rotate-0" aria-hidden /></div>
              <h2 className="mt-4 text-xl">Your fit result appears here</h2>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted">Select an appliance, enter the product and installation-space dimensions, then check the fit.</p>
            </motion.div>
          )}
        </AnimatePresence>
        {fitRecord?.isPaid && paymentNotice && (
          <p role="status" className="mt-3 rounded-xl bg-ok-soft p-3 text-sm font-medium text-ok">{paymentNotice}</p>
        )}
      </div>
    </div>
  );
}
