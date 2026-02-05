"use client";

import { Search, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  NotificationFilterType,
  NotificationStatusFilter,
} from "@/types/notifications";

const typeLabels: Record<NotificationFilterType, string> = {
  all: "All",
  meeting_reminder: "Meetings",
  action_item_due: "Action Items",
  mention: "Mentions",
  comment: "Comments",
  assignment: "Assignments",
};

interface NotificationFiltersProps {
  typeFilter: NotificationFilterType;
  statusFilter: NotificationStatusFilter;
  searchQuery: string;
  onTypeChange: (type: NotificationFilterType) => void;
  onStatusChange: (status: NotificationStatusFilter) => void;
  onSearchChange: (query: string) => void;
}

export function NotificationFilters({
  typeFilter,
  statusFilter,
  searchQuery,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: NotificationFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-cyan-dark/20 focus:border-cyan-dark transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Tabs
          value={typeFilter}
          onValueChange={(value) => onTypeChange(value as NotificationFilterType)}
        >
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            {(Object.keys(typeLabels) as NotificationFilterType[]).map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                )}
              >
                {typeLabels[type]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
          {(["all", "unread", "read"] as NotificationStatusFilter[]).map(
            (status) => (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange(status)}
                className={cn(
                  "px-3 py-1.5 h-auto text-xs font-medium rounded-md",
                  statusFilter === status
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
