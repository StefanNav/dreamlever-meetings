"use client";

import { use, useState, useRef, useEffect, Suspense } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Info } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DepartmentHeader } from "@/components/departments/department-header";
import { MeetingSummariesSection } from "@/components/departments/meeting-summaries-section";
import { PurposeSection } from "@/components/departments/purpose-section";
import { ParticipantsSection } from "@/components/departments/participants-section";
import { FilesSection } from "@/components/departments/files-section";
import { AgendaSection } from "@/components/departments/agenda-section";
import { FutureItemsSection } from "@/components/departments/future-items-section";
import { ActionItemsSection } from "@/components/departments/action-items-section";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { OnboardingSpotlight } from "@/components/ui/onboarding-spotlight";
import { getDepartmentById } from "@/lib/department-data";

// Miles AI Button component (reused from header)
function MileAiButton() {
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] flex items-center justify-center shadow-md cursor-pointer hover:shadow-lg hover:opacity-90 transition-all">
      <Image
        src="/miles-logo.png"
        alt="Miles AI"
        width={20}
        height={20}
        className="brightness-0 invert"
      />
    </div>
  );
}

function DepartmentDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read initial tab from URL query params
  const initialTab = searchParams.get("tab") || "overview";
  const targetInstance = searchParams.get("instance");
  const targetAgendaItem = searchParams.get("agendaItem");
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const overviewRef = useRef<HTMLDivElement>(null);

  const department = getDepartmentById(id);

  // Handle deep-link scroll and highlight when navigating to agenda tab
  useEffect(() => {
    if (activeTab === "agenda" && (targetInstance || targetAgendaItem)) {
      // Wait for DOM to render
      setTimeout(() => {
        // If we have an instance ID, expand that meeting instance
        if (targetInstance) {
          const instanceElement = document.querySelector(
            `[data-meeting-instance-id="${targetInstance}"]`
          );
          if (instanceElement) {
            // The date group might already be expanded, but we scroll to it
            instanceElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }

        // If we have an agenda item ID, scroll to and highlight it
        if (targetAgendaItem) {
          setTimeout(() => {
            const agendaElement = document.querySelector(
              `[data-agenda-item-id="${targetAgendaItem}"]`
            );
            if (agendaElement) {
              agendaElement.scrollIntoView({ behavior: "smooth", block: "center" });
              agendaElement.classList.add("source-highlight");
              setTimeout(() => {
                agendaElement.classList.remove("source-highlight");
              }, 2000);
            }
          }, 300);
        }
      }, 300);
    }
  }, [activeTab, targetInstance, targetAgendaItem]);

  if (!department) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Meetings", href: "/" },
    { label: department.name },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between py-4">
          <Breadcrumb
            items={breadcrumbItems}
            onCollapse={() => router.push("/")}
          />
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <MileAiButton />
          </div>
        </div>

        {/* Page Header */}
        <DepartmentHeader title={department.name} />

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList variant="line" className="border-b border-border">
            <TabsTrigger value="overview" className="pb-3 px-0 mr-6">
              Overview
            </TabsTrigger>
            <TabsTrigger value="agenda" className="pb-3 px-0 mr-6">
              Agenda
            </TabsTrigger>
            <TabsTrigger value="future" className="pb-3 px-0 mr-6">
              Future items
            </TabsTrigger>
            <TabsTrigger value="actions" className="pb-3 px-0">
              Action items
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6 space-y-8">
            {/* Header with info tooltip */}
            <div className="flex items-center gap-2" ref={overviewRef}>
              <h3 className="text-sm font-medium text-foreground">Overview</h3>
              <Tooltip
                content="View meeting details, summaries, participants, and files. This is the central hub for all meeting information."
                position="right"
              >
                <button className="p-0.5 rounded-full hover:bg-muted transition-colors">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
              </Tooltip>
            </div>

            {/* Onboarding Spotlight - shows only on first visit */}
            <OnboardingSpotlight
              id="overview-onboarding"
              title="Overview"
              description="The Overview tab is your meeting's home base. Here you'll find meeting summaries, the purpose of the meeting, participants, and any attached files."
              targetRef={overviewRef}
            />

            {/* Meeting Summaries */}
            <MeetingSummariesSection
              summaries={department.meetingSummaries}
              onSummaryClick={(summaryId) => {
                console.log("View summary:", summaryId);
              }}
            />

            {/* Purpose of Meeting */}
            <PurposeSection 
              purpose={department.purpose} 
              placeholder="e.g. Align on weekly engineering priorities and unblock progress"
            />

            {/* Participants */}
            <ParticipantsSection
              participants={department.participants}
              onAddMember={() => {
                console.log("Add member clicked");
              }}
            />

            {/* Files */}
            <FilesSection
              files={department.files}
              onFileClick={(fileId) => {
                console.log("View file:", fileId);
              }}
            />
          </TabsContent>

          {/* Agenda Tab Content */}
          <TabsContent value="agenda" className="mt-6">
            <AgendaSection
              agendaDates={department.agendaDates}
              onNewDate={() => {
                console.log("New date clicked");
              }}
              onAddItem={(dateId) => {
                console.log("Add item to date:", dateId);
              }}
              onViewSummary={(dateId) => {
                console.log("View summary for date:", dateId);
              }}
            />
          </TabsContent>

          {/* Future Items Tab Content */}
          <TabsContent value="future" className="mt-6">
            <FutureItemsSection
              futureItems={department.futureItems}
              meetingName={department.name}
              onNewItem={() => {
                console.log("New item clicked");
              }}
            />
          </TabsContent>

          {/* Action Items Tab Content */}
          <TabsContent value="actions" className="mt-6">
            <ActionItemsSection
              actionItems={department.actionItems}
              participants={department.participants}
              onNavigateToAgenda={() => setActiveTab("agenda")}
            />
          </TabsContent>
        </Tabs>

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}

export default function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DepartmentDetailContent id={id} />
    </Suspense>
  );
}
