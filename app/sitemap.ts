import type { MetadataRoute } from "next";
import { getProjects, getTags } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date(process.env.BUILD_DATE ?? "2026-01-01T00:00:00.000Z");
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/projects"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: absoluteUrl("/experience"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
  const tagPages: MetadataRoute.Sitemap = getTags().map((tag) => ({
    url: absoluteUrl(`/projects/tag/${tag.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  const projectPages: MetadataRoute.Sitemap = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));
  return [...staticPages, ...projectPages, ...tagPages];
}
