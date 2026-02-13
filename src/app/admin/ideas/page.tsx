"use client";

import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminIdeasPage() {
  return (
    <EntityManager
      entity="ideas"
      title="Ideas"
      description="Manage short-form ideas, notes, and thought snippets."
      previewPath={(item) => `/ideas/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "tags", label: "Tags" },
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
