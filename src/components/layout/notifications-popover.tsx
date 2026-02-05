"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Bell,
  Calendar,
  CheckSquare,
  AtSign,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/notifications-data";
import type { Notification, NotificationType } from "@/types/notifications";

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  meeting_reminder: <Calendar className="w-4 h-4" />,
  action_item_due: <CheckSquare className="w-4 h-4" />,
  mention: <AtSign className="w-4 h-4" />,
  comment: <MessageSquare className="w-4 h-4" />,
  assignment: <UserPlus className="w-4 h-4" />,
};

function formatRelativeTime(date: Date): string {
  const distance = formatDistanceToNowStrict(date, { addSuffix: false });
  // Shorten common formats: "2 hours" -> "2h", "1 day" -> "1d", etc.
  return distance
    .replace(/ seconds?/, "s")
    .replace(/ minutes?/, "m")
    .replace(/ hours?/, "h")
    .replace(/ days?/, "d")
    .replace(/ weeks?/, "w")
    .replace(/ months?/, "mo")
    .replace(/ years?/, "y");
}

interface NotificationsPopoverProps {
  onCloseDrawer?: () => void;
  isCollapsed?: boolean;
}

export function NotificationsPopover({ onCloseDrawer, isCollapsed = false }: NotificationsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasUnread = notifications.some((n) => !n.isRead);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleViewAll = () => {
    setIsOpen(false);
    onCloseDrawer?.();
  };

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving to popover content
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <PopoverTrigger asChild>
          <button
            className={cn(
              "relative flex items-center rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted",
              isCollapsed ? "justify-center w-9 h-9 p-0" : "gap-3 px-3 py-2 w-full"
            )}
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </div>
            {!isCollapsed && "Notifications"}
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-[360px] p-0"
        align="start"
        side="right"
        sideOffset={8}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground h-auto py-1 px-2"
            onClick={markAllAsRead}
            disabled={!hasUnread}
          >
            Mark all as read
          </Button>
        </div>

        {/* Scrollable List */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => markAsRead(notification.id)}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "mt-0.5 p-1.5 rounded-full shrink-0",
                        notification.isRead
                          ? "bg-muted text-muted-foreground"
                          : "bg-cyan-light text-cyan-dark"
                      )}
                    >
                      {notificationIcons[notification.type]}
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm truncate",
                          notification.isRead
                            ? "font-normal text-foreground"
                            : "font-semibold text-foreground"
                        )}
                      >
                        {notification.primaryText}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {notification.contextText}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border">
          <Link
            href="/notifications"
            className="flex items-center justify-center px-4 py-3 text-sm font-medium text-cyan-dark hover:bg-muted/50 transition-colors"
            onClick={handleViewAll}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
