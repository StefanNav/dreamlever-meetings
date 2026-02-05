"use client";

import React from "react";
import { Search, X, Inbox, Circle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
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

const statusIcons: Record<NotificationStatusFilter, { icon: React.ReactNode; label: string }> = {
  all: { icon: <Inbox className="w-4 h-4" />, label: "All" },
  unread: { icon: <Circle className="w-4 h-4 fill-current" />, label: "Unread" },
  read: { icon: <CheckCircle className="w-4 h-4" />, label: "Read" },
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D9097]" />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-[#E6E6E6] rounded-xl bg-[#FCFCFC] focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-colors placeholder:text-[#6D9097]"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D9097] hover:text-cyan transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status & Type Filters - Combined */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FCFCFC] border border-[#E6E6E6] rounded-xl w-full">
        {/* Status Filter - Icon Toggles */}
        {(["all", "unread", "read"] as NotificationStatusFilter[]).map(
          (status) => (
            <Tooltip key={status} content={statusIcons[status].label} position="bottom">
              <button
                onClick={() => onStatusChange(status)}
                className={cn(
                  "p-2 transition-all duration-200 rounded-lg",
                  statusFilter === status
                    ? "bg-gradient-to-b from-white to-[#F0F0F0] text-[#2D4A50] shadow-[0_2px_4px_0_rgba(63,140,156,0.15)] border border-[#E6E6E6]"
                    : "text-[#6D9097] hover:text-cyan hover:bg-cyan-light/50"
                )}
              >
                {statusIcons[status].icon}
              </button>
            </Tooltip>
          )
        )}

        {/* Separator */}
        <div className="w-px h-6 bg-[#E6E6E6] mx-1" />

        {/* Type Filter */}
        {(Object.keys(typeLabels) as NotificationFilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg",
              typeFilter === type
                ? "bg-gradient-to-b from-white to-[#F0F0F0] text-[#2D4A50] shadow-[0_2px_4px_0_rgba(63,140,156,0.15)] border border-[#E6E6E6]"
                : "text-[#6D9097] hover:text-cyan hover:bg-cyan-light/50"
            )}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
