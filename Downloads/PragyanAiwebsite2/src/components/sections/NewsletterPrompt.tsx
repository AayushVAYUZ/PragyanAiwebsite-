import { NEWSLETTER } from "@/content/navigation";

/**
 * The newsletter proposition, shared word for word by the footer and the Insights section.
 * No newsletter backend exists, so the field is the footer's visual echo: not a form, no
 * input or button, nothing focusable, and hidden from assistive tech.
 * TODO: wire to a newsletter provider, then make this a real form.
 */
export default function NewsletterPrompt({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="max-w-md">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.3em] text-[var(--neon-cyan)]/70 uppercase">
        {NEWSLETTER.label}
      </p>
      <Heading className="mt-3 text-lg font-medium text-slate-200">{NEWSLETTER.heading}</Heading>
      <p className="mt-2 text-sm leading-relaxed font-light text-[var(--text-secondary)]">{NEWSLETTER.body}</p>
      <div aria-hidden="true" className="footer-field mt-5 flex items-center justify-between gap-3 rounded-full p-2 pl-6">
        <span className="text-sm text-slate-500">{NEWSLETTER.placeholder}</span>
        <span className="footer-field-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
