"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        toast.error("Logout failed.");
        return;
      }
      toast.success("Logged out.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Unable to logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleLogout} disabled={loading}>
      <LogOut className="size-4" />
      {loading ? "Logging Out..." : "Logout"}
    </Button>
  );
}
