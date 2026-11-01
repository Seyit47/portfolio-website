import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-(--motion-fast) ease-(--ease-standard) active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-strong border border-transparent shadow-sm",
  secondary: "bg-bg-elevated text-fg border border-border-strong hover:border-fg hover:bg-bg-muted",
  ghost: "bg-transparent text-fg-muted hover:text-fg hover:bg-bg-muted border border-transparent",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    download?: boolean | string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function omitStyling<T extends CommonProps>(props: T): Omit<T, keyof CommonProps> {
  const rest = { ...props } as Partial<CommonProps> & Omit<T, keyof CommonProps>;
  delete rest.variant;
  delete rest.size;
  delete rest.className;
  delete rest.children;
  return rest;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const { href, ...rest } = omitStyling(props);
    const isInternal =
      href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+$/i.test(href);
    if (isInternal) {
      return (
        <Link href={href} className={classes} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const { type = "button", ...rest } = omitStyling(props);
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
