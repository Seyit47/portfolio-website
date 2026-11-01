/**
 * Minimal content fixtures shaped like the Content Collections output.
 * Used by unit tests through vi.mock("content-collections").
 */
export const profileFixture = {
  name: "Seyit Geldiyev",
  alternateNames: ["Seyitmyrat Geldiyew"],
  title: "Middle+ Software Engineer",
  tagline:
    "I build fast, accessible dashboards and SaaS front-ends that ship on time and score 95+.",
  summary: "Summary paragraph.",
  location: { city: "Ashgabat", country: "Turkmenistan" },
  availability: { status: "open" as const, label: "Open to new opportunities" },
  email: "seyitbu1111@gmail.com",
  links: {
    github: "https://github.com/Seyit47",
    linkedin: "https://www.linkedin.com/in/seyitgeldiyev-55a17b230",
  },
  resume: { path: "/resume.pdf", filename: "Seyit-Geldiyev-Resume.pdf" },
  languages: [{ name: "English", level: "Professional" }],
  certifications: [],
  seo: {
    siteName: "Seyit Geldiyev",
    defaultDescription: "Portfolio of Seyit Geldiyev.",
    ogImageAlt: "Seyit Geldiyev, Middle+ Software Engineer",
  },
  _meta: {
    filePath: "profile.yaml",
    fileName: "profile.yaml",
    directory: ".",
    path: "profile",
    extension: "yaml",
  },
};

export const experienceFixture = {
  roles: [
    {
      id: "kinestex",
      employer: "KinesteX",
      role: "Software Developer",
      start: "2025-05",
      end: "2026-06",
      location: "Dubai",
      remote: true,
      highlights: ["Built a dashboard."],
      relatedProjects: ["kinestex-dashboard"],
    },
    {
      id: "ynamly-belentlik",
      employer: "Ynamly Belentlik",
      role: "Frontend Developer",
      start: "2022-12",
      end: "2026-06",
      location: "Ashgabat",
      remote: false,
      highlights: ["Improved Lighthouse."],
      relatedProjects: [],
    },
    {
      id: "foreach-partners",
      employer: "ForEach Partners",
      role: "Frontend Developer",
      start: "2024-12",
      end: "2025-03",
      location: "Remote",
      remote: true,
      highlights: ["Figma to Vue."],
      relatedProjects: [],
    },
    {
      id: "datacorda",
      employer: "Datacorda",
      role: "Frontend Developer",
      start: "2023-06",
      end: "2023-10",
      location: "United States",
      remote: true,
      highlights: ["Nuxt dashboard."],
      relatedProjects: ["datacorda"],
    },
    {
      id: "belli-creative",
      employer: "Belli Creative",
      role: "Frontend Developer",
      start: "2020-06",
      end: "2022-11",
      location: "Ashgabat",
      remote: false,
      highlights: ["CV maker."],
      relatedProjects: [],
    },
  ],
  education: [
    {
      institution: "Institute of Telecommunications and Informatics of Turkmenistan",
      degree: "Engineer's degree",
      field: "Information Security Engineering",
      start: "2021-09",
      end: "2026-06",
    },
  ],
  _meta: {
    filePath: "experience.yaml",
    fileName: "experience.yaml",
    directory: ".",
    path: "experience",
    extension: "yaml",
  },
};

export const skillsFixture = {
  groups: [
    {
      id: "frameworks",
      name: "Front-end frameworks",
      order: 2,
      skills: [{ name: "Next.js", level: "primary" as const, tags: ["dashboard"] }],
    },
    {
      id: "ui",
      name: "Styling",
      order: 1,
      skills: [{ name: "Tailwind", level: "working" as const, tags: [] }],
    },
  ],
  _meta: {
    filePath: "skills.yaml",
    fileName: "skills.yaml",
    directory: ".",
    path: "skills",
    extension: "yaml",
  },
};

export const tagsFixture = {
  tags: [
    { slug: "dashboard", label: "Dashboard" },
    { slug: "full-stack", label: "Full-stack" },
    { slug: "media", label: "Media" },
    { slug: "tooling", label: "Tooling" },
  ],
  _meta: {
    filePath: "tags.yaml",
    fileName: "tags.yaml",
    directory: ".",
    path: "tags",
    extension: "yaml",
  },
};

const baseProject = {
  role: "Developer",
  period: "2026",
  problem: "Problem.",
  solution: "Solution.",
  highlights: ["One.", "Two."],
  outcome: "Outcome.",
  metrics: [],
  order: undefined as number | undefined,
  links: {},
  visuals: [],
  published: true,
  mdx: "",
};

export const projectsFixture = [
  {
    ...baseProject,
    slug: "audit-app",
    title: "Audit App",
    year: 2026,
    type: "Full-stack platform",
    summary: "A".repeat(90),
    tags: ["full-stack", "dashboard"],
    featured: true,
    order: 1,
    links: {
      live: "https://audit-app-steel.vercel.app",
      source: "https://github.com/Seyit47/audit-app",
    },
    employer: undefined as string | undefined,
    _meta: {
      filePath: "projects/audit-app.mdx",
      fileName: "audit-app.mdx",
      directory: "projects",
      path: "projects/audit-app",
      extension: "mdx",
    },
  },
  {
    ...baseProject,
    slug: "sdd-navigator-dashboard",
    title: "SDD Navigator Dashboard",
    year: 2026,
    type: "Dashboard",
    summary: "B".repeat(90),
    tags: ["dashboard", "tooling"],
    featured: true,
    order: 2,
    employer: undefined as string | undefined,
    _meta: {
      filePath: "projects/sdd-navigator-dashboard.mdx",
      fileName: "sdd-navigator-dashboard.mdx",
      directory: "projects",
      path: "projects/sdd-navigator-dashboard",
      extension: "mdx",
    },
  },
  {
    ...baseProject,
    slug: "instant-play-video-navigator",
    title: "Instant Play Video Navigator",
    year: 2025,
    type: "Media app",
    summary: "C".repeat(90),
    tags: ["media"],
    featured: true,
    employer: undefined as string | undefined,
    _meta: {
      filePath: "projects/instant-play-video-navigator.mdx",
      fileName: "instant-play-video-navigator.mdx",
      directory: "projects",
      path: "projects/instant-play-video-navigator",
      extension: "mdx",
    },
  },
  {
    ...baseProject,
    slug: "datacorda",
    title: "Datacorda Dashboard",
    year: 2023,
    type: "SaaS dashboard",
    summary: "D".repeat(90),
    tags: ["dashboard"],
    featured: false,
    employer: "datacorda",
    _meta: {
      filePath: "projects/datacorda.mdx",
      fileName: "datacorda.mdx",
      directory: "projects",
      path: "projects/datacorda",
      extension: "mdx",
    },
  },
  {
    ...baseProject,
    slug: "kinestex-dashboard",
    title: "KinesteX Dashboard",
    year: 2025,
    type: "Data dashboard",
    summary: "E".repeat(90),
    tags: ["dashboard"],
    featured: false,
    employer: "kinestex",
    _meta: {
      filePath: "projects/kinestex-dashboard.mdx",
      fileName: "kinestex-dashboard.mdx",
      directory: "projects",
      path: "projects/kinestex-dashboard",
      extension: "mdx",
    },
  },
  {
    ...baseProject,
    slug: "draft",
    title: "Draft project",
    year: 2026,
    type: "Draft",
    summary: "F".repeat(90),
    tags: ["tooling"],
    featured: false,
    published: false,
    employer: undefined as string | undefined,
    _meta: {
      filePath: "projects/draft.mdx",
      fileName: "draft.mdx",
      directory: "projects",
      path: "projects/draft",
      extension: "mdx",
    },
  },
];

export function mockContentCollections() {
  return {
    allProfiles: [profileFixture],
    allExperiences: [experienceFixture],
    allSkills: [skillsFixture],
    allTags: [tagsFixture],
    allProjects: projectsFixture,
  };
}
