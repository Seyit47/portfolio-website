import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TagFilter } from "@/components/projects/TagFilter";
import { getTags } from "@/lib/content";

describe("TagFilter", () => {
  it("renders All plus every tag as links", () => {
    render(<TagFilter tags={getTags()} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(getTags().length + 1);
    expect(links[0]).toHaveTextContent("All");
    expect(links[0]).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/projects/tag/dashboard",
    );
  });

  it("marks the active tag with aria-current", () => {
    render(<TagFilter tags={getTags()} active="media" />);
    expect(screen.getByRole("link", { name: "Media" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "All" })).not.toHaveAttribute("aria-current");
  });

  it("marks All active when nothing is selected", () => {
    render(<TagFilter tags={getTags()} />);
    expect(screen.getByRole("link", { name: "All" })).toHaveAttribute("aria-current", "page");
  });

  it("shows a note for an unknown active value", () => {
    render(<TagFilter tags={getTags()} active="nope" unknown />);
    expect(screen.getByRole("status")).toHaveTextContent(/"nope" was not recognised/);
  });
});

describe("TagFilter status line", () => {
  it("always renders the status element so the grid never moves", () => {
    render(<TagFilter tags={getTags()} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("reports the filtered count for an active tag", () => {
    render(<TagFilter tags={getTags()} active="dashboard" count={4} total={9} />);
    expect(screen.getByRole("status")).toHaveTextContent("4 of 9 projects tagged Dashboard.");
  });

  it("reports the total when nothing is selected", () => {
    render(<TagFilter tags={getTags()} count={9} total={9} />);
    expect(screen.getByRole("status")).toHaveTextContent("Showing all 9 projects.");
  });
});
