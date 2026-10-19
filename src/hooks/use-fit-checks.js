"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

/** Loads the signed-in user's saved fit checks; a 401 sends them to /session-expired. */
export function useFitChecks() {
  const router = useRouter();
  const [items, setItems] = useState(null); // null = loading
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    api.fitChecks
      .list()
      .then(({ items }) => alive && setItems(items))
      .catch((e) => {
        if (!alive) return;
        if (e.status === 401) return router.replace("/session-expired");
        setError(e.message || "Could not load your fit checks.");
        setItems([]);
      });
    return () => {
      alive = false;
    };
  }, [version, router]);

  const reload = useCallback(() => {
    setError("");
    setItems(null);
    setVersion((v) => v + 1);
  }, []);

  const remove = async (id) => {
    await api.fitChecks.remove(id);
    setItems((cur) => cur.filter((c) => c.id !== id));
  };
  return { items, error, reload, remove };
}
