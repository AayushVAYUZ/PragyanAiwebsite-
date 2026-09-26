import type { MouseEvent } from "react";
import { navigateToHash } from "@/lib/navigation";
import { isContactInterest, type ContactInterest } from "@/content/contact";

const INTEREST_EVENT = "pragyan:contact-interest";

/**
 * Scrolls to the contact section and pre-selects an area of interest in its form.
 * Links keep `href="#contact"` so they still land on the form without JavaScript.
 */
export function requestContact(event: MouseEvent<HTMLAnchorElement>, interest?: ContactInterest) {
  if (interest) window.dispatchEvent(new CustomEvent<ContactInterest>(INTEREST_EVENT, { detail: interest }));
  navigateToHash(event, "#contact");
}

/** Subscribes the contact form to interest requests; returns the unsubscribe function. */
export function onContactInterest(listener: (interest: ContactInterest) => void): () => void {
  const handler = (event: Event) => {
    const interest = (event as CustomEvent<unknown>).detail;
    if (isContactInterest(interest)) listener(interest);
  };
  window.addEventListener(INTEREST_EVENT, handler);
  return () => window.removeEventListener(INTEREST_EVENT, handler);
}

/** Interest from a shared link, e.g. `/?interest=Sovereign%20ai#contact`. */
export function interestFromUrl(): ContactInterest | null {
  const value = new URLSearchParams(window.location.search).get("interest");
  return isContactInterest(value) ? value : null;
}
