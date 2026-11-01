import { Picture } from "@/components/ui/Picture";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { getTag } from "@/lib/content";
import type { Project } from "@/lib/content/types";

const PLACEHOLDER = { src: "/images/projects/placeholder.svg", width: 1200, height: 675 };

type ProjectCardProps = {
  project: Project;
  /** Heading level for the card title; defaults to h3 (cards sit under an h2 section). */
  headingLevel?: 2 | 3;
  priority?: boolean;
};

export function ProjectCard({ project, headingLevel = 3, priority = false }: ProjectCardProps) {
  const Heading = `h${headingLevel}` as const;
  const visual = project.visuals[0];
  const image = visual
    ? { src: visual.src, alt: visual.alt, width: visual.width, height: visual.height }
    : { ...PLACEHOLDER, alt: `${project.title} preview placeholder` };
  const titleId = `project-${project.slug}-title`;

  return (
    <Card
      as="article"
      interactive
      className="group flex h-full flex-col overflow-hidden"
      aria-labelledby={titleId}
    >
      <div className="relative aspect-video overflow-hidden border-b border-border bg-bg-muted">
        <Picture
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="size-full object-cover transition-transform duration-(--motion-slow) ease-(--ease-standard) group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex items-center gap-2 text-xs text-fg-subtle">
          <span>{project.year}</span>
          <span aria-hidden="true">·</span>
          <span>{project.type}</span>
        </p>
        <Heading id={titleId} className="font-display text-lg font-semibold text-fg">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
            <span className="sr-only">: read case study</span>
          </Link>
        </Heading>
        <p className="text-sm text-fg-muted" data-testid="project-summary">
          {project.summary}
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Tags">
          {project.tags.map((tag) => (
            <li key={tag} data-testid="project-tag" className="relative z-10">
              <Tag slug={tag} label={getTag(tag)?.label ?? tag} />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
