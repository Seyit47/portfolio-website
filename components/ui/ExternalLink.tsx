import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  /** Set when the visible text already says it opens elsewhere. */
  silent?: boolean;
};

export function ExternalLink({
  href,
  children,
  className,
  silent = false,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("underline-offset-4 hover:underline", className)}
      {...rest}
    >
      {children}
      {!silent && <span className="sr-only"> (opens in new tab)</span>}
    </a>
  );
}
