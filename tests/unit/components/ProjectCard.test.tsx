import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getProject } from "@/lib/content";

describe("ProjectCard", () => {
  it("renders title, year, type, summary and tags", () => {
    const project = getProject("audit-app")!;
    render(<ProjectCard project={project} />);
    expect(screen.getByRole("heading", { level: 3, name: /^Audit App/ })).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("Full-stack platform")).toBeInTheDocument();
    expect(screen.getByTestId("project-summary")).toHaveTextContent(project.summary);
    expect(screen.getAllByTestId("project-tag")).toHaveLength(project.tags.length);
  });

  it("links to the project page", () => {
    const project = getProject("audit-app")!;
    render(<ProjectCard project={project} />);
    expect(screen.getByRole("link", { name: /read case study/i })).toHaveAttribute(
      "href",
      "/projects/audit-app",
    );
  });

  it("uses the placeholder image when there are no visuals", () => {
    const project = getProject("audit-app")!;
    render(<ProjectCard project={project} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("placeholder"));
    expect(img).toHaveAttribute("alt", expect.stringContaining("Audit App"));
  });

  it("uses the first visual when present", () => {
    const project = {
      ...getProject("audit-app")!,
      visuals: [
        {
          src: "/images/projects/audit-app/hero.png",
          alt: "Audit App admin map",
          kind: "image" as const,
          width: 1200,
          height: 675,
        },
      ],
    };
    render(<ProjectCard project={project} />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Audit App admin map");
  });
});
