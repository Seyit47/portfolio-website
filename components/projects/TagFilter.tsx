import Link from "next/link";
import type { Tag } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

type TagFilterProps = {
  tags: Tag[];
  active?: string;
  /** True when `active` is not a known tag; renders an unobtrusive note. */
  unknown?: boolean;
};

const pill =
  "inline-flex min-h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors duration-(--motion-fast)";

export function TagFilter({ tags, active, unknown = false }: TagFilterProps) {
  const allActive = !active || unknown;
  return (
    <nav aria-label="Filter by tag" className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/projects"
            aria-current={allActive ? "page" : undefined}
            className={cn(
              pill,
              allActive
                ? "border-accent bg-accent text-accent-fg"
                : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg",
            )}
          >
            All
          </Link>
        </li>
        {tags.map((tag) => {
          const isActive = tag.slug === active;
          return (
            <li key={tag.slug}>
              <Link
                href={`/projects/tag/${tag.slug}`}
                aria-current={isActive ? "page" : undefined}
                title={tag.description}
                className={cn(
                  pill,
                  isActive
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {tag.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {unknown && active && (
        <p role="status" className="text-sm text-fg-subtle">
          Filter &quot;{active}&quot; was not recognised, so all projects are shown.
        </p>
      )}
    </nav>
  );
}
