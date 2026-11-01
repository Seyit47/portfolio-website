import Link from "next/link";
import type { Project } from "@/lib/content/types";

export function ProjectPager({ project }: { project: Project }) {
  if (!project.prev && !project.next) return null;
  return (
    <nav
      aria-label="Project pagination"
      className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {project.prev ? (
        <Link
          href={`/projects/${project.prev.slug}`}
          rel="prev"
          className="group rounded-lg border border-border p-4 transition-colors hover:border-border-strong"
        >
          <span className="text-xs tracking-[0.14em] text-fg-subtle uppercase">
            Previous project
          </span>
          <span className="mt-1 block font-medium text-fg group-hover:text-accent">
            {project.prev.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {project.next && (
        <Link
          href={`/projects/${project.next.slug}`}
          rel="next"
          className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-border-strong"
        >
          <span className="text-xs tracking-[0.14em] text-fg-subtle uppercase">Next project</span>
          <span className="mt-1 block font-medium text-fg group-hover:text-accent">
            {project.next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
