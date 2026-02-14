import { redirect } from "next/navigation";
import { getAdminCredentials, getAdminSessionFromCookies } from "@/lib/admin-auth";
import { SectionHeading } from "@/components/common/section-heading";
import { AdminLoginForm } from "@/app/admin/login/login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSessionFromCookies();
  if (session) {
    redirect("/admin");
  }

  const creds = getAdminCredentials();

  return (
    <section className="container pb-20 pt-16">
      <SectionHeading
        eyebrow="Admin"
        title="Secure Dashboard Login"
        description="Only authenticated admin users can access content controls."
      />
      <div className="mt-8">
        <AdminLoginForm defaultEmail={creds.email} />
      </div>
    </section>
  );
}
