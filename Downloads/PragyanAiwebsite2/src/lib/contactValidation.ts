import { isContactInterest, type ContactInterest } from "@/content/contact";

/** Shared by the contact form (client-side) and /api/contact (server-side). */

export interface ContactSubmission {
  name: string;
  email: string;
  company: string;
  role: string;
  interest: ContactInterest | "";
  message: string;
  /** Which engagement model or PRISM offer the visitor came from, if any. */
  context: string;
  /** Honeypot: hidden from people, so anything in it came from a bot. */
  website: string;
}

export type ContactField = "name" | "email" | "company" | "role" | "interest" | "message" | "context";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS: Record<ContactField, number> = {
  name: 100,
  email: 254,
  company: 150,
  role: 100,
  interest: 60,
  message: 5000,
  context: 200,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Coerces untrusted input into a submission, trimming every field. */
export function normaliseSubmission(input: unknown): ContactSubmission {
  const source = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const text = (key: string) => (typeof source[key] === "string" ? (source[key] as string).trim() : "");
  const interest = text("interest");
  return {
    name: text("name"),
    email: text("email"),
    company: text("company"),
    role: text("role"),
    interest: isContactInterest(interest) ? interest : "",
    message: text("message"),
    context: text("context"),
    website: text("website"),
  };
}

export function validateSubmission(submission: ContactSubmission): ContactErrors {
  const errors: ContactErrors = {};
  if (!submission.name) errors.name = "Please enter your name.";
  if (!submission.email) errors.email = "Please enter your work email.";
  else if (!EMAIL_PATTERN.test(submission.email)) errors.email = "Please enter a valid email address.";
  if (!submission.company) errors.company = "Please enter your company.";
  if (!submission.message) errors.message = "Please tell us what needs to work better.";

  (Object.keys(CONTACT_LIMITS) as ContactField[]).forEach((field) => {
    if (!errors[field] && submission[field].length > CONTACT_LIMITS[field]) {
      errors[field] = `Please keep this under ${CONTACT_LIMITS[field]} characters.`;
    }
  });
  return errors;
}
