import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminPhotosPage() {
  return (
    <EntityManager
      entity="photos"
      title="Photos"
      description="Manage gallery photo uploads and metadata."
      previewPath={(item) => `/media/photos/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "imageUrl", label: "Image URL", type: "url", required: true, uploadType: "image" },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT"
      }}
      columns={[
        { key: "title", label: "Title" },
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
