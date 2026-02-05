"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsRight, Paperclip, Link2, MoreHorizontal, Bot, ChevronRight, Home } from "lucide-react";
import { Meeting } from "@/types/meetings";
import Image from "next/image";

interface MeetingSummaryDrawerProps {
  meeting: Meeting;
  isOpen: boolean;
  onClose: () => void;
}

// Mock attendees
const mockAttendees = [
  { name: "Brad Benson", role: "CEO" },
  { name: "Amelia Sutton", role: "Head of Marketing" },
];

// Mock discussion topics
const mockDiscussionTopics = [
  {
    id: 1,
    title: "Campaign Retrospective",
    description: "Reviewed performance of February's Sweetheart Bundle and Galentine's event.",
    details: [
      "Sweetheart Bundle drove strong AOV and repeat visits; Galentine's event was effective in attracting first-time customers and generating buzz.",
      "Identified opportunities to host similar themed events in Q3 to drive engagement during non-peak periods.",
    ],
  },
  {
    id: 2,
    title: "Q3 Demand Generation Strategy",
    description: "Amelia presented the upcoming strategy to boost repeat business and acquire new customers, with an emphasis on digital marketing and loyalty initiatives.",
    details: [
      "Discussed targeted paid social to support new customer growth, and leveraging the upcoming loyalty program to increase retention.",
    ],
  },
  {
    id: 3,
    title: "Retail-Marketing Collaboration",
    description: "Agreed on the importance of aligning retail events and marketing campaigns, especially for in-store experiences and localized promotions.",
    details: [
      "Decided to implement a shared calendar and more frequent cross-department touchpoints.",
    ],
  },
];

// Mock transcript
const mockTranscript = [
  { speaker: "Brad Benson", time: "0:00", text: "Good morning Amelia, let's dive into the campaign review." },
  { speaker: "Amelia Sutton", time: "0:08", text: "Thanks Brad. I wanted to start with the Sweetheart Bundle results from February." },
  { speaker: "Brad Benson", time: "0:22", text: "Yes, I saw the numbers looked strong. Walk me through the highlights." },
  { speaker: "Amelia Sutton", time: "0:30", text: "The bundle drove a 23% increase in AOV compared to our baseline. We also saw a 15% lift in repeat visits within 30 days." },
  { speaker: "Brad Benson", time: "0:52", text: "That's excellent. And the Galentine's event?" },
  { speaker: "Amelia Sutton", time: "1:02", text: "Galentine's was more about acquisition. We attracted 340 first-time customers, and social engagement was up 45% that week." },
  { speaker: "Brad Benson", time: "1:20", text: "Great results. Should we consider similar themed events for Q3?" },
  { speaker: "Amelia Sutton", time: "1:30", text: "Absolutely. I'm thinking a summer kickoff event in June and maybe a back-to-school theme in August." },
  { speaker: "Brad Benson", time: "1:45", text: "I like that. Let's make sure we coordinate with the retail team on in-store activations." },
  { speaker: "Amelia Sutton", time: "1:55", text: "Agreed. I'll set up a shared calendar with David's team to align on dates and promotions." },
];

export function MeetingSummaryDrawer({ meeting, isOpen, onClose }: MeetingSummaryDrawerProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Reset tab when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("summary");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                aria-label="Close drawer"
              >
                <ChevronsRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-muted transition-colors">
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-md hover:bg-muted transition-colors">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-md hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-sm px-6 pt-4" aria-label="Breadcrumb">
              <button
                onClick={onClose}
                className="flex items-center gap-1 text-muted-foreground hover:text-cyan transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Meetings</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-foreground font-medium">{meeting.title}</span>
            </nav>

            {/* Header */}
            <div className="px-6 pt-4 pb-4">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Meeting Summary and Recording
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Created by</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#4DD0E1] to-[#26C6DA] flex items-center justify-center">
                    <Image
                      src="/miles-logo.png"
                      alt="Miles"
                      width={12}
                      height={12}
                      className="brightness-0 invert"
                    />
                  </div>
                  <span className="font-medium text-foreground">Miles</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 pb-4">
              <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "summary"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab("transcript")}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                    activeTab === "transcript"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Transcript
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {activeTab === "summary" ? (
                <div className="space-y-6">
                  {/* Meeting Title */}
                  <h3 className="text-lg font-semibold text-cyan">
                    Meeting Summary: {meeting.title} – {meeting.date}
                  </h3>

                  {/* Attendees */}
                  <div>
                    <p className="font-medium text-foreground mb-2">Attendees:</p>
                    <ul className="space-y-1">
                      {mockAttendees.map((attendee, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-foreground">•</span>
                          <span>{attendee.name} ({attendee.role})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Discussion Topics */}
                  <div>
                    <p className="font-medium text-foreground mb-3">Key Discussion Topics:</p>
                    <p className="font-medium text-foreground mb-4">Campaign Retrospective:</p>
                    
                    <ol className="space-y-6">
                      {mockDiscussionTopics.map((topic) => (
                        <li key={topic.id} className="text-sm">
                          <p className="text-foreground mb-1">
                            <span className="font-semibold">{topic.id}. {topic.title}:</span>{" "}
                            <span className="text-muted-foreground">{topic.description}</span>
                          </p>
                          {topic.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground mt-2 pl-4">
                              {detail}
                            </p>
                          ))}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Meeting Title */}
                  <h3 className="text-lg font-semibold text-cyan mb-4">
                    Transcript: {meeting.title} – {meeting.date}
                  </h3>
                  
                  {mockTranscript.map((entry, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-muted-foreground">
                          {entry.speaker.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-foreground">{entry.speaker}</span>
                          <span className="text-xs text-muted-foreground">{entry.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="px-6 py-4 border-t border-border bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted overflow-hidden shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">U</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Comment..."
                  className="flex-1 px-4 py-2.5 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan/20 focus:border-cyan transition-all"
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
