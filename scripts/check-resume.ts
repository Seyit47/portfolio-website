/**
 * Asserts that every role in content/experience.yaml appears in public/resume.pdf
 * (employer, role title and the resume-formatted period). Uses the `pdftotext`
 * binary from poppler-utils, which is available locally and installed in CI.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { periodLabel } from "../lib/utils/dates";

export type RoleLike = {
  id: string;
  employer: string;
  role: string;
  start: string;
  end: string;
};

function normalise(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function compare(pdfText: string, roles: RoleLike[]): string[] {
  const haystack = normalise(pdfText);
  const issues: string[] = [];
  for (const role of roles) {
    const period = periodLabel(role.start, role.end, "long");
    const checks: Array<[string, string]> = [
      ["employer", role.employer],
      ["role", role.role],
      ["period", period],
    ];
    for (const [kind, value] of checks) {
      if (!haystack.includes(normalise(value))) {
        issues.push(`${role.id}: ${kind} "${value}" not found in resume PDF`);
      }
    }
  }
  return issues;
}

function extractText(pdfPath: string): string {
  try {
    return execFileSync("pdftotext", ["-layout", pdfPath, "-"], { encoding: "utf8" });
  } catch (error) {
    throw new Error(
      `pdftotext failed (install poppler-utils): ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function main() {
  const root = process.cwd();
  const pdfPath = path.join(root, "public", "resume.pdf");
  const yamlPath = path.join(root, "content", "experience.yaml");
  if (!fs.existsSync(pdfPath)) {
    console.error(`Missing ${pdfPath}`);
    process.exit(1);
  }
  const doc = parse(fs.readFileSync(yamlPath, "utf8")) as { roles: RoleLike[] };
  const text = extractText(pdfPath);
  const issues = compare(text, doc.roles);
  for (const role of doc.roles) {
    const own = issues.filter((i) => i.startsWith(`${role.id}:`));
    console.log(own.length === 0 ? `OK   ${role.employer}` : `FAIL ${role.employer}`);
  }
  if (issues.length > 0) {
    console.error(`\n${issues.join("\n")}`);
    process.exit(1);
  }
  console.log(`\nAll ${doc.roles.length} roles match public/resume.pdf.`);
}

const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename ?? "");
if (isMain) main();
