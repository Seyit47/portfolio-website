# Feature Specification: Portfolio Website

**Feature Branch**: `001-portfolio-website`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "we need to build my portfolio website that is very advanced and highlighting ... you have all required info about me and my projects so get from github and linkedin or my resume i provided"

## Profile Source Data

Content below is derived from the provided resume (LinkedIn export,
`geldiyev-seyitmyrat-resume.pdf`) and the public GitHub profile `Seyit47`.
It is the single source of truth for the site's initial content.

**Owner**: Seyit Geldiyev, Middle+ Software Engineer, Ashgabat, Turkmenistan.
Contact: seyitbu1111@gmail.com, GitHub `Seyit47`, LinkedIn `seyitgeldiyev-55a17b230`.

**Positioning**: Frontend-leaning full-stack engineer with six years of shipping
dashboards, SaaS front-ends and content sites. Strengths: pixel-perfect UI from
design files, performance work (Lighthouse 68 to 95+, TTI reduced 40%),
accessible dark-mode interfaces, CI/CD and cloud deployment, and
specification-driven development with AI-assisted tooling.

**Experience (newest first)**:

| Employer | Role | Period | Location | Highlights |
|----------|------|--------|----------|------------|
| KinesteX (AI personal trainer, digital health) | Software Developer | May 2025 - Jun 2026 | Dubai, UAE | Data-driven dashboard with server-rendered pages, reusable tables/cards/charts, backend logic colocated with the front-end, automated preview and production deployments |
| Ynamly Belentlik | Frontend Developer | Dec 2022 - Jun 2026 | Ashgabat | Pixel-perfect UI with UX team, dark mode and accessibility, reusable component library, third-party API integrations, Lighthouse 68 to 95+ site-wide |
| ForEach Partners | Frontend Developer | Dec 2024 - Mar 2025 | Remote | Figma-to-component translation, QA support, feature and UI fixes |
| Datacorda | Frontend Developer | Jun 2023 - Oct 2023 | USA (remote) | Multi-tenant dashboard, media upload to cloud storage, CI/CD and hosting, DNS and environments, delivery speed +30% |
| Belli Creative | Frontend Developer | Jun 2020 - Nov 2022 | Ashgabat | CV maker with live preview and PDF export, SVG/PNG badge generator, CMS-free landing templates, legacy framework migration, TTI reduced 40% |

**Education**: Institute of Telecommunications and Informatics of Turkmenistan,
Engineer's degree in Information Security Engineering, Sep 2021 - Jun 2026.

**Languages**: Turkmen (native), Turkish (full professional), English and
Russian (professional working). English certified C2 (EF SET 71/100).

**Certifications**: JavaScript Algorithms and Data Structures; JavaScript
(Intermediate); CSS; Introduction to Cybersecurity; EF SET English C2.

**Skill groups (for the skills section)**: Front-end frameworks and
server rendering; component systems and utility-first styling; state and
data fetching; backend-in-frontend APIs; cloud, CI/CD and hosting;
containers and server administration; scripting languages; design-to-code
workflow; AI-assisted and specification-driven development.

**Projects (from GitHub, newest first)**:

| Project | Year | Type | Summary | Links |
|---------|------|------|---------|-------|
| Audit App | 2026 | Full-stack platform, monorepo (API, admin web, mobile) | Retail-execution platform: field agents follow daily routes and record GPS-checked photo audits; admins manage shops, agents and products, watch agents live on a map, review photos and export reports. Built pixel-perfect from a Figma source with a documented design-gap protocol. | Live demo, source |
| SDD Navigator Dashboard | 2026 | Dashboard | Specification-driven-development coverage dashboard: which requirements are implemented, tested or unaddressed; searchable, filterable, URL-shareable requirement table; requirement detail with code annotations; orphan detection; light/dark theme; mock and live data modes. | Live demo, source |
| MAX Web Chat | 2026 | Browser client | Backend-less browser chat client for the MAX messenger via a public messaging API, with the messenger's own UI kit. | Live demo, source |
| Canvas Challenge | 2026 | Interactive canvas | Node-based canvas editor with multiple workspaces persisted in the URL and locally, unified request/error handling layer. | Source |
| Checkout Challenge | 2026 | E-commerce flow | Store checkout flow against a provided API, with documented API integration and evaluation criteria. | Source |
| Instant Play Video Navigator | 2025 | Media app | Mobile-first video preloader that tracks download progress so playback starts instantly; uses a service worker for caching. | Source |
| Datacorda Dashboard and Website | 2023-2024 | SaaS dashboard + marketing site | Multi-tenant analytics dashboard and its public website, server-rendered with cloud media storage and automated deployments. | Source |
| CV Maker, Badge Generator, Landing Templates | 2020-2022 | Client tools (Belli Creative) | Form-driven CV builder with PDF export; SVG/PNG name-badge designer; CMS-free dynamic landing templates for startups. | No public source; case-study only |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Impression Landing (Priority: P1)

A recruiter or potential client opens the site on their phone from a LinkedIn
or GitHub link. Within the first screen they learn who Seyit is, what he does
best, and that he is a credible senior-leaning engineer. Scrolling down they
see his best three to four projects with visuals and outcomes, and clear
routes to his work, his experience and how to contact him.

**Why this priority**: This is the entire reason the site exists. If a
visitor cannot grasp identity, strengths and proof of work in under thirty
seconds, nothing else on the site matters.

**Independent Test**: Deploy only the landing page with hero, featured
projects, a short "about" strip and a footer with contact links. A visitor
can judge Seyit's fit for a role without visiting any other page.

**Acceptance Scenarios**:

1. **Given** a visitor opens the home page on a 360 px wide phone, **When** the
   page finishes loading, **Then** the first screen shows the owner's name,
   role title, one-sentence value proposition, location/availability, and
   primary actions for "View work" and "Contact", with no horizontal scroll.
2. **Given** the home page is loaded, **When** the visitor scrolls, **Then**
   they see a featured-projects section with at least three projects, each
   showing a visual, title, one-line outcome, technology tags and a link to
   its detail page.
3. **Given** the home page is loaded, **When** the visitor reaches the end,
   **Then** they see a contact section with email, GitHub and LinkedIn links
   and a resume download, and every link opens the correct destination.
4. **Given** a visitor shares the home page URL on LinkedIn, Telegram or X,
   **When** the preview card renders, **Then** it shows a custom title,
   description and branded preview image.

---

### User Story 2 - Project Case Studies (Priority: P2)

A hiring manager wants evidence of depth. From the featured list or the
projects index they open a project and read a structured case study: the
problem, Seyit's role, what was built, key decisions, the outcome, visuals,
and links to the live demo and source where they exist.

**Why this priority**: Case studies are the proof behind the landing-page
claims. They convert interest into a conversation.

**Independent Test**: Publish the projects index and at least four case-study
pages from the project list above. A visitor can browse, open and read each
one and reach every live demo and repository link.

**Acceptance Scenarios**:

1. **Given** the projects index, **When** it loads, **Then** every published
   project appears with title, year, type, summary and tags, ordered newest
   first, and each card leads to its own page.
2. **Given** the projects index, **When** the visitor filters by a tag (for
   example "dashboard" or "full-stack"), **Then** only matching projects
   remain, the filter is reflected in the page address, and reloading or
   sharing that address restores the same view.
3. **Given** a project page, **When** it loads, **Then** it presents, in
   order: hero visual, summary, role and period, problem, solution,
   highlights or key decisions, outcome/metrics, technology tags, and
   external links (live demo and/or source) when available.
4. **Given** a project without a public repository (for example the Belli
   Creative tools), **When** its page loads, **Then** no broken or empty
   "source" link is shown and the page states the work is described as a
   case study only.
5. **Given** a project page, **When** the visitor reaches the end, **Then**
   they can move to the previous or next project without returning to the
   index.

---

### User Story 3 - Experience Timeline and Skills (Priority: P3)

A recruiter checks career history and skill fit. They see an interactive
timeline of the five roles plus education, can expand any role to read its
highlights, and see skills grouped by area with an indication of depth. They
can also download the resume as a PDF.

**Why this priority**: Recruiters screen on history and keywords. Making this
scannable and matching the resume avoids back-and-forth.

**Independent Test**: Publish the "Experience" section (or page) with the
timeline, skills groups and resume download. A recruiter can verify role
dates, employers and skills without opening the PDF.

**Acceptance Scenarios**:

1. **Given** the experience section, **When** it loads, **Then** all five
   roles and the degree appear in chronological order with employer, title,
   period, location, and overlapping roles are visibly represented as
   overlapping.
2. **Given** a role entry, **When** the visitor activates it (click, tap or
   keyboard), **Then** its highlight bullets expand in place and the
   expansion is announced to assistive technology.
3. **Given** the skills section, **When** it loads, **Then** skills are
   grouped by area as listed in Profile Source Data, and each group shows
   its items with a depth indicator (for example primary, working, familiar).
4. **Given** any page, **When** the visitor activates "Download resume",
   **Then** a PDF resume is delivered whose content matches the data on the
   site.

---

### User Story 4 - Contact and Hire (Priority: P4)

A visitor decides to reach out. They can copy the email, open LinkedIn or
GitHub, or send a short message through an on-site form stating their name,
email and message. They receive confirmation that the message was sent.

**Why this priority**: Contact is the conversion event, but direct links
already satisfy it in Story 1. The form adds convenience and should not block
launch.

**Independent Test**: Publish the contact page with links and the form. A
tester submits a message and the owner receives it; invalid submissions are
rejected with helpful messages; automated spam is blocked.

**Acceptance Scenarios**:

1. **Given** the contact form, **When** the visitor submits a valid name,
   email and message, **Then** they see an on-page success confirmation
   within three seconds and the owner receives the message by email.
2. **Given** the contact form, **When** the visitor submits an empty or
   malformed email or an empty message, **Then** the form shows a specific
   inline error next to the offending field and nothing is sent.
3. **Given** an automated submission (bot), **When** it posts to the form,
   **Then** it is silently rejected and the owner receives nothing.
4. **Given** the contact form, **When** the sending service fails, **Then**
   the visitor sees an error that offers the direct email address as a
   fallback.

---

### User Story 5 - Signature "Advanced" Experience (Priority: P5)

A fellow engineer or design-minded visitor explores the site for craft. They
notice a distinctive animated hero, smooth transitions between pages,
scroll-driven reveals, a light/dark theme that follows their system and can be
toggled, and a keyboard command palette to jump anywhere. None of it gets in
the way: with reduced-motion enabled, or without scripts, everything still
reads and works.

**Why this priority**: This differentiates the site from a template and
demonstrates front-end craft, which is Seyit's core selling point. It layers
on top of the content stories and must never degrade them.

**Independent Test**: With Stories 1 to 3 in place, enable the polish layer
and verify each enhancement works, respects reduced-motion, and the site
still passes performance and accessibility budgets.

**Acceptance Scenarios**:

1. **Given** the home page, **When** it loads with motion allowed, **Then**
   the hero plays an introductory animation that completes within two
   seconds and never delays the display of the name, role and primary
   actions.
2. **Given** the operating system prefers reduced motion, **When** any page
   loads, **Then** no element moves except simple fades, and all content and
   navigation remain fully functional.
3. **Given** any page, **When** the visitor presses the command-palette
   shortcut or activates its button, **Then** a searchable list of pages,
   projects and external links appears and can be operated entirely by
   keyboard.
4. **Given** the system theme is dark, **When** the site first loads,
   **Then** it renders in the dark theme without a flash of the light theme,
   and a manual toggle persists the visitor's choice across visits.
5. **Given** scripts are disabled, **When** the visitor opens any page,
   **Then** all text content, images and navigation links render and work.

---

### Edge Cases

- A project has a live-demo link whose host is down: the page still renders
  and the link is shown with its destination; no content depends on the
  remote site being reachable.
- A project has no visual asset yet: a branded placeholder is shown instead
  of a broken image or empty box.
- Very long project titles or employer names on a 360 px screen wrap
  cleanly without overflow.
- The visitor is on a slow 3G connection: the first screen's text and
  primary actions are visible before any heavy visual or animation assets
  arrive.
- The visitor navigates with a screen reader: skip link, landmarks, heading
  order and link names make every section reachable and understandable.
- The resume PDF is updated: the site's data and the PDF do not drift; the
  build fails or warns if the two disagree on roles or dates.
- A filter tag in the URL does not exist: the index shows all projects and
  an unobtrusive note that the filter was not recognised.
- The contact form is submitted twice quickly: the second submission is
  ignored or debounced; the owner does not receive duplicates.
- A visitor opens a project URL that no longer exists: a designed "not
  found" page offers the projects index and home.

## Requirements *(mandatory)*

### Functional Requirements

**Content and structure**

- **FR-001**: The site MUST provide these destinations: Home, Projects index,
  one page per project, Experience (timeline + skills + education), Contact,
  and a designed "not found" page.
- **FR-002**: The Home page MUST show, within the first screen on a 360 px
  wide viewport, the owner's name, role, one-sentence value proposition,
  location, availability status, and primary actions to view work and to
  contact.
- **FR-003**: The Home page MUST feature at least three and at most four
  highlighted projects selected by an explicit "featured" flag in the content
  data; initial featured set: Audit App, SDD Navigator Dashboard, Datacorda
  Dashboard, Instant Play Video Navigator.
- **FR-004**: All profile content (bio, roles, education, skills, projects,
  certifications, links) MUST live in structured content files separate from
  presentation, and adding or editing a project MUST require no change to
  layout or component code.
- **FR-005**: Each project record MUST include: title, slug, year, type,
  summary, role, period, problem, solution, highlights, outcome, tags,
  featured flag, optional live-demo link, optional source link, and one or
  more visuals or a placeholder flag.
- **FR-006**: The Projects index MUST list every published project newest
  first and MUST support filtering by tag, with the active filter reflected
  in the page address.
- **FR-007**: Project pages MUST present content in the fixed order defined
  in User Story 2 and MUST include previous/next navigation.
- **FR-008**: Where a project has no public source or no live demo, the
  corresponding link MUST be omitted rather than rendered empty or broken.
- **FR-009**: The Experience section MUST render all roles from the Profile
  Source Data in chronological order, visibly represent overlapping periods,
  and allow each role to expand to show its highlights.
- **FR-010**: The Skills section MUST group skills by the areas listed in
  Profile Source Data and show a depth indicator per skill.
- **FR-011**: The site MUST offer a resume download as a PDF from the Home
  page, Experience section and Contact page, and the delivered PDF MUST match
  the roles, dates and employers shown on the site.
- **FR-012**: The Contact page and the Home footer MUST expose email, GitHub
  and LinkedIn links, each opening the correct destination; external links
  MUST open in a new tab with clear labelling.

**Contact form**

- **FR-013**: The Contact page MUST include a form with name, email and
  message fields; it MUST validate inputs before and after submission,
  reject malformed email and empty required fields with inline messages, and
  deliver valid messages to the owner's email.
- **FR-014**: The contact form MUST include non-interactive spam protection
  (for example a honeypot and submission-timing check) and MUST rate-limit
  repeated submissions from the same visitor.
- **FR-015**: On delivery failure the form MUST show an error that includes
  the direct email address as a fallback.

**Experience layer**

- **FR-016**: The site MUST provide light and dark themes, default to the
  visitor's system preference without a visible flash of the wrong theme, and
  persist a manual override across visits.
- **FR-017**: The site MUST provide a keyboard-operable command palette
  listing pages, projects and external links, searchable by typing, opened
  by a documented shortcut and by a visible control.
- **FR-018**: The Home hero MUST include a signature introductory animation
  that completes within two seconds and never delays the display of the
  name, role or primary actions.
- **FR-019**: Page transitions and scroll-triggered reveals MUST be used
  consistently across the site and MUST be disabled or reduced to fades
  when the visitor prefers reduced motion.
- **FR-020**: All primary content and navigation MUST render and function
  without scripts; animations, palette and theme toggle are enhancements.

**Discoverability and sharing**

- **FR-021**: Every page MUST have a unique title and description, canonical
  address, and social preview metadata with a branded preview image;
  project pages MUST use a project-specific preview image or a generated one
  carrying the project title.
- **FR-022**: The site MUST publish a sitemap and robots directives and MUST
  emit structured data describing the owner as a person and each project as
  a creative work.
- **FR-023**: Unknown addresses MUST return a designed "not found" page with
  links to Home and Projects, and MUST signal "not found" to crawlers.

**Quality**

- **FR-024**: Every page MUST be fully operable by keyboard with visible
  focus, MUST provide a skip link and landmark regions, and MUST meet WCAG
  2.2 AA including colour contrast in both themes.
- **FR-025**: Every image and visual MUST have a meaningful text alternative
  or be marked decorative, and project visuals MUST be served sized for the
  viewport and lazy-loaded below the fold.
- **FR-026**: The site MUST be mobile-first and verified at 360, 768, 1024
  and 1440 px widths with no horizontal scrolling.
- **FR-027**: Any visitor analytics MUST be privacy-preserving and cookieless,
  and the site MUST NOT show a cookie banner because it MUST NOT set tracking
  cookies.

### Key Entities

- **Owner Profile**: name, title, tagline, location, availability status,
  summary, contact links (email, GitHub, LinkedIn), resume file reference,
  spoken languages, certifications.
- **Project**: see FR-005; belongs to the owner; has many Tags; may reference
  an Experience entry (the employer for which it was built).
- **Experience Entry**: employer, role title, period (start, end or present),
  location, highlight bullets, related projects.
- **Education Entry**: institution, degree, field, period.
- **Skill Group**: area name, ordered Skills each with name and depth level.
- **Tag**: short label used for filtering projects (for example dashboard,
  full-stack, mobile, performance).
- **Contact Message**: sender name, sender email, message body, submitted
  time, spam-check result; transient, delivered by email, not stored on the
  site beyond delivery and rate-limiting needs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can state the owner's name, role and one
  strength within 10 seconds of the Home page loading, verified with five
  unmoderated testers on mobile.
- **SC-002**: From Home, a visitor can reach a specific project's case study
  and its live demo in at most three interactions.
- **SC-003**: The Home page becomes readable and actionable (name, role,
  primary actions visible and tappable) within 2.5 seconds on a mid-tier
  phone over a throttled mobile connection, at the 75th percentile.
- **SC-004**: Each page scores at least 95 for performance, accessibility,
  best practices and SEO in a standard page-quality audit on mobile.
- **SC-005**: Automated accessibility scans report zero serious or critical
  issues on every page in both themes.
- **SC-006**: With reduced motion enabled, 100% of content and navigation
  remains available; a tester can complete every user story without any
  animation.
- **SC-007**: Social previews render the correct title, description and image
  on LinkedIn, Telegram and X for Home and for every project page.
- **SC-008**: Valid contact-form submissions reach the owner's inbox within
  one minute in 99% of cases, and zero bot submissions reach the inbox during
  a one-week test window.
- **SC-009**: Adding a new project requires editing exactly one content file
  and adding its visuals; the new project appears on the index, in the
  palette and in the sitemap with no code change.
- **SC-010**: Every piece of career data on the site (employers, titles,
  periods) matches the resume PDF with zero discrepancies.

## Assumptions

- The display name is "Seyit Geldiyev" as on the resume; the GitHub profile's
  "Seyitmyrat Geldiyew" is treated as a variant and may be mentioned in
  structured data as an alternate name.
- The resume shows all roles ending June 2026 and today is November 2026, so
  the availability status defaults to "Open to new opportunities"; the owner
  can change this single field in content data.
- The site is in English only. Turkmen, Russian and Turkish are listed as
  spoken languages but no translated versions are in scope for this release.
- The initial featured projects are those with live demos or the strongest
  outcomes: Audit App, SDD Navigator Dashboard, Datacorda Dashboard and
  Instant Play Video Navigator. The owner can change the featured flags.
- Belli Creative tools (CV maker, badge generator, landing templates) and the
  KinesteX dashboard have no public source; they appear as case studies
  without source links, using descriptions from the resume.
- Project visuals (screenshots or short recordings) will be supplied by the
  owner or captured from the live demos; until then a branded placeholder is
  used, and a missing visual never blocks a page from publishing.
- Links to live demos use the addresses recorded on GitHub at the time of
  writing; the owner can update them in content data.
- The resume PDF served for download is the provided file; regenerating the
  PDF from site data is out of scope for this release.
- A blog or writing section, multilingual content, authenticated areas, and
  a content management interface are out of scope.
- Contact-form delivery relies on an email-sending service chosen during
  planning; the owner's inbox is seyitbu1111@gmail.com.
- The site will be hosted on a platform that supports preview deployments
  per change and automatic production deployment, consistent with the
  project constitution's workflow.
