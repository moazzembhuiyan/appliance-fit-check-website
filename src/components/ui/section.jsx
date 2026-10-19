import { cn } from "@/lib/utils";

export function Container({ className, ...p }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...p} />;
}
export function Eyebrow({ className, ...p }) {
  return <p className={cn("text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep", className)} {...p} />;
}
export function PageHeader({ eyebrow, title, children }) {
  return (
    <div className="border-b border-line bg-white">
      <Container className="py-12 sm:py-16">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-muted">{children}</div>}
      </Container>
    </div>
  );
}
