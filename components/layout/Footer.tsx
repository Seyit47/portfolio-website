import Link from "next/link";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { Profile } from "@/lib/content/types";
import { PAGES } from "@/lib/content/pages";

export function Footer({ profile }: { profile: Profile }) {
  const year = process.env.BUILD_YEAR ?? "2026";
  return (
    <footer className="mt-auto border-t border-border bg-bg-muted/60">
      <div className="container-content grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-fg">{profile.name}</p>
          <p className="mt-1 text-sm text-fg-muted">{profile.title}</p>
          <p className="mt-1 text-sm text-fg-subtle">
            {profile.location.city}, {profile.location.country}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid gap-2 text-sm">
            {PAGES.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-fg-muted underline-offset-4 hover:text-fg hover:underline"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="grid gap-2 text-sm" aria-label="Contact links">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="text-fg-muted underline-offset-4 hover:text-fg hover:underline"
            >
              {profile.email}
            </a>
          </li>
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
          <li>
            <a
              href={profile.resume.path}
              download={profile.resume.filename}
              className="text-fg-muted underline-offset-4 hover:text-fg hover:underline"
            >
              Download resume (PDF)
            </a>
          </li>
        </ul>
      </div>
      <div className="container-content border-t border-border py-4 text-xs text-fg-subtle">
        © {year} {profile.name}. Built with care, tested in CI.
      </div>
    </footer>
  );
}
