"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CONTACT_DETAILS, CONTACT_INTERESTS, type ContactInterest } from "@/content/contact";
import { interestFromUrl, onContactRequest } from "@/lib/contact";
import {
  CONTACT_LIMITS,
  normaliseSubmission,
  validateSubmission,
  type ContactErrors,
  type ContactField,
} from "@/lib/contactValidation";

/**
 * The contact form (#contact-form), inside the contact block (#contact, see FinalContact).
 * Every contact CTA on the page lands on this block, some with an area of interest pre-selected.
 */

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  role: "",
  interest: "" as ContactInterest | "",
  message: "",
  context: "",
  website: "",
};
const FIELD_ORDER: ContactField[] = ["name", "email", "company", "role", "interest", "message"];

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  // Interest arrives from a CTA elsewhere on the page, or from a shared ?interest= link.
  // The URL is only read after hydration, so the server and first client render agree.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const fromUrl = interestFromUrl();
      if (fromUrl) setValues((current) => ({ ...current, interest: fromUrl }));
    });
    // A CTA replaces the context line it set before; an interest is only changed when given.
    const unsubscribe = onContactRequest(({ interest, context }) =>
      setValues((current) => ({ ...current, interest: interest ?? current.interest, context: context ?? "" })),
    );
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  const update = (field: keyof typeof EMPTY_FORM) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "submitting") return;

    const submission = normaliseSubmission(values);
    const found = validateSubmission(submission);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      setStatus({ state: "error", message: "Please check the highlighted fields." });
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; errors?: ContactErrors };
      if (response.ok && result.ok) {
        setValues(EMPTY_FORM);
        setStatus({ state: "success" });
        return;
      }
      if (response.status === 422 && result.errors) {
        setErrors(result.errors);
        setStatus({ state: "error", message: "Please check the highlighted fields." });
        return;
      }
      setStatus({ state: "error", message: fallbackMessage() });
    } catch {
      setStatus({ state: "error", message: fallbackMessage() });
    }
  };

  const submitting = status.state === "submitting";
  const phones = CONTACT_DETAILS.phones.filter(Boolean);
  const address = CONTACT_DETAILS.address.filter(Boolean);

  return (
    <div id="contact-form" className="relative z-10 px-[var(--gutter-x)] pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto grid w-full max-w-[1152px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Invitation and direct details */}
        <div className="flex flex-col lg:col-span-5">
          <p className="mb-5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--neon-cyan)]/70 uppercase">
            Connect With Us
          </p>
          <h2
            id="contact-heading"
            className="mb-6 text-4xl leading-[1.12] font-extralight tracking-[-0.03em] text-[var(--text-primary)] sm:text-5xl"
          >
            Let&apos;s start with <span className="font-normal text-white">your business challenge.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed font-light text-[var(--text-soft)] sm:text-lg">
            Tell us where ai should make a difference, and we&apos;ll come back to you to set up the conversation.
          </p>

          <dl className="mt-10 flex flex-col gap-6 border-t border-[var(--border-subtle)] pt-8 text-sm">
            {CONTACT_DETAILS.email && (
              <div>
                <dt className="contact-detail-label">Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT_DETAILS.email}`} className="contact-detail-link">
                    {CONTACT_DETAILS.email}
                  </a>
                </dd>
              </div>
            )}
            {phones.length > 0 && (
              <div>
                <dt className="contact-detail-label">Phone</dt>
                {phones.map((phone) => (
                  <dd key={phone}>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="contact-detail-link">
                      {phone}
                    </a>
                  </dd>
                ))}
              </div>
            )}
            {address.length > 0 && (
              <div>
                <dt className="contact-detail-label">Office</dt>
                <dd>
                  <address className="leading-relaxed font-light text-[var(--text-soft)] not-italic">
                    {address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Enquiry form */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          aria-labelledby="contact-heading"
          className="contact-form flex flex-col gap-5 rounded-2xl p-5 sm:p-8 lg:col-span-7"
        >
          {values.context && (
            <p className="contact-context flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm">
              <span>
                <span className="contact-detail-label mr-2">Enquiry about</span>
                {values.context}
              </span>
              <button
                type="button"
                onClick={() => setValues((current) => ({ ...current, context: "" }))}
                aria-label={`Remove "${values.context}" from this enquiry`}
                className="contact-context-clear"
              >
                <span aria-hidden="true">×</span>
              </button>
            </p>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="name" label="Name" required error={errors.name}>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={CONTACT_LIMITS.name}
                value={values.name}
                onChange={update("name")}
                {...fieldA11y("name", errors.name, true)}
                className="contact-input"
              />
            </Field>
            <Field id="email" label="Work email" required error={errors.email}>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={CONTACT_LIMITS.email}
                value={values.email}
                onChange={update("email")}
                {...fieldA11y("email", errors.email, true)}
                className="contact-input"
              />
            </Field>
            <Field id="company" label="Company" required error={errors.company}>
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                maxLength={CONTACT_LIMITS.company}
                value={values.company}
                onChange={update("company")}
                {...fieldA11y("company", errors.company, true)}
                className="contact-input"
              />
            </Field>
            <Field id="role" label="Role" error={errors.role}>
              <input
                id="contact-role"
                name="role"
                type="text"
                autoComplete="organization-title"
                maxLength={CONTACT_LIMITS.role}
                value={values.role}
                onChange={update("role")}
                {...fieldA11y("role", errors.role, false)}
                className="contact-input"
              />
            </Field>
          </div>

          <Field id="interest" label="Area of interest" error={errors.interest}>
            <select
              id="contact-interest"
              name="interest"
              value={values.interest}
              onChange={update("interest")}
              {...fieldA11y("interest", errors.interest, false)}
              className="contact-input contact-select"
            >
              <option value="">Select an area</option>
              {CONTACT_INTERESTS.map((interest) => (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
          </Field>

          <Field id="message" label="What needs to work better?" required error={errors.message}>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              maxLength={CONTACT_LIMITS.message}
              value={values.message}
              onChange={update("message")}
              {...fieldA11y("message", errors.message, true)}
              className="contact-input resize-y"
            />
          </Field>

          {/* Honeypot: off-screen and out of the tab order, so only bots fill it in. */}
          <div aria-hidden="true" className="contact-honeypot">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={update("website")}
            />
          </div>

          <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={submitting} className="hero-cta hero-cta-primary contact-submit">
              <span>{submitting ? "Sending…" : "Send enquiry"}</span>
              <span aria-hidden="true">→</span>
            </button>
            <p className="text-xs text-[var(--text-muted)]">
              <span aria-hidden="true">*</span> Required
            </p>
          </div>

          <p role="status" aria-live="polite" className="contact-status min-h-[1.5rem] text-sm" data-state={status.state}>
            {status.state === "success" && "Thank you. Your message has been sent, and we'll be in touch soon."}
            {status.state === "error" && status.message}
          </p>
        </form>
      </div>
    </div>
  );
}

function fallbackMessage() {
  return CONTACT_DETAILS.email
    ? `We couldn't send your message. Please email us at ${CONTACT_DETAILS.email}.`
    : "We couldn't send your message. Please try again later.";
}

function fieldA11y(field: ContactField, error: string | undefined, required: boolean) {
  return {
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `contact-${field}-error` : undefined,
  };
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: ContactField;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`contact-${id}`} className="contact-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`contact-${id}-error`} className="contact-error text-xs">
          {error}
        </p>
      )}
    </div>
  );
}
