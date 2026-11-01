import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { getTag, getTags } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getTags().map((tag) => ({ tag: tag.slug }));
}

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const known = getTag(tag);
  if (!known) {
    return buildMetadata({
      title: "Projects",
      description: "All projects by Seyit Geldiyev.",
      path: "/projects",
      noindex: true,
    });
  }
  return buildMetadata({
    title: `Projects · ${known.label}`,
    description: known.description ?? `Projects tagged ${known.label} by Seyit Geldiyev.`,
    path: `/projects/tag/${known.slug}`,
  });
}

export default async function ProjectsByTagPage({ params }: Props) {
  const { tag } = await params;
  return <ProjectsIndex tag={tag} />;
}
