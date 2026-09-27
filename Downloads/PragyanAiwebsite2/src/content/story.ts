/**
 * The business story between the opening and the proof: why enterprise ai is hard, why
 * Pragyan ai, how to engage, what PRISM delivers, the outcomes and the trust behind them.
 *
 * Copy is the approved P1 story brief, with "ai" in the brand's lowercase. The market figures
 * are cited to their publisher; outcome figures come from the case studies.
 */

/* ---------------------------------------------------------------- */
/* Problem / Stakes: why does this matter?                          */
/* ---------------------------------------------------------------- */

export const PROBLEM = {
  label: "The enterprise ai gap",
  heading: ["ai is easy to explore.", "Making it work in the enterprise is harder."],
  lead: "Enterprises don't lack access to ai. The harder problem is turning ai into something useful, measurable and operational.",
  frictions: [
    "Data is fragmented.",
    "Processes are complex.",
    "Legacy systems cannot simply be replaced.",
    "The right use cases are not always obvious.",
    "And moving from prototype to production requires more than a model.",
  ],
  // The earlier 92% / 58% / ₹91.5T figures had no traceable source, so they were replaced.
  // Each figure below was checked against its linked article.
  // TODO: replace each source URL with the primary report URL.
  evidence: [
    {
      value: "4%",
      detail: "of Indian organisations say their enterprise data is fully ready for ai at scale",
      source: { publisher: "Dun & Bradstreet India", year: "2026", url: "https://cxotoday.com/research/indian-firms-rush-into-ai-but-96-lack-data-readiness/" },
    },
    {
      value: "44%",
      detail: "of Indian organisations are still planning or piloting ai",
      source: { publisher: "Dun & Bradstreet India", year: "2026", url: "https://cxotoday.com/research/indian-firms-rush-into-ai-but-96-lack-data-readiness/" },
    },
    {
      value: "~$967B",
      detail: "potential ai contribution to India's economy by 2035",
      source: {
        publisher: "Parliamentary Standing Committee on Communications & IT",
        year: "2026",
        url: "https://southasianherald.com/ai-set-to-add-nearly-1-trillion-to-indias-economy-by-2035-panel-says/",
      },
    },
  ],
  closing: ["The opportunity is significant.", "The path to value needs to be deliberate."],
};

/* ---------------------------------------------------------------- */
/* Why Pragyan: what makes the approach different?                  */
/* ---------------------------------------------------------------- */

export const WHY_PRAGYAN = {
  label: "Our difference",
  heading: "Why Pragyan ai",
  lead: "We don't begin with the model. We begin with the business, the data and the way work actually happens.",
  pillars: [
    {
      number: "01",
      title: "Business before model",
      text: "Start with the business problem, decisions, processes and data before choosing the ai approach.",
    },
    {
      number: "02",
      title: "Intelligence around what already exists",
      text: "Modernize and connect existing enterprise systems rather than assuming everything needs to be rebuilt.",
    },
    {
      number: "03",
      title: "From opportunity to production",
      text: "PRISM takes you from opportunity to production — one method, four ways to engage.",
      link: { label: "See how PRISM works", href: "#prism" },
    },
    {
      number: "04",
      title: "Augmented Intelligence",
      equation: "Human Intelligence + Artificial Intelligence = Augmented Intelligence",
      text: "The goal is not to replace how people work. It is to expand what people and enterprises can achieve.",
    },
  ] as { number: string; title: string; text: string; equation?: string; link?: { label: string; href: `#${string}` } }[],
};

/* ---------------------------------------------------------------- */
/* Engagement models: how can we work together?                     */
/* Proposed customer-facing packages, not established contracts.    */
/* ---------------------------------------------------------------- */

export interface EngagementModel {
  number: string;
  name: string;
  summary: string;
  includes: string[];
  bestFor: string;
  /** PRISM stages this model covers; each chip opens that stage's tab (0-based index). */
  stages: { label: string; index: number }[];
}

export const ENGAGEMENT = {
  label: "Engagement models",
  heading: "Start where the business needs it.",
  lead: "Not every enterprise starts from the same point. Pragyan ai engages at any stage — from identifying the opportunity to building, deploying and scaling the solution.",
  cta: { label: "Find your starting point", interest: "ai Strategy & Transformation" as const },
  models: [
    {
      number: "01",
      name: "Explore",
      summary: "Identify where ai can create meaningful business value.",
      includes: ["Business problem discovery", "Opportunity identification", "Data and process understanding", "Priority opportunities"],
      bestFor: "Enterprises starting their ai journey.",
      stages: [{ label: "Orient", index: 0 }, { label: "Disperse", index: 1 }],
    },
    {
      number: "02",
      name: "Prove",
      summary: "Turn one high-value opportunity into a working proof of concept.",
      includes: ["Use-case definition", "Data assessment", "Solution design", "Working prototype", "Business validation"],
      bestFor: "Enterprises that need evidence before scaling.",
      stages: [{ label: "Spectrum", index: 2 }, { label: "Refract", index: 3 }],
    },
    {
      number: "03",
      name: "Build",
      summary: "Take a validated solution into production.",
      includes: ["Solution architecture", "Integration", "Engineering", "Deployment", "Production readiness"],
      bestFor: "Enterprises ready to operationalise ai.",
      stages: [{ label: "Emerge", index: 4 }],
    },
    {
      number: "04",
      name: "Scale",
      summary: "Extend intelligence across existing workflows, systems and business functions.",
      includes: ["Continuous improvement", "Additional use cases", "Embedded intelligence", "Workflow expansion", "Operational measurement"],
      bestFor: "Enterprises moving from individual use cases to broader adoption.",
      stages: [{ label: "Emerge — continuous improvement", index: 4 }],
    },
  ] as EngagementModel[],
};

/* ---------------------------------------------------------------- */
/* Impact: what has changed in real work?                           */
/* Every figure is already published in the case studies or the     */
/* use cases section; `source` says where.                          */
/* ---------------------------------------------------------------- */

export const IMPACT = {
  label: "Impact",
  heading: "Built for outcomes.",
  outcomes: [
    { value: "5 days → 3 seconds", label: "Decision turnaround", source: "Case Study 01" },
    { value: "90%", label: "Fewer billing errors", source: "Case Study 02" },
    { value: "70%", label: "Time saved", source: "Case Study 02" },
    { value: "100%", label: "Real-time operational visibility", source: "Case Study 02" },
    {
      value: "40+",
      label: "Production-ready ai model prototypes available for rapid customer demonstrations",
      source: "Accelerators",
    },
  ],
};
