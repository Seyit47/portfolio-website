import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Section } from "@/components/ui/Section";
import type { Profile } from "@/lib/content/types";

export function ContactStrip({ profile }: { profile: Profile }) {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something fast"
      className="border-t border-border"
    >
      <Reveal className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <p className="max-w-(--prose-max) text-fg-muted">
          Hiring for a front-end or full-stack role, or need a dashboard shipped? Email me, connect
          on LinkedIn, or grab the resume. I reply within a day.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href={`mailto:${profile.email}`} size="lg">
            {profile.email}
          </Button>
          <Button
            href={profile.resume.path}
            variant="secondary"
            size="lg"
            download={profile.resume.filename}
          >
            Download resume
          </Button>
        </div>
      </Reveal>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Profiles">
        <li>
          <ExternalLink href={profile.links.github} className="text-fg-muted hover:text-fg">
            GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href={profile.links.linkedin} className="text-fg-muted hover:text-fg">
            LinkedIn
          </ExternalLink>
        </li>
      </ul>
    </Section>
  );
}
