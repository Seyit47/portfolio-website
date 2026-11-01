import Link from "next/link";
import type { Project } from "@/lib/content/types";

export function ProjectMeta({ project }: { project: Project }) {
  const items: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Year", value: project.year },
    { label: "Type", value: project.type },
    { label: "Role", value: project.role },
    { label: "Period", value: project.period },
  ];
  if (project.employerRole) {
    items.push({
      label: "For",
      value: (
        <Link
          href={`/experience#${project.employerRole.id}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          {project.employerRole.employer}
        </Link>
      ),
    });
  }
  return (
    <dl
      className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border border-border bg-bg-muted/50 p-4 text-sm sm:grid-cols-3 md:grid-cols-5"
      data-testid="project-meta"
    >
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-semibold tracking-[0.14em] text-fg-subtle uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-fg">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
