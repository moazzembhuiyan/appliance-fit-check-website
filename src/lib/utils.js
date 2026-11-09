import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInches } from "./measurements";
export const cn = (...i) => twMerge(clsx(i));
export const fmtIn = formatInches;
export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
