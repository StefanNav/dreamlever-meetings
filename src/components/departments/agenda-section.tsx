"use client";

import { useRef } from "react";
import { Plus, Info, FileText, User, Clock, AlignLeft, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { OnboardingSpotlight } from "@/components/ui/onboarding-spotlight";
import { AgendaDate } from "@/lib/department-data";
import { AgendaDateGroup } from "./agenda-date-group";
import { AGENDA_GRID_ROW, AGENDA_CELL_PADDING } from "./agenda-constants";

interface AgendaSectionProps {
  agendaDates: AgendaDate[];
  onNewDate?: () => void;
  onAddItem?: (dateId: string) => void;
  onViewSummary?: (dateId: string) => void;
}

export function AgendaSection({
  agendaDates,
  onNewDate,
  onAddItem,
  onViewSummary,
}: AgendaSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      {/* Header with info tooltip */}
      <div className="flex items-center gap-2" ref={contentRef}>
        <h3 className="text-sm font-medium text-foreground">Agenda</h3>
        <Tooltip
          content="Plan and organize discussion topics for each meeting date. Add items, assign time, and track what needs to be covered."
          position="right"
        >
          <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </Tooltip>
      </div>

      {/* Onboarding Spotlight - shows only on first visit */}
      <OnboardingSpotlight
        id="agenda-onboarding"
        title="Agenda"
        description="Use the Agenda tab to plan what will be discussed in each meeting. Add topics, assign time allocations, and keep your meetings focused and productive."
        targetRef={contentRef}
      />

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {/* Top Row with CTA Button */}
        <div className="flex items-center px-4 py-2 bg-muted/50 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onNewDate}
          >
            <Plus className="w-4 h-4" />
            New Date
          </Button>
        </div>

        {/* Column Headers - 7 grid children */}
        <div className={`${AGENDA_GRID_ROW} bg-muted/50 border-b border-border-table text-xs font-medium text-muted-foreground`}>
          {/* [expand] */}
          <div></div>
          {/* [item] */}
          <div className={`flex items-center gap-1.5 ${AGENDA_CELL_PADDING}`}>
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Item</span>
          </div>
          {/* [createdBy] */}
          <div className={`flex items-center gap-1.5 ${AGENDA_CELL_PADDING}`}>
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Created by</span>
          </div>
          {/* [time] */}
          <Tooltip content="Time allocated" position="top">
            <div className={`flex items-center gap-1.5 ${AGENDA_CELL_PADDING}`}>
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Time</span>
            </div>
          </Tooltip>
          {/* [description] */}
          <div className={`flex items-center gap-1.5 ${AGENDA_CELL_PADDING}`}>
            <AlignLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Description</span>
          </div>
          {/* [notes] */}
          <div className={`flex items-center gap-1.5 ${AGENDA_CELL_PADDING}`}>
            <StickyNote className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Notes</span>
          </div>
          {/* [actions] */}
          <div className="flex items-center justify-center">
            <button
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label="Add column"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Groups */}
        {agendaDates.length > 0 ? (
          agendaDates.map((agendaDate) => (
            <AgendaDateGroup
              key={agendaDate.id}
              agendaDate={agendaDate}
              onAddItem={onAddItem}
              onViewSummary={onViewSummary}
            />
          ))
        ) : (
          /* Empty state - 7 grid children, content spans visually via first cell + colspan trick */
          <div className={AGENDA_GRID_ROW}>
            {/* [expand] */}
            <div></div>
            {/* [item] through [actions] - use col-span-6 on a wrapper */}
            <div className="col-span-6 px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                No meeting dates scheduled yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Click{" "}
                <button
                  onClick={onNewDate}
                  className="text-primary hover:underline font-medium"
                >
                  New Date
                </button>{" "}
                to add your first meeting date and start building your agenda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

