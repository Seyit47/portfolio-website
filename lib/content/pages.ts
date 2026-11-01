/** Static page registry shared by the header, palette and sitemap. Safe for client components. */
export const PAGES: Array<{ label: string; href: string; hint: string }> = [
  { label: "Home", href: "/", hint: "Start here" },
  { label: "Projects", href: "/projects", hint: "Case studies" },
  { label: "Experience", href: "/experience", hint: "Roles, education, skills" },
  { label: "Contact", href: "/contact", hint: "Get in touch" },
];
