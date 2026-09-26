/**
 * Contact configuration: the details shown beside the form and the interests it offers.
 * Blank values are hidden by the contact section, so a detail can be removed by emptying it.
 */

export const CONTACT_DETAILS = {
  email: "hello@vayuz.com",
  phones: ["+91 120-4259095", "+91 966-738-9913"],
  address: ["VAYUZ Technologies", "Add India Center, Plot #9,", "Floor #8, Sector 125,", "Noida, India 201303"],
};

export const CONTACT_INTERESTS = [
  "ai Strategy & Transformation",
  "Agentic ai & Automation",
  "Knowledge & Data Intelligence",
  "Predictive & Decision Intelligence",
  "Custom ai & LLM Engineering",
  "Multimodal ai",
  "ai Droplets",
  "Sovereign ai",
  "Product / accelerator demo",
  "Other",
] as const;

export type ContactInterest = (typeof CONTACT_INTERESTS)[number];

export function isContactInterest(value: unknown): value is ContactInterest {
  return typeof value === "string" && (CONTACT_INTERESTS as readonly string[]).includes(value);
}
