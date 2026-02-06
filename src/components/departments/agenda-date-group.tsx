"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Calendar, MoreHorizontal, Plus } from "lucide-react";
import { AgendaDate } from "@/lib/department-data";
import { AgendaItemRow } from "./agenda-item-row";
import { AGENDA_GRID_ROW, AGENDA_CELL_PADDING } from "./agenda-constants";

interface AgendaDateGroupProps {
  agendaDate: AgendaDate;
  onAddItem?: (dateId: string) => void;
  onViewSummary?: (dateId: string) => void;
}

export function AgendaDateGroup({
  agendaDate,
  onAddItem,
  onViewSummary,
}: AgendaDateGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      className="border-b border-border"
      data-meeting-instance-id={agendaDate.id}
      data-meeting-date={agendaDate.date}
    >
      {/* Date Header Row - 7 grid children */}
      <div
        className={`${AGENDA_GRID_ROW} bg-surface-alt transition-colors cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* [expand] - chevron */}
        <div className="flex items-center justify-center py-3">
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

        {/* [item] - date label + icons */}
        <div className={`flex items-center gap-2 ${AGENDA_CELL_PADDING}`}>
          <span className="text-sm font-medium text-foreground">
            {agendaDate.date}
          </span>
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open menu
            }}
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* [createdBy] - empty */}
        <div></div>

        {/* [time] - empty */}
        <div></div>

        {/* [description] - empty */}
        <div></div>

        {/* [notes] - Meeting Summary link (right-aligned) */}
        <div className={`flex items-center justify-end ${AGENDA_CELL_PADDING}`}>
          {agendaDate.isPast && agendaDate.hasSummary && (
            <button
              className="text-xs text-cyan hover:text-cyan-dark transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation();
                onViewSummary?.(agendaDate.id);
              }}
            >
              Summary
            </button>
          )}
        </div>

        {/* [actions] - empty */}
        <div></div>
      </div>

      {/* Items */}
      {isExpanded && (
        <>
          {agendaDate.items.length > 0 ? (
            agendaDate.items.map((item, index) => (
              <AgendaItemRow key={item.id} item={item} index={index} />
            ))
          ) : (
            /* Empty state - 7 grid children */
            <div className={AGENDA_GRID_ROW}>
              {/* [expand] */}
              <div></div>
              {/* [item] through [actions] - content spans remaining columns */}
              <div className="col-span-6 py-6 text-center text-sm text-muted-foreground">
                No agenda items yet.
              </div>
            </div>
          )}

          {/* Add Item Row - 7 grid children */}
          <div className={`${AGENDA_GRID_ROW} hover:bg-muted/30 transition-colors`}>
            {/* [expand] - empty */}
            <div></div>
            {/* [item] - Add Item button */}
            <button
              className={`flex items-center gap-2 ${AGENDA_CELL_PADDING} text-sm text-muted-foreground hover:text-foreground transition-colors text-left`}
              onClick={() => onAddItem?.(agendaDate.id)}
            >
              <Plus className="w-4 h-4" />
              Add Item...
            </button>
            {/* [createdBy] */}
            <div></div>
            {/* [time] */}
            <div></div>
            {/* [description] */}
            <div></div>
            {/* [notes] */}
            <div></div>
            {/* [actions] */}
            <div></div>
          </div>
        </>
      )}
    </div>
  );
}
