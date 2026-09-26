import type { MouseEvent } from "react";
import { navigateToHash } from "@/lib/navigation";

const CASE_STUDY_EVENT = "pragyan:case-study";

/** Scrolls to the case studies section with the given case study on the stage. */
export function showCaseStudy(event: MouseEvent<HTMLAnchorElement>, caseStudyId: string) {
  window.dispatchEvent(new CustomEvent<string>(CASE_STUDY_EVENT, { detail: caseStudyId }));
  navigateToHash(event, "#case-studies");
}

/** Subscribes the case studies section to selection requests; returns the unsubscribe function. */
export function onCaseStudyRequest(listener: (caseStudyId: string) => void): () => void {
  const handler = (event: Event) => {
    const id = (event as CustomEvent<unknown>).detail;
    if (typeof id === "string") listener(id);
  };
  window.addEventListener(CASE_STUDY_EVENT, handler);
  return () => window.removeEventListener(CASE_STUDY_EVENT, handler);
}
