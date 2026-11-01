import type { Metadata } from "next";
import type {
  BreadcrumbList,
  CreativeWork,
  Person,
  SoftwareSourceCode,
  WithContext,
} from "schema-dts";

const SCHEMA = "https://schema.org" as const;
import { getProfile, getRoles, getEducation } from "@/lib/content";
import type { Project } from "@/lib/content/types";

export function siteUrl(): string {
  const raw = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(pathname: string): string {
  return `${siteUrl()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function clampDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).trimEnd()}...`;
}

export type MetadataInput = {
  title: string | { absolute: string };
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export function buildMetadata(input: MetadataInput): Metadata {
  const profile = getProfile();
  const url = absoluteUrl(input.path);
  const description = clampDescription(input.description);
  const titleText = typeof input.title === "string" ? input.title : input.title.absolute;
  const metadata: Metadata = {
    title: input.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      url,
      siteName: profile.seo.siteName,
      title:
        typeof input.title === "string" ? `${input.title} · ${profile.seo.siteName}` : titleText,
      description,
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title:
        typeof input.title === "string" ? `${input.title} · ${profile.seo.siteName}` : titleText,
      description,
    },
  };
  if (input.noindex) {
    metadata.robots = { index: false, follow: false };
  }
  return metadata;
}

export function personJsonLd() {
  const p = getProfile();
  const roles = getRoles();
  const education = getEducation();
  return {
    "@context": SCHEMA,
    "@type": "Person",
    name: p.name,
    alternateName: p.alternateNames,
    jobTitle: p.title,
    description: p.tagline,
    email: `mailto:${p.email}`,
    url: siteUrl(),
    image: absoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress" as const,
      addressLocality: p.location.city,
      addressCountry: p.location.country,
    },
    sameAs: [p.links.github, p.links.linkedin, ...(p.links.website ? [p.links.website] : [])],
    knowsLanguage: p.languages.map((l) => l.name),
    hasOccupation: roles.map((r) => ({
      "@type": "Occupation" as const,
      name: r.role,
      description: `${r.employer}, ${r.periodLabel}`,
    })),
    alumniOf: education.map((e) => ({
      "@type": "EducationalOrganization" as const,
      name: e.institution,
    })),
  } satisfies WithContext<Person>;
}

export function projectJsonLd(project: Project) {
  const p = getProfile();
  const base = {
    "@context": SCHEMA,
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    datePublished: `${project.year}`,
    keywords: project.tags.join(", "),
    author: { "@type": "Person" as const, name: p.name, url: siteUrl() },
    image: absoluteUrl(`/projects/${project.slug}/opengraph-image`),
  };
  const sameAs = project.links.live ? { sameAs: project.links.live } : {};
  if (project.links.source) {
    return {
      ...base,
      "@type": "SoftwareSourceCode" as const,
      codeRepository: project.links.source,
      ...sameAs,
    } satisfies WithContext<SoftwareSourceCode>;
  }
  return {
    ...base,
    "@type": "CreativeWork" as const,
    ...sameAs,
  } satisfies WithContext<CreativeWork>;
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  } satisfies WithContext<BreadcrumbList>;
}

export function itemListJsonLd(projects: Project[]) {
  return {
    "@context": SCHEMA,
    "@type": "ItemList" as const,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: absoluteUrl(`/projects/${project.slug}`),
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
