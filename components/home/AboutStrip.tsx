import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import type { Profile } from "@/lib/content/types";

export function AboutStrip({ profile }: { profile: Profile }) {
  const paragraphs = profile.summary
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Who I am"
      className="border-t border-border bg-bg-muted/40"
    >
      <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <Reveal>
          <Prose>
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <div className="mt-6">
              <Button href="/experience" variant="secondary">
                More about me
              </Button>
            </div>
          </Prose>
        </Reveal>
        <Reveal index={1}>
          <dl className="grid gap-5 text-sm">
            <div>
              <dt className="text-xs font-semibold tracking-[0.18em] text-fg-subtle uppercase">
                Based in
              </dt>
              <dd className="mt-1 text-fg">
                {profile.location.city}, {profile.location.country}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.18em] text-fg-subtle uppercase">
                Languages
              </dt>
              <dd className="mt-1">
                <ul className="grid gap-1 text-fg">
                  {profile.languages.map((l) => (
                    <li key={l.name}>
                      {l.name} <span className="text-fg-subtle">· {l.level}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-[0.18em] text-fg-subtle uppercase">
                Availability
              </dt>
              <dd className="mt-1 text-fg">{profile.availability.label}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
