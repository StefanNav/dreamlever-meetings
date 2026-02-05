"use client";

import { useState } from "react";
import { X, Mail, Bell, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  NotificationPreferences,
  NotificationType,
} from "@/types/notifications";

const typeLabels: Record<NotificationType, string> = {
  meeting_reminder: "Meeting Reminders",
  action_item_due: "Action Item Due Dates",
  mention: "Mentions",
  comment: "Comments",
  assignment: "Assignments",
};

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

export function NotificationSettingsModal({
  isOpen,
  onClose,
  preferences,
  onSave,
}: NotificationSettingsModalProps) {
  const [localPrefs, setLocalPrefs] =
    useState<NotificationPreferences>(preferences);

  if (!isOpen) return null;

  const handleEmailToggle = (type: NotificationType, enabled: boolean) => {
    setLocalPrefs((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        types: { ...prev.email.types, [type]: enabled },
      },
    }));
  };

  const handlePushToggle = (type: NotificationType, enabled: boolean) => {
    setLocalPrefs((prev) => ({
      ...prev,
      push: {
        ...prev.push,
        types: { ...prev.push.types, [type]: enabled },
      },
    }));
  };

  const handleSave = () => {
    onSave(localPrefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-background rounded-xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Notification Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* Email Notifications */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">
                Email Notifications
              </h3>
              <div className="ml-auto">
                <Switch
                  checked={localPrefs.email.enabled}
                  onCheckedChange={(checked) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      email: { ...prev.email, enabled: checked },
                    }))
                  }
                />
              </div>
            </div>
            <div
              className={cn(
                "space-y-3 pl-7",
                !localPrefs.email.enabled && "opacity-50 pointer-events-none"
              )}
            >
              {(Object.keys(typeLabels) as NotificationType[]).map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {typeLabels[type]}
                  </span>
                  <Switch
                    checked={localPrefs.email.types[type]}
                    onCheckedChange={(checked) =>
                      handleEmailToggle(type, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">
                Push Notifications
              </h3>
              <div className="ml-auto">
                <Switch
                  checked={localPrefs.push.enabled}
                  onCheckedChange={(checked) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      push: { ...prev.push, enabled: checked },
                    }))
                  }
                />
              </div>
            </div>
            <div
              className={cn(
                "space-y-3 pl-7",
                !localPrefs.push.enabled && "opacity-50 pointer-events-none"
              )}
            >
              {(Object.keys(typeLabels) as NotificationType[]).map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {typeLabels[type]}
                  </span>
                  <Switch
                    checked={localPrefs.push.types[type]}
                    onCheckedChange={(checked) =>
                      handlePushToggle(type, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium text-foreground">Quiet Hours</h3>
              <div className="ml-auto">
                <Switch
                  checked={localPrefs.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, enabled: checked },
                    }))
                  }
                />
              </div>
            </div>
            <div
              className={cn(
                "flex items-center gap-4 pl-7",
                !localPrefs.quietHours.enabled &&
                  "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">From</span>
                <input
                  type="time"
                  value={localPrefs.quietHours.start}
                  onChange={(e) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      quietHours: {
                        ...prev.quietHours,
                        start: e.target.value,
                      },
                    }))
                  }
                  className="px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-cyan-dark/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">to</span>
                <input
                  type="time"
                  value={localPrefs.quietHours.end}
                  onChange={(e) =>
                    setLocalPrefs((prev) => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: e.target.value },
                    }))
                  }
                  className="px-2 py-1 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-cyan-dark/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-cyan-dark hover:bg-cyan-dark/90">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
