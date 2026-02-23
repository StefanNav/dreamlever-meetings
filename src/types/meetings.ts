export type MeetingCategory = 
  | "operations"
  | "design"
  | "engineering"
  | "marketing"
  | "sales";

export type MeetingStatus = "live" | "recurring" | "upcoming" | "past";

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export interface AgendaItem {
  id: string;
  text: string;
  completed?: boolean;
}

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface RecurringMeeting {
  id: string;
  title: string;
  category: MeetingCategory;
  nextDate: string;
  time: string;
  dayOfWeek: DayOfWeek;
  isDaily?: boolean;
  participants: Participant[];
  agendaItems: AgendaItem[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participantCount: number;
  status: MeetingStatus;
  aiEnabled: boolean;
  description?: string;
  agendaItems?: AgendaItem[];
  previousSummary?: string;
  agenda?: MeetingCategory;
}

export type DayFilter = "coming-up" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type MeetingListFilter = "upcoming" | "past";
