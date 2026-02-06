"use client";

import { useState } from "react";
import { Menu, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FutureItem } from "@/lib/department-data";
import { cn } from "@/lib/utils";

interface FutureItemRowProps {
  item: FutureItem;
  index?: number;
  onEditClick?: (item: FutureItem) => void;
}

export function FutureItemRow({ item, index = 0, onEditClick }: FutureItemRowProps) {
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const initials = item.createdBy.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Alternating row colors
  const isEvenRow = index % 2 === 0;
  const baseRowColor = isEvenRow ? "bg-white" : "bg-surface-alt";

  return (
    <div
      className={cn(
        "border-b border-border-table last:border-b-0 transition-colors relative",
        baseRowColor
      )}
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => {
        setIsRowHovered(false);
        setHoveredCell(null);
      }}
    >
      {/* Main Row */}
      <div className="grid grid-cols-[220px_150px_120px_1fr_120px] items-center">
        {/* Menu icon (visible on hover) + Agenda Item */}
        <div 
          className={cn(
            "flex items-center py-2 pl-2 pr-4 relative transition-all",
            hoveredCell === "title" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("title")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          {/* Menu/drag handle icon - visible on hover */}
          <div
            className={cn(
              "w-6 h-6 flex items-center justify-center shrink-0 transition-opacity",
              isRowHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Edit button - visible on hover */}
          <button
            className={cn(
              "w-6 h-6 flex items-center justify-center rounded hover:bg-white/50 transition-all shrink-0 mr-2",
              isRowHovered ? "opacity-100" : "opacity-0"
            )}
            onClick={() => onEditClick?.(item)}
            aria-label="Edit item"
          >
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Title */}
          <span className="text-xs text-foreground truncate">{item.title}</span>
        </div>

        {/* Created By */}
        <div 
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 transition-all",
            hoveredCell === "createdBy" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("createdBy")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <Avatar className="w-5 h-5 shrink-0">
            <AvatarImage src={item.createdBy.avatar} alt={item.createdBy.name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-foreground truncate">
            {item.createdBy.name}
          </span>
        </div>

        {/* Time Allocated */}
        <div 
          className={cn(
            "px-4 py-2 transition-all",
            hoveredCell === "time" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("time")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-xs text-foreground">{item.timeAllocated}</span>
        </div>

        {/* Description */}
        <div 
          className={cn(
            "px-4 py-2 transition-all",
            hoveredCell === "description" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("description")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-xs text-foreground truncate block">
            {item.description}
          </span>
        </div>

        {/* Date Added */}
        <div 
          className={cn(
            "px-4 py-2 transition-all",
            hoveredCell === "date" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("date")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-xs text-foreground">{item.dateAdded}</span>
        </div>
      </div>
    </div>
  );
}
