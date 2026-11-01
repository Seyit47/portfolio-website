import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { TagFilter } from "@/components/projects/TagFilter";
import { Section } from "@/components/ui/Section";
import { getProjects, getTag, getTags } from "@/lib/content";
import { JsonLd, itemListJsonLd } from "@/lib/seo";

export function ProjectsIndex({ tag }: { tag?: string }) {
  const known = tag ? getTag(tag) : undefined;
  const unknown = Boolean(tag) && !known;
  const projects = known ? getProjects({ tag: known.slug }) : getProjects();
  const title = known ? `Projects · ${known.label}` : "Projects";
  return (
    <Section
      level={1}
      eyebrow="Case studies"
      title={title}
      intro={
        known?.description ??
        "Every project with the problem, the decisions and the outcome. Filter by what you are hiring for."
      }
    >
      <JsonLd data={itemListJsonLd(projects)} />
      <div className="mb-8">
        <TagFilter tags={getTags()} active={tag} unknown={unknown} />
      </div>
      <ProjectGrid projects={projects} headingLevel={2} />
    </Section>
  );
}
