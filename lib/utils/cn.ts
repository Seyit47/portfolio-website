/** Joins class names, dropping falsy values. Small enough that tailwind-merge is unnecessary. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
