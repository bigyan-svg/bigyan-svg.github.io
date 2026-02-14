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
          eyebrow="Admin CMS"
          title="Manage Live Portfolio Content"
          description="Secure dashboard with real database persistence for profile, projects, blog, media, skills, and timeline."
        />
        <AdminLogoutButton />
      </div>

      <AdminShellPreview />
    </section>
  );
}
