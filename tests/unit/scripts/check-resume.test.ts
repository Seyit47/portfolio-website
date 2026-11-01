import { describe, expect, it } from "vitest";
import { compare } from "@/scripts/check-resume";

const roles = [
  {
    id: "kinestex",
    employer: "KinesteX",
    role: "Software Developer",
    start: "2025-05",
    end: "2026-06",
  },
  {
    id: "datacorda",
    employer: "Datacorda",
    role: "Frontend Developer",
    start: "2023-06",
    end: "2023-10",
  },
];

const pdfText = `
KinesteX AI Personal Trainer in your Digital Health Platform
Software Developer
May 2025 - June 2026 (1 year 2 months)
Datacorda
Frontend Developer
June 2023 - October 2023 (5 months)
`;

describe("compare", () => {
  it("passes when employer, role and period appear in the PDF text", () => {
    expect(compare(pdfText, roles)).toEqual([]);
  });

  it("reports missing employer, role or period", () => {
    const issues = compare(pdfText, [
      ...roles,
      { id: "ghost", employer: "Ghost Corp", role: "Wizard", start: "2019-01", end: "2019-02" },
    ]);
    expect(issues).toHaveLength(3);
    expect(issues.join("\n")).toMatch(/Ghost Corp/);
    expect(issues.join("\n")).toMatch(/Wizard/);
    expect(issues.join("\n")).toMatch(/January 2019 - February 2019/);
  });

  it("tolerates line breaks and extra whitespace in the PDF text", () => {
    const wrapped = pdfText.replace("May 2025 - June 2026", "May 2025 -\n   June 2026");
    expect(compare(wrapped, roles)).toEqual([]);
  });
});
