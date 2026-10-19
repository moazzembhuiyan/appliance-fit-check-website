"use client";
import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Labelled input with helper + error text wired for screen readers. */
export const Field = forwardRef(function Field(
  { label, hint, error, suffix, className, inputClassName, type = "text", id, ...props },
  ref
) {
  const auto = useId();
  const fid = id || auto;
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const describedBy = [hint && `${fid}-hint`, error && `${fid}-err`].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={fid} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={fid}
          ref={ref}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-12 w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-muted/60 transition-colors",
            "border-line hover:border-ink/30 focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10",
            error && "border-no focus:border-no focus:ring-no/15",
            isPassword && "pr-14", suffix && !isPassword && "pl-3 pr-8 sm:pl-4 sm:pr-10",
            inputClassName
          )}
          {...props}
        />
        {suffix && !isPassword && (
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-muted sm:right-4 sm:text-sm">{suffix}</span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute inset-y-0 right-1 flex w-11 items-center justify-center rounded-lg text-muted hover:text-ink"
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={`${fid}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fid}-err`} role="alert" className="text-xs font-medium text-no">
          {error}
        </p>
      )}
    </div>
  );
});
