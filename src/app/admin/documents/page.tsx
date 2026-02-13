import { EntityManager } from "@/components/admin/entity-manager";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" }
];

const typeOptions = [
  { label: "Resume", value: "RESUME" },
  { label: "Certificate", value: "CERTIFICATE" },
  { label: "Report", value: "REPORT" },
  { label: "Other", value: "OTHER" }
];

export default function AdminDocumentsPage() {
  return (
    <EntityManager
      entity="documents"
      title="Documents"
      description="Upload and organize PDFs such as resume, certificates, and reports."
      previewPath={(item) => `/media/documents/${String(item.slug || "")}`}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "fileUrl", label: "File URL", type: "url", required: true, uploadType: "pdf" },
        { name: "docType", label: "Document Type", type: "select", options: typeOptions },
        { name: "description", label: "Description", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: statusOptions },
        { name: "publishAt", label: "Publish At", type: "datetime" }
      ]}
      defaultValues={{
        status: "DRAFT",
        docType: "OTHER"
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "docType", label: "Type" },
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
