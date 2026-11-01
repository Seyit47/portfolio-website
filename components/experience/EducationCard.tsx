import type { Education } from "@/lib/content/types";
import { periodLabel } from "@/lib/utils/dates";

export function EducationCard({ education }: { education: Education[] }) {
  return (
    <ul className="grid gap-4">
      {education.map((e) => (
        <li key={e.institution} className="rounded-lg border border-border bg-bg-elevated p-5">
          <p className="font-display text-lg font-semibold text-fg">{e.institution}</p>
          <p className="mt-1 text-fg">
            {e.degree}, {e.field}
          </p>
          <p className="mt-1 text-sm text-fg-subtle">
            {periodLabel(e.start, e.end)}
            {e.location ? ` · ${e.location}` : ""}
          </p>
        </li>
      ))}
    </ul>
  );
}
