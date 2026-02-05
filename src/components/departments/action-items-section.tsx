"use client";

import { useState, useRef, useCallback } from "react";
import { Search, ChevronDown, Check, Circle, Info, CheckSquare, User, Calendar, CalendarDays, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { OnboardingSpotlight } from "@/components/ui/onboarding-spotlight";
import { ActionItemDrawer } from "./action-item-drawer";
import { ActionItem, ActionItemStatus, Participant } from "@/lib/department-data";
import { cn } from "@/lib/utils";

interface ActionItemsSectionProps {
  actionItems: ActionItem[];
  participants: Participant[];
  onNavigateToAgenda?: () => void;
  onUpdateActionItem?: (id: string, updates: Partial<ActionItem>) => Promise<void>;
  onDeleteActionItem?: (id: string) => Promise<void>;
}

type StatusFilterType = "all" | ActionItemStatus;

export function ActionItemsSection({
  actionItems,
  participants,
  onNavigateToAgenda,
  onUpdateActionItem,
  onDeleteActionItem,
}: ActionItemsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);
  
  // Drawer state
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Local state for optimistic updates
  const [localActionItems, setLocalActionItems] = useState<ActionItem[]>(actionItems);

  // Sync local state with props when actionItems changes
  useState(() => {
    setLocalActionItems(actionItems);
  });

  // Ref for onboarding spotlight target
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle action item click to open drawer
  const handleItemClick = (item: ActionItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // Delay clearing the selected item to allow drawer close animation
    setTimeout(() => setSelectedItem(null), 200);
  };

  // Handle update action item with optimistic update
  const handleUpdateActionItem = useCallback(async (id: string, updates: Partial<ActionItem>) => {
    // Optimistic update
    setLocalActionItems(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
    
    // Also update the selected item if it's the one being updated
    setSelectedItem(prev => 
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
    
    try {
      // Call the actual update function
      await onUpdateActionItem?.(id, updates);
    } catch (error) {
      // Rollback on error - restore from original actionItems
      const originalItem = actionItems.find(item => item.id === id);
      if (originalItem) {
        setLocalActionItems(prev =>
          prev.map(item => item.id === id ? originalItem : item)
        );
        setSelectedItem(prev => 
          prev && prev.id === id ? originalItem : prev
        );
      }
      throw error;
    }
  }, [actionItems, onUpdateActionItem]);

  // Handle delete action item
  const handleDeleteActionItem = useCallback(async (id: string) => {
    // Optimistic update - remove from list
    setLocalActionItems(prev => prev.filter(item => item.id !== id));
    
    try {
      await onDeleteActionItem?.(id);
    } catch (error) {
      // Rollback on error - restore the item
      const deletedItem = actionItems.find(item => item.id === id);
      if (deletedItem) {
        setLocalActionItems(prev => [...prev, deletedItem]);
      }
      throw error;
    }
  }, [actionItems, onDeleteActionItem]);

  // Get unique assignees from action items (excluding null assignees)
  const assignees = localActionItems.reduce((acc, item) => {
    if (item.assignee && !acc.find((a) => a.id === item.assignee!.id)) {
      acc.push(item.assignee);
    }
    return acc;
  }, [] as { id: string; name: string; avatar?: string }[]);

  // Filter action items
  const filteredItems = localActionItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesAssignee = !assigneeFilter || (item.assignee && item.assignee.id === assigneeFilter);
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const hasItems = localActionItems.length > 0;

  // Status filter options
  const statusOptions: { value: StatusFilterType; label: string }[] = [
    { value: "all", label: "All statuses" },
    { value: "incomplete", label: "Incomplete" },
    { value: "in_progress", label: "In progress" },
    { value: "complete", label: "Complete" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with info tooltip */}
      <div className="flex items-center gap-2" ref={contentRef}>
        <h3 className="text-sm font-medium text-foreground">Action Items</h3>
        <Tooltip 
          content="To-dos created from agenda discussions."
          position="right"
        >
          <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
            <Info className="w-4 h-4 text-muted-foreground" />
          </button>
        </Tooltip>
      </div>

      {/* Onboarding Spotlight - shows only on first visit */}
      <OnboardingSpotlight
        id="action-items-onboarding"
        title="Action Items"
        description="Action items capture follow-ups from your meetings. They're created automatically from meeting transcripts or pulled from agenda discussions—so there's nothing to add manually here."
        targetRef={contentRef}
      />

      {/* Controls Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search action items…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!hasItems}
            className={cn(
              "w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white",
              "focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all",
              !hasItems && "opacity-50 cursor-not-allowed"
            )}
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => hasItems && setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            disabled={!hasItems}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-white",
              "hover:bg-muted/50 transition-colors",
              !hasItems && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>
              {statusOptions.find(opt => opt.value === statusFilter)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {isStatusDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsStatusDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-border rounded-lg shadow-lg z-20">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left hover:bg-muted/50 first:rounded-t-lg last:rounded-b-lg",
                      statusFilter === option.value && "bg-muted/30"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Assignee Filter */}
        <div className="relative">
          <button
            onClick={() => hasItems && setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
            disabled={!hasItems}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg bg-white",
              "hover:bg-muted/50 transition-colors",
              !hasItems && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>
              {assigneeFilter
                ? assignees.find((a) => a.id === assigneeFilter)?.name || "Assignee"
                : "All assignees"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {isAssigneeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsAssigneeDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                <button
                  onClick={() => {
                    setAssigneeFilter(null);
                    setIsAssigneeDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-muted/50 rounded-t-lg",
                    !assigneeFilter && "bg-muted/30"
                  )}
                >
                  All assignees
                </button>
                {assignees.map((assignee) => (
                  <button
                    key={assignee.id}
                    onClick={() => {
                      setAssigneeFilter(assignee.id);
                      setIsAssigneeDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left hover:bg-muted/50 flex items-center gap-2 last:rounded-b-lg",
                      assigneeFilter === assignee.id && "bg-muted/30"
                    )}
                  >
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                        {assignee.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{assignee.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-border rounded-lg overflow-hidden mt-2">
        {hasItems ? (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[40px_1fr_150px_100px_120px] items-center bg-muted/50 border-b border-[#e0f2fe] text-xs font-medium text-muted-foreground">
              <span></span>
              <span className="flex items-center gap-1.5 px-3 py-2">
                <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Action item</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-2">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Assignee</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-2">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Due date</span>
              </span>
              <Tooltip content="Meeting date" position="top">
                <span className="flex items-center gap-1.5 px-3 py-2">
                  <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Meeting</span>
                </span>
              </Tooltip>
            </div>

            {/* Action Items List */}
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <ActionItemRow 
                  key={item.id} 
                  item={item} 
                  index={index}
                  onClick={() => handleItemClick(item)}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No action items match your filters.
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-medium text-foreground mb-3">
              No action items yet
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Action items are created during meetings to track follow-ups from{" "}
              <button
                onClick={onNavigateToAgenda}
                className="text-primary hover:underline font-medium"
              >
                agenda discussions
              </button>
              .
            </p>
          </div>
        )}
      </div>

      {/* Action Item Drawer */}
      <ActionItemDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        participants={participants}
        onUpdateActionItem={handleUpdateActionItem}
        onDeleteActionItem={handleDeleteActionItem}
      />
    </div>
  );
}

// Action Item Row Component
interface ActionItemRowProps {
  item: ActionItem;
  index?: number;
  onClick?: () => void;
}

function ActionItemRow({ item, index = 0, onClick }: ActionItemRowProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const initials = item.assignee
    ? item.assignee.name.split(" ").map((n) => n[0]).join("")
    : "?";

  // Alternating row colors
  const isEvenRow = index % 2 === 0;
  const baseRowColor = isEvenRow ? "bg-white" : "bg-[#F7FDFE]";

  // Status icon based on status
  const getStatusIcon = () => {
    switch (item.status) {
      case "complete":
        return (
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-600" />
          </div>
        );
      case "in_progress":
        return (
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <Loader2 className="w-3 h-3 text-blue-600" />
          </div>
        );
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-[40px_1fr_150px_100px_120px] items-stretch border-b border-[#e0f2fe] last:border-b-0 transition-colors cursor-pointer",
        baseRowColor
      )}
      onClick={onClick}
      onMouseLeave={() => {
        setHoveredCell(null);
      }}
    >
      {/* Status Icon */}
      <div className="flex items-center justify-center px-2 py-3">
        {getStatusIcon()}
      </div>

      {/* Title */}
      <div
        className={cn(
          "flex items-center px-3 py-3 transition-all",
          hoveredCell === "title" ? "shadow-[inset_0_0_0_1px_#67e8f9]" : ""
        )}
        onMouseEnter={() => setHoveredCell("title")}
        onMouseLeave={() => setHoveredCell(null)}
      >
        <span className={cn(
          "text-sm truncate",
          item.status === "complete"
            ? "text-muted-foreground line-through"
            : "text-foreground"
        )}>
          {item.title}
        </span>
      </div>

      {/* Assignee */}
      <div 
        className={cn(
          "flex items-center gap-2 px-3 py-3 transition-all",
          hoveredCell === "assignee" ? "shadow-[inset_0_0_0_1px_#67e8f9]" : ""
        )}
        onMouseEnter={() => setHoveredCell("assignee")}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {item.assignee ? (
          <>
            <Avatar className="w-6 h-6 shrink-0">
              <AvatarImage src={item.assignee.avatar} alt={item.assignee.name} />
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {item.assignee.name}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted-foreground italic">Unassigned</span>
        )}
      </div>

      {/* Due Date */}
      <div 
        className={cn(
          "flex items-center px-3 py-3 transition-all",
          hoveredCell === "dueDate" ? "shadow-[inset_0_0_0_1px_#67e8f9]" : ""
        )}
        onMouseEnter={() => setHoveredCell("dueDate")}
        onMouseLeave={() => setHoveredCell(null)}
      >
        <span className="text-sm text-muted-foreground">{item.dueDate || "—"}</span>
      </div>

      {/* Meeting Date */}
      <div 
        className={cn(
          "flex items-center px-3 py-3 transition-all",
          hoveredCell === "meetingDate" ? "shadow-[inset_0_0_0_1px_#67e8f9]" : ""
        )}
        onMouseEnter={() => setHoveredCell("meetingDate")}
        onMouseLeave={() => setHoveredCell(null)}
      >
        <span className="text-sm text-muted-foreground">{item.meetingInstanceDate}</span>
      </div>
    </div>
  );
}
