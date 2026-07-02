"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/mock/about", label: "About" },
  { href: "/mock/write-up", label: "Writing" },
  { href: "/mock/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between border-b border-white/8 px-5 py-4 lg:px-14 lg:py-[22px]">
      <Link href="/mock/home" className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/18 font-mono text-xs font-semibold text-primary">
          AM
        </div>
        <span className="font-mono text-[13px] font-medium tracking-tight text-foreground">
          alexmorask.com
        </span>
      </Link>

      <nav className="hidden items-center gap-8 lg:flex">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-150",
                isActive ? "text-primary" : "text-text-tertiary hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="flex flex-col gap-1 p-1.5 lg:hidden"
        aria-label="Menu"
      >
        <span className="block h-0.5 w-[18px] bg-text-tertiary" />
        <span className="block h-0.5 w-[18px] bg-text-tertiary" />
        <span className="block h-0.5 w-[18px] bg-text-tertiary" />
      </button>

      {mobileOpen && (
        <nav className="absolute left-0 right-0 top-full z-50 flex flex-col gap-4 border-b border-white/8 bg-card px-5 py-6 lg:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-mono text-xs font-medium uppercase tracking-wider",
                  isActive ? "text-primary" : "text-text-tertiary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
