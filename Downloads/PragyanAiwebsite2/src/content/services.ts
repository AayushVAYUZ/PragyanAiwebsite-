import type { ContactInterest } from "@/content/contact";

/**
 * Frame 08 — the eight service lines. A catalogue, not a process: the order carries no
 * dependency between entries. Proof is only given where it is documented.
 */

export type ServiceId =
  | "agentic"
  | "strategy"
  | "knowledge"
  | "predictive"
  | "custom-llm"
  | "multimodal"
  | "droplets"
  | "sovereign";

export type ServiceProof =
  /** A documented result, optionally linked to the case study that backs it. */
  | { kind: "result"; text: string; caseStudyId?: string }
  /** A plain statement of where the service is in use. */
  | { kind: "note"; text: string }
  /** A link to the homepage section that covers the service in depth. */
  | { kind: "section"; text: string; href: `#${string}` };

export interface Service {
  id: ServiceId;
  number: string;
  title: string;
  problem: string;
  deliver: string;
  proof?: ServiceProof;
  /** Pre-selected in the contact form by "Discuss this". */
  interest: ContactInterest;
}

export const SERVICES: Service[] = [
  {
    id: "agentic",
    number: "01",
    title: "Agentic ai & Enterprise Automation",
    problem: "Multi-step workflows eat team capacity and create handoff delays.",
    deliver: "ai agents that execute workflows across your systems, with human-in-the-loop controls and audit trails.",
    interest: "Agentic ai & Automation",
  },
  {
    id: "strategy",
    number: "02",
    title: "ai Strategy & Transformation",
    problem: "ai pilots rarely make it to production or show ROI.",
    deliver: "PRISM-led assessment, use-case prioritisation, business case and a phased roadmap to production.",
    interest: "ai Strategy & Transformation",
  },
  {
    id: "knowledge",
    number: "03",
    title: "Knowledge & Data Intelligence",
    problem: "Critical knowledge is trapped in documents, systems and silos.",
    deliver: "A unified enterprise knowledge core with secure, context-aware search and retrieval.",
    interest: "Knowledge & Data Intelligence",
  },
  {
    id: "predictive",
    number: "04",
    title: "Predictive & Decision Intelligence",
    problem: "Decisions depend on slow, manual analysis.",
    deliver: "Forecasting, risk scoring and decision dashboards built on your operational data.",
    proof: { kind: "result", text: "Credit decisions: 5 days → 3 seconds", caseStudyId: "risk" },
    interest: "Predictive & Decision Intelligence",
  },
  {
    id: "custom-llm",
    number: "05",
    title: "Custom ai & LLM Engineering",
    problem: "Off-the-shelf models don't fit your domain, data or controls.",
    deliver: "Fine-tuned models and LLM applications with evaluation, guardrails and monitoring.",
    interest: "Custom ai & LLM Engineering",
  },
  {
    id: "multimodal",
    number: "06",
    title: "Multimodal ai Analysis",
    problem: "Insight is locked in documents, images, audio and video.",
    deliver: "Models that extract, classify and analyse across formats at scale.",
    interest: "Multimodal ai",
  },
  {
    id: "droplets",
    number: "07",
    title: "ai Droplets & Embedded Intelligence",
    problem: "Adding ai shouldn't mean rebuilding your platforms.",
    deliver: "Focused ai capabilities embedded directly into existing applications and workflows.",
    proof: { kind: "note", text: "Powering the BITOVN Suite" },
    interest: "ai Droplets",
  },
  {
    id: "sovereign",
    number: "08",
    title: "Sovereign ai Infrastructure & Governance",
    problem: "Regulated data can't leave your jurisdiction or control.",
    deliver: "Private, single-tenant ai environments with governance built in.",
    proof: { kind: "section", text: "Explore Sovereign ai", href: "#sovereign-ai" },
    interest: "Sovereign ai",
  },
];
