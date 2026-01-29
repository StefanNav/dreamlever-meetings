"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Meeting } from "@/types/meetings";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

// Mock department agendas data
const departmentAgendas = [
  { id: "1", name: "Operations", color: "#7a5af8", bgColor: "rgba(122, 90, 248, 0.1)", textColor: "#7a5af8" },
  { id: "2", name: "Engineering", color: "#3b82f6", bgColor: "rgba(59, 130, 246, 0.1)", textColor: "#3b82f6" },
  { id: "3", name: "Design", color: "#ec4899", bgColor: "rgba(236, 72, 153, 0.1)", textColor: "#ec4899" },
  { id: "4", name: "Marketing", color: "#f97316", bgColor: "rgba(249, 115, 22, 0.1)", textColor: "#f97316" },
  { id: "5", name: "Sales", color: "#22c55e", bgColor: "rgba(34, 197, 94, 0.1)", textColor: "#22c55e" },
  { id: "6", name: "Product", color: "#d4a024", bgColor: "rgba(212, 160, 36, 0.1)", textColor: "#b8901c" },
];

interface MeetingListItemProps {
  meeting: Meeting;
  className?: string;
}

export function MeetingListItem({ meeting, className }: MeetingListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(meeting.aiEnabled);
  const [isAgendaDropdownOpen, setIsAgendaDropdownOpen] = useState(false);
  const [selectedAgendas, setSelectedAgendas] = useState<string[]>([]);

  const isPast = meeting.status === "past";
  const isLive = meeting.status === "live";
  const isRecurring = meeting.status === "recurring";
  const canAddToAgenda = !isPast && !isRecurring;
  const hasExpandableContent =
    meeting.agendaItems?.length || meeting.previousSummary || meeting.description;

  // Handle adding meeting to an agenda
  const handleAddToAgenda = (departmentId: string) => {
    if (!selectedAgendas.includes(departmentId)) {
      setSelectedAgendas([...selectedAgendas, departmentId]);
    }
    setIsAgendaDropdownOpen(false);
  };

  // Handle removing meeting from an agenda
  const handleRemoveFromAgenda = (departmentId: string) => {
    setSelectedAgendas(selectedAgendas.filter(id => id !== departmentId));
  };

  // Get departments that haven't been selected yet
  const availableDepartments = departmentAgendas.filter(
    dept => !selectedAgendas.includes(dept.id)
  );

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border overflow-hidden transition-all hover:shadow-sm hover:border-cyan",
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
            {canAddToAgenda && (
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {/* Add to Agenda button */}
                <Popover open={isAgendaDropdownOpen} onOpenChange={setIsAgendaDropdownOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark transition-colors"
                      aria-label="Add to Agenda"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Agenda</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="start">
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground">Add to Agenda</p>
                    </div>
                    <div className="py-1">
                      {availableDepartments.length > 0 ? (
                        availableDepartments.map((dept) => (
                          <button
                            key={dept.id}
                            onClick={() => handleAddToAgenda(dept.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <span 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: dept.color }}
                            />
                            <span className="text-foreground">{dept.name}</span>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-2 text-sm text-muted-foreground">
                          Added to all agendas
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Department tags */}
                {selectedAgendas.map((deptId) => {
                  const dept = departmentAgendas.find(d => d.id === deptId);
                  if (!dept) return null;
                  return (
                    <span
                      key={dept.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: dept.bgColor,
                        color: dept.textColor,
                        borderColor: `${dept.color}30`,
                      }}
                    >
                      {dept.name}
                      <button
                        onClick={() => handleRemoveFromAgenda(dept.id)}
                        className="ml-0.5 hover:opacity-70 transition-opacity"
                        aria-label={`Remove from ${dept.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
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

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && hasExpandableContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
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
                    <button className="text-sm text-cyan hover:text-cyan-dark transition-colors font-medium">
                      View Full Transcript
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
