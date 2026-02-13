"use client";

import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminProjectsPage() {
  return (
    <EntityManager
      entity="projects"
      title="Projects"
      description="Manage portfolio projects with publish workflow, tags, and rich details."
      previewPath={(item) => `/projects/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "coverImage", label: "Cover Image URL", type: "url", uploadType: "image" },
        { name: "repoUrl", label: "Repo URL", type: "url" },
        { name: "liveUrl", label: "Live URL", type: "url" },
        { name: "projectType", label: "Project Type", type: "text", required: true },
        { name: "techStack", label: "Tech Stack", type: "tags", helpText: "Comma separated" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT",
        featured: false
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "projectType", label: "Type" },
        { key: "status", label: "Status" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
