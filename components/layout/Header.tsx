import Link from "next/link";
import type { ReactNode } from "react";
import { Nav } from "./Nav";

type HeaderProps = {
  name: string;
  /** Slot for the theme toggle and palette trigger (client components). */
  tools?: ReactNode;
};

export function Header({ name, tools }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="container-content flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-0 py-2 sm:py-0">
        <Link
          href="/"
          className="min-w-0 truncate font-display text-base font-semibold tracking-tight text-fg hover:text-accent"
        >
          {name}
        </Link>
        {tools && (
          <div className="flex items-center gap-1 sm:order-last sm:border-l sm:border-border sm:pl-2">
            {tools}
          </div>
        )}
        <Nav className="-mx-2 w-full sm:mx-0 sm:w-auto" />
      </div>
    </header>
  );
}
