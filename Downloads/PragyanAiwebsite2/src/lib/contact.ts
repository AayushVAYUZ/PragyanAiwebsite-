import type { MouseEvent } from "react";
import { navigateToHash } from "@/lib/navigation";
import { isContactInterest, type ContactInterest } from "@/content/contact";

const REQUEST_EVENT = "pragyan:contact-request";

/** What a CTA hands the contact form: an area of interest and/or a free-text context line. */
export interface ContactRequest {
  interest?: ContactInterest;
  /** Shown above the form and sent with the enquiry, e.g. "Engagement model: Prove". */
  context?: string;
}

/**
 * Scrolls to the contact section and pre-fills its form from the CTA that was used.
 * Links keep `href="#contact"` so they still land on the form without JavaScript.
 */
export function requestContact(event: MouseEvent<HTMLAnchorElement>, interest?: ContactInterest, context?: string) {
  if (interest || context) {
    window.dispatchEvent(new CustomEvent<ContactRequest>(REQUEST_EVENT, { detail: { interest, context } }));
  }
  navigateToHash(event, "#contact");
}

/** Subscribes the contact form to CTA requests; returns the unsubscribe function. */
export function onContactRequest(listener: (request: ContactRequest) => void): () => void {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<unknown>).detail as Record<string, unknown> | null;
    if (!detail || typeof detail !== "object") return;
    listener({
      interest: isContactInterest(detail.interest) ? detail.interest : undefined,
      context: typeof detail.context === "string" ? detail.context : undefined,
    });
  };
  window.addEventListener(REQUEST_EVENT, handler);
  return () => window.removeEventListener(REQUEST_EVENT, handler);
}

/** Interest from a shared link, e.g. `/?interest=Sovereign%20ai#contact`. */
export function interestFromUrl(): ContactInterest | null {
  const value = new URLSearchParams(window.location.search).get("interest");
  return isContactInterest(value) ? value : null;
}
