"use client";

import { cn } from "@/lib/utils";

export type FolderDayFilter = "all" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface FolderDayFilterProps {
  activeFilter: FolderDayFilter;
  onFilterChange: (filter: FolderDayFilter) => void;
}

const filters: { value: FolderDayFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

export function FolderDayFilter({ activeFilter, onFilterChange }: FolderDayFilterProps) {
  return (
    <div className="inline-flex items-center gap-1.5 p-1.5 bg-surface border border-border-light rounded-xl">
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
    </div>
  );
}
