import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li" | "section";
  interactive?: boolean;
  children: ReactNode;
};

export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-border bg-bg-elevated shadow-sm",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-(--motion-base) ease-(--ease-standard) focus-within:border-border-strong hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
