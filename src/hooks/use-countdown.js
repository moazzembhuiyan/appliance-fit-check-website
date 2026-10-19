"use client";
import { useCallback, useEffect, useState } from "react";

/** Simple resend-cooldown timer. */
export function useCountdown(initial = 0) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const start = useCallback((s) => setLeft(s), []);
  return { left, start, active: left > 0 };
}
