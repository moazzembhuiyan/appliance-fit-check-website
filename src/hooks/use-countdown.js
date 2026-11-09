"use client";
import { useCallback, useEffect, useState } from "react";

/** Simple resend-cooldown timer. */
export function useCountdown(initial = 0, storageKey) {
  const [left, setLeft] = useState(initial);

  useEffect(() => {
    let deadline;
    try {
      const savedDeadline = storageKey ? Number(sessionStorage.getItem(storageKey)) : 0;
      deadline = savedDeadline > Date.now() ? savedDeadline : Date.now() + initial * 1000;
      if (storageKey && savedDeadline <= Date.now()) {
        sessionStorage.setItem(storageKey, String(deadline));
      }
    } catch {
      deadline = Date.now() + initial * 1000;
    }

    const initialize = setTimeout(() => {
      setLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 0);
    return () => clearTimeout(initialize);
  }, [initial, storageKey]);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const start = useCallback((seconds) => {
    const duration = Math.max(0, Number(seconds) || 0);
    try {
      if (storageKey) {
        if (duration) sessionStorage.setItem(storageKey, String(Date.now() + duration * 1000));
        else sessionStorage.removeItem(storageKey);
      }
    } catch {
      // The countdown still works for this page when session storage is unavailable.
    }
    setLeft(duration);
  }, [storageKey]);

  return { left, start, active: left > 0 };
}
