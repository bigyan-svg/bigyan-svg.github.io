import { SectionHeading } from "@/components/common/section-heading";
import { AdminShellPreview } from "@/components/portfolio/admin-shell-preview";

export default function AdminPage() {
  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Admin UI"
        title="Template dashboard shell for CMS"
        description="Frontend-only admin layout with sidebar, table, and forms. Ready to wire with APIs later."
      />

      <div className="mt-8">
        <AdminShellPreview />
      </div>
    </section>
  );
}