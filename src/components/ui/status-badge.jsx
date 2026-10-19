import { CheckCircle2, AlertTriangle, Wrench, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const STATUS_STYLE = {
  fits: { icon: CheckCircle2, text: "text-ok", bg: "bg-ok-soft", solid: "bg-ok", ring: "ring-ok/30" },
  tight: { icon: AlertTriangle, text: "text-tight", bg: "bg-tight-soft", solid: "bg-tight", ring: "ring-tight/30" },
  modify: { icon: Wrench, text: "text-modify", bg: "bg-modify-soft", solid: "bg-modify", ring: "ring-modify/30" },
  no: { icon: XCircle, text: "text-no", bg: "bg-no-soft", solid: "bg-no", ring: "ring-no/30" },
};

/** Status is never conveyed by colour alone: icon + text label always shown. */
export function StatusBadge({ status, label, className }) {
  const s = STATUS_STYLE[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", s.bg, s.text, className)}>
      <Icon className="size-4" aria-hidden />
      {label}
    </span>
  );
}
