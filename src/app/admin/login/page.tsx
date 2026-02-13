import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  const user = await requireAdminUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="bg-grid-soft flex min-h-screen items-center justify-center p-4">
      <Card className="shine-sweep w-full max-w-md">
        <CardHeader>
          <p className="inline-flex w-fit rounded-full border border-border/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            CMS Access
          </p>
          <CardTitle>Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in with your admin credentials to manage content.
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
