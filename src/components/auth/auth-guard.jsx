"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

/**
 * UX-only guard: redirects signed-out visitors to /login. Real authorization
 * must be enforced by your backend on every API call.
 */
export function AuthGuard({ children }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (status === "unauthenticated") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, pathname, router]);

  if (status !== "authenticated")
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8" role="status" aria-label="Loading your account">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-mist" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-mist" />)}</div>
      </div>
    );
  return children;
}
