export type SkillCategory = "Frontend" | "Backend" | "Cloud" | "Data" | "Tooling";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  highlight?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  type: "Web Platform" | "Mobile" | "AI" | "DevOps";
  tech: string[];
  year: string;
  image: string;
  role: string;
  status: "Live" | "Prototype" | "Research";
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
};

export type TimelineItem = {
  id: string;
  title: string;
  organization: string;
  start: string;
  end: string;
  type: "Education" | "Experience";
  description: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: "Engineering" | "Design" | "Career" | "Architecture";
  tags: string[];
  readingTime: string;
  publishedAt: string;
};

export type Photo = {
  id: string;
  title: string;
  image: string;
  caption: string;
};

export type Video = {
  id: string;
  title: string;
  platform: "YouTube" | "Vimeo";
  url: string;
  thumbnail: string;
  duration: string;
};

export type PdfResource = {
  id: string;
  title: string;
  type: "Resume" | "Certificate" | "Report";
  description: string;
  url: string;
};

export type NavItem = {
  label: string;
  href: string;
};

export type CommandItem = {
  id: string;
  label: string;
  href: string;
  group: "Pages" | "Sections" | "Actions";
};
