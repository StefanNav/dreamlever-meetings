"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { expandCollapse } from "@/lib/animation";
import { Calendar, Clock, Users, ChevronDown, ChevronUp, Plus, X, Search } from "lucide-react";
import Link from "next/link";
import { Meeting } from "@/types/meetings";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "./status-badge";
import { MeetingSummaryDrawer } from "./meeting-summary-drawer";
import { cn } from "@/lib/utils";

const departmentAgendas = [
  { id: "operations", name: "Operations", color: "bg-operations", route: "1" },
  { id: "engineering", name: "Engineering", color: "bg-engineering", route: "2" },
  { id: "design", name: "Design", color: "bg-design", route: "3" },
  { id: "marketing", name: "Marketing", color: "bg-marketing", route: "4" },
  { id: "sales", name: "Sales", color: "bg-sales", route: "5" },
];


interface MeetingListItemProps {
  meeting: Meeting;
  className?: string;
}

export function MeetingListItem({ meeting, className }: MeetingListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(meeting.aiEnabled);
  const [selectedAgendas, setSelectedAgendas] = useState<string[]>(
    meeting.agenda ? [meeting.agenda] : []
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [agendaSearch, setAgendaSearch] = useState("");
  const [agendaPopoverOpen, setAgendaPopoverOpen] = useState(false);

  const isPast = meeting.status === "past";
  const isLive = meeting.status === "live";
  const isRecurring = meeting.status === "recurring";
  const canAddToAgenda = !isPast;
  const hasExpandableContent =
    meeting.agendaItems?.length || meeting.previousSummary || meeting.description;

  const availableDepartments = departmentAgendas.filter(
    (dept) => !selectedAgendas.includes(dept.id)
  );

  const filteredDepartments = availableDepartments.filter((dept) =>
    dept.name.toLowerCase().includes(agendaSearch.toLowerCase())
  );

  const handleAddToAgenda = (departmentId: string) => {
    setSelectedAgendas((prev) => [...prev, departmentId]);
  };

  const handleRemoveFromAgenda = (departmentId: string) => {
    setSelectedAgendas((prev) => prev.filter((id) => id !== departmentId));
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border transition-all hover:shadow-sm hover:border-cyan",
        className
      )}
    >
      {/* Main Row */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{meeting.title}</h4>
              <StatusBadge status={meeting.status} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {meeting.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {meeting.participantCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip content={aiEnabled ? "AI Assistant is enabled" : "AI Assistant is disabled"} position="left">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-muted-foreground">AI</span>
              <Switch
                checked={aiEnabled}
                onCheckedChange={setAiEnabled}
                className="data-[state=checked]:bg-cyan"
              />
            </div>
          </Tooltip>

          {isLive && (
            <Button
              size="sm"
              className="bg-cyan hover:bg-cyan-dark text-white"
            >
              Join
            </Button>
          )}

          {hasExpandableContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Agenda Section */}
      {canAddToAgenda && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {availableDepartments.length > 0 && (
              <Popover
                open={agendaPopoverOpen}
                onOpenChange={(open) => {
                  setAgendaPopoverOpen(open);
                  if (!open) setAgendaSearch("");
                }}
              >
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    Add to Agenda
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="start">
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={agendaSearch}
                        onChange={(e) => setAgendaSearch(e.target.value)}
                        placeholder="Search agendas..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="p-1 max-h-48 overflow-y-auto">
                    {filteredDepartments.length > 0 ? (
                      filteredDepartments.map((dept) => (
                        <button
                          key={dept.id}
                          onClick={() => {
                            handleAddToAgenda(dept.id);
                            setAgendaSearch("");
                            setAgendaPopoverOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                          <span className={cn("w-2 h-2 rounded-full", dept.color)} />
                          {dept.name}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No agendas found
                      </p>
                    )}
                  </div>
                  <div className="border-t border-border p-1">
                    <button
                      onClick={() => setAgendaPopoverOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-cyan rounded-md hover:bg-cyan-light/50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create New Agenda
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {selectedAgendas.map((agendaId) => {
              const dept = departmentAgendas.find((d) => d.id === agendaId);
              if (!dept) return null;
              return (
                <span
                  key={dept.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-foreground"
                >
                  <Link
                    href={`/departments/${dept.route}?tab=agenda`}
                    className="inline-flex items-center gap-1.5 hover:text-cyan-dark transition-colors"
                  >
                    <span className={cn("w-2 h-2 rounded-full", dept.color)} />
                    {dept.name}
                  </Link>
                  <button
                    onClick={() => handleRemoveFromAgenda(dept.id)}
                    className="ml-0.5 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${dept.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && hasExpandableContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={expandCollapse}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <div className="bg-cyan-light/50 rounded-lg p-4 border border-cyan/20">
                {/* Description */}
                {meeting.description && (
                  <p className="text-sm text-muted-foreground italic mb-3">
                    {meeting.description}
                  </p>
                )}

                {/* Agenda Items (for upcoming/recurring) */}
                {!isPast && meeting.agendaItems && meeting.agendaItems.length > 0 && (
                  <>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Agenda:
                    </p>
                    <ul className="space-y-1.5 mb-3">
                      {meeting.agendaItems.map((item) => (
                        <li
                          key={item.id}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-cyan mt-0.5">•</span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="text-sm text-cyan hover:text-cyan-dark transition-colors font-medium">
                      Edit Agenda
                    </button>
                  </>
                )}

                {/* Previous Summary (for past meetings) */}
                {isPast && meeting.previousSummary && (
                  <>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Previous Meeting Summary
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {meeting.previousSummary}
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className="text-sm text-cyan hover:text-cyan-dark transition-colors font-medium"
                    >
                      View Full Transcript
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meeting Summary Drawer */}
      <MeetingSummaryDrawer
        meeting={meeting}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
