"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, UserRound, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/checks", label: "My fit checks", icon: History },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Sidebar on desktop, horizontally scrollable tab bar on mobile. */
export function AccountNav() {
  const path = usePathname();
  return (
    <nav aria-label="Account" className="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0">
      <ul className="flex gap-2 lg:sticky lg:top-24 lg:flex-col lg:gap-1">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const on = exact ? path === href : path.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link href={href} aria-current={on ? "page" : undefined}
                className={cn("flex h-11 items-center gap-2.5 rounded-full px-4 text-sm font-medium transition-colors lg:rounded-xl", on ? "bg-ink text-white" : "hover:bg-ink/5")}>
                <Icon className="size-4" aria-hidden />{label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
