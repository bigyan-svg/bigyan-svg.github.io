import { EntityManager } from "@/components/admin/entity-manager";

export default function AdminResumePage() {
  return (
    <EntityManager
      entity="resume"
      title="Resume"
      description="Manage profile details and resume PDF shown on public pages."
      fields={[
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "headline", label: "Headline", type: "text", required: true },
        { name: "summary", label: "Summary", type: "textarea", required: true },
        { name: "email", label: "Email", type: "text", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "website", label: "Website", type: "url" },
        { name: "github", label: "GitHub URL", type: "url" },
        { name: "linkedin", label: "LinkedIn URL", type: "url" },
        { name: "resumePdfUrl", label: "Resume PDF URL", type: "url", uploadType: "pdf" },
        { name: "skills", label: "Skills", type: "tags" }
      ]}
      defaultValues={{
        fullName: "Bigyan Sanjyal",
        headline: "BE Computer Engineering Student | Full-Stack Developer",
        email: "bigyan@example.com"
      }}
      columns={[
        { key: "fullName", label: "Name" },
        { key: "headline", label: "Headline" },
        { key: "email", label: "Email" },
        {
          key: "updatedAt",
          label: "Updated",
          render: (item) => new Date(String(item.updatedAt)).toLocaleDateString()
        }
      ]}
    />
  );
}
