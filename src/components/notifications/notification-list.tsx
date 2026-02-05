"use client";

import { useMemo } from "react";
import {
  isToday,
  isYesterday,
  isWithinInterval,
  subDays,
  startOfDay,
} from "date-fns";
import { Inbox } from "lucide-react";
import { NotificationItem } from "./notification-item";
import type { Notification } from "@/types/notifications";

interface DateGroup {
  label: string;
  notifications: Notification[];
}

function groupNotificationsByDate(notifications: Notification[]): DateGroup[] {
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];

  const now = new Date();
  const weekAgo = subDays(startOfDay(now), 7);

  notifications.forEach((notification) => {
    const date = notification.createdAt;
    if (isToday(date)) {
      today.push(notification);
    } else if (isYesterday(date)) {
      yesterday.push(notification);
    } else if (
      isWithinInterval(date, { start: weekAgo, end: startOfDay(now) })
    ) {
      thisWeek.push(notification);
    } else {
      earlier.push(notification);
    }
  });

  const groups: DateGroup[] = [];
  if (today.length > 0) groups.push({ label: "Today", notifications: today });
  if (yesterday.length > 0)
    groups.push({ label: "Yesterday", notifications: yesterday });
  if (thisWeek.length > 0)
    groups.push({ label: "This Week", notifications: thisWeek });
  if (earlier.length > 0)
    groups.push({ label: "Earlier", notifications: earlier });

  return groups;
}

interface NotificationListProps {
  notifications: Notification[];
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({
  notifications,
  selectedIds,
  onSelect,
  onSelectAll,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  const groups = useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  const allSelected =
    notifications.length > 0 && selectedIds.size === notifications.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Inbox className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-foreground mb-1">
          No notifications
        </p>
        <p className="text-sm text-muted-foreground text-center">
          You&apos;re all caught up! Check back later for new updates.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Select All Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="w-4 h-4 rounded border-border text-cyan-dark focus:ring-cyan-dark cursor-pointer"
        />
        <span className="text-sm text-muted-foreground">
          {selectedIds.size > 0
            ? `${selectedIds.size} selected`
            : `${notifications.length} notifications`}
        </span>
      </div>

      {/* Grouped Notifications */}
      {groups.map((group) => (
        <div key={group.label}>
          <div className="px-4 py-2 bg-muted/20 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </span>
          </div>
          <div className="divide-y divide-border">
            {group.notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isSelected={selectedIds.has(notification.id)}
                onSelect={onSelect}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
