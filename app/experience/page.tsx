import type { Metadata } from "next";
import { EducationCard } from "@/components/experience/EducationCard";
import { SkillsGrid } from "@/components/experience/SkillsGrid";
import { Timeline } from "@/components/experience/Timeline";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getEducation, getProfile, getProjects, getRoles, getSkillGroups } from "@/lib/content";
import { JsonLd, buildMetadata, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Experience",
  description:
    "Six years of front-end and full-stack roles across health-tech, analytics and creative agencies, with education, certifications and skills by area.",
  path: "/experience",
});

export default function ExperiencePage() {
  const profile = getProfile();
  const roles = getRoles();
  const projectsBySlug = new Map(
    getProjects().map((p) => [p.slug, { slug: p.slug, title: p.title }]),
  );
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Section
        level={1}
        eyebrow="Career"
        title="Experience"
        intro="Five roles across three countries, two of them in parallel. Expand any role for what I actually shipped."
        action={
          <Button href={profile.resume.path} variant="secondary" download={profile.resume.filename}>
            Download resume (PDF)
          </Button>
        }
      >
        <Timeline roles={roles} projectsBySlug={projectsBySlug} />
      </Section>
      <Section id="education" title="Education" className="border-t border-border bg-bg-muted/40">
        <EducationCard education={getEducation()} />
        {profile.certifications.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-fg">Certifications</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {profile.certifications.map((c) => (
                <li
                  key={c.name}
                  className="rounded-full border border-border bg-bg-elevated px-3 py-1 text-sm text-fg-muted"
                >
                  {c.name}
                  {c.issuer ? <span className="text-fg-subtle"> · {c.issuer}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
      <Section
        id="skills"
        title="Skills"
        intro="Grouped by area. Primary means I reach for it daily; Working means I ship with it; Familiar means I have used it in production at least once."
        className="border-t border-border"
      >
        <SkillsGrid groups={getSkillGroups()} />
        <p className="mt-8 text-sm text-fg-subtle">
          Languages: {profile.languages.map((l) => `${l.name} (${l.level})`).join(", ")}.
        </p>
      </Section>
    </>
  );
}
