import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

export default function AdminBlogPostsPage() {
  return (
    <EntityManager
      entity="blog-posts"
      title="Blog Posts"
      description="Manage long-form blog content with categories, tags, and publishing."
      previewPath={(item) => `/blog/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
        { name: "content", label: "Content", type: "richtext", required: true },
        { name: "coverImage", label: "Cover Image URL", type: "url", uploadType: "image" },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "tags", label: "Tags", type: "tags" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
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
