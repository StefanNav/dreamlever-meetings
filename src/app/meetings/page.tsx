"use client";

import { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import { DayFilter, DayOfWeek, RecurringMeeting } from "@/types/meetings";
import { recurringMeetings, allMeetings } from "@/lib/mock-data";
import { Header } from "@/components/layout/header";
import { DayTabs } from "@/components/meetings/day-tabs";
import { RecurringMeetingsGrid } from "@/components/meetings/recurring-meetings-grid";
import { AllMeetingsSection } from "@/components/meetings/all-meetings-section";
import { FolderAgendaCard } from "@/components/ui/folder-agenda-card";
import { FolderDayFilter, type FolderDayFilter as FolderDayFilterType } from "@/components/meetings/folder-day-filter";

// Sample data for folder agenda cards demo
const folderAgendaData = [
  {
    id: "1",
    departmentLabel: "Operations",
    cadence: "Mondays · 9:00 AM",
    agendaItems: [
      "Review Q1 roadmap priorities",
      "Discuss hiring pipeline updates",
      "Engineering capacity planning",
      "Budget allocation review",
      "Team performance metrics",
      "Cross-department collaboration",
      "Quarterly OKR review",
    ],
    count: 7,
    avatars: [
      { id: "1", name: "Alex Johnson" },
      { id: "2", name: "Sarah Chen" },
      { id: "3", name: "Mike Williams" },
      { id: "4", name: "Emily Davis" },
      { id: "5", name: "Chris Brown" },
      { id: "6", name: "Lisa Wang" },
      { id: "7", name: "David Kim" },
      { id: "8", name: "Rachel Green" },
    ],
  },
  {
    id: "2",
    departmentLabel: "Engineering",
    cadence: "Tue / Thu · 10:00 AM",
    agendaItems: [
      "Sprint retrospective",
      "Technical debt review",
      "Architecture decisions",
      "Code review standards",
      "Performance optimization",
    ],
    count: 5,
    avatars: [
      { id: "1", name: "Tom Harris" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Bob Wilson" },
      { id: "4", name: "Amy Lee" },
    ],
  },
  {
    id: "3",
    departmentLabel: "Design",
    cadence: "Wednesdays · 2:00 PM",
    agendaItems: [
      "Component library updates",
      "User testing results",
      "Accessibility audit",
      "Design system docs",
      "Icon library expansion",
      "Mobile patterns review",
    ],
    count: 6,
    avatars: [
      { id: "1", name: "Kate Moore" },
      { id: "2", name: "Ryan Taylor" },
      { id: "3", name: "Olivia Brown" },
    ],
  },
  {
    id: "4",
    departmentLabel: "Marketing",
    cadence: "Mon / Wed · 1:00 PM",
    agendaItems: [
      "Campaign budget review",
      "Social media rollout",
      "Content calendar planning",
      "Brand partnership opportunities",
    ],
    count: 4,
    avatars: [
      { id: "1", name: "Mark Johnson" },
      { id: "2", name: "Nina Patel" },
      { id: "3", name: "Steve Clark" },
      { id: "4", name: "Laura White" },
      { id: "5", name: "James Brown" },
    ],
  },
  {
    id: "5",
    departmentLabel: "Sales",
    cadence: "Fridays · 8:30 AM",
    agendaItems: [
      "Pipeline review",
      "Lead qualification criteria",
      "CRM workflow optimization",
      "Customer feedback analysis",
      "Competitor analysis update",
    ],
    count: 5,
    avatars: [
      { id: "1", name: "Peter Jones" },
      { id: "2", name: "Mary Wilson" },
      { id: "3", name: "John Davis" },
      { id: "4", name: "Susan Lee" },
      { id: "5", name: "Robert Chen" },
      { id: "6", name: "Emma Wang" },
    ],
  },
  {
    id: "6",
    departmentLabel: "Product",
    cadence: "Thursdays · 11:00 AM",
    agendaItems: [
      "Roadmap prioritization",
      "Feature requests review",
      "User story refinement",
      "Release planning",
      "Stakeholder updates",
      "Metrics dashboard review",
    ],
    count: 6,
    avatars: [
      { id: "1", name: "Chris Martin" },
      { id: "2", name: "Anna Kim" },
      { id: "3", name: "David Park" },
    ],
  },
];

// Helper function to extract days from cadence string
function getDaysFromCadence(cadence: string): string[] {
  const dayMap: Record<string, string> = {
    "monday": "mon", "mondays": "mon", "mon": "mon",
    "tuesday": "tue", "tuesdays": "tue", "tue": "tue",
    "wednesday": "wed", "wednesdays": "wed", "wed": "wed",
    "thursday": "thu", "thursdays": "thu", "thu": "thu",
    "friday": "fri", "fridays": "fri", "fri": "fri",
    "saturday": "sat", "saturdays": "sat", "sat": "sat",
    "sunday": "sun", "sundays": "sun", "sun": "sun",
  };
  
  const lowerCadence = cadence.toLowerCase();
  const foundDays: string[] = [];
  
  for (const [key, value] of Object.entries(dayMap)) {
    if (lowerCadence.includes(key) && !foundDays.includes(value)) {
      foundDays.push(value);
    }
  }
  
  return foundDays;
}

// Today is Monday - define the day order starting from Monday
const DAY_ORDER: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const TODAY: DayOfWeek = "mon";

function filterMeetingsByDay(
  meetings: RecurringMeeting[],
  filter: DayFilter
): RecurringMeeting[] {
  if (filter === "coming-up") {
    // Show all meetings from today (Monday) onwards
    const todayIndex = DAY_ORDER.indexOf(TODAY);
    const upcomingDays = DAY_ORDER.slice(todayIndex);
    return meetings.filter((m) => upcomingDays.includes(m.dayOfWeek));
  }

  // Filter by specific day
  const dayFilter = filter as DayOfWeek;
  return meetings.filter((m) => m.dayOfWeek === dayFilter);
}

export default function MeetingsPage() {
  const [activeDay, setActiveDay] = useState<DayFilter>("coming-up");
  const [folderFilter, setFolderFilter] = useState<FolderDayFilterType>("all");

  // Filter meetings based on selected day
  const filteredRecurringMeetings = useMemo(
    () => filterMeetingsByDay(recurringMeetings, activeDay),
    [activeDay]
  );

  // Filter folders based on selected day filter
  const filteredFolders = useMemo(() => {
    if (folderFilter === "all") return folderAgendaData;
    return folderAgendaData.filter((folder) => {
      const days = getDaysFromCadence(folder.cadence);
      return days.includes(folderFilter);
    });
  }, [folderFilter]);

  return (
    <>
      {/* Main content wrapper */}
      <div className="max-w-6xl mx-auto px-8">
        <Header />

        {/* Day Filter for Folders */}
        <div className="mt-2">
          <FolderDayFilter activeFilter={folderFilter} onFilterChange={setFolderFilter} />
        </div>

        {/* Department Folders Section */}
        <section className="mt-16">
          {filteredFolders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {filteredFolders.map((folder) => (
                <FolderAgendaCard
                  key={folder.id}
                  departmentLabel={folder.departmentLabel}
                  cadence={folder.cadence}
                  agendaItems={folder.agendaItems}
                  count={folder.count}
                  avatars={folder.avatars}
                  href={`/departments/${folder.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-heading-1 mb-2">
                No meetings scheduled
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                There are no recurring meetings scheduled for this day. Try selecting a different day or view all meetings.
              </p>
            </div>
          )}
        </section>

        {/* HIDDEN: Day Tabs - preserved for future use
        <div className="mt-2">
          <DayTabs activeDay={activeDay} onDayChange={setActiveDay} />
        </div>
        */}

        {/* HIDDEN: Recurring Meetings - preserved for future use
        <section className="mt-8">
          <RecurringMeetingsGrid
            meetings={filteredRecurringMeetings}
            activeDay={activeDay}
          />
        </section>
        */}

        {/* All Meetings Section */}
        <div className="mt-20">
          <AllMeetingsSection initialMeetings={allMeetings} />
        </div>

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </>
  );
}
