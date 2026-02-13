import { AnalyticsPanel } from "@/components/admin/analytics-panel";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Basic content and engagement metrics from the CMS database.
        </p>
      </div>
      <AnalyticsPanel />
    </div>
  );
}
