import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Section } from "@/components/ui/Section";
import { renderTimestamp } from "@/lib/contact/spam";
import { getProfile } from "@/lib/content";
import { JsonLd, buildMetadata, siteUrl } from "@/lib/seo";
import { sendContactMessage } from "./actions";

/** Rendered per request so the anti-spam timestamp is fresh and the form is in the initial HTML. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Hire Seyit Geldiyev for front-end or full-stack work: email, LinkedIn, GitHub, resume download or a short message through the contact form.",
  path: "/contact",
});

export default function ContactPage() {
  const profile = getProfile();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Seyit Geldiyev",
          url: `${siteUrl()}/contact`,
        }}
      />
      <Section
        level={1}
        eyebrow="Contact"
        title="Let's talk"
        intro="Hiring, freelance dashboards, or a question about a case study: pick whichever channel suits you."
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="grid content-start gap-6">
            <div className="rounded-lg border border-border bg-bg-elevated p-5">
              <p className="text-xs font-semibold tracking-[0.18em] text-fg-subtle uppercase">
                Email
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-medium text-fg underline-offset-4 hover:underline"
                >
                  {profile.email}
                </a>
                <CopyEmail email={profile.email} />
              </div>
            </div>
            <ul className="grid gap-3 text-sm" aria-label="Profiles and documents">
              <li>
                <ExternalLink href={profile.links.linkedin} className="text-fg-muted hover:text-fg">
                  LinkedIn profile
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href={profile.links.github} className="text-fg-muted hover:text-fg">
                  GitHub profile
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
            <p className="text-sm text-fg-subtle">
              Based in {profile.location.city}, {profile.location.country}. Comfortable with remote
              teams across European and Gulf time zones.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-fg">Send a message</h2>
            <div className="mt-4">
              <ContactForm
                action={sendContactMessage}
                renderedAt={renderTimestamp()}
                email={profile.email}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
