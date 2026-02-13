import { EntityManager } from "@/components/admin/entity-manager";

const typeOptions = [
  { label: "Experience", value: "EXPERIENCE" },
  { label: "Education", value: "EDUCATION" }
];

export default function AdminTimelinePage() {
  return (
    <EntityManager
      entity="timeline"
      title="Timeline"
      description="Manage experience and education timeline entries."
      fields={[
        { name: "type", label: "Type", type: "select", options: typeOptions },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "organization", label: "Organization", type: "text", required: true },
        { name: "location", label: "Location", type: "text" },
        { name: "startDate", label: "Start Date", type: "datetime", required: true },
        { name: "endDate", label: "End Date", type: "datetime" },
        { name: "isCurrent", label: "Current", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "sortOrder", label: "Sort Order", type: "number" }
      ]}
      defaultValues={{
        type: "EXPERIENCE",
        isCurrent: false,
        sortOrder: 0
      }}
      columns={[
        { key: "type", label: "Type" },
        { key: "title", label: "Title" },
        { key: "organization", label: "Organization" },
        {
          key: "startDate",
          label: "Start Date",
          render: (item) => new Date(String(item.startDate)).toLocaleDateString()
        }
      ]}
    />
  );
}
