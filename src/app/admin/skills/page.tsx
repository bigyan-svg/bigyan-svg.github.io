import { EntityManager } from "@/components/admin/entity-manager";

export default function AdminSkillsPage() {
  return (
    <EntityManager
      entity="skills"
      title="Skills"
      description="Manage technical skill list shown on the public site."
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", required: true },
        { name: "level", label: "Level (1-100)", type: "number", required: true },
        { name: "icon", label: "Icon Name", type: "text" },
        { name: "sortOrder", label: "Sort Order", type: "number" }
      ]}
      defaultValues={{
        level: 80,
        sortOrder: 0
      }}
      columns={[
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level" },
        { key: "sortOrder", label: "Order" }
      ]}
    />
  );
}
