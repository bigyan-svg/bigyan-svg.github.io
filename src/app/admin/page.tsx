import { SectionHeading } from "@/components/common/section-heading";
import { AdminShellPreview } from "@/components/portfolio/admin-shell-preview";

export default function AdminPage() {
  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Admin UI"
        title="Control Every Frontend Function"
        description="Manage profile, sections, animations, and all content data from one dashboard."
      />

      <div className="mt-8">
        <AdminShellPreview />
      </div>
    </section>
  );
}
