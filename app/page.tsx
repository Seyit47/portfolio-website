import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { AboutStrip } from "@/components/home/AboutStrip";
import { ContactStrip } from "@/components/home/ContactStrip";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { getProfile, getProjects } from "@/lib/content";
import { JsonLd, buildMetadata, personJsonLd, siteUrl } from "@/lib/seo";

const profile = getProfile();

export const metadata: Metadata = buildMetadata({
  title: { absolute: `${profile.name} · ${profile.title}` },
  description: profile.seo.defaultDescription,
  path: "/",
});

export default function HomePage() {
  const featured = getProjects({ featured: true });
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: profile.seo.siteName,
          url: siteUrl(),
        }}
      />
      <Hero profile={profile} />
      <FeaturedProjects projects={featured} />
      <AboutStrip profile={profile} />
      <ContactStrip profile={profile} />
    </>
  );
}
