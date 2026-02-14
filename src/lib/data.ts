import type {
  BlogPost,
  CommandItem,
  NavItem,
  PdfResource,
  Photo,
  Project,
  Skill,
  TimelineItem,
  Video
} from "@/lib/types";

export const profile = {
  name: "Bigyan Sanjyal",
  username: "bigyan-svg",
  role: "BE Computer Engineering Student",
  location: "Kathmandu, Nepal",
  email: "bigyansanjyal56@gmail.com",
  avatar: "/images/bigyan.jpeg",
  heroImage:
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
  aboutImage:
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=1400&q=80",
  contactImage:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
  headline:
    "Designing cinematic digital products with clean architecture, measurable performance, and human-first UX.",
  intro:
    "I build full-stack experiences that feel premium on the surface and reliable at the core. I care about speed, accessibility, and long-term maintainability.",
  github: "https://github.com/bigyan-svg",
  linkedin: "https://linkedin.com/in/bigyan-svg",
  resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
  { label: "Admin UI", href: "/admin" }
];

export const homeSectionItems = [
  { id: "home", label: "Hero" },
  { id: "about-preview", label: "About Preview" },
  { id: "skills-preview", label: "Skills Snapshot" },
  { id: "projects-preview", label: "Projects Preview" },
  { id: "blog-preview", label: "Blog Preview" },
  { id: "contact-preview", label: "Contact CTA" }
] as const;

export const commandItems: CommandItem[] = [
  ...navItems.map((item) => ({
    id: `page-${item.href}`,
    label: item.label,
    href: item.href,
    group: "Pages" as const
  })),
  ...homeSectionItems.map((item) => ({
    id: `section-${item.id}`,
    label: `Home: ${item.label}`,
    href: `/#${item.id}`,
    group: "Sections" as const
  })),
  {
    id: "action-contact",
    label: "Quick Contact",
    href: "/contact",
    group: "Actions"
  }
];

export const skills: Skill[] = [
  { id: "sk-1", name: "Next.js", category: "Frontend", level: 92, highlight: "SSR + RSC" },
  { id: "sk-2", name: "TypeScript", category: "Frontend", level: 90, highlight: "Strict DX" },
  { id: "sk-3", name: "Tailwind CSS", category: "Frontend", level: 94, highlight: "Design systems" },
  { id: "sk-4", name: "Framer Motion", category: "Frontend", level: 84, highlight: "Motion architecture" },
  { id: "sk-5", name: "Node.js", category: "Backend", level: 88, highlight: "API design" },
  { id: "sk-6", name: "PostgreSQL", category: "Backend", level: 82, highlight: "Query tuning" },
  { id: "sk-7", name: "Prisma ORM", category: "Backend", level: 84, highlight: "Schema design" },
  { id: "sk-8", name: "Redis", category: "Backend", level: 72, highlight: "Caching" },
  { id: "sk-9", name: "Docker", category: "Cloud", level: 78, highlight: "Containerization" },
  { id: "sk-10", name: "Vercel", category: "Cloud", level: 88, highlight: "Edge deployment" },
  { id: "sk-11", name: "AWS Basics", category: "Cloud", level: 70, highlight: "Infra fundamentals" },
  { id: "sk-12", name: "Python", category: "Data", level: 79, highlight: "Automation" },
  { id: "sk-13", name: "GitHub Actions", category: "Tooling", level: 76, highlight: "CI pipelines" },
  { id: "sk-14", name: "Figma", category: "Tooling", level: 75, highlight: "Interface systems" }
];

export const timeline: TimelineItem[] = [
  {
    id: "tl-1",
    title: "BE in Computer Engineering",
    organization: "Tribhuvan University",
    start: "2022",
    end: "Present",
    type: "Education",
    description: "Focusing on systems, distributed computing, and full-stack product engineering."
  },
  {
    id: "tl-2",
    title: "Frontend Engineering Intern",
    organization: "Nimbus Labs",
    start: "2025",
    end: "2025",
    type: "Experience",
    description: "Built responsive dashboards and improved Lighthouse score from 74 to 95."
  },
  {
    id: "tl-3",
    title: "Open Source Contributor",
    organization: "Community Projects",
    start: "2024",
    end: "Present",
    type: "Experience",
    description: "Contributed bug fixes and docs for Next.js starter templates and UI kits."
  },
  {
    id: "tl-4",
    title: "Hackathon Finalist",
    organization: "Kathmandu HackFest",
    start: "2024",
    end: "2024",
    type: "Experience",
    description: "Shipped a smart mobility prototype with map intelligence and offline support."
  }
];

export const projects: Project[] = [
  {
    id: "pr-1",
    title: "Outversal Portfolio CMS",
    slug: "outversal-portfolio-cms",
    summary: "A cinematic portfolio with modular CMS-ready architecture and dynamic content zones.",
    description:
      "Built with Next.js App Router, strict TypeScript, and composable UI primitives. The interface blends motion-led storytelling with strong accessibility semantics.",
    type: "Web Platform",
    tech: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Prisma"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1400&q=80",
    role: "Product Engineer",
    status: "Live",
    featured: true,
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/bigyan-svg",
    highlights: [
      "Reusable design tokens across public and admin surfaces",
      "High-performance motion system with reduced-motion fallbacks",
      "SEO-safe content templates with modular sections"
    ]
  },
  {
    id: "pr-2",
    title: "SignalOps Monitor",
    slug: "signalops-monitor",
    summary: "Observability dashboard for distributed services with anomaly overlays.",
    description:
      "Designed a monitoring cockpit with real-time metrics, incident timeline, and alert triage workflows.",
    type: "Web Platform",
    tech: ["React", "Node.js", "WebSocket", "PostgreSQL"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
    role: "Full-Stack Engineer",
    status: "Prototype",
    featured: true,
    githubUrl: "https://github.com/bigyan-svg",
    highlights: [
      "Live telemetry stream with adaptive sampling",
      "Incident explorer with searchable traces",
      "Role-ready table and detail panel architecture"
    ]
  },
  {
    id: "pr-3",
    title: "CampusFlow Mobile",
    slug: "campusflow-mobile",
    summary: "Student productivity app with routines, attendance insights, and note sync.",
    description:
      "Developed cross-device UI patterns and modular APIs to coordinate timetable events and task prioritization.",
    type: "Mobile",
    tech: ["React Native", "Expo", "TypeScript", "Supabase"],
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1400&q=80",
    role: "Frontend Engineer",
    status: "Live",
    featured: false,
    liveUrl: "https://example.com",
    highlights: [
      "Battery-efficient background sync",
      "Semantic color system with accessibility presets",
      "Offline-first task pipeline"
    ]
  },
  {
    id: "pr-4",
    title: "Neural Resume Scorer",
    slug: "neural-resume-scorer",
    summary: "AI-assisted resume analysis tool with actionable scoring feedback.",
    description:
      "Implemented a recruiter-friendly scoring interface with transparent metrics and export-ready recommendations.",
    type: "AI",
    tech: ["Next.js", "Python", "FastAPI", "OpenAI"],
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    role: "ML Product Engineer",
    status: "Research",
    featured: true,
    githubUrl: "https://github.com/bigyan-svg",
    highlights: [
      "Explainable scoring rubric",
      "Secure upload and analysis pipeline",
      "Prompt orchestration with cost controls"
    ]
  },
  {
    id: "pr-5",
    title: "DeployForge CLI",
    slug: "deployforge-cli",
    summary: "CLI toolkit for environment setup and release automation.",
    description:
      "Created opinionated release scripts, quality gates, and cloud deploy presets for student teams.",
    type: "DevOps",
    tech: ["Node.js", "TypeScript", "Docker", "GitHub Actions"],
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80",
    role: "Tooling Engineer",
    status: "Live",
    featured: false,
    githubUrl: "https://github.com/bigyan-svg",
    highlights: [
      "One-command project bootstrap",
      "Integrated lint/test/release workflow",
      "Cross-platform shell compatibility"
    ]
  },
  {
    id: "pr-6",
    title: "VisionBoard AR",
    slug: "visionboard-ar",
    summary: "Augmented reality concept for immersive portfolio storytelling.",
    description:
      "Prototyped interactive 3D overlays for project demos with narrative anchors and voice guidance.",
    type: "AI",
    tech: ["Unity", "C#", "ARCore"],
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    role: "Prototype Engineer",
    status: "Prototype",
    featured: false,
    highlights: [
      "Spatial UI experiments",
      "Gesture-based interaction mapping",
      "Narrative flow tuned for recruiters"
    ]
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: "bl-1",
    slug: "designing-cinematic-dev-portfolios",
    title: "Designing Cinematic Developer Portfolios That Still Hire",
    excerpt:
      "How to create visual wow-factor without sacrificing recruiter readability and credibility.",
    category: "Design",
    tags: ["portfolio", "ux", "motion"],
    readingTime: "6 min read",
    publishedAt: "2026-01-18",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    content: `Great portfolios are not poster art. They are conversion journeys.

Start with information clarity: role, outcomes, and credibility indicators should be visible in the first screen.

Then layer motion where it adds orientation and emotion, not distraction.

\`\`\`ts
const rule = (animation: Motion) =>
  animation.supportsUnderstanding ? "keep" : "remove";
\`\`\`

Recruiters skim first, dive later. Build for both.`
  },
  {
    id: "bl-2",
    slug: "scaling-nextjs-ui-systems",
    title: "Scaling Next.js UI Systems with Token Discipline",
    excerpt:
      "A practical method to keep design quality consistent while adding pages fast.",
    category: "Architecture",
    tags: ["nextjs", "design-system", "frontend"],
    readingTime: "8 min read",
    publishedAt: "2025-12-01",
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80",
    content:
      "Tokens are interface contracts. If your border radius, spacing, and colors are arbitrary per page, polish collapses as you scale."
  },
  {
    id: "bl-3",
    slug: "backend-thinking-for-frontend-devs",
    title: "Backend Thinking for Frontend Engineers",
    excerpt:
      "Why UI quality improves when frontend developers think in data contracts and state invariants.",
    category: "Engineering",
    tags: ["frontend", "backend", "architecture"],
    readingTime: "7 min read",
    publishedAt: "2025-10-14",
    coverImage:
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1400&q=80",
    content:
      "Frontend architecture becomes robust when you model failure states first: empty, loading, partial data, and stale sessions."
  },
  {
    id: "bl-4",
    slug: "internship-lessons-from-real-products",
    title: "Internship Lessons from Real Product Teams",
    excerpt:
      "What changed in my engineering mindset after shipping inside a cross-functional team.",
    category: "Career",
    tags: ["career", "internship", "growth"],
    readingTime: "5 min read",
    publishedAt: "2025-09-05",
    coverImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
    content:
      "The best feedback loop is production reality: user tickets, release pressure, and measurable outcomes."
  },
  {
    id: "bl-5",
    slug: "shipping-motion-without-killing-performance",
    title: "Shipping Motion Without Killing Performance",
    excerpt:
      "Framer Motion patterns that feel rich while staying smooth on low-end devices.",
    category: "Engineering",
    tags: ["framer-motion", "performance"],
    readingTime: "9 min read",
    publishedAt: "2025-08-20",
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    content:
      "Animate transform and opacity first. Avoid expensive filters in large lists. Respect reduced motion by default."
  }
];

export const photos: Photo[] = [
  {
    id: "ph-1",
    title: "Night Build Session",
    image:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80",
    caption: "Late-night sprint while polishing interaction details."
  },
  {
    id: "ph-2",
    title: "Hackathon Stage",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    caption: "Presenting product architecture to judges."
  },
  {
    id: "ph-3",
    title: "Desk Setup",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    caption: "My focused workspace for design and development."
  },
  {
    id: "ph-4",
    title: "Team Whiteboard",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    caption: "Mapping API flows and UI states with the team."
  },
  {
    id: "ph-5",
    title: "Campus Innovation Lab",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6dcef2f8?auto=format&fit=crop&w=1200&q=80",
    caption: "Testing interaction prototypes with classmates."
  },
  {
    id: "ph-6",
    title: "Code Review Session",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    caption: "Reviewing performance traces before release."
  }
];

export const videos: Video[] = [
  {
    id: "vd-1",
    title: "Portfolio Walkthrough",
    platform: "YouTube",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    duration: "03:24"
  },
  {
    id: "vd-2",
    title: "Dashboard Animation System",
    platform: "YouTube",
    url: "https://www.youtube.com/embed/kY8fswJelXQ",
    thumbnail: "https://i.ytimg.com/vi/kY8fswJelXQ/hqdefault.jpg",
    duration: "07:10"
  },
  {
    id: "vd-3",
    title: "Project Architecture Talk",
    platform: "Vimeo",
    url: "https://player.vimeo.com/video/76979871",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    duration: "11:42"
  }
];

export const pdfResources: PdfResource[] = [
  {
    id: "pdf-1",
    title: "Bigyan Sanjyal Resume",
    type: "Resume",
    description: "Current one-page resume with project outcomes and skills summary.",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-2",
    title: "Cloud Fundamentals Certificate",
    type: "Certificate",
    description: "Verified coursework in cloud architecture and deployment workflows.",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "pdf-3",
    title: "Realtime Dashboard Case Study",
    type: "Report",
    description: "Engineering report covering observability dashboard design decisions.",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

export const siteStats = {
  projects: projects.length,
  skills: skills.length,
  blogs: blogPosts.length
};

export const imageBlurDataUrl =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIHZpZXdCb3g9JzAgMCAxNiAxNicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nMTYnIGZpbGw9JyNlZWYzZmYnLz48L3N2Zz4=";
