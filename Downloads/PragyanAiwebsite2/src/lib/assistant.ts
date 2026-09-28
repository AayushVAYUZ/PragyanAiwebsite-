import { ASSISTANT_TOPICS, BOOKING_KEYWORDS, QUICK_REPLY_TOPICS, type AssistantTopic } from "@/content/assistant";

const OPEN_EVENT = "pragyan:assistant-open";

/** Opens the Ask P.ai panel from anywhere on the page (the header CTA, the mobile menu). */
export function openAssistant() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Subscribes the assistant to open requests; returns the unsubscribe function. */
export function onAssistantOpen(listener: () => void): () => void {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}

function normalise(text: string): string {
  return ` ${text.toLowerCase().replace(/[^a-z0-9.&\s-]/g, " ").replace(/\s+/g, " ").trim()} `;
}

/** A keyword counts when it appears as whole words; phrases weigh more than single words. */
function hits(text: string, keyword: string): number {
  return text.includes(` ${keyword} `) ? (keyword.includes(" ") ? 2 : 1) : 0;
}

export function wantsBooking(input: string): boolean {
  const text = normalise(input);
  return BOOKING_KEYWORDS.some((keyword) => hits(text, keyword) > 0);
}

/** The best-matching topic, or null when nothing on the site fits. */
export function findTopic(input: string): AssistantTopic | null {
  const direct = QUICK_REPLY_TOPICS[input.trim()];
  if (direct) return ASSISTANT_TOPICS.find((topic) => topic.id === direct) ?? null;

  const text = normalise(input);
  let best: AssistantTopic | null = null;
  let bestScore = 0;
  for (const topic of ASSISTANT_TOPICS) {
    const score = topic.keywords.reduce((sum, keyword) => sum + hits(text, keyword), 0);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}
