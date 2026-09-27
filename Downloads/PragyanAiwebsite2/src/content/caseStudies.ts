/**
 * Frame 09 — Proof. Every word and number is the approved .docx content, as restructured by the
 * owner: each headline metric appears once per card, and both cases are shown in full.
 */

export interface CaseStudy {
  id: string;
  index: string;
  sector: string;
  metric: string;
  metricLabel: string;
  title: string;
  summary: string;
  /** Who the client is, in the owner's words; null until supplied (the line is then hidden). */
  client: string | null;
  challenge: string;
  solution: string[];
  impact: { value: string; text: string }[];
  /** How large the delivery was, where the owner has confirmed it. */
  scale?: { items: { value: string; label: string }[]; context: string };
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
      "Predictive analysis model for India's leading finance and wealth management firm, scoring credit risk across multiple parameters in real time.",
    client: null,
    challenge: "Manual credit assessment slowed lending decisions and limited risk visibility across the portfolio.",
    solution: ["Unified Data Intelligence", "Real-Time Risk Scoring", "Credit Behaviour Analysis", "Decision Intelligence Dashboard"],
    // The headline metric is the only result; it is not repeated in a stats row.
    impact: [],
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
    // TODO: client descriptor (e.g. "One of India's leading talent advisory firms").
    client: null,
    challenge: "Data was spread across systems, billing remained manual, and leaders lacked real-time operational visibility.",
    solution: ["Enterprise CRM", "ATS", "Real-time MIS & Dashboards", "Automated & Pre-Billing Validation", "Single Sign-On & Data Governance"],
    impact: [
      { value: "90%", text: "fewer billing errors" },
      { value: "70%", text: "time saved" },
    ],
    // Owner-confirmed as this engagement's figures (formerly the standalone "Client proof").
    // TODO: confirm "migrated" is the right verb for the 1,399 documents.
    scale: {
      items: [
        { value: "8", label: "Branches" },
        { value: "24", label: "Practices" },
        { value: "1,399", label: "Documents" },
        { value: "12", label: "Weeks to go live" },
      ],
      context: "Delivered across 8 branches and 24 practices — 1,399 documents migrated, live in 12 weeks.",
    },
    // TODO: CS02 image. It used to share case-study-02-manufacturing.png with the
    // Manufacturing industry tile; no talent-advisory photograph exists yet.
    image: null,
    alt: "",
    tone: "violet",
  },
];

/** The proof block's one contact CTA. */
export const PROOF_CTA = "Get similar results";
