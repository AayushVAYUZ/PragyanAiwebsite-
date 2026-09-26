import { normaliseSubmission, validateSubmission, type ContactSubmission } from "@/lib/contactValidation";

/**
 * Contact form submissions. Validates server-side, drops honeypot hits, and sends the
 * enquiry through Resend's REST API. Without the email env vars it answers 503 so the
 * form can tell the visitor to use the email address instead.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
/** Resend's shared test sender; set CONTACT_FROM_EMAIL to an address on a verified domain. */
const DEFAULT_FROM = "Pragyan ai <onboarding@resend.dev>";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const submission = normaliseSubmission(body);

  // A bot filled the hidden field: report success so it has nothing to retry against.
  if (submission.website) return Response.json({ ok: true });

  const errors = validateSubmission(submission);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.warn("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set; the enquiry was not sent.");
    return Response.json(
      { ok: false, error: "The contact form is not available right now." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: to.split(",").map((address) => address.trim()).filter(Boolean),
        reply_to: submission.email,
        subject: `New enquiry: ${submission.interest || "General"} (${submission.company})`,
        text: formatEnquiry(submission),
      }),
    });
    if (!response.ok) {
      console.error(`[contact] Resend responded ${response.status}: ${await response.text()}`);
      return Response.json({ ok: false, error: "We couldn't send your message." }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Resend request failed:", error);
    return Response.json({ ok: false, error: "We couldn't send your message." }, { status: 502 });
  }

  return Response.json({ ok: true });
}

/** Plain text only, so nothing a visitor types is ever rendered as HTML. */
function formatEnquiry(submission: ContactSubmission): string {
  return [
    `Name: ${submission.name}`,
    `Work email: ${submission.email}`,
    `Company: ${submission.company}`,
    `Role: ${submission.role || "Not given"}`,
    `Area of interest: ${submission.interest || "Not selected"}`,
    ...(submission.context ? [`Came from: ${submission.context}`] : []),
    "",
    "What needs to work better?",
    submission.message,
  ].join("\n");
}
