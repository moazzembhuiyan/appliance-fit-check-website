"use client";
import { useEffect, useRef } from "react";

/**
 * Scroll-reveal that is safe without JavaScript: content is visible in the
 * server HTML and only hidden (then revealed) after hydration, and only when
 * it starts below the fold. Respects prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, className, as = "div" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) return; // already on screen: leave visible
    el.dataset.rv = "hide";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.rv = "show";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    // Safety net: never leave content hidden.
    const t = setTimeout(() => { el.dataset.rv = "show"; io.disconnect(); }, 8000);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);

  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </Tag>
  );
}
