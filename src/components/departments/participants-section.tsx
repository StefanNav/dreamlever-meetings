"use client";

import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Participant {
  id: string;
  name: string;
  role: "owner" | "participant";
  avatar?: string;
}

interface ParticipantsSectionProps {
  participants: Participant[];
  onAddMember?: () => void;
}

function getRoleLabel(role: "owner" | "participant"): string {
  switch (role) {
    case "owner":
      return "Meeting owner";
    case "participant":
      return "Participants";
    default:
      return "Participant";
  }
}

export function ParticipantsSection({
  participants,
  onAddMember,
}: ParticipantsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Participants</h3>
      <div className="flex flex-wrap items-start gap-6">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                {participant.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">
                {participant.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {getRoleLabel(participant.role)}
              </p>
            </div>
          </div>
        ))}

        {/* Add member button */}
        <button
          onClick={onAddMember}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-muted-foreground transition-colors">
            <UserPlus className="w-4 h-4" />
          </div>
          <span>Add member...</span>
        </button>
      </div>
    </div>
  );
}
