"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Calendar,
  CheckSquare,
  AtSign,
  MessageSquare,
  UserPlus,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  return distance
    .replace(/ seconds?/, "s")
    .replace(/ minutes?/, "m")
    .replace(/ hours?/, "h")
    .replace(/ days?/, "d")
    .replace(/ weeks?/, "w")
    .replace(/ months?/, "mo")
    .replace(/ years?/, "y");
}

interface NotificationItemProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(notification.id, e.target.checked);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(notification.id);
  };

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors",
        "hover:bg-muted/50",
        !notification.isRead && "bg-cyan-light/10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <div className="flex items-center pt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded border-border text-cyan-dark focus:ring-cyan-dark cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

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
            "text-sm",
            notification.isRead
              ? "font-normal text-foreground"
              : "font-semibold text-foreground"
          )}
        >
          {notification.primaryText}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {notification.contextText}
        </p>
      </div>

      {/* Timestamp & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {isHovered ? (
          <div className="flex items-center gap-1">
            {!notification.isRead && (
              <button
                onClick={handleMarkAsRead}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Mark as read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(notification.createdAt)}
          </span>
        )}
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return <div className="cursor-default">{content}</div>;
}
