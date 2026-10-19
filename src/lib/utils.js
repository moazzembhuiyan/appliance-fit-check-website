import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i) => twMerge(clsx(i));
export const fmtIn = (n) => `${Number(n).toFixed(2).replace(/\.?0+$/, "")} in`;
export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
