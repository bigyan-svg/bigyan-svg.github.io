
"use client";

import { type ChangeEvent, FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  type LucideIcon,
  Briefcase,
  Camera,
  Clapperboard,
  Clock3,
  ExternalLink,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  PenLine,
  Pencil,
  Plus,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import type { FrontendControls, HomeSectionItem, NavItem, Profile } from "@/lib/types";
import { slugify } from "@/lib/validators";
import { usePortfolioContent } from "@/components/content/content-provider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type PublishStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";
type TimelineType = "EXPERIENCE" | "EDUCATION";
type VideoSource = "YOUTUBE" | "VIMEO" | "UPLOADED";
type DocumentType = "RESUME" | "CERTIFICATE" | "REPORT" | "OTHER";
type UploadKind = "image" | "video" | "pdf";

type MediaLibraryItem = {
  id: string;
  url: string;
  kind: UploadKind;
  name: string;
  createdAt: string;
};

type ProjectEntity = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  projectType: string;
  techStack: string[];
  featured: boolean;
  status: PublishStatus;
  publishAt: string | null;
  updatedAt: string;
};

type BlogPostEntity = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  status: PublishStatus;
  publishAt: string | null;
  updatedAt: string;
};

type SkillEntity = {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  sortOrder: number;
};

type TimelineEntity = {
  id: string;
  type: TimelineType;
  title: string;
  organization: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  sortOrder: number;
};

type PhotoEntity = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  caption: string | null;
  tags: string[];
  status: PublishStatus;
  publishAt: string | null;
  updatedAt: string;
};

type VideoEntity = {
  id: string;
  title: string;
  slug: string;
  source: VideoSource;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  tags: string[];
  status: PublishStatus;
  publishAt: string | null;
  updatedAt: string;
};

type DocumentEntity = {
  id: string;
  title: string;
  slug: string;
  fileUrl: string;
  docType: DocumentType;
  description: string | null;
  status: PublishStatus;
  publishAt: string | null;
  updatedAt: string;
};

type TabKey = "settings" | "projects" | "blog" | "skills" | "timeline" | "photos" | "videos" | "documents";

type ProjectForm = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  repoUrl: string;
  liveUrl: string;
  projectType: string;
  techStack: string;
  featured: boolean;
  status: PublishStatus;
  publishAt: string;
};

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string;
  status: PublishStatus;
  publishAt: string;
};

type SkillForm = {
  name: string;
  category: string;
  level: number;
  icon: string;
  sortOrder: number;
};

type TimelineForm = {
  type: TimelineType;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  sortOrder: number;
};

type PhotoForm = {
  title: string;
  slug: string;
  imageUrl: string;
  caption: string;
  tags: string;
  status: PublishStatus;
  publishAt: string;
};

type VideoForm = {
  title: string;
  slug: string;
  source: VideoSource;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  tags: string;
  status: PublishStatus;
  publishAt: string;
};

type DocumentForm = {
  title: string;
  slug: string;
  fileUrl: string;
  docType: DocumentType;
  description: string;
  status: PublishStatus;
  publishAt: string;
};

const tabItems: Array<{ key: TabKey; label: string }> = [
  { key: "settings", label: "Settings" },
  { key: "projects", label: "Projects" },
  { key: "blog", label: "Blog" },
  { key: "skills", label: "Skills" },
  { key: "timeline", label: "Timeline" },
  { key: "photos", label: "Photos" },
  { key: "videos", label: "Videos" },
  { key: "documents", label: "Documents" }
];

const statusOptions: Array<{ label: string; value: PublishStatus }> = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

const controlMeta: Record<keyof FrontendControls, { label: string; description: string }> = {
  showNavbarProfilePhoto: {
    label: "Navbar profile photo",
    description: "Show your avatar beside the brand in the navbar."
  },
  showHeroAvatarChip: {
    label: "Hero avatar chip",
    description: "Display the @username chip on the hero media card."
  },
  showHeroStats: {
    label: "Hero stats",
    description: "Show quick stats (projects, skills, blogs) in the hero section."
  },
  showHomeAboutPreview: {
    label: "Home: About preview",
    description: "Enable the About preview section on the home page."
  },
  showHomeSkillsPreview: {
    label: "Home: Skills preview",
    description: "Enable the Skills snapshot section on the home page."
  },
  showHomeProjectsPreview: {
    label: "Home: Projects preview",
    description: "Enable the Projects preview section on the home page."
  },
  showHomeBlogPreview: {
    label: "Home: Blog preview",
    description: "Enable the Blog preview section on the home page."
  },
  showHomeContactPreview: {
    label: "Home: Contact CTA",
    description: "Enable the contact call-to-action section on the home page."
  },
  enableAnimatedBackground: {
    label: "Animated background",
    description: "Enable the aurora/grid animated background effects."
  },
  enablePageTransitions: {
    label: "Page transitions",
    description: "Animate route transitions between pages."
  },
  enableRevealAnimations: {
    label: "Reveal animations",
    description: "Animate sections as they enter the viewport while scrolling."
  },
  enableCardTilt: {
    label: "3D card tilt",
    description: "Enable 3D tilt interactions on project cards."
  },
  enableScrollProgress: {
    label: "Scroll progress",
    description: "Show the top progress bar while scrolling."
  },
  enableBackToTop: {
    label: "Back to top",
    description: "Show a floating back-to-top button."
  }
};

const projectFormDefaults: ProjectForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  coverImage: "",
  repoUrl: "",
  liveUrl: "",
  projectType: "Web Platform",
  techStack: "",
  featured: false,
  status: "DRAFT",
  publishAt: ""
};

const blogFormDefaults: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Engineering",
  tags: "",
  status: "DRAFT",
  publishAt: ""
};

const skillFormDefaults: SkillForm = {
  name: "",
  category: "Frontend",
  level: 70,
  icon: "",
  sortOrder: 0
};

const timelineFormDefaults: TimelineForm = {
  type: "EXPERIENCE",
  title: "",
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  sortOrder: 0
};

const photoFormDefaults: PhotoForm = {
  title: "",
  slug: "",
  imageUrl: "",
  caption: "",
  tags: "",
  status: "DRAFT",
  publishAt: ""
};

const videoFormDefaults: VideoForm = {
  title: "",
  slug: "",
  source: "YOUTUBE",
  videoUrl: "",
  thumbnailUrl: "",
  caption: "",
  tags: "",
  status: "DRAFT",
  publishAt: ""
};

const documentFormDefaults: DocumentForm = {
  title: "",
  slug: "",
  fileUrl: "",
  docType: "RESUME",
  description: "",
  status: "DRAFT",
  publishAt: ""
};

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function toDateInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function splitComma(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export function AdminShellPreview() {
  const router = useRouter();
  const { content, hydrated, refreshContent } = usePortfolioContent();
  const mainTopRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("settings");
  const [tabQuery, setTabQuery] = useState("");
  const [bootstrapping, setBootstrapping] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);

  const [profileForm, setProfileForm] = useState<Profile>(content.profile);
  const [controlsForm, setControlsForm] = useState<FrontendControls>(content.controls);
  const [navItemsJson, setNavItemsJson] = useState(JSON.stringify(content.navItems, null, 2));
  const [homeSectionsJson, setHomeSectionsJson] = useState(JSON.stringify(content.homeSectionItems, null, 2));

  const [projects, setProjects] = useState<ProjectEntity[]>([]);
  const [projectForm, setProjectForm] = useState<ProjectForm>(projectFormDefaults);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState(false);

  const [blogPosts, setBlogPosts] = useState<BlogPostEntity[]>([]);
  const [blogForm, setBlogForm] = useState<BlogForm>(blogFormDefaults);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [savingBlog, setSavingBlog] = useState(false);

  const [skills, setSkills] = useState<SkillEntity[]>([]);
  const [skillForm, setSkillForm] = useState<SkillForm>(skillFormDefaults);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [savingSkill, setSavingSkill] = useState(false);

  const [timelineItems, setTimelineItems] = useState<TimelineEntity[]>([]);
  const [timelineForm, setTimelineForm] = useState<TimelineForm>(timelineFormDefaults);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [savingTimeline, setSavingTimeline] = useState(false);

  const [photos, setPhotos] = useState<PhotoEntity[]>([]);
  const [photoForm, setPhotoForm] = useState<PhotoForm>(photoFormDefaults);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const [videos, setVideos] = useState<VideoEntity[]>([]);
  const [videoForm, setVideoForm] = useState<VideoForm>(videoFormDefaults);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [savingVideo, setSavingVideo] = useState(false);

  const [documents, setDocuments] = useState<DocumentEntity[]>([]);
  const [documentForm, setDocumentForm] = useState<DocumentForm>(documentFormDefaults);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [savingDocument, setSavingDocument] = useState(false);

  const stats = useMemo(
    () => ({
      projects: projects.length,
      blogPosts: blogPosts.length,
      skills: skills.length,
      timeline: timelineItems.length,
      photos: photos.length,
      videos: videos.length,
      documents: documents.length
    }),
    [blogPosts.length, documents.length, photos.length, projects.length, skills.length, timelineItems.length, videos.length]
  );

  const tabMeta = useMemo(
    () =>
      ({
        settings: {
          icon: Settings2,
          description: "Profile, navigation, and frontend toggles.",
          count: null
        },
        projects: {
          icon: Briefcase,
          description: "Case studies, tech stack, and publishing.",
          count: stats.projects
        },
        blog: {
          icon: PenLine,
          description: "Posts, tags, scheduling, and SEO.",
          count: stats.blogPosts
        },
        skills: {
          icon: Sparkles,
          description: "Skill taxonomy and proficiency levels.",
          count: stats.skills
        },
        timeline: {
          icon: Clock3,
          description: "Education and experience timeline.",
          count: stats.timeline
        },
        photos: {
          icon: Camera,
          description: "Gallery photos and captions.",
          count: stats.photos
        },
        videos: {
          icon: Clapperboard,
          description: "Video embeds and uploads.",
          count: stats.videos
        },
        documents: {
          icon: FileText,
          description: "Resume and PDF resources.",
          count: stats.documents
        }
      } satisfies Record<TabKey, { icon: LucideIcon; description: string; count: number | null }>),
    [stats.blogPosts, stats.documents, stats.photos, stats.projects, stats.skills, stats.timeline, stats.videos]
  );

  const filteredTabs = useMemo(() => {
    const query = tabQuery.trim().toLowerCase();
    if (!query) return tabItems;
    return tabItems.filter((item) => item.label.toLowerCase().includes(query));
  }, [tabQuery]);

  const selectTab = (key: TabKey) => {
    setActiveTab(key);
    requestAnimationFrame(() => {
      mainTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const apiRequest = useCallback(
    async <T,>(url: string, options?: RequestInit): Promise<T> => {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {})
        },
        cache: "no-store"
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string } & T;

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/admin/login");
          router.refresh();
        }
        throw new Error(payload.message || "Request failed.");
      }

      return payload;
    },
    [router]
  );
  const loadEntities = useCallback(async () => {
    setLoadingEntities(true);
    try {
      const [projectRes, blogRes, skillRes, timelineRes, photoRes, videoRes, documentRes] = await Promise.all([
        apiRequest<{ items: ProjectEntity[] }>("/api/admin/projects"),
        apiRequest<{ items: BlogPostEntity[] }>("/api/admin/blog-posts"),
        apiRequest<{ items: SkillEntity[] }>("/api/admin/skills"),
        apiRequest<{ items: TimelineEntity[] }>("/api/admin/timeline"),
        apiRequest<{ items: PhotoEntity[] }>("/api/admin/photos"),
        apiRequest<{ items: VideoEntity[] }>("/api/admin/videos"),
        apiRequest<{ items: DocumentEntity[] }>("/api/admin/documents")
      ]);

      setProjects(projectRes.items);
      setBlogPosts(blogRes.items);
      setSkills(skillRes.items);
      setTimelineItems(timelineRes.items);
      setPhotos(photoRes.items);
      setVideos(videoRes.items);
      setDocuments(documentRes.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load CMS entities.");
    } finally {
      setLoadingEntities(false);
      setBootstrapping(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    if (!hydrated) return;
    setProfileForm(content.profile);
    setControlsForm(content.controls);
    setNavItemsJson(JSON.stringify(content.navItems, null, 2));
    setHomeSectionsJson(JSON.stringify(content.homeSectionItems, null, 2));
  }, [content.controls, content.homeSectionItems, content.navItems, content.profile, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    void loadEntities();
  }, [hydrated, loadEntities]);

  const onSaveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let navItems: NavItem[];
    let homeSectionItems: HomeSectionItem[];

    try {
      navItems = JSON.parse(navItemsJson) as NavItem[];
      homeSectionItems = JSON.parse(homeSectionsJson) as HomeSectionItem[];
    } catch {
      toast.error("Navigation JSON or home sections JSON is invalid.");
      return;
    }

    setSavingSettings(true);

    try {
      await apiRequest<{ ok: boolean }>("/api/admin/site-config", {
        method: "PUT",
        body: JSON.stringify({
          profile: profileForm,
          controls: controlsForm,
          navItems,
          homeSectionItems
        })
      });

      await refreshContent("admin");
      toast.success("Site settings updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm(projectFormDefaults);
  };

  const onSubmitProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProject(true);

    try {
      const payload = {
        title: projectForm.title,
        slug: projectForm.slug,
        summary: projectForm.summary,
        content: projectForm.content,
        coverImage: projectForm.coverImage || null,
        repoUrl: projectForm.repoUrl || null,
        liveUrl: projectForm.liveUrl || null,
        projectType: projectForm.projectType,
        techStack: splitComma(projectForm.techStack),
        featured: projectForm.featured,
        status: projectForm.status,
        publishAt: projectForm.publishAt ? new Date(projectForm.publishAt).toISOString() : null
      };

      if (editingProjectId) {
        await apiRequest<{ item: ProjectEntity }>(`/api/admin/projects/${editingProjectId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Project updated.");
      } else {
        await apiRequest<{ item: ProjectEntity }>("/api/admin/projects", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Project created.");
      }

      resetProjectForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project.");
    } finally {
      setSavingProject(false);
    }
  };

  const onEditProject = (item: ProjectEntity) => {
    setEditingProjectId(item.id);
    setProjectForm({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      content: item.content,
      coverImage: item.coverImage || "",
      repoUrl: item.repoUrl || "",
      liveUrl: item.liveUrl || "",
      projectType: item.projectType,
      techStack: item.techStack.join(", "),
      featured: item.featured,
      status: item.status,
      publishAt: toDateTimeLocal(item.publishAt)
    });
  };

  const onDeleteProject = async (id: string) => {
    if (!window.confirm("Delete this project permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/projects/${id}`, { method: "DELETE" });
      toast.success("Project deleted.");
      if (editingProjectId === id) resetProjectForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project.");
    }
  };

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogForm(blogFormDefaults);
  };

  const onSubmitBlog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingBlog(true);

    try {
      const payload = {
        title: blogForm.title,
        slug: blogForm.slug,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        coverImage: blogForm.coverImage || null,
        category: blogForm.category,
        tags: splitComma(blogForm.tags),
        status: blogForm.status,
        publishAt: blogForm.publishAt ? new Date(blogForm.publishAt).toISOString() : null
      };

      if (editingBlogId) {
        await apiRequest<{ item: BlogPostEntity }>(`/api/admin/blog-posts/${editingBlogId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Blog post updated.");
      } else {
        await apiRequest<{ item: BlogPostEntity }>("/api/admin/blog-posts", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Blog post created.");
      }

      resetBlogForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save blog post.");
    } finally {
      setSavingBlog(false);
    }
  };

  const onEditBlog = (item: BlogPostEntity) => {
    setEditingBlogId(item.id);
    setBlogForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      coverImage: item.coverImage || "",
      category: item.category,
      tags: item.tags.join(", "),
      status: item.status,
      publishAt: toDateTimeLocal(item.publishAt)
    });
  };

  const onDeleteBlog = async (id: string) => {
    if (!window.confirm("Delete this blog post permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
      toast.success("Blog post deleted.");
      if (editingBlogId === id) resetBlogForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete blog post.");
    }
  };

  const resetSkillForm = () => {
    setEditingSkillId(null);
    setSkillForm(skillFormDefaults);
  };

  const onSubmitSkill = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingSkill(true);

    try {
      const payload = {
        name: skillForm.name,
        category: skillForm.category,
        level: skillForm.level,
        icon: skillForm.icon || null,
        sortOrder: skillForm.sortOrder
      };

      if (editingSkillId) {
        await apiRequest<{ item: SkillEntity }>(`/api/admin/skills/${editingSkillId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Skill updated.");
      } else {
        await apiRequest<{ item: SkillEntity }>("/api/admin/skills", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Skill created.");
      }

      resetSkillForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save skill.");
    } finally {
      setSavingSkill(false);
    }
  };
  const onEditSkill = (item: SkillEntity) => {
    setEditingSkillId(item.id);
    setSkillForm({
      name: item.name,
      category: item.category,
      level: item.level,
      icon: item.icon || "",
      sortOrder: item.sortOrder
    });
  };

  const onDeleteSkill = async (id: string) => {
    if (!window.confirm("Delete this skill permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/skills/${id}`, { method: "DELETE" });
      toast.success("Skill deleted.");
      if (editingSkillId === id) resetSkillForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete skill.");
    }
  };

  const resetTimelineForm = () => {
    setEditingTimelineId(null);
    setTimelineForm(timelineFormDefaults);
  };

  const onSubmitTimeline = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingTimeline(true);

    try {
      const payload = {
        type: timelineForm.type,
        title: timelineForm.title,
        organization: timelineForm.organization,
        location: timelineForm.location || null,
        startDate: timelineForm.startDate,
        endDate: timelineForm.endDate || null,
        isCurrent: timelineForm.isCurrent,
        description: timelineForm.description,
        sortOrder: timelineForm.sortOrder
      };

      if (editingTimelineId) {
        await apiRequest<{ item: TimelineEntity }>(`/api/admin/timeline/${editingTimelineId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Timeline item updated.");
      } else {
        await apiRequest<{ item: TimelineEntity }>("/api/admin/timeline", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Timeline item created.");
      }

      resetTimelineForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save timeline item.");
    } finally {
      setSavingTimeline(false);
    }
  };

  const onEditTimeline = (item: TimelineEntity) => {
    setEditingTimelineId(item.id);
    setTimelineForm({
      type: item.type,
      title: item.title,
      organization: item.organization,
      location: item.location || "",
      startDate: toDateInput(item.startDate),
      endDate: toDateInput(item.endDate),
      isCurrent: item.isCurrent,
      description: item.description,
      sortOrder: item.sortOrder
    });
  };

  const onDeleteTimeline = async (id: string) => {
    if (!window.confirm("Delete this timeline item permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/timeline/${id}`, { method: "DELETE" });
      toast.success("Timeline item deleted.");
      if (editingTimelineId === id) resetTimelineForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete timeline item.");
    }
  };

  const resetPhotoForm = () => {
    setEditingPhotoId(null);
    setPhotoForm(photoFormDefaults);
  };

  const onSubmitPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingPhoto(true);

    try {
      const payload = {
        title: photoForm.title,
        slug: photoForm.slug,
        imageUrl: photoForm.imageUrl,
        caption: photoForm.caption || null,
        tags: splitComma(photoForm.tags),
        status: photoForm.status,
        publishAt: photoForm.publishAt ? new Date(photoForm.publishAt).toISOString() : null
      };

      if (editingPhotoId) {
        await apiRequest<{ item: PhotoEntity }>(`/api/admin/photos/${editingPhotoId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Photo updated.");
      } else {
        await apiRequest<{ item: PhotoEntity }>("/api/admin/photos", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Photo created.");
      }

      resetPhotoForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save photo.");
    } finally {
      setSavingPhoto(false);
    }
  };

  const onEditPhoto = (item: PhotoEntity) => {
    setEditingPhotoId(item.id);
    setPhotoForm({
      title: item.title,
      slug: item.slug,
      imageUrl: item.imageUrl,
      caption: item.caption || "",
      tags: item.tags.join(", "),
      status: item.status,
      publishAt: toDateTimeLocal(item.publishAt)
    });
  };

  const onDeletePhoto = async (id: string) => {
    if (!window.confirm("Delete this photo permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/photos/${id}`, { method: "DELETE" });
      toast.success("Photo deleted.");
      if (editingPhotoId === id) resetPhotoForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete photo.");
    }
  };

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setVideoForm(videoFormDefaults);
  };

  const onSubmitVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingVideo(true);

    try {
      const payload = {
        title: videoForm.title,
        slug: videoForm.slug,
        source: videoForm.source,
        videoUrl: videoForm.videoUrl,
        thumbnailUrl: videoForm.thumbnailUrl || null,
        caption: videoForm.caption || null,
        tags: splitComma(videoForm.tags),
        status: videoForm.status,
        publishAt: videoForm.publishAt ? new Date(videoForm.publishAt).toISOString() : null
      };

      if (editingVideoId) {
        await apiRequest<{ item: VideoEntity }>(`/api/admin/videos/${editingVideoId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Video updated.");
      } else {
        await apiRequest<{ item: VideoEntity }>("/api/admin/videos", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Video created.");
      }

      resetVideoForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save video.");
    } finally {
      setSavingVideo(false);
    }
  };

  const onEditVideo = (item: VideoEntity) => {
    setEditingVideoId(item.id);
    setVideoForm({
      title: item.title,
      slug: item.slug,
      source: item.source,
      videoUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl || "",
      caption: item.caption || "",
      tags: item.tags.join(", "),
      status: item.status,
      publishAt: toDateTimeLocal(item.publishAt)
    });
  };

  const onDeleteVideo = async (id: string) => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/videos/${id}`, { method: "DELETE" });
      toast.success("Video deleted.");
      if (editingVideoId === id) resetVideoForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete video.");
    }
  };

  const resetDocumentForm = () => {
    setEditingDocumentId(null);
    setDocumentForm(documentFormDefaults);
  };

  const onSubmitDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingDocument(true);

    try {
      const payload = {
        title: documentForm.title,
        slug: documentForm.slug,
        fileUrl: documentForm.fileUrl,
        docType: documentForm.docType,
        description: documentForm.description || null,
        status: documentForm.status,
        publishAt: documentForm.publishAt ? new Date(documentForm.publishAt).toISOString() : null
      };

      if (editingDocumentId) {
        await apiRequest<{ item: DocumentEntity }>(`/api/admin/documents/${editingDocumentId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        toast.success("Document updated.");
      } else {
        await apiRequest<{ item: DocumentEntity }>("/api/admin/documents", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Document created.");
      }

      resetDocumentForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save document.");
    } finally {
      setSavingDocument(false);
    }
  };

  const onEditDocument = (item: DocumentEntity) => {
    setEditingDocumentId(item.id);
    setDocumentForm({
      title: item.title,
      slug: item.slug,
      fileUrl: item.fileUrl,
      docType: item.docType,
      description: item.description || "",
      status: item.status,
      publishAt: toDateTimeLocal(item.publishAt)
    });
  };

  const onDeleteDocument = async (id: string) => {
    if (!window.confirm("Delete this document permanently?")) return;

    try {
      await apiRequest<{ ok: boolean }>(`/api/admin/documents/${id}`, { method: "DELETE" });
      toast.success("Document deleted.");
      if (editingDocumentId === id) resetDocumentForm();
      await loadEntities();
      await refreshContent("admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete document.");
    }
  };

  if (!hydrated || bootstrapping) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 pt-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading CMS data...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Control Center</p>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="size-5 text-primary" /> Live CMS
                </CardTitle>
                <p className="text-sm text-muted-foreground">Edits persist to database and reflect on the public site.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => void loadEntities()} disabled={loadingEntities}>
                {loadingEntities ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <StatBox label="Projects" value={stats.projects} />
            <StatBox label="Blog" value={stats.blogPosts} />
            <StatBox label="Timeline" value={stats.timeline} />
            <StatBox label="Media + Docs" value={stats.photos + stats.videos + stats.documents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1.5 pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" /> Sections
            </CardTitle>
            <p className="text-sm text-muted-foreground">Jump between admin tools.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={tabQuery}
                onChange={(event) => setTabQuery(event.target.value)}
                className="pl-9"
                placeholder="Search sections..."
              />
            </div>

            <div className="grid gap-2">
              {filteredTabs.map((item) => {
                const meta = tabMeta[item.key];
                const Icon = meta.icon;
                const active = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => selectTab(item.key)}
                    className={[
                      "flex w-full items-start gap-3 rounded-2xl border px-3 py-2 text-left shadow-[var(--shadow-sm)] transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active
                        ? "border-primary/35 bg-primary/10"
                        : "border-border/60 bg-background/60 hover:border-primary/25 hover:bg-muted/30"
                    ].join(" ")}
                  >
                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-border/60 bg-muted/30">
                      <Icon className="size-4 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{meta.description}</p>
                    </div>
                    {meta.count !== null ? (
                      <Badge variant="outline" className="ml-auto">
                        {meta.count}
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1.5 pb-3">
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground">Create new entries fast.</p>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetProjectForm();
                selectTab("projects");
              }}
            >
              <Plus className="size-4" /> New Project
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetBlogForm();
                selectTab("blog");
              }}
            >
              <Plus className="size-4" /> New Blog Post
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetDocumentForm();
                selectTab("documents");
              }}
            >
              <Plus className="size-4" /> New PDF Document
            </Button>

            <a href="/" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline" })}>
              <ExternalLink className="size-4" /> Open Public Site
            </a>
          </CardContent>
        </Card>
      </aside>

      <div className="space-y-6">
        <div ref={mainTopRef} />
        {activeTab === "settings" ? (
        <Card>
          <CardHeader>
            <CardTitle>Profile, Navigation, and Frontend Toggles</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSaveSettings} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" value={profileForm.name} onChange={(value) => setProfileForm((prev) => ({ ...prev, name: value }))} />
                <Field label="Username" value={profileForm.username} onChange={(value) => setProfileForm((prev) => ({ ...prev, username: value }))} />
                <Field label="Role" value={profileForm.role} onChange={(value) => setProfileForm((prev) => ({ ...prev, role: value }))} />
                <Field label="Email" value={profileForm.email} onChange={(value) => setProfileForm((prev) => ({ ...prev, email: value }))} />
                <Field label="Location" value={profileForm.location} onChange={(value) => setProfileForm((prev) => ({ ...prev, location: value }))} />
                <Field label="GitHub" value={profileForm.github} onChange={(value) => setProfileForm((prev) => ({ ...prev, github: value }))} />
                <Field label="LinkedIn" value={profileForm.linkedin} onChange={(value) => setProfileForm((prev) => ({ ...prev, linkedin: value }))} />
                <Field
                  label="Resume URL"
                  value={profileForm.resumeUrl}
                  onChange={(value) => setProfileForm((prev) => ({ ...prev, resumeUrl: value }))}
                  upload={{ kind: "pdf" }}
                />
                <Field
                  label="Avatar URL"
                  value={profileForm.avatar}
                  onChange={(value) => setProfileForm((prev) => ({ ...prev, avatar: value }))}
                  upload={{ kind: "image" }}
                />
                <Field
                  label="Hero Image"
                  value={profileForm.heroImage}
                  onChange={(value) => setProfileForm((prev) => ({ ...prev, heroImage: value }))}
                  upload={{ kind: "image" }}
                />
                <Field
                  label="About Image"
                  value={profileForm.aboutImage}
                  onChange={(value) => setProfileForm((prev) => ({ ...prev, aboutImage: value }))}
                  upload={{ kind: "image" }}
                />
                <Field
                  label="Contact Image"
                  value={profileForm.contactImage}
                  onChange={(value) => setProfileForm((prev) => ({ ...prev, contactImage: value }))}
                  upload={{ kind: "image" }}
                />
              </div>

              <div className="space-y-2">
                <Label>Headline</Label>
                <Textarea
                  value={profileForm.headline}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, headline: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Intro</Label>
                <Textarea
                  value={profileForm.intro}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, intro: event.target.value }))}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {(Object.entries(controlsForm) as Array<[keyof FrontendControls, boolean]>).map(([key, value]) => {
                  const meta = controlMeta[key];

                  return (
                    <label
                      key={key}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/60 p-3 shadow-[var(--shadow-sm)]"
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-semibold">{meta?.label ?? String(key)}</span>
                        {meta?.description ? <span className="block text-xs text-muted-foreground">{meta.description}</span> : null}
                      </div>
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-primary"
                        checked={value}
                        onChange={(event) =>
                          setControlsForm((prev) => ({
                            ...prev,
                            [key]: event.target.checked
                          }))
                        }
                      />
                    </label>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Navigation Items (JSON array)</Label>
                  <Textarea
                    value={navItemsJson}
                    onChange={(event) => setNavItemsJson(event.target.value)}
                    className="min-h-[180px] font-mono text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Home Section Items (JSON array)</Label>
                  <Textarea
                    value={homeSectionsJson}
                    onChange={(event) => setHomeSectionsJson(event.target.value)}
                    className="min-h-[180px] font-mono text-xs"
                  />
                </div>
              </div>

              <Button type="submit" disabled={savingSettings}>
                {savingSettings ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {savingSettings ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {activeTab === "projects" ? (
        <CrudShell title="Projects" count={projects.length}>
          <CrudTable
            headers={["Title", "Slug", "Status", "Updated", "Actions"]}
            rows={projects.map((item) => [
              item.title,
              item.slug,
              <StatusBadge key={`${item.id}-status`} status={item.status} />,
              formatUpdatedAt(item.updatedAt),
              <ActionButtons
                key={`${item.id}-actions`}
                viewHref={`/projects/${item.slug}`}
                onEdit={() => onEditProject(item)}
                onDelete={() => void onDeleteProject(item.id)}
              />
            ])}
          />

          <form onSubmit={onSubmitProject} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Project Form" editing={Boolean(editingProjectId)} onReset={resetProjectForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={projectForm.title} onChange={(value) => setProjectForm((prev) => ({ ...prev, title: value }))} />
              <SlugField
                value={projectForm.slug}
                title={projectForm.title}
                onChange={(value) => setProjectForm((prev) => ({ ...prev, slug: value }))}
              />
              <Field label="Project Type" value={projectForm.projectType} onChange={(value) => setProjectForm((prev) => ({ ...prev, projectType: value }))} />
              <Field label="Tech Stack (comma separated)" value={projectForm.techStack} onChange={(value) => setProjectForm((prev) => ({ ...prev, techStack: value }))} />
              <Field
                label="Cover Image URL"
                value={projectForm.coverImage}
                onChange={(value) => setProjectForm((prev) => ({ ...prev, coverImage: value }))}
                upload={{ kind: "image" }}
              />
              <Field label="Repository URL" value={projectForm.repoUrl} onChange={(value) => setProjectForm((prev) => ({ ...prev, repoUrl: value }))} />
              <Field label="Live URL" value={projectForm.liveUrl} onChange={(value) => setProjectForm((prev) => ({ ...prev, liveUrl: value }))} />
              <Field
                label="Publish At"
                value={projectForm.publishAt}
                type="datetime-local"
                onChange={(value) => setProjectForm((prev) => ({ ...prev, publishAt: value }))}
              />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={projectForm.status}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, status: event.target.value as PublishStatus }))}
                  options={statusOptions}
                />
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, featured: event.target.checked }))}
                />
                Featured project
              </label>
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea value={projectForm.summary} onChange={(event) => setProjectForm((prev) => ({ ...prev, summary: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={projectForm.content}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, content: event.target.value }))}
                className="min-h-[160px]"
              />
            </div>
            <Button type="submit" disabled={savingProject}>
              {savingProject ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingProjectId ? "Update Project" : "Create Project"}
            </Button>
          </form>
        </CrudShell>
      ) : null}

      {activeTab === "blog" ? (
        <CrudShell title="Blog Posts" count={blogPosts.length}>
          <CrudTable
            headers={["Title", "Category", "Status", "Updated", "Actions"]}
            rows={blogPosts.map((item) => [
              item.title,
              item.category,
              <StatusBadge key={`${item.id}-status`} status={item.status} />,
              formatUpdatedAt(item.updatedAt),
              <ActionButtons
                key={`${item.id}-actions`}
                viewHref={`/blog/${item.slug}`}
                onEdit={() => onEditBlog(item)}
                onDelete={() => void onDeleteBlog(item.id)}
              />
            ])}
          />
          <form onSubmit={onSubmitBlog} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Blog Form" editing={Boolean(editingBlogId)} onReset={resetBlogForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={blogForm.title} onChange={(value) => setBlogForm((prev) => ({ ...prev, title: value }))} />
              <SlugField value={blogForm.slug} title={blogForm.title} onChange={(value) => setBlogForm((prev) => ({ ...prev, slug: value }))} />
              <Field label="Category" value={blogForm.category} onChange={(value) => setBlogForm((prev) => ({ ...prev, category: value }))} />
              <Field label="Tags (comma separated)" value={blogForm.tags} onChange={(value) => setBlogForm((prev) => ({ ...prev, tags: value }))} />
              <Field
                label="Cover Image URL"
                value={blogForm.coverImage}
                onChange={(value) => setBlogForm((prev) => ({ ...prev, coverImage: value }))}
                upload={{ kind: "image" }}
              />
              <Field
                label="Publish At"
                value={blogForm.publishAt}
                type="datetime-local"
                onChange={(value) => setBlogForm((prev) => ({ ...prev, publishAt: value }))}
              />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={blogForm.status}
                  onChange={(event) => setBlogForm((prev) => ({ ...prev, status: event.target.value as PublishStatus }))}
                  options={statusOptions}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={blogForm.excerpt} onChange={(event) => setBlogForm((prev) => ({ ...prev, excerpt: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={blogForm.content}
                onChange={(event) => setBlogForm((prev) => ({ ...prev, content: event.target.value }))}
                className="min-h-[220px]"
              />
            </div>
            <Button type="submit" disabled={savingBlog}>
              {savingBlog ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingBlogId ? "Update Blog Post" : "Create Blog Post"}
            </Button>
          </form>
        </CrudShell>
      ) : null}

      {activeTab === "skills" ? (
        <CrudShell title="Skills" count={skills.length}>
          <CrudTable
            headers={["Name", "Category", "Level", "Order", "Actions"]}
            rows={skills.map((item) => [
              item.name,
              item.category,
              `${item.level}%`,
              String(item.sortOrder),
              <ActionButtons key={`${item.id}-actions`} onEdit={() => onEditSkill(item)} onDelete={() => void onDeleteSkill(item.id)} />
            ])}
          />

          <form onSubmit={onSubmitSkill} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Skill Form" editing={Boolean(editingSkillId)} onReset={resetSkillForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Name" value={skillForm.name} onChange={(value) => setSkillForm((prev) => ({ ...prev, name: value }))} />
              <Field label="Category" value={skillForm.category} onChange={(value) => setSkillForm((prev) => ({ ...prev, category: value }))} />
              <Field
                label="Level"
                value={String(skillForm.level)}
                type="number"
                onChange={(value) => setSkillForm((prev) => ({ ...prev, level: Number(value) || 0 }))}
              />
              <Field
                label="Sort Order"
                value={String(skillForm.sortOrder)}
                type="number"
                onChange={(value) => setSkillForm((prev) => ({ ...prev, sortOrder: Number(value) || 0 }))}
              />
              <Field label="Highlight/Icon text" value={skillForm.icon} onChange={(value) => setSkillForm((prev) => ({ ...prev, icon: value }))} />
            </div>
            <Button type="submit" disabled={savingSkill}>
              {savingSkill ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingSkillId ? "Update Skill" : "Create Skill"}
            </Button>
          </form>
        </CrudShell>
      ) : null}

      {activeTab === "timeline" ? (
        <CrudShell title="Timeline" count={timelineItems.length}>
          <CrudTable
            headers={["Title", "Type", "Period", "Order", "Actions"]}
            rows={timelineItems.map((item) => [
              item.title,
              item.type,
              `${toDateInput(item.startDate)} - ${item.isCurrent ? "Present" : toDateInput(item.endDate)}`,
              String(item.sortOrder),
              <ActionButtons
                key={`${item.id}-actions`}
                onEdit={() => onEditTimeline(item)}
                onDelete={() => void onDeleteTimeline(item.id)}
              />
            ])}
          />

          <form onSubmit={onSubmitTimeline} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Timeline Form" editing={Boolean(editingTimelineId)} onReset={resetTimelineForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={timelineForm.type}
                  onChange={(event) => setTimelineForm((prev) => ({ ...prev, type: event.target.value as TimelineType }))}
                  options={[
                    { label: "Experience", value: "EXPERIENCE" },
                    { label: "Education", value: "EDUCATION" }
                  ]}
                />
              </div>
              <Field label="Title" value={timelineForm.title} onChange={(value) => setTimelineForm((prev) => ({ ...prev, title: value }))} />
              <Field
                label="Organization"
                value={timelineForm.organization}
                onChange={(value) => setTimelineForm((prev) => ({ ...prev, organization: value }))}
              />
              <Field label="Location" value={timelineForm.location} onChange={(value) => setTimelineForm((prev) => ({ ...prev, location: value }))} />
              <Field label="Start Date" value={timelineForm.startDate} type="date" onChange={(value) => setTimelineForm((prev) => ({ ...prev, startDate: value }))} />
              <Field label="End Date" value={timelineForm.endDate} type="date" onChange={(value) => setTimelineForm((prev) => ({ ...prev, endDate: value }))} />
              <Field
                label="Sort Order"
                value={String(timelineForm.sortOrder)}
                type="number"
                onChange={(value) => setTimelineForm((prev) => ({ ...prev, sortOrder: Number(value) || 0 }))}
              />
              <label className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={timelineForm.isCurrent}
                  onChange={(event) => setTimelineForm((prev) => ({ ...prev, isCurrent: event.target.checked }))}
                />
                Current position
              </label>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={timelineForm.description}
                onChange={(event) => setTimelineForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={savingTimeline}>
              {savingTimeline ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingTimelineId ? "Update Timeline" : "Create Timeline"}
            </Button>
          </form>
        </CrudShell>
      ) : null}

      {activeTab === "photos" ? (
        <CrudShell title="Photos" count={photos.length}>
          <CrudTable
            headers={["Title", "Slug", "Status", "Updated", "Actions"]}
            rows={photos.map((item) => [
              item.title,
              item.slug,
              <StatusBadge key={`${item.id}-status`} status={item.status} />,
              formatUpdatedAt(item.updatedAt),
              <ActionButtons
                key={`${item.id}-actions`}
                viewHref={item.imageUrl}
                onEdit={() => onEditPhoto(item)}
                onDelete={() => void onDeletePhoto(item.id)}
              />
            ])}
          />

          <form onSubmit={onSubmitPhoto} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Photo Form" editing={Boolean(editingPhotoId)} onReset={resetPhotoForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={photoForm.title} onChange={(value) => setPhotoForm((prev) => ({ ...prev, title: value }))} />
              <SlugField value={photoForm.slug} title={photoForm.title} onChange={(value) => setPhotoForm((prev) => ({ ...prev, slug: value }))} />
              <Field
                label="Image URL"
                value={photoForm.imageUrl}
                onChange={(value) => setPhotoForm((prev) => ({ ...prev, imageUrl: value }))}
                upload={{ kind: "image" }}
              />
              <Field label="Tags (comma separated)" value={photoForm.tags} onChange={(value) => setPhotoForm((prev) => ({ ...prev, tags: value }))} />
              <Field
                label="Publish At"
                value={photoForm.publishAt}
                type="datetime-local"
                onChange={(value) => setPhotoForm((prev) => ({ ...prev, publishAt: value }))}
              />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={photoForm.status}
                  onChange={(event) => setPhotoForm((prev) => ({ ...prev, status: event.target.value as PublishStatus }))}
                  options={statusOptions}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea value={photoForm.caption} onChange={(event) => setPhotoForm((prev) => ({ ...prev, caption: event.target.value }))} />
            </div>
            <Button type="submit" disabled={savingPhoto}>
              {savingPhoto ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingPhotoId ? "Update Photo" : "Create Photo"}
            </Button>
          </form>
        </CrudShell>
      ) : null}
      {activeTab === "videos" ? (
        <CrudShell title="Videos" count={videos.length}>
          <CrudTable
            headers={["Title", "Source", "Status", "Updated", "Actions"]}
            rows={videos.map((item) => [
              item.title,
              item.source,
              <StatusBadge key={`${item.id}-status`} status={item.status} />,
              formatUpdatedAt(item.updatedAt),
              <ActionButtons
                key={`${item.id}-actions`}
                viewHref={item.videoUrl}
                onEdit={() => onEditVideo(item)}
                onDelete={() => void onDeleteVideo(item.id)}
              />
            ])}
          />

          <form onSubmit={onSubmitVideo} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Video Form" editing={Boolean(editingVideoId)} onReset={resetVideoForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={videoForm.title} onChange={(value) => setVideoForm((prev) => ({ ...prev, title: value }))} />
              <SlugField value={videoForm.slug} title={videoForm.title} onChange={(value) => setVideoForm((prev) => ({ ...prev, slug: value }))} />
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={videoForm.source}
                  onChange={(event) => setVideoForm((prev) => ({ ...prev, source: event.target.value as VideoSource }))}
                  options={[
                    { label: "YouTube", value: "YOUTUBE" },
                    { label: "Vimeo", value: "VIMEO" },
                    { label: "Uploaded", value: "UPLOADED" }
                  ]}
                />
              </div>
              <Field
                label="Video URL"
                value={videoForm.videoUrl}
                onChange={(value) => setVideoForm((prev) => ({ ...prev, videoUrl: value }))}
                upload={{ kind: "video" }}
              />
              <Field
                label="Thumbnail URL"
                value={videoForm.thumbnailUrl}
                onChange={(value) => setVideoForm((prev) => ({ ...prev, thumbnailUrl: value }))}
                upload={{ kind: "image" }}
              />
              <Field label="Tags (comma separated)" value={videoForm.tags} onChange={(value) => setVideoForm((prev) => ({ ...prev, tags: value }))} />
              <Field
                label="Publish At"
                value={videoForm.publishAt}
                type="datetime-local"
                onChange={(value) => setVideoForm((prev) => ({ ...prev, publishAt: value }))}
              />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={videoForm.status}
                  onChange={(event) => setVideoForm((prev) => ({ ...prev, status: event.target.value as PublishStatus }))}
                  options={statusOptions}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea value={videoForm.caption} onChange={(event) => setVideoForm((prev) => ({ ...prev, caption: event.target.value }))} />
            </div>
            <Button type="submit" disabled={savingVideo}>
              {savingVideo ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingVideoId ? "Update Video" : "Create Video"}
            </Button>
          </form>
        </CrudShell>
      ) : null}

      {activeTab === "documents" ? (
        <CrudShell title="Documents" count={documents.length}>
          <CrudTable
            headers={["Title", "Type", "Status", "Updated", "File", "Actions"]}
            rows={documents.map((item) => [
              item.title,
              item.docType,
              <StatusBadge key={`${item.id}-status`} status={item.status} />,
              formatUpdatedAt(item.updatedAt),
              item.fileUrl ? (
                <div key={`${item.id}-file`} className="flex flex-wrap gap-2">
                  <a
                    href={`/resources/${item.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ size: "sm", variant: "outline" })}
                  >
                    <FileText className="size-3.5" /> Preview
                  </a>
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ size: "sm", variant: "outline" })}
                  >
                    <ExternalLink className="size-3.5" /> Open
                  </a>
                </div>
              ) : (
                <span key={`${item.id}-file`} className="text-sm text-muted-foreground">
                  -
                </span>
              ),
              <ActionButtons
                key={`${item.id}-actions`}
                onEdit={() => onEditDocument(item)}
                onDelete={() => void onDeleteDocument(item.id)}
              />
            ])}
          />

          <form onSubmit={onSubmitDocument} className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-4">
            <FormTitle title="Document Form" editing={Boolean(editingDocumentId)} onReset={resetDocumentForm} />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Title" value={documentForm.title} onChange={(value) => setDocumentForm((prev) => ({ ...prev, title: value }))} />
              <SlugField value={documentForm.slug} title={documentForm.title} onChange={(value) => setDocumentForm((prev) => ({ ...prev, slug: value }))} />
              <Field
                label="File URL"
                value={documentForm.fileUrl}
                onChange={(value) => setDocumentForm((prev) => ({ ...prev, fileUrl: value }))}
                upload={{ kind: "pdf" }}
              />
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select
                  value={documentForm.docType}
                  onChange={(event) => setDocumentForm((prev) => ({ ...prev, docType: event.target.value as DocumentType }))}
                  options={[
                    { label: "Resume", value: "RESUME" },
                    { label: "Certificate", value: "CERTIFICATE" },
                    { label: "Report", value: "REPORT" },
                    { label: "Other", value: "OTHER" }
                  ]}
                />
              </div>
              <Field
                label="Publish At"
                value={documentForm.publishAt}
                type="datetime-local"
                onChange={(value) => setDocumentForm((prev) => ({ ...prev, publishAt: value }))}
              />
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={documentForm.status}
                  onChange={(event) => setDocumentForm((prev) => ({ ...prev, status: event.target.value as PublishStatus }))}
                  options={statusOptions}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={documentForm.description}
                onChange={(event) => setDocumentForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={savingDocument}>
              {savingDocument ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {editingDocumentId ? "Update Document" : "Create Document"}
            </Button>
          </form>
        </CrudShell>
      ) : null}
    </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function CrudShell({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary">{count} items</Badge>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function CrudTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ status }: { status: PublishStatus }) {
  if (status === "PUBLISHED") {
    return <Badge variant="success">Published</Badge>;
  }

  if (status === "SCHEDULED") {
    return <Badge variant="secondary">Scheduled</Badge>;
  }

  return <Badge variant="outline">Draft</Badge>;
}

function ActionButtons({
  onEdit,
  onDelete,
  viewHref
}: {
  onEdit: () => void;
  onDelete: () => void;
  viewHref?: string;
}) {
  return (
    <div className="flex gap-2">
      {viewHref ? (
        <a href={viewHref} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
          <ExternalLink className="size-3.5" /> View
        </a>
      ) : null}
      <Button type="button" size="sm" variant="outline" onClick={onEdit}>
        <Pencil className="size-3.5" /> Edit
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={onDelete}>
        <Trash2 className="size-3.5" /> Delete
      </Button>
    </div>
  );
}

function FormTitle({ title, editing, onReset }: { title: string; editing: boolean; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="font-medium">{title}</p>
      {editing ? (
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Create New
        </Button>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  upload
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  upload?: {
    kind: UploadKind;
    accept?: string;
  };
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState("");
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryItems, setLibraryItems] = useState<MediaLibraryItem[]>([]);

  const acceptMap: Record<UploadKind, string> = {
    image: "image/jpeg,image/png,image/webp,image/gif",
    video: "video/mp4,video/webm,video/quicktime",
    pdf: "application/pdf"
  };

  const loadLibrary = useCallback(async () => {
    if (!upload) return;

    setLibraryLoading(true);
    setLibraryError("");
    try {
      const response = await fetch(`/api/admin/media-library?kind=${encodeURIComponent(upload.kind)}`, {
        cache: "no-store"
      });
      const json = (await response.json().catch(() => ({}))) as {
        message?: string;
        items?: MediaLibraryItem[];
      };

      if (!response.ok) {
        throw new Error(json.message || "Unable to load media library.");
      }

      setLibraryItems(Array.isArray(json.items) ? json.items : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load media library.";
      setLibraryError(message);
      toast.error(message);
    } finally {
      setLibraryLoading(false);
    }
  }, [upload]);

  const filteredLibraryItems = useMemo(() => {
    const query = libraryQuery.trim().toLowerCase();
    if (!query) return libraryItems;
    return libraryItems.filter(
      (item) => item.name.toLowerCase().includes(query) || item.url.toLowerCase().includes(query)
    );
  }, [libraryItems, libraryQuery]);

  const onUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !upload) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", upload.kind);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const json = (await response.json().catch(() => ({}))) as { message?: string; url?: string };

      if (!response.ok || !json.url) {
        throw new Error(json.message || "Upload failed.");
      }

      onChange(json.url);
      toast.success("File uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload file.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const openLibrary = () => {
    setLibraryOpen(true);
    void loadLibrary();
  };

  const selectLibraryItem = (item: MediaLibraryItem) => {
    onChange(item.url);
    setLibraryOpen(false);
    toast.success("Media selected from library.");
  };

  return (
    <div className="relative space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex gap-2">
        <Input id={inputId} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
        {upload ? (
          <>
            <input
              ref={fileRef}
              type="file"
              accept={upload.accept || acceptMap[upload.kind]}
                className="hidden"
                onChange={onUpload}
              />
              <Button
                type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={libraryOpen ? () => setLibraryOpen(false) : openLibrary}
              >
                {libraryLoading ? <Loader2 className="size-4 animate-spin" /> : <FolderOpen className="size-4" />}
                {libraryOpen ? "Close" : "Library"}
              </Button>
            </>
          ) : null}
      </div>

      {upload && value.trim() ? (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-2 shadow-[var(--shadow-sm)]">
          {upload.kind === "image" ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-border/60 bg-muted/30">
              {/* Use <img> here so any pasted URL can preview without next/image domain config. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={`${label} preview`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-lg border border-border/60 bg-muted/30 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {upload.kind}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Current</p>
            <p className="truncate text-[11px] text-muted-foreground">{value}</p>
          </div>

          <a href={value} target="_blank" rel="noreferrer" className={buttonVariants({ size: "sm", variant: "outline" })}>
            <ExternalLink className="size-3.5" /> Open
          </a>
        </div>
      ) : null}

      {upload && libraryOpen ? (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-border/70 bg-background p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium">
              Media Library ({upload.kind})
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setLibraryOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={libraryQuery}
              onChange={(event) => setLibraryQuery(event.target.value)}
              placeholder="Search uploaded files..."
              className="pl-8"
            />
          </div>

          {libraryError ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs text-destructive">
              {libraryError}
            </p>
          ) : null}

          <div className="max-h-72 space-y-2 overflow-auto pr-1">
            {libraryLoading ? (
              <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading uploads...
              </div>
            ) : null}

            {!libraryLoading && filteredLibraryItems.length === 0 ? (
              <p className="py-2 text-xs text-muted-foreground">No uploaded files found for this type.</p>
            ) : null}

            {!libraryLoading
              ? filteredLibraryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectLibraryItem(item)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-2 text-left transition hover:border-primary/60 hover:bg-primary/5"
                  >
                    {upload.kind === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-md border border-border/60 object-cover"
                      />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-md border border-border/60 bg-muted text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                        {item.kind}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{item.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{item.url}</p>
                    </div>
                  </button>
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SlugField({ value, title, onChange }: { value: string; title: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>Slug</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
        <Button type="button" variant="outline" onClick={() => onChange(slugify(title || value || ""))}>
          Auto
        </Button>
      </div>
    </div>
  );
}
