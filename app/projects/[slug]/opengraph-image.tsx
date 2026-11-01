import { ImageResponse } from "next/og";
import { getProject, getProjects, getTag } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const alt = "Project case study by Seyit Geldiyev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const title = project?.title ?? "Project";
  const type = project?.type ?? "";
  const tags = project?.tags.map((t) => getTag(t)?.label ?? t) ?? [];
  const host = siteUrl().replace(/^https?:\/\//, "");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #0f1013 0%, #1b2a4d 60%, #1d4ed8 100%)",
        color: "#f2f1ee",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, color: "#c2c0ba", letterSpacing: 4, textTransform: "uppercase" }}>
        {type}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          {title}
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 26,
                padding: "8px 18px",
                borderRadius: 999,
                border: "2px solid #8ab4ff",
                color: "#8ab4ff",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#c2c0ba" }}
      >
        <span>Seyit Geldiyev · Case study</span>
        <span>{host}</span>
      </div>
    </div>,
    { ...size },
  );
}
