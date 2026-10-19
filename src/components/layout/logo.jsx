import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../assets/Logo/Logo.png";

export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="currentColor" />
      <rect x="8" y="7" width="16" height="18" rx="1.5" fill="none" stroke="#c9a46a" strokeWidth="1.6" strokeDasharray="3 2.2" />
      <rect x="10.5" y="11" width="11" height="14" rx="1" fill="#c9a46a" />
    </svg>
  );
}

export function Logo({ light, className }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 font-display text-lg font-semibold", light ? "text-white" : "text-ink", className)}>
     <Image src={logo} alt="Appliance Fit Check logo" width={3200} height={320} className="w-[200px]" />
    </Link>
  );
}
