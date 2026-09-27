import type { MouseEvent } from "react";
import { navigateToHash } from "@/lib/navigation";

const STAGE_EVENT = "pragyan:prism-stage";

/** Scrolls to PRISM with the given stage's tab open (0-based: Orient = 0 … Emerge = 4). */
export function showPrismStage(event: MouseEvent<HTMLAnchorElement>, stageIndex: number) {
  window.dispatchEvent(new CustomEvent<number>(STAGE_EVENT, { detail: stageIndex }));
  navigateToHash(event, "#prism");
}

/** Subscribes the PRISM section to stage requests; returns the unsubscribe function. */
export function onPrismStageRequest(listener: (stageIndex: number) => void): () => void {
  const handler = (event: Event) => {
    const index = (event as CustomEvent<unknown>).detail;
    if (typeof index === "number") listener(index);
  };
  window.addEventListener(STAGE_EVENT, handler);
  return () => window.removeEventListener(STAGE_EVENT, handler);
}
