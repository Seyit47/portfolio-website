import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section level={1} title="Page not found" eyebrow="404" width="prose">
      <p className="text-fg-muted">
        That address does not exist here. The work is probably on the projects page, or you can
        start again from the home page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/projects">Browse projects</Button>
        <Button href="/" variant="secondary">
          Go home
        </Button>
      </div>
      <p className="mt-8 text-sm text-fg-subtle">
        Tip: press{" "}
        <kbd className="rounded-sm border border-border bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
          Ctrl
        </kbd>{" "}
        +{" "}
        <kbd className="rounded-sm border border-border bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
          K
        </kbd>{" "}
        to search every page and project.
      </p>
    </Section>
  );
}
