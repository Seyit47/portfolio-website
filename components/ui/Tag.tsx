import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type TagProps = {
  slug: string;
  label: string;
  active?: boolean;
  asLink?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5 transition-colors duration-(--motion-fast)";

export function Tag({ slug, label, active = false, asLink = true, className }: TagProps) {
  const classes = cn(
    base,
    active
      ? "border-accent bg-accent text-accent-fg"
      : "border-border bg-bg-muted text-fg-muted hover:border-border-strong hover:text-fg",
    className,
  );
  if (!asLink) {
    return <span className={classes}>{label}</span>;
  }
  return (
    <Link
      href={`/projects/tag/${slug}`}
      scroll={false}
      className={classes}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
