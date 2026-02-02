import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface SourceLocatorParams {
  meetingSeriesId: string;
  meetingInstanceId?: string;
  meetingInstanceDate?: string;
  agendaItemId?: string;
  transcriptChunkId?: string;
}

/**
 * Navigates to the source of an action item (agenda item or transcript)
 * within a meeting instance.
 */
export function navigateToSource(
  params: SourceLocatorParams,
  router: AppRouterInstance
) {
  const query = new URLSearchParams();
  query.set("tab", "agenda");

  if (params.meetingInstanceId) {
    query.set("instance", params.meetingInstanceId);
  }

  if (params.agendaItemId) {
    query.set("agendaItem", params.agendaItemId);
  }

  // For transcript sources, we navigate to the meeting but don't specify an agenda item
  // The page will handle scrolling to the transcript section if applicable

  router.push(`/departments/${params.meetingSeriesId}?${query.toString()}`);
}

/**
 * Scrolls to and highlights a target element on the page.
 * Used after navigation to focus on the source agenda item.
 */
export function scrollToAndHighlight(
  selector: string,
  highlightDurationMs: number = 2000
) {
  setTimeout(() => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("source-highlight");
      setTimeout(() => {
        element.classList.remove("source-highlight");
      }, highlightDurationMs);
    }
  }, 300);
}

/**
 * Expands a meeting instance accordion by its ID.
 * Used to ensure the target meeting date is visible before scrolling to an agenda item.
 */
export function expandMeetingInstance(instanceId: string) {
  const instanceElement = document.querySelector(
    `[data-meeting-instance-id="${instanceId}"]`
  );
  if (instanceElement) {
    instanceElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
