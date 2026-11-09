"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

/** Loads the signed-in user's saved fit checks; a 401 sends them to /session-expired. */
export function useFitChecks({ page = 1, limit = 10 } = {}) {
  const router = useRouter();
  const [items, setItems] = useState(null); // null = loading
  const [meta, setMeta] = useState({ page, limit, total: 0, totalPage: 0 });
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    api.fitChecks
      .list({ page, limit })
      .then(({ items: nextItems, meta: nextMeta }) => {
        if (!alive) return;
        setItems(nextItems);
        setMeta(nextMeta);
      })
      .catch((e) => {
        if (!alive) return;
        if (e.status === 401) return router.replace("/session-expired");
        setError(e.message || "Could not load your fit checks.");
        setItems([]);
      });
    return () => {
      alive = false;
    };
  }, [page, limit, version, router]);

  const reload = useCallback(() => {
    setError("");
    setItems(null);
    setVersion((v) => v + 1);
  }, []);

  const remove = async (id) => {
    await api.fitChecks.remove(id);
    setItems((current) => current?.filter((item) => item.id !== id) ?? []);
    setMeta((current) => {
      const total = Math.max(0, current.total - 1);
      return { ...current, total, totalPage: Math.ceil(total / current.limit) };
    });
  };
  return { items, meta, error, reload, remove };
}
