import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/content/types";

export function ProjectLinks({ project }: { project: Project }) {
  const { live, source } = project.links;
  if (!live && !source) {
    return <p className="text-fg-muted">This work is described as a case study only.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-3">
      {live && (
        <li>
          <Button href={live} target="_blank" rel="noopener noreferrer">
            Open live demo
            <span className="sr-only"> (opens in new tab)</span>
          </Button>
        </li>
      )}
      {source && (
        <li>
          <Button href={source} variant="secondary" target="_blank" rel="noopener noreferrer">
            View source code
            <span className="sr-only"> (opens in new tab)</span>
          </Button>
        </li>
      )}
    </ul>
  );
}
