"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ArrowLeft, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AgendaDefinition {
  id: string;
  name: string;
  color: string;
  route?: string;
}

const COLOR_PALETTE = [
  { hex: "#F44336", label: "Red" },
  { hex: "#E91E63", label: "Pink" },
  { hex: "#9C27B0", label: "Purple" },
  { hex: "#3F51B5", label: "Indigo" },
  { hex: "#2196F3", label: "Blue" },
  { hex: "#009688", label: "Teal" },
  { hex: "#4CAF50", label: "Green" },
  { hex: "#FF9800", label: "Orange" },
  { hex: "#795548", label: "Brown" },
  { hex: "#607D8B", label: "Slate" },
];

const VIEW_TRANSITION = { duration: 0.15, ease: "easeOut" as const };

interface AgendaPopoverProps {
  agendas: AgendaDefinition[];
  selectedIds: string[];
  onSelect: (agendaId: string) => void;
  onCreateNew: (agenda: AgendaDefinition) => void;
}

type PopoverView = "browse" | "create";

export function AgendaPopover({
  agendas,
  selectedIds,
  onSelect,
  onCreateNew,
}: AgendaPopoverProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PopoverView>("browse");
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].hex);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const available = agendas.filter((a) => !selectedIds.includes(a.id));
  const filtered = available.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setNewName("");
    setSelectedColor(COLOR_PALETTE[0].hex);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setView("browse");
      setSearch("");
      resetForm();
    }
  };

  const handleSelect = (agendaId: string) => {
    onSelect(agendaId);
    setSearch("");
    setOpen(false);
  };

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const id = `custom-${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    onCreateNew({ id, name: trimmed, color: selectedColor });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add to Agenda
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 overflow-hidden" align="start">
        <AnimatePresence mode="wait" initial={false}>
          {view === "browse" ? (
            <motion.div
              key="browse"
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -16, opacity: 0 }}
              transition={VIEW_TRANSITION}
            >
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search agendas..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-1 max-h-48 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((agenda) => (
                    <button
                      key={agenda.id}
                      onClick={() => handleSelect(agenda.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                      <AgendaColorDot color={agenda.color} />
                      {agenda.name}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                    No agendas found
                  </p>
                )}
              </div>

              <div className="border-t border-border p-1">
                <button
                  onClick={() => setView("create")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-cyan rounded-md hover:bg-cyan-light/50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create New Agenda
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 16, opacity: 0 }}
              transition={VIEW_TRANSITION}
            >
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                <button
                  onClick={() => {
                    setView("browse");
                    resetForm();
                  }}
                  className="p-0.5 rounded hover:bg-muted transition-colors"
                  aria-label="Back to agenda list"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground">
                  New Agenda
                </span>
              </div>

              <div className="p-3 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Name
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Product, HR, Finance…"
                    className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan focus:border-cyan"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newName.trim()) handleCreate();
                    }}
                    maxLength={32}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setSelectedColor(c.hex)}
                        className={cn(
                          "w-6 h-6 rounded-full transition-all flex items-center justify-center",
                          selectedColor === c.hex
                            ? "ring-2 ring-offset-1 ring-foreground/30 scale-110"
                            : "hover:scale-110"
                        )}
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.label}
                      >
                        {selectedColor === c.hex && (
                          <Check className="w-3 h-3 text-white drop-shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-3 pb-3">
                <Button
                  size="sm"
                  className="w-full bg-cyan hover:bg-cyan-dark text-white"
                  disabled={!newName.trim()}
                  onClick={handleCreate}
                >
                  Create Agenda
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}

export function AgendaColorDot({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  if (color.startsWith("bg-")) {
    return <span className={cn("w-2 h-2 rounded-full shrink-0", color, className)} />;
  }
  return (
    <span
      className={cn("w-2 h-2 rounded-full shrink-0", className)}
      style={{ backgroundColor: color }}
    />
  );
}
