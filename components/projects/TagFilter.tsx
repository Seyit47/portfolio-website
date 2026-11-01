import Link from "next/link";
import type { Tag } from "@/lib/content/types";
import { cn } from "@/lib/utils/cn";

type TagFilterProps = {
  tags: Tag[];
  active?: string;
  /** True when `active` is not a known tag; renders an unobtrusive note. */
  unknown?: boolean;
  /** Number of projects currently shown and the total; rendered in a reserved status line. */
  count?: number;
  total?: number;
};

const pill =
  "inline-flex min-h-9 items-center rounded-full border px-3 text-sm font-medium transition-colors duration-(--motion-fast)";

export function TagFilter({ tags, active, unknown = false, count, total }: TagFilterProps) {
  const allActive = !active || unknown;
  const activeTag = tags.find((tag) => tag.slug === active);
  let status: string | null = null;
  if (unknown && active) {
    status = `Filter "${active}" was not recognised, so all projects are shown.`;
  } else if (activeTag && count !== undefined) {
    status = `${count} of ${total ?? count} projects tagged ${activeTag.label}.`;
  } else if (count !== undefined) {
    status = `Showing all ${count} projects.`;
  }
  return (
    <nav aria-label="Filter by tag" className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/projects"
            scroll={false}
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
                scroll={false}
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
      {/* Reserved height so the grid below never moves when the filter changes. */}
      <p role="status" className="min-h-5 text-sm text-fg-subtle" data-testid="filter-status">
        {status}
      </p>
    </nav>
  );
}
