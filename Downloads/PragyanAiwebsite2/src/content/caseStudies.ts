import type { ContactInterest } from "@/content/contact";

/**
 * Frame 09 — Proof. Every word and number is the approved .docx content. No case study has a
 * published detail page yet, so each CTA leads to the contact form instead.
 */

export interface CaseStudy {
  id: string;
  index: string;
  sector: string;
  metric: string;
  metricLabel: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string[];
  impact: { value: string; text: string }[];
  cta: string;
  /** Pre-selected in the contact form by the CTA. */
  interest: ContactInterest;
  /** Null renders the on-brand gradient placeholder until a photograph is supplied. */
  image: string | null;
  alt: string;
  tone: "cyan" | "violet";
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "risk",
    index: "Case Study 01",
    sector: "Finance & Wealth Management",
    metric: "5 days → 3 seconds",
    metricLabel: "Decision turnaround",
    title: "ai-powered Credit Risk Prediction",
    summary:
      "Predictive analysis model for India's leading finance and wealth management firm, using multiple parameters to reduce decision time and effort from 5 days to 3 seconds.",
    challenge: "Manual credit assessment slowed lending decisions and limited risk visibility across the portfolio.",
    solution: ["Unified Data Intelligence", "Real-Time Risk Scoring", "Credit Behaviour Analysis", "Decision Intelligence Dashboard"],
    impact: [{ value: "5 days → 3 seconds", text: "decision turnaround time" }],
    cta: "Get similar results",
    interest: "Predictive & Decision Intelligence",
    image: "/images/case-study-p-and-c.png",
    alt: "A financial trading floor at night, analysts silhouetted against curved data screens",
    tone: "cyan",
  },
  {
    id: "talent",
    index: "Case Study 02",
    sector: "Talent Advisory",
    metric: "90% fewer billing errors",
    metricLabel: "Billing accuracy",
    title: "ai-backed Legacy Talent Advisory Platform",
    summary: "Modernising the legacy talent advisory platform with ai and intelligent automation.",
    challenge: "Data was spread across systems, billing remained manual, and leaders lacked real-time operational visibility.",
    solution: ["Enterprise CRM", "ATS", "Real-time MIS & Dashboards", "Automated & Pre-Billing Validation", "Single Sign-On & Data Governance"],
    impact: [
      { value: "90%", text: "reduction in billing errors" },
      { value: "100%", text: "real-time operational visibility" },
      { value: "70%", text: "time saved" },
    ],
    cta: "Get similar results",
    interest: "Agentic ai & Automation",
    // TODO: replace CS02 image. It used to share case-study-02-manufacturing.png with the
    // Manufacturing industry tile; no talent-advisory photograph exists yet.
    image: null,
    alt: "",
    tone: "violet",
  },
];
