import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MetricCallouts } from "@/components/projects/MetricCallouts";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectMeta } from "@/components/projects/ProjectMeta";
import { ProjectPager } from "@/components/projects/ProjectPager";
import { Picture } from "@/components/ui/Picture";
import { Prose } from "@/components/ui/Prose";
import { Tag } from "@/components/ui/Tag";
import { getProject, getProjects, getTag } from "@/lib/content";
import { MDXContent } from "@/lib/mdx";
import { JsonLd, breadcrumbJsonLd, buildMetadata, projectJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: `${project.title} · Projects`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

const PLACEHOLDER = { src: "/images/projects/placeholder.svg", width: 1200, height: 675 };

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-10">
      <h2 id={`${id}-heading`} className="font-display text-xl font-semibold text-fg">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Paragraphs({ text }: { text: string }) {
  return (
    <Prose>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => (
          <p key={p}>{p}</p>
        ))}
    </Prose>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const visual = project.visuals[0];
  const hero = visual
    ? { src: visual.src, alt: visual.alt, width: visual.width, height: visual.height }
    : { ...PLACEHOLDER, alt: `${project.title} preview placeholder` };

  return (
    <article className="container-content py-12 md:py-16">
      <JsonLd data={projectJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-fg-subtle">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-fg">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/projects" className="hover:text-fg">
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            {project.title}
          </li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          {project.type}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-fg">{project.title}</h1>
        <p className="mt-4 text-lg text-fg-muted">{project.summary}</p>
      </header>

      <div className="mt-8">
        <ProjectMeta project={project} />
      </div>

      <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-bg-muted">
        <Picture
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          sizes="(min-width: 1200px) 72rem, 100vw"
          priority
          className="size-full object-cover"
        />
      </figure>

      <div className="max-w-(--prose-max)">
        <Block id="summary" title="Summary">
          <Paragraphs text={project.summary} />
        </Block>
        <Block id="problem" title="Problem">
          <Paragraphs text={project.problem} />
        </Block>
        <Block id="solution" title="Solution">
          <Paragraphs text={project.solution} />
        </Block>
        <Block id="highlights" title="Highlights">
          <ul className="grid gap-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-fg">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block id="outcome" title="Outcome">
          <Paragraphs text={project.outcome} />
          <MetricCallouts metrics={project.metrics} />
        </Block>
        <Block id="tags" title="Tags">
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {project.tags.map((slug) => {
              const tag = getTag(slug);
              return (
                <li key={slug}>
                  <Tag slug={slug} label={tag?.label ?? slug} />
                </li>
              );
            })}
          </ul>
        </Block>
        <Block id="links" title="Links">
          <ProjectLinks project={project} />
        </Block>
        <section aria-label="Case study" className="mt-10 border-t border-border pt-6">
          <Prose>
            <MDXContent code={project.mdx} />
          </Prose>
        </section>
        <ProjectPager project={project} />
      </div>
    </article>
  );
}
