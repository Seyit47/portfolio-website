import type { Project } from "@/lib/content/types";

export function MetricCallouts({ metrics }: { metrics: Project["metrics"] }) {
  if (metrics.length === 0) return null;
  return (
    <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-lg border border-border bg-bg-elevated p-4">
          <dd className="font-display text-xl font-semibold text-accent">{metric.value}</dd>
          <dt className="mt-1 text-xs text-fg-subtle">{metric.label}</dt>
        </div>
      ))}
    </dl>
  );
}
