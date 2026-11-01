import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { Profile } from "@/lib/content/types";
import { HeroCanvasLoader } from "./HeroCanvasLoader";
import { HeroFallback } from "./HeroFallback";

type HeroProps = {
  profile: Profile;
  /** Optional client enhancement slot (animated canvas), rendered behind the content. */
  canvas?: ReactNode;
  /** Optional wrapper that animates the text intro; defaults to a plain fragment. */
  intro?: (children: ReactNode) => ReactNode;
};

const availabilityTone: Record<Profile["availability"]["status"], string> = {
  open: "bg-success/15 text-success border-success/30",
  limited: "bg-focus/15 text-fg border-focus/40",
  unavailable: "bg-bg-muted text-fg-muted border-border",
};

export function Hero({ profile, canvas, intro }: HeroProps) {
  const wrap = intro ?? ((children: ReactNode) => <>{children}</>);
  return (
    <section
      aria-labelledby="hero-heading"
      data-testid="hero"
      className="relative isolate overflow-hidden border-b border-border"
    >
      <HeroFallback />
      {canvas ?? <HeroCanvasLoader />}
      <div className="relative container-content flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16 md:py-24">
        {wrap(
          <div className="hero-intro max-w-3xl">
            <p
              className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${availabilityTone[profile.availability.status]}`}
              data-hero-line
            >
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {profile.availability.label}
            </p>
            <h1
              id="hero-heading"
              className="font-display text-4xl font-semibold text-fg"
              data-hero-line
            >
              {profile.name}
            </h1>
            <p className="mt-3 text-xl font-medium text-fg-muted" data-hero-line>
              {profile.title}
            </p>
            <p
              className="mt-6 max-w-2xl text-lg text-fg-muted"
              data-hero-line
              data-testid="hero-tagline"
            >
              {profile.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" data-hero-line>
              <Button href="/projects" size="lg">
                View work
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Contact me
              </Button>
            </div>
            <p className="mt-8 text-sm text-fg-subtle" data-hero-line>
              {profile.location.city}, {profile.location.country} · Remote-friendly
            </p>
          </div>,
        )}
      </div>
    </section>
  );
}
