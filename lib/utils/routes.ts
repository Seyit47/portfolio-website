/**
 * Groups routes that should feel like one page. Navigating within a group (for example
 * between `/projects` and `/projects/tag/dashboard`) keeps the scroll position and skips
 * the page-enter animation, so filtering reads as an in-place update rather than a page load.
 */
export function transitionKey(pathname: string): string {
  if (pathname === "/projects" || pathname.startsWith("/projects/tag/")) return "/projects";
  return pathname;
}

export function sameTransitionGroup(a: string, b: string): boolean {
  return transitionKey(a) === transitionKey(b);
}
