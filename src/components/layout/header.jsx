"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as Menu from "@radix-ui/react-dropdown-menu";
import { Menu as MenuIcon, X, ChevronDown, LayoutDashboard, UserRound, Settings, LogOut } from "lucide-react";
import { Logo } from "./logo";
import { LogoutDialog } from "./logout-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { APPLIANCES } from "@/lib/fit/appliances";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/check", label: "Fit calculator" },
  { href: "/guides", label: "Guides", menu: true },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const itemCls = "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm outline-none data-[highlighted]:bg-mist";

function UserMenu({ onLogout }) {
  const { user } = useAuth();
  const initials = (user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Menu.Root>
      <Menu.Trigger aria-label="Account menu" className="flex h-11 items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 hover:border-ink/40">
        <span className="flex size-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">{initials}</span>
        <ChevronDown className="size-4 text-muted" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content align="end" sideOffset={8} className="z-50 w-60 rounded-xl border border-line bg-white p-1.5 shadow-lift">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
          <Menu.Separator className="my-1 h-px bg-line" />
          <Menu.Item asChild className={itemCls}><Link href="/dashboard"><LayoutDashboard className="size-4" />Dashboard</Link></Menu.Item>
          <Menu.Item asChild className={itemCls}><Link href="/profile"><UserRound className="size-4" />Profile</Link></Menu.Item>
          <Menu.Item asChild className={itemCls}><Link href="/settings"><Settings className="size-4" />Settings</Link></Menu.Item>
          <Menu.Separator className="my-1 h-px bg-line" />
          <Menu.Item onSelect={onLogout} className={itemCls}><LogOut className="size-4" />Sign out</Menu.Item>
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}

export function Header() {
  const pathname = usePathname();
  const { status } = useAuth();
  const [open, setOpen] = useState(false);
  const [logout, setLogout] = useState(false);
  const active = (h) => pathname === h || pathname.startsWith(h + "/");
  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) =>
            n.menu ? (
              <Menu.Root key={n.href}>
                <Menu.Trigger className={cn("flex h-10 items-center gap-1 rounded-full px-4 text-sm font-medium hover:bg-ink/5", active(n.href) && "bg-ink/5")}>
                  {n.label} <ChevronDown className="size-3.5" />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Content sideOffset={8} className="z-50 w-64 rounded-xl border border-line bg-white p-1.5 shadow-lift">
                    <Menu.Item asChild className={itemCls}><Link href="/guides" className="font-medium">All guides</Link></Menu.Item>
                    <Menu.Separator className="my-1 h-px bg-line" />
                    {APPLIANCES.map((a) => (
                      <Menu.Item key={a.id} asChild className={itemCls}>
                        <Link href={`/guides?appliance=${a.id}`}>{a.name}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.Content>
                </Menu.Portal>
              </Menu.Root>
            ) : (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
                className={cn("flex h-10 items-center rounded-full px-4 text-sm font-medium hover:bg-ink/5", active(n.href) && "bg-ink/5")}>
                {n.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            {status === "loading" ? <div className="h-11 w-24" aria-hidden /> : authed ? (
              <UserMenu onLogout={() => setLogout(true)} />
            ) : (
              <>
                <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
                <Button asChild size="sm"><Link href="/register">Get started</Link></Button>
              </>
            )}
          </div>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger aria-label="Open menu" className="flex size-11 items-center justify-center rounded-full hover:bg-ink/5 lg:hidden">
              <MenuIcon className="size-6" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 data-[state=open]:animate-[fade_.2s_ease]" />
              <Dialog.Content className="on-dark fixed inset-y-0 right-0 z-50 flex w-[min(22rem,90vw)] flex-col bg-ink p-6 text-white shadow-lift">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-lg">Menu</Dialog.Title>
                  <Dialog.Close aria-label="Close menu" className="flex size-11 items-center justify-center rounded-full hover:bg-white/10"><X className="size-6" /></Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <nav aria-label="Mobile" className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
                  {NAV.map((n) => (
                    <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={active(n.href) ? "page" : undefined}
                      className={cn("rounded-xl px-4 py-3.5 font-display text-2xl hover:bg-white/10", active(n.href) && "bg-white/10")}>
                      {n.label}
                    </Link>
                  ))}
                  {authed && (
                    <>
                      <p className="mt-4 px-4 text-xs uppercase tracking-widest text-white/50">Account</p>
                      {[["/dashboard", "Dashboard"], ["/profile", "Profile"], ["/settings", "Settings"]].map(([h, l]) => (
                        <Link key={h} href={h} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 hover:bg-white/10">{l}</Link>
                      ))}
                    </>
                  )}
                </nav>
                <div className="grid gap-3 pt-4">
                  {authed ? (
                    <Button variant="outline-light" onClick={() => { setOpen(false); setLogout(true); }}>Sign out</Button>
                  ) : (
                    <>
                      <Button asChild variant="brass"><Link href="/register" onClick={() => setOpen(false)}>Get started</Link></Button>
                      <Button asChild variant="outline-light"><Link href="/login" onClick={() => setOpen(false)}>Sign in</Link></Button>
                    </>
                  )}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <LogoutDialog open={logout} onOpenChange={setLogout} />
    </header>
  );
}
