import Link from "next/link";
import type { Project, Role } from "@/lib/content/types";

type RoleItemProps = {
  role: Role;
  lane: number;
  relatedProjects: Array<Pick<Project, "slug" | "title">>;
  overlapEmployers: string[];
  defaultOpen?: boolean;
};

export function RoleItem({
  role,
  lane,
  relatedProjects,
  overlapEmployers,
  defaultOpen = false,
}: RoleItemProps) {
  return (
    <li
      id={role.id}
      data-testid="role-item"
      data-lane={lane}
      className="relative scroll-mt-24 md:transition-[margin]"
      style={{ marginLeft: `calc(var(--lane-offset, 0px) * ${lane})` }}
    >
      <span
        aria-hidden="true"
        className="absolute top-6 -left-[1.3rem] size-3 rounded-full border-2 border-bg bg-accent md:-left-[1.35rem]"
      />
      <details
        open={defaultOpen}
        className="group rounded-lg border border-border bg-bg-elevated shadow-sm open:border-border-strong"
      >
        <summary className="flex cursor-pointer list-none flex-col gap-1 p-5 [&::-webkit-details-marker]:hidden">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-display text-lg font-semibold text-fg" data-employer>
              {role.employer}
            </span>
            <span className="text-sm text-fg-subtle">
              {role.periodLabel} · {role.durationLabel}
            </span>
          </span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
            <span className="font-medium text-fg">{role.role}</span>
            <span aria-hidden="true">·</span>
            <span>{role.location}</span>
            {role.remote && (
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-fg-subtle">
                Remote
              </span>
            )}
          </span>
          {overlapEmployers.length > 0 && (
            <span className="mt-1 text-xs text-fg-subtle" data-testid="overlap-note">
              Overlaps with {overlapEmployers.join(" and ")}
            </span>
          )}
          <span className="mt-2 text-xs font-medium text-accent group-open:hidden">
            Show highlights
          </span>
          <span className="mt-2 hidden text-xs font-medium text-accent group-open:inline">
            Hide highlights
          </span>
        </summary>
        <div className="border-t border-border px-5 pt-4 pb-5">
          <ul className="grid gap-2" aria-label={`${role.employer} highlights`}>
            {role.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-sm text-fg">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          {relatedProjects.length > 0 && (
            <p className="mt-4 text-sm text-fg-muted">
              Related:{" "}
              {relatedProjects.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {p.title}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </details>
    </li>
  );
}
