/** Frame 05 — The Belief. Copy from the approved Stitch reference and DESIGN.md §20. */

export const BELIEF_COPY = {
  label: "05 — The Belief",
  subLabel: "// Cognitive foundation",
  heading: ["AI doesn't", "start with a model.", "It starts with"],
  headingAccent: "the right questions.",
  body: "Effective enterprise AI begins with understanding the business, the underlying friction, and the high-value questions that matter—not simply deploying an off-the-shelf model into existing complexity.",
  cta: { label: "Explore Our Belief", href: "#journey" },
  methodologyNote: "PRISM_METHODOLOGY // ORIENT",
};

export type QuestionTone = "cyan" | "violet";

export interface BeliefQuestion {
  label: string;
  question: string;
  tone: QuestionTone;
}

export const BELIEF_QUESTIONS: BeliefQuestion[] = [
  { label: "Q.01 // Objective", question: "What are we trying to improve?", tone: "cyan" },
  { label: "Q.02 // Velocity", question: "Where are decisions taking too long?", tone: "violet" },
  { label: "Q.03 // Synthesis", question: "What information is hard to access?", tone: "cyan" },
  { label: "Q.04 // Value", question: "Where can AI create real business value?", tone: "violet" },
  { label: "Q.05 // Assets", question: "What data do we already have?", tone: "cyan" },
  { label: "Q.06 // Architecture", question: "What should not be rebuilt?", tone: "violet" },
];
