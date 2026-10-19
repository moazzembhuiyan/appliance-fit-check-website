import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-plum shadow-soft",
        brass: "bg-brass text-ink hover:bg-[#d6b47c]",
        outline: "border border-ink/25 bg-white text-ink hover:border-ink hover:bg-mist",
        ghost: "text-ink hover:bg-ink/6",
        "ghost-light": "text-white hover:bg-white/10",
        "outline-light": "border border-white/35 text-white hover:bg-white/10",
        danger: "bg-no text-white hover:bg-[#932019]",
      },
      size: { sm: "h-10 px-4 text-sm", md: "h-12 px-6 text-[0.95rem]", lg: "h-14 px-8 text-base" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export function Button({ className, variant, size, asChild, loading, children, disabled, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(variants({ variant, size }), className)} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {children}
        </>
      )}
    </Comp>
  );
}
