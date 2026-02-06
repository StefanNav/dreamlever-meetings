"use client";

import { ReactNode } from "react";
import { MeetingListFilter as FilterType } from "@/types/meetings";
import { cn } from "@/lib/utils";

interface MeetingListFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  children?: ReactNode;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export function MeetingListFilter({
  activeFilter,
  onFilterChange,
  children,
}: MeetingListFilterProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-surface border border-border-light rounded-xl">
      {/* Tab buttons */}
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
            activeFilter === filter.value
              ? "bg-gradient-to-b from-white to-surface-filter text-heading-1 shadow-[0_2px_4px_0_rgba(63,140,156,0.15)] border border-border-light"
              : "text-text-secondary hover:text-cyan hover:bg-cyan-light/50"
          )}
        >
          {filter.label}
        </button>
      ))}

      {/* Right side content (calendar, date badge, etc.) */}
      {children && (
        <div className="ml-auto flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
