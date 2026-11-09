import Link from "next/link";
import { ShieldCheck, Save, History } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] grid-cols-[minmax(0,1fr)] lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="on-dark relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-plum/70 blur-3xl" aria-hidden />
        <LogoMark className="relative size-12 text-plum" />
        <div className="relative">
          <h2 className="text-4xl leading-tight">Keep every fit check in one place.</h2>
          <ul className="mt-8 space-y-4 text-white/80">
            {[[Save, "Save results for the appliances you’re considering"], [History, "Come back to past checks any time"], [ShieldCheck, "Measure once, buy with confidence"]].map(([I, t]) => (
              <li key={t} className="flex items-center gap-3"><I className="size-5 text-brass" aria-hidden />{t}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/50">Appliance Fit Check</p>
      </aside>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </div>
      </section>
    </div>
  );
}

export const AuthLink = ({ href, children }) => (
  <Link href={href} className="font-medium text-ink underline underline-offset-4 hover:text-brass-deep">{children}</Link>
);
