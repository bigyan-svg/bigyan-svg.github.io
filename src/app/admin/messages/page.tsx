import { MessagesInbox } from "@/components/admin/messages-inbox";

export default function AdminMessagesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Contact form submissions saved in the database.
        </p>
      </div>
      <MessagesInbox />
    </div>
  );
}
