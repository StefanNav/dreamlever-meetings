"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Settings, Calendar, X } from "lucide-react";
import { format } from "date-fns";
import { Meeting, MeetingListFilter as FilterType } from "@/types/meetings";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MeetingListFilter } from "./meeting-list-filter";
import { MeetingListItem } from "./meeting-list-item";
import { AiSettingsModal } from "./ai-settings-modal";

interface AllMeetingsSectionProps {
  initialMeetings: Meeting[];
}

export function AllMeetingsSection({ initialMeetings }: AllMeetingsSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAiSettingsOpen, setIsAiSettingsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [visibleSection, setVisibleSection] = useState<"upcoming" | "past">("upcoming");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const upcomingSectionRef = useRef<HTMLDivElement>(null);
  const pastSectionRef = useRef<HTMLDivElement>(null);

  // Detect when header becomes sticky and which section is visible
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // Header is sticky when its top is at or near 0
        setIsSticky(rect.top <= 0);
      }

      // Determine which section is currently visible (based on header position)
      const headerHeight = headerRef.current?.getBoundingClientRect().height || 0;
      const offset = headerHeight + 100; // Account for sticky header + buffer

      const upcomingRect = upcomingSectionRef.current?.getBoundingClientRect();
      const pastRect = pastSectionRef.current?.getBoundingClientRect();

      // Determine which section is visible
      if (pastRect && pastRect.top <= offset) {
        setVisibleSection("past");
      } else {
        setVisibleSection("upcoming");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to section when tab is clicked
  const handleTabClick = useCallback((tab: FilterType) => {
    const headerHeight = headerRef.current?.getBoundingClientRect().height || 120;
    
    if (tab === "upcoming") {
      // Scroll to upcoming section
      if (upcomingSectionRef.current) {
        const y = upcomingSectionRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else if (tab === "past") {
      // Scroll to past section
      if (pastSectionRef.current) {
        const y = pastSectionRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  }, []);

  const clearDateFilter = useCallback(() => {
    setSelectedDate(undefined);
  }, []);

  // Filter meetings based on selected date only (no status filtering)
  const filteredMeetings = selectedDate 
    ? initialMeetings.filter((meeting) => {
        const meetingDateStr = meeting.date.toLowerCase();
        const selectedDateStr = format(selectedDate, "MMM d").toLowerCase();
        const selectedDateStrAlt = format(selectedDate, "MMMM d").toLowerCase();
        
        // Handle "Today" case
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        
        if (isToday && meetingDateStr === "today") {
          return true;
        }
        return meetingDateStr.includes(selectedDateStr) || meetingDateStr.includes(selectedDateStrAlt);
      })
    : initialMeetings;

  // Group meetings by upcoming/past for display
  const upcomingMeetings = filteredMeetings.filter(
    (m) => m.status === "upcoming" || m.status === "live" || m.status === "recurring"
  );
  const pastMeetings = filteredMeetings.filter((m) => m.status === "past");

  return (
    <section ref={sectionRef} className="mt-10 scroll-mt-4">
      {/* Sticky Header with Title and Tab Bar */}
      <div ref={headerRef} className="sticky top-0 z-20 bg-background pb-3 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold text-heading-1">All Meetings</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-b from-white to-surface-filter border border-border-light text-heading-1 hover:text-cyan hover:bg-cyan-light/50 shadow-[0_2px_4px_0_rgba(63,140,156,0.15)] transition-all duration-200"
            onClick={() => setIsAiSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
            AI Settings
          </button>
        </div>
        {/* Tab bar - fills width with calendar inside */}
        <div 
          className={`transition-all duration-200 ${
            isSticky ? "pb-3 border-b border-border-light" : ""
          }`}
        >
          <MeetingListFilter 
            activeFilter={visibleSection} 
            onFilterChange={handleTabClick} 
          >
            {/* Selected date badge */}
            {selectedDate && (
              <div className="flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-[10px] text-sm font-medium">
                <span>{format(selectedDate, "MMM d, yyyy")}</span>
                <button 
                  onClick={clearDateFilter}
                  className="ml-1 hover:bg-cyan-100 rounded-full p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {/* Calendar icon button */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-border-light text-text-secondary hover:text-cyan hover:bg-cyan-light/50 transition-all duration-200"
                  aria-label="Select date"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </MeetingListFilter>
        </div>
      </div>

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isAiSettingsOpen}
        onClose={() => setIsAiSettingsOpen(false)}
      />

      {/* Meeting Lists */}
      <div className="space-y-8 mt-6">
        {/* Empty state for date filter */}
        {selectedDate && filteredMeetings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No meetings on {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <p className="text-muted-foreground mb-4">
              There are no meetings scheduled for this date.
            </p>
            <Button variant="outline" onClick={clearDateFilter}>
              Clear date filter
            </Button>
          </div>
        )}

        {/* Upcoming Section - always visible */}
        {upcomingMeetings.length > 0 && (
          <div ref={upcomingSectionRef}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {selectedDate ? `Upcoming on ${format(selectedDate, "MMM d")}` : "Upcoming"}
            </h3>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <MeetingListItem key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </div>
        )}

        {/* Past Section - always visible */}
        {pastMeetings.length > 0 && (
          <div ref={pastSectionRef}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              {selectedDate ? `Past on ${format(selectedDate, "MMM d")}` : "Past"}
            </h3>
            <div className="space-y-3">
              {pastMeetings.map((meeting) => (
                <MeetingListItem key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
