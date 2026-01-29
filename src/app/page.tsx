"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { DayFilter, DayOfWeek, RecurringMeeting } from "@/types/meetings";
import { recurringMeetings, allMeetings } from "@/lib/mock-data";
import { Header } from "@/components/layout/header";
import { DayTabs } from "@/components/meetings/day-tabs";
import { RecurringMeetingsGrid } from "@/components/meetings/recurring-meetings-grid";
import { AllMeetingsSection } from "@/components/meetings/all-meetings-section";
import { FolderAgendaCard } from "@/components/ui/folder-agenda-card";

// Sample data for folder agenda cards demo
const folderAgendaData = [
  {
    id: "1",
    departmentLabel: "Operations",
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
    color: "purple" as const,
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
    agendaItems: [
      "Sprint retrospective",
      "Technical debt review",
      "Architecture decisions",
      "Code review standards",
      "Performance optimization",
    ],
    count: 5,
    color: "blue" as const,
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
    agendaItems: [
      "Component library updates",
      "User testing results",
      "Accessibility audit",
      "Design system docs",
      "Icon library expansion",
      "Mobile patterns review",
    ],
    count: 6,
    color: "pink" as const,
    avatars: [
      { id: "1", name: "Kate Moore" },
      { id: "2", name: "Ryan Taylor" },
      { id: "3", name: "Olivia Brown" },
    ],
  },
  {
    id: "4",
    departmentLabel: "Marketing",
    agendaItems: [
      "Campaign budget review",
      "Social media rollout",
      "Content calendar planning",
      "Brand partnership opportunities",
    ],
    count: 4,
    color: "orange" as const,
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
    agendaItems: [
      "Pipeline review",
      "Lead qualification criteria",
      "CRM workflow optimization",
      "Customer feedback analysis",
      "Competitor analysis update",
    ],
    count: 5,
    color: "green" as const,
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
    agendaItems: [
      "Roadmap prioritization",
      "Feature requests review",
      "User story refinement",
      "Release planning",
      "Stakeholder updates",
      "Metrics dashboard review",
    ],
    count: 6,
    color: "yellow" as const,
    avatars: [
      { id: "1", name: "Chris Martin" },
      { id: "2", name: "Anna Kim" },
      { id: "3", name: "David Park" },
    ],
  },
];

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

  // Filter meetings based on selected day
  const filteredRecurringMeetings = useMemo(
    () => filterMeetingsByDay(recurringMeetings, activeDay),
    [activeDay]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Collapsed sidebar indicator */}
      <div className="fixed left-0 top-0 bottom-0 w-6 bg-white border-r border-border flex items-start pt-8 justify-center z-10">
        <button
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Main content wrapper - accounts for sidebar */}
      <div className="pl-6">
        <main className="max-w-6xl mx-auto px-8">
        <Header />

        {/* Department Folders Section - moved to top */}
        <section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {folderAgendaData.map((folder) => (
              <FolderAgendaCard
                key={folder.id}
                departmentLabel={folder.departmentLabel}
                agendaItems={folder.agendaItems}
                count={folder.count}
                color={folder.color}
                avatars={folder.avatars}
                href={`/departments/${folder.id}`}
              />
            ))}
          </div>
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
      </main>
      </div>
    </div>
  );
}
