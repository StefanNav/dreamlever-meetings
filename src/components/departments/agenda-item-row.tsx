"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AgendaItem } from "@/lib/department-data";
import { cn } from "@/lib/utils";
import { AGENDA_GRID_ROW, AGENDA_CELL_PADDING } from "./agenda-constants";

interface AgendaItemRowProps {
  item: AgendaItem;
  index?: number;
  onItemClick?: (itemId: string) => void;
}

export function AgendaItemRow({ item, index = 0, onItemClick }: AgendaItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const initials = item.createdBy.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div 
      className="border-b border-border-table last:border-b-0 transition-colors bg-white"
      data-agenda-item-id={item.id}
      id={`agenda-item-${item.id}`}
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => {
        setIsRowHovered(false);
        setHoveredCell(null);
      }}
    >
      {/* Main Row - 7 grid children */}
      <div
        className={`${AGENDA_GRID_ROW} cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* [expand] - chevron */}
        <div className="flex items-center justify-center py-2">
          <button
            className="p-0.5 rounded hover:bg-muted transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* [item] - title */}
        <div 
          className={cn(
            `flex items-center ${AGENDA_CELL_PADDING} transition-all`,
            hoveredCell === "title" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("title")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-sm text-foreground truncate">{item.title}</span>
        </div>

        {/* [createdBy] - avatar + name */}
        <div 
          className={cn(
            `flex items-center gap-2 ${AGENDA_CELL_PADDING} transition-all`,
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
          <span className="text-sm text-muted-foreground truncate">
            {item.createdBy.name}
          </span>
        </div>

        {/* [time] - time allocated */}
        <div 
          className={cn(
            `flex items-center ${AGENDA_CELL_PADDING} transition-all`,
            hoveredCell === "time" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("time")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-sm text-muted-foreground">{item.timeAllocated}</span>
        </div>

        {/* [description] - description text */}
        <div 
          className={cn(
            `flex items-center ${AGENDA_CELL_PADDING} transition-all`,
            hoveredCell === "description" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("description")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-sm text-muted-foreground truncate">{item.description}</span>
        </div>

        {/* [notes] - notes text */}
        <div 
          className={cn(
            `flex items-center ${AGENDA_CELL_PADDING} transition-all`,
            hoveredCell === "notes" ? "shadow-[inset_0_0_0_1px_var(--highlight-hover)]" : ""
          )}
          onMouseEnter={() => setHoveredCell("notes")}
          onMouseLeave={() => setHoveredCell(null)}
        >
          <span className="text-sm text-muted-foreground truncate">{item.notes || ""}</span>
        </div>

        {/* [actions] - empty for now */}
        <div></div>
      </div>

      {/* Expanded Content - 7 grid children, content spans remaining columns */}
      {isExpanded && (
        <div className={AGENDA_GRID_ROW}>
          {/* [expand] - empty */}
          <div></div>
          {/* [item] through [actions] - content spans 6 columns */}
          <div className="col-span-6 py-3 pr-3 bg-muted/20">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm text-foreground">{item.description}</p>
              </div>
              {item.notes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-foreground">{item.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
