import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { Project } from "@/lib/content/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="featured"
      eyebrow="Selected work"
      title="Featured work"
      intro="Dashboards, platforms and tools I have shipped, with the decisions behind them."
      action={
        <Button href="/projects" variant="secondary">
          All projects
        </Button>
      }
    >
      <ul className="grid gap-6 md:grid-cols-2" aria-label="Featured projects">
        {projects.map((project, index) => (
          <Reveal key={project.slug} as="li" index={index} className="relative">
            <ProjectCard project={project} priority={index === 0} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
