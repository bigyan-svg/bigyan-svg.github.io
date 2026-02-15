"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminLoginForm({ defaultEmail }: { defaultEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const json = (await response.json().catch(() => ({ message: "Login failed." }))) as { message?: string };
        toast.error(json.message || "Login failed.");
        return;
      }

      toast.success("Admin login successful.");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Unable to reach login service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-[var(--shadow-lg)]">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <p className="text-sm text-muted-foreground">Sign in to manage frontend content and settings.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-9"
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="pl-9 pr-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="size-4" />
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
