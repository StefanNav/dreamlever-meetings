// Department detail data types and mock data

export interface Participant {
  id: string;
  name: string;
  role: "owner" | "participant";
  avatar?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: "pdf" | "xlsx" | "doc" | "ppt" | "other";
  size: string;
}

export interface MeetingSummary {
  id: string;
  date: string;
  title: string;
}

// New Agenda types
export interface AgendaItem {
  id: string;
  title: string;
  createdBy: { id: string; name: string; avatar?: string };
  timeAllocated: string; // e.g., "15 min"
  description: string;
  notes?: string;
}

export interface AgendaDate {
  id: string;
  date: string; // e.g., "25 July 2025"
  isPast: boolean;
  hasSummary: boolean;
  items: AgendaItem[];
}

// Future Items types
export interface FutureItem {
  id: string;
  title: string;
  createdBy: { id: string; name: string; avatar?: string };
  timeAllocated: string; // e.g., "15 min"
  description: string;
  dateAdded: string; // e.g., "04/25/2025"
  notes?: string;
  actionItems?: string[];
}

// Action Items types
export type ActionItemStatus = "incomplete" | "in_progress" | "complete";

export interface ActionItem {
  id: string;
  title: string;
  status: ActionItemStatus;
  assignee: { id: string; name: string; avatar?: string } | null;
  dueDate?: string;
  notes?: string;
  createdByName?: string;
  createdAt?: string;
  // Origin tracking fields for deep-linking
  meetingSeriesId: string;
  meetingSeriesName: string;
  meetingInstanceId?: string;
  meetingInstanceDate: string;
  agendaItemId?: string;
  agendaItemTitle?: string;
  transcriptChunkId?: string;
  source: "agenda" | "transcript"; // Where the action item originated
}

export interface DepartmentDetail {
  id: string;
  name: string;
  cadence: string;
  purpose: string;
  participants: Participant[];
  files: FileItem[];
  meetingSummaries: MeetingSummary[];
  agendaItems: string[]; // Legacy - kept for backward compatibility
  agendaDates: AgendaDate[]; // New structured agenda
  futureItems: FutureItem[]; // Future items for upcoming meetings
  actionItems: ActionItem[]; // Action items from meetings
  color: "purple" | "blue" | "green" | "orange" | "pink" | "yellow";
}

export const departmentDetails: Record<string, DepartmentDetail> = {
  "1": {
    id: "1",
    name: "Operations",
    cadence: "Mondays · 9:00 AM",
    color: "purple",
    purpose:
      "To review recent operational performance, align on upcoming initiatives and resource needs, finalize preparations for key launches, and ensure strong collaboration between operations and executive leadership as the company enters a key growth phase.",
    participants: [
      { id: "p1", name: "Alex Johnson", role: "owner" },
      { id: "p2", name: "Sarah Chen", role: "participant" },
      { id: "p3", name: "Mike Williams", role: "participant" },
      { id: "p4", name: "Emily Davis", role: "participant" },
    ],
    files: [
      { id: "f1", name: "Operations Guidelines.pdf", type: "pdf", size: "200 KB" },
      { id: "f2", name: "2025 Performance Metrics.xlsx", type: "xlsx", size: "450 KB" },
      { id: "f3", name: "Q1 Roadmap Overview.pdf", type: "pdf", size: "320 KB" },
    ],
    meetingSummaries: [
      { id: "ms1", date: "Jan 27, 2025", title: "Weekly Ops Sync - Q1 Planning" },
      { id: "ms2", date: "Jan 20, 2025", title: "Weekly Ops Sync - Budget Review" },
      { id: "ms3", date: "Jan 13, 2025", title: "Weekly Ops Sync - Team Updates" },
    ],
    agendaItems: [
      "Review Q1 roadmap priorities",
      "Discuss hiring pipeline updates",
      "Engineering capacity planning",
      "Budget allocation review",
      "Team performance metrics",
      "Cross-department collaboration",
      "Quarterly OKR review",
    ],
    agendaDates: [
      {
        id: "ad1",
        date: "3 February 2025",
        isPast: false,
        hasSummary: false,
        items: [
          {
            id: "ai1",
            title: "Q1 Performance & Outlook",
            createdBy: { id: "p1", name: "Alex Johnson" },
            timeAllocated: "15 min",
            description: "Recap Q1 results, key learnings, and set expectations for Q2",
            notes: "",
          },
          {
            id: "ai2",
            title: "Hiring Pipeline Status",
            createdBy: { id: "p2", name: "Sarah Chen" },
            timeAllocated: "15 min",
            description: "Walk through readiness of hiring pipeline: open roles, candidates in process",
            notes: "",
          },
          {
            id: "ai3",
            title: "Cross-Team Initiatives",
            createdBy: { id: "p3", name: "Mike Williams" },
            timeAllocated: "15 min",
            description: "Explore collaboration opportunities with engineering and product teams",
            notes: "",
          },
          {
            id: "ai4",
            title: "Budget & Resource Planning",
            createdBy: { id: "p1", name: "Alex Johnson" },
            timeAllocated: "15 min",
            description: "Review open tasks, clarify ownership, and lock deadlines for Q2",
            notes: "",
          },
        ],
      },
      {
        id: "ad2",
        date: "27 January 2025",
        isPast: true,
        hasSummary: true,
        items: [
          {
            id: "ai5",
            title: "Campaign Retrospective",
            createdBy: { id: "p2", name: "Sarah Chen" },
            timeAllocated: "15 min",
            description: "Analyze January's operational initiatives for wins, misses, and improvements",
            notes: "",
          },
          {
            id: "ai6",
            title: "Q1 Demand Generation Strategy",
            createdBy: { id: "p2", name: "Sarah Chen" },
            timeAllocated: "20 min",
            description: "Present operations plans to drive efficiency, reduce costs",
            notes: "",
          },
          {
            id: "ai7",
            title: "Team Collaboration",
            createdBy: { id: "p3", name: "Mike Williams" },
            timeAllocated: "15 min",
            description: "Sync on cross-functional initiatives to improve team communication",
            notes: "",
          },
          {
            id: "ai8",
            title: "Resource Planning",
            createdBy: { id: "p1", name: "Alex Johnson" },
            timeAllocated: "10 min",
            description: "Review proposed budget, new resource requests, and agreements",
            notes: "",
          },
        ],
      },
      {
        id: "ad3",
        date: "20 January 2025",
        isPast: true,
        hasSummary: true,
        items: [
          {
            id: "ai9",
            title: "Review Q4 Performance Results",
            createdBy: { id: "p2", name: "Sarah Chen" },
            timeAllocated: "20 min",
            description: "Walk through Q4 operations performance metrics and outcomes",
            notes: "",
          },
        ],
      },
    ],
    futureItems: [
      {
        id: "fi1",
        title: "July Performance & Q3 Outlook",
        createdBy: { id: "p1", name: "Alex Johnson" },
        timeAllocated: "15 min",
        description: "Recap July campaign results, key learnings, and set expectations for Q3",
        dateAdded: "04/25/2025",
        notes: "",
        actionItems: [],
      },
      {
        id: "fi2",
        title: "New Vendor Evaluation",
        createdBy: { id: "p2", name: "Sarah Chen" },
        timeAllocated: "20 min",
        description: "Review proposals from potential vendors for Q3 initiatives",
        dateAdded: "04/22/2025",
        notes: "",
        actionItems: [],
      },
      {
        id: "fi3",
        title: "Team Capacity Planning",
        createdBy: { id: "p3", name: "Mike Williams" },
        timeAllocated: "15 min",
        description: "Assess team bandwidth and allocate resources for upcoming projects",
        dateAdded: "04/20/2025",
        notes: "",
        actionItems: [],
      },
      {
        id: "fi4",
        title: "Process Improvement Ideas",
        createdBy: { id: "p4", name: "Emily Davis" },
        timeAllocated: "10 min",
        description: "Share ideas for streamlining workflows and reducing overhead",
        dateAdded: "04/18/2025",
        notes: "",
        actionItems: [],
      },
    ],
    actionItems: [
      {
        id: "act1",
        title: "Finalize Q2 budget allocation spreadsheet",
        status: "incomplete",
        assignee: { id: "p1", name: "Alex Johnson" },
        dueDate: "Feb 10, 2025",
        notes: "Need to include revised headcount projections",
        createdByName: "Alex Johnson",
        createdAt: "Jan 27, 2025",
        meetingSeriesId: "1",
        meetingSeriesName: "Operations",
        meetingInstanceId: "ad2",
        meetingInstanceDate: "27 January 2025",
        agendaItemId: "ai8",
        agendaItemTitle: "Resource Planning",
        source: "agenda",
      },
      {
        id: "act2",
        title: "Schedule interviews for open engineering roles",
        status: "complete",
        assignee: { id: "p2", name: "Sarah Chen" },
        dueDate: "Feb 3, 2025",
        notes: "",
        createdByName: "Sarah Chen",
        createdAt: "Jan 27, 2025",
        meetingSeriesId: "1",
        meetingSeriesName: "Operations",
        meetingInstanceId: "ad2",
        meetingInstanceDate: "27 January 2025",
        transcriptChunkId: "tc1",
        source: "transcript",
      },
      {
        id: "act3",
        title: "Draft cross-team collaboration proposal",
        status: "incomplete",
        assignee: { id: "p3", name: "Mike Williams" },
        dueDate: "Feb 7, 2025",
        notes: "Focus on engineering and product teams",
        createdByName: "Mike Williams",
        createdAt: "Jan 27, 2025",
        meetingSeriesId: "1",
        meetingSeriesName: "Operations",
        meetingInstanceId: "ad2",
        meetingInstanceDate: "27 January 2025",
        agendaItemId: "ai7",
        agendaItemTitle: "Team Collaboration",
        source: "agenda",
      },
      {
        id: "act4",
        title: "Review vendor contracts for renewal",
        status: "complete",
        assignee: { id: "p4", name: "Emily Davis" },
        dueDate: "Jan 31, 2025",
        notes: "",
        createdByName: "Emily Davis",
        createdAt: "Jan 20, 2025",
        meetingSeriesId: "1",
        meetingSeriesName: "Operations",
        meetingInstanceId: "ad3",
        meetingInstanceDate: "20 January 2025",
        transcriptChunkId: "tc2",
        source: "transcript",
      },
      {
        id: "act5",
        title: "Update team capacity planning doc",
        status: "incomplete",
        assignee: { id: "p1", name: "Alex Johnson" },
        dueDate: "Feb 14, 2025",
        notes: "Include Q2 resource requests",
        createdByName: "Alex Johnson",
        createdAt: "Jan 27, 2025",
        meetingSeriesId: "1",
        meetingSeriesName: "Operations",
        meetingInstanceId: "ad2",
        meetingInstanceDate: "27 January 2025",
        agendaItemId: "ai6",
        agendaItemTitle: "Q1 Demand Generation Strategy",
        source: "agenda",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Engineering",
    cadence: "Tue / Thu · 10:00 AM",
    color: "blue",
    purpose: "",
    participants: [],
    files: [],
    meetingSummaries: [],
    agendaItems: [],
    agendaDates: [],
    futureItems: [], // Empty for empty state demo
    actionItems: [], // Empty for empty state demo
  },
  "3": {
    id: "3",
    name: "Design",
    cadence: "Wednesdays · 2:00 PM",
    color: "pink",
    purpose:
      "To review design system updates, share user testing results, discuss accessibility improvements, and align on visual patterns for mobile and web platforms.",
    participants: [
      { id: "p1", name: "Kate Moore", role: "owner" },
      { id: "p2", name: "Ryan Taylor", role: "participant" },
      { id: "p3", name: "Olivia Brown", role: "participant" },
    ],
    files: [
      { id: "f1", name: "Design System v2.pdf", type: "pdf", size: "2.4 MB" },
      { id: "f2", name: "User Testing Results.xlsx", type: "xlsx", size: "340 KB" },
      { id: "f3", name: "Accessibility Audit.pdf", type: "pdf", size: "890 KB" },
    ],
    meetingSummaries: [
      { id: "ms1", date: "Jan 22, 2025", title: "Component Library Review" },
      { id: "ms2", date: "Jan 15, 2025", title: "Mobile Patterns Discussion" },
    ],
    agendaItems: [
      "Component library updates",
      "User testing results",
      "Accessibility audit",
      "Design system docs",
      "Icon library expansion",
      "Mobile patterns review",
    ],
    agendaDates: [
      {
        id: "ad1",
        date: "5 February 2025",
        isPast: false,
        hasSummary: false,
        items: [
          {
            id: "ai1",
            title: "Component Library Updates",
            createdBy: { id: "p1", name: "Kate Moore" },
            timeAllocated: "20 min",
            description: "Review new components added to the design system",
          },
          {
            id: "ai2",
            title: "User Testing Results",
            createdBy: { id: "p2", name: "Ryan Taylor" },
            timeAllocated: "15 min",
            description: "Share findings from recent usability tests",
          },
        ],
      },
    ],
    futureItems: [],
    actionItems: [
      {
        id: "act1",
        title: "Update button component documentation",
        status: "incomplete",
        assignee: { id: "p1", name: "Kate Moore" },
        dueDate: "Feb 12, 2025",
        notes: "Include all new variants and states",
        createdByName: "Kate Moore",
        createdAt: "Jan 22, 2025",
        meetingSeriesId: "3",
        meetingSeriesName: "Design",
        meetingInstanceId: "ad1",
        meetingInstanceDate: "5 February 2025",
        agendaItemId: "ai1",
        agendaItemTitle: "Component Library Updates",
        source: "agenda",
      },
      {
        id: "act2",
        title: "Schedule usability testing sessions for new flow",
        status: "complete",
        assignee: { id: "p2", name: "Ryan Taylor" },
        dueDate: "Jan 29, 2025",
        notes: "",
        createdByName: "Ryan Taylor",
        createdAt: "Jan 22, 2025",
        meetingSeriesId: "3",
        meetingSeriesName: "Design",
        meetingInstanceId: "ad1",
        meetingInstanceDate: "5 February 2025",
        transcriptChunkId: "tc3",
        source: "transcript",
      },
      {
        id: "act3",
        title: "Review accessibility audit findings with eng team",
        status: "incomplete",
        assignee: { id: "p3", name: "Olivia Brown" },
        dueDate: "Feb 5, 2025",
        notes: "Focus on WCAG 2.1 AA compliance",
        createdByName: "Olivia Brown",
        createdAt: "Jan 15, 2025",
        meetingSeriesId: "3",
        meetingSeriesName: "Design",
        meetingInstanceId: "ad1",
        meetingInstanceDate: "5 February 2025",
        agendaItemId: "ai2",
        agendaItemTitle: "User Testing Results",
        source: "agenda",
      },
    ],
  },
  "4": {
    id: "4",
    name: "Marketing",
    cadence: "Mon / Wed · 1:00 PM",
    color: "orange",
    purpose:
      "To review campaign performance, align on content strategy, discuss brand partnerships, and coordinate social media initiatives across all channels.",
    participants: [
      { id: "p1", name: "Mark Johnson", role: "owner" },
      { id: "p2", name: "Nina Patel", role: "participant" },
      { id: "p3", name: "Steve Clark", role: "participant" },
      { id: "p4", name: "Laura White", role: "participant" },
    ],
    files: [
      { id: "f1", name: "Brand Guidelines.pdf", type: "pdf", size: "5.2 MB" },
      { id: "f2", name: "Campaign Performance.xlsx", type: "xlsx", size: "280 KB" },
      { id: "f3", name: "Content Calendar.xlsx", type: "xlsx", size: "150 KB" },
    ],
    meetingSummaries: [
      { id: "ms1", date: "Jan 27, 2025", title: "Campaign Budget Review" },
      { id: "ms2", date: "Jan 22, 2025", title: "Social Media Strategy" },
    ],
    agendaItems: [
      "Campaign budget review",
      "Social media rollout",
      "Content calendar planning",
      "Brand partnership opportunities",
    ],
    agendaDates: [],
    futureItems: [],
    actionItems: [
      {
        id: "act1",
        title: "Prepare Q2 campaign budget breakdown",
        status: "incomplete",
        assignee: { id: "p1", name: "Mark Johnson" },
        dueDate: "Feb 8, 2025",
        notes: "Include digital and traditional media allocations",
        createdByName: "Mark Johnson",
        createdAt: "Jan 27, 2025",
        meetingSeriesId: "4",
        meetingSeriesName: "Marketing",
        meetingInstanceDate: "27 January 2025",
        source: "agenda",
      },
      {
        id: "act2",
        title: "Draft social media content calendar for March",
        status: "incomplete",
        assignee: { id: "p2", name: "Nina Patel" },
        dueDate: "Feb 15, 2025",
        notes: "",
        createdByName: "Nina Patel",
        createdAt: "Jan 27, 2025",
        meetingSeriesId: "4",
        meetingSeriesName: "Marketing",
        meetingInstanceDate: "27 January 2025",
        transcriptChunkId: "tc4",
        source: "transcript",
      },
      {
        id: "act3",
        title: "Reach out to influencer partners for spring campaign",
        status: "complete",
        assignee: { id: "p3", name: "Steve Clark" },
        dueDate: "Jan 31, 2025",
        notes: "Priority: fashion and lifestyle influencers",
        createdByName: "Steve Clark",
        createdAt: "Jan 22, 2025",
        meetingSeriesId: "4",
        meetingSeriesName: "Marketing",
        meetingInstanceDate: "22 January 2025",
        source: "agenda",
      },
    ],
  },
  "5": {
    id: "5",
    name: "Sales",
    cadence: "Fridays · 8:30 AM",
    color: "green",
    purpose:
      "To review sales pipeline, discuss lead qualification criteria, optimize CRM workflows, and share competitive intelligence and customer feedback.",
    participants: [
      { id: "p1", name: "Peter Jones", role: "owner" },
      { id: "p2", name: "Mary Wilson", role: "participant" },
      { id: "p3", name: "John Davis", role: "participant" },
      { id: "p4", name: "Susan Lee", role: "participant" },
    ],
    files: [
      { id: "f1", name: "Pipeline Report Q1.xlsx", type: "xlsx", size: "420 KB" },
      { id: "f2", name: "Competitor Analysis.pdf", type: "pdf", size: "1.8 MB" },
    ],
    meetingSummaries: [
      { id: "ms1", date: "Jan 24, 2025", title: "Weekly Pipeline Review" },
      { id: "ms2", date: "Jan 17, 2025", title: "CRM Optimization Discussion" },
    ],
    agendaItems: [
      "Pipeline review",
      "Lead qualification criteria",
      "CRM workflow optimization",
      "Customer feedback analysis",
      "Competitor analysis update",
    ],
    agendaDates: [],
    futureItems: [],
    actionItems: [
      {
        id: "act1",
        title: "Update CRM fields for new lead scoring model",
        status: "incomplete",
        assignee: { id: "p1", name: "Peter Jones" },
        dueDate: "Feb 7, 2025",
        notes: "Coordinate with IT for field additions",
        createdByName: "Peter Jones",
        createdAt: "Jan 24, 2025",
        meetingSeriesId: "5",
        meetingSeriesName: "Sales",
        meetingInstanceDate: "24 January 2025",
        source: "agenda",
      },
      {
        id: "act2",
        title: "Complete competitor analysis for Q1 report",
        status: "complete",
        assignee: { id: "p2", name: "Mary Wilson" },
        dueDate: "Jan 28, 2025",
        notes: "",
        createdByName: "Mary Wilson",
        createdAt: "Jan 17, 2025",
        meetingSeriesId: "5",
        meetingSeriesName: "Sales",
        meetingInstanceDate: "17 January 2025",
        transcriptChunkId: "tc5",
        source: "transcript",
      },
      {
        id: "act3",
        title: "Schedule training session on new CRM features",
        status: "incomplete",
        assignee: { id: "p3", name: "John Davis" },
        dueDate: "Feb 14, 2025",
        notes: "Focus on pipeline automation features",
        createdByName: "John Davis",
        createdAt: "Jan 24, 2025",
        meetingSeriesId: "5",
        meetingSeriesName: "Sales",
        meetingInstanceDate: "24 January 2025",
        source: "agenda",
      },
      {
        id: "act4",
        title: "Follow up with top 10 enterprise prospects",
        status: "incomplete",
        assignee: { id: "p4", name: "Susan Lee" },
        dueDate: "Feb 3, 2025",
        notes: "Priority accounts: Acme Corp, TechStart, GlobalInc",
        createdByName: "Susan Lee",
        createdAt: "Jan 24, 2025",
        meetingSeriesId: "5",
        meetingSeriesName: "Sales",
        meetingInstanceDate: "24 January 2025",
        transcriptChunkId: "tc6",
        source: "transcript",
      },
    ],
  },
  "6": {
    id: "6",
    name: "Product",
    cadence: "Thursdays · 11:00 AM",
    color: "yellow",
    purpose:
      "To prioritize the product roadmap, review feature requests, refine user stories, plan releases, and communicate updates to stakeholders.",
    participants: [
      { id: "p1", name: "Chris Martin", role: "owner" },
      { id: "p2", name: "Anna Kim", role: "participant" },
      { id: "p3", name: "David Park", role: "participant" },
    ],
    files: [
      { id: "f1", name: "Product Roadmap 2025.pdf", type: "pdf", size: "1.2 MB" },
      { id: "f2", name: "Feature Requests Backlog.xlsx", type: "xlsx", size: "380 KB" },
      { id: "f3", name: "Release Notes Template.doc", type: "doc", size: "45 KB" },
    ],
    meetingSummaries: [
      { id: "ms1", date: "Jan 23, 2025", title: "Roadmap Prioritization" },
      { id: "ms2", date: "Jan 16, 2025", title: "Feature Request Review" },
    ],
    agendaItems: [
      "Roadmap prioritization",
      "Feature requests review",
      "User story refinement",
      "Release planning",
      "Stakeholder updates",
      "Metrics dashboard review",
    ],
    agendaDates: [],
    futureItems: [],
    actionItems: [
      {
        id: "act1",
        title: "Prioritize backlog items for Q2 sprint planning",
        status: "incomplete",
        assignee: { id: "p1", name: "Chris Martin" },
        dueDate: "Feb 6, 2025",
        notes: "Use MoSCoW method for prioritization",
        createdByName: "Chris Martin",
        createdAt: "Jan 23, 2025",
        meetingSeriesId: "6",
        meetingSeriesName: "Product",
        meetingInstanceDate: "23 January 2025",
        source: "agenda",
      },
      {
        id: "act2",
        title: "Write user stories for notification feature",
        status: "complete",
        assignee: { id: "p2", name: "Anna Kim" },
        dueDate: "Jan 30, 2025",
        notes: "",
        createdByName: "Anna Kim",
        createdAt: "Jan 23, 2025",
        meetingSeriesId: "6",
        meetingSeriesName: "Product",
        meetingInstanceDate: "23 January 2025",
        transcriptChunkId: "tc7",
        source: "transcript",
      },
      {
        id: "act3",
        title: "Schedule stakeholder review for dashboard redesign",
        status: "incomplete",
        assignee: { id: "p3", name: "David Park" },
        dueDate: "Feb 10, 2025",
        notes: "Include finance and ops leadership",
        createdByName: "David Park",
        createdAt: "Jan 16, 2025",
        meetingSeriesId: "6",
        meetingSeriesName: "Product",
        meetingInstanceDate: "16 January 2025",
        source: "agenda",
      },
    ],
  },
  // Zero state example - for demonstrating empty states
  "new": {
    id: "new",
    name: "New Meeting Series",
    cadence: "Weekly · TBD",
    color: "blue",
    purpose: "", // Empty to show placeholder
    participants: [
      { id: "p1", name: "You", role: "owner" },
    ],
    files: [], // Empty to show empty state
    meetingSummaries: [], // Empty
    agendaItems: [],
    agendaDates: [],
    futureItems: [],
    actionItems: [],
  },
};

export function getDepartmentById(id: string): DepartmentDetail | undefined {
  return departmentDetails[id];
}

export function getAllDepartmentIds(): string[] {
  return Object.keys(departmentDetails);
}
