"use client";

import { useState, useRef } from "react";
import { Plus, Info, FileText, User, Clock, AlignLeft, Calendar } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { OnboardingSpotlight } from "@/components/ui/onboarding-spotlight";
import { FutureItem } from "@/lib/department-data";
import { FutureItemRow } from "./future-item-row";
import { FutureItemDrawer } from "./future-item-drawer";

interface FutureItemsSectionProps {
  futureItems: FutureItem[];
  meetingName?: string;
  onNewItem?: () => void;
}

export function FutureItemsSection({
  futureItems,
  meetingName = "Operations",
  onNewItem,
}: FutureItemsSectionProps) {
  const [selectedItem, setSelectedItem] = useState<FutureItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (item: FutureItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with info tooltip */}
      <div className="flex items-center gap-2" ref={contentRef}>
        <h3 className="text-sm font-medium text-foreground">Future Items</h3>
        <Tooltip
          content="Capture topics and ideas for future meetings. These items can be moved to the agenda when you're ready to discuss them."
          position="right"
        >
          <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </Tooltip>
      </div>

      {/* Onboarding Spotlight - shows only on first visit */}
      <OnboardingSpotlight
        id="future-items-onboarding"
        title="Future Items"
        description="Use Future Items to capture topics you want to discuss later. When you're ready, move them to the Agenda for an upcoming meeting."
        targetRef={contentRef}
      />

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-[220px_150px_120px_1fr_120px_32px] items-center bg-muted/50 border-b border-[#e0f2fe] text-xs font-medium text-muted-foreground">
          <div className="px-4 py-2 pl-12 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Item</span>
          </div>
          <div className="px-4 py-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Created by</span>
          </div>
          <Tooltip content="Time allocated" position="top">
            <div className="px-4 py-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Time</span>
            </div>
          </Tooltip>
          <div className="px-4 py-2 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Description</span>
          </div>
          <Tooltip content="Date added" position="top">
            <div className="px-4 py-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Date</span>
            </div>
          </Tooltip>
          <div className="px-4 py-2 flex items-center justify-center">
            <button
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label="Add column"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item Rows */}
        {futureItems.map((item, index) => (
          <FutureItemRow
            key={item.id}
            item={item}
            index={index}
            onEditClick={handleEditClick}
          />
        ))}

        {/* Add item row - at bottom when items exist, above empty state when empty */}
        <div className={`px-4 py-2 pl-12 ${futureItems.length > 0 ? "border-t border-[#e0f2fe]" : ""}`}>
          <button
            onClick={onNewItem}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Add item...
          </button>
        </div>

        {/* Empty state message - only shown when no items */}
        {futureItems.length === 0 && (
          <div className="px-6 py-12 text-center border-t border-[#e0f2fe]">
            <p className="text-sm font-medium text-foreground mb-2">
              No future items yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Click{" "}
              <button
                onClick={onNewItem}
                className="text-primary hover:underline font-medium"
              >
                Add item
              </button>{" "}
              to add topics for future meetings.
            </p>
          </div>
        )}
      </div>

      {/* Item Detail Drawer */}
      <FutureItemDrawer
        item={selectedItem}
        meetingName={meetingName}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
