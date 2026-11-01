import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Case studies of dashboards, platforms and tools built by Seyit Geldiyev: the problem, the decisions and the outcome.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsIndex />;
}
