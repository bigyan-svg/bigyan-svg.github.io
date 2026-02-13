import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

const sourceOptions = [
  { label: "YouTube", value: "YOUTUBE" },
  { label: "Vimeo", value: "VIMEO" },
  { label: "Uploaded", value: "UPLOADED" }
];

export default function AdminVideosPage() {
  return (
    <EntityManager
      entity="videos"
      title="Videos"
      description="Manage YouTube/Vimeo embeds or uploaded video entries."
      previewPath={(item) => `/media/videos/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "source", label: "Source", type: "select", options: sourceOptions },
        { name: "videoUrl", label: "Video URL", type: "url", required: true, uploadType: "video" },
        { name: "thumbnailUrl", label: "Thumbnail URL", type: "url", uploadType: "image" },
        { name: "caption", label: "Caption", type: "textarea" },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT",
        source: "YOUTUBE"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "source", label: "Source" },
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
