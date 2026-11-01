import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/lib/content/types";

export function ProjectGrid({
  projects,
  label = "Projects",
  headingLevel = 3,
}: {
  projects: Project[];
  label?: string;
  headingLevel?: 2 | 3;
}) {
  if (projects.length === 0) {
    return (
      <p
        className="rounded-lg border border-dashed border-border p-8 text-center text-fg-muted"
        data-flip-size="project-grid"
      >
        No projects with this tag yet.
      </p>
    );
  }
  return (
    <ul
      className="grid content-start gap-6 md:grid-cols-2 lg:grid-cols-3"
      aria-label={label}
      data-flip-size="project-grid"
    >
      {projects.map((project, index) => (
        <Reveal
          key={project.slug}
          as="li"
          index={index % 3}
          className="relative"
          flipKey={project.slug}
        >
          <span className="sr-only" data-project-year>
            {project.year}
          </span>
          <ProjectCard project={project} priority={index < 2} headingLevel={headingLevel} />
        </Reveal>
      ))}
    </ul>
  );
}
