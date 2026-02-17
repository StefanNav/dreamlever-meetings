import { Users } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function PeoplePage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="mb-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "People" }]}
        />
      </div>

      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-cyan-light flex items-center justify-center mb-6">
          <Users className="w-8 h-8 text-cyan-dark" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">People</h1>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          View and manage your team members, roles, and collaboration. This page
          is coming soon.
        </p>
      </div>
    </div>
  );
}
