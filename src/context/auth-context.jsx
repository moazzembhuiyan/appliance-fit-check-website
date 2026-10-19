"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

/**
 * Frontend auth state. status: "loading" | "authenticated" | "unauthenticated".
 * On mount it asks the API for the current session (api.auth.getSession). With a
 * real backend this works for httpOnly-cookie sessions as-is; for token-based
 * auth, store/read the token in lib/api/client.js (getAuthHeaders).
 * Real security is enforced by your backend — client-side guards are UX only.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;
    api.auth
      .getSession()
      .then(({ user }) => alive && (setUser(user), setStatus("authenticated")))
      .catch(() => alive && (setUser(null), setStatus("unauthenticated")));
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback((u) => {
    setUser(u);
    setStatus("authenticated");
  }, []);
  const signOut = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo(() => ({ user, status, signIn, signOut, setUser }), [user, status, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
