"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGES } from "@/lib/content/pages";
import { cn } from "@/lib/utils/cn";

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-1 sm:justify-end sm:gap-2">
        {PAGES.filter((p) => p.href !== "/").map((page) => {
          const active = page.href === "/" ? pathname === "/" : pathname.startsWith(page.href);
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors duration-(--motion-fast)",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
