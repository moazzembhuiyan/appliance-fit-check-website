"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** 6-box one-time-code input: paste, backspace navigation, SMS autofill. */
export function OtpInput({ value, onChange, error, disabled, length = 6, autoFocus }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");
  const focus = (i) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  const set = (next) => onChange(next.replace(/\D/g, "").slice(0, length));

  return (
    <div>
      <div role="group" aria-label="6-digit verification code" className="flex justify-between gap-2 sm:gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            value={d}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            inputMode="numeric"
            pattern="\d*"
            maxLength={length}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={error ? true : undefined}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (!v) return set(value.slice(0, i) + value.slice(i + 1));
              if (v.length > 1) { set(value.slice(0, i) + v + value.slice(i + 1)); return focus(i + v.length); }
              set(value.slice(0, i) + v + value.slice(i + 1));
              focus(i + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !d) { e.preventDefault(); set(value.slice(0, i - 1) + value.slice(i)); focus(i - 1); }
              if (e.key === "ArrowLeft") focus(i - 1);
              if (e.key === "ArrowRight") focus(i + 1);
            }}
            onPaste={(e) => {
              e.preventDefault();
              const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
              set(t);
              focus(t.length);
            }}
            className={cn(
              "h-14 w-0 min-w-0 flex-1 rounded-xl border bg-white text-center text-2xl font-semibold tabular-nums sm:h-16",
              "border-line focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/10",
              error && "border-no"
            )}
          />
        ))}
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-no">{error}</p>}
    </div>
  );
}
