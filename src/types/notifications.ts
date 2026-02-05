export type NotificationType =
  | "meeting_reminder"
  | "action_item_due"
  | "mention"
  | "comment"
  | "assignment";

export interface Notification {
  id: string;
  type: NotificationType;
  primaryText: string;
  contextText: string;
  createdAt: Date;
  isRead: boolean;
  /** Optional link to navigate to when clicking the notification */
  link?: string;
}

export type NotificationFilterType = "all" | NotificationType;

export type NotificationStatusFilter = "all" | "unread" | "read";

export interface NotificationFilters {
  type: NotificationFilterType;
  status: NotificationStatusFilter;
  search: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    types: Record<NotificationType, boolean>;
  };
  push: {
    enabled: boolean;
    types: Record<NotificationType, boolean>;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}
