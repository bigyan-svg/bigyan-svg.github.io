import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import { SectionHeading } from "@/components/common/section-heading";
import { AdminShellPreview } from "@/components/portfolio/admin-shell-preview";
import { AdminLogoutButton } from "@/components/portfolio/admin-logout-button";

export default async function AdminPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="container pb-20 pt-16">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Admin UI"
          title="Control Every Frontend Function"
          description="Manage profile, sections, animations, and all content data from one dashboard."
        />
        <AdminLogoutButton />
      </div>

      <AdminShellPreview />
    </section>
  );
}
