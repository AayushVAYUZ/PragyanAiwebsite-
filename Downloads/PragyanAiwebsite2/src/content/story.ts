/**
 * The business story between the opening and the proof: why enterprise ai is hard, why
 * Pragyan ai, how to engage, what PRISM delivers, the outcomes and the trust behind them.
 *
 * Copy is the approved P1 story brief, with "ai" in the brand's lowercase. Figures come from
 * the Pragyan ai deck as quoted in that brief; the deck itself is not in the repository.
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
  // TODO: cite the primary source for each figure as it appears in the deck.
  evidence: [
    { value: "92%", label: "Enterprise ai scaling challenge", detail: "of Indian enterprises still struggle to scale ai." },
    { value: "58%", label: "Digitization readiness challenge", detail: "say low enterprise digitization is holding back ai adoption." },
    {
      value: "₹91.5T",
      label: "Potential economic impact by 2035",
      detail: "could be added to India's economy by 2035 as ai contributes to economic growth.",
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
      text: "Move from identifying the right opportunity through prioritisation, solution design, prototype, deployment and continuous improvement.",
    },
    {
      number: "04",
      title: "Augmented Intelligence",
      equation: "Human Intelligence + Artificial Intelligence = Augmented Intelligence",
      text: "The goal is not to replace how people work. It is to expand what people and enterprises can achieve.",
    },
  ] as { number: string; title: string; text: string; equation?: string }[],
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
  cta: string;
}

export const ENGAGEMENT = {
  label: "Engagement models",
  heading: "Start where the business needs it.",
  lead: "Not every enterprise starts from the same point. Pragyan ai can engage from identifying the opportunity through building, deploying and improving the solution.",
  models: [
    {
      number: "01",
      name: "Explore",
      summary: "Identify where ai can create meaningful business value.",
      includes: ["Business problem discovery", "Opportunity identification", "Data and process understanding", "Priority opportunities"],
      bestFor: "Enterprises starting their ai journey.",
      cta: "Explore",
    },
    {
      number: "02",
      name: "Prove",
      summary: "Turn one high-value opportunity into a working proof of concept.",
      includes: ["Use-case definition", "Data assessment", "Solution design", "Working prototype", "Business validation"],
      bestFor: "Enterprises that need evidence before scaling.",
      cta: "Prove",
    },
    {
      number: "03",
      name: "Build",
      summary: "Take a validated solution into production.",
      includes: ["Solution architecture", "Integration", "Engineering", "Deployment", "Production readiness"],
      bestFor: "Enterprises ready to operationalise ai.",
      cta: "Build",
    },
    {
      number: "04",
      name: "Scale",
      summary: "Extend intelligence across existing workflows, systems and business functions.",
      includes: ["Continuous improvement", "Additional use cases", "Embedded intelligence", "Workflow expansion", "Operational measurement"],
      bestFor: "Enterprises moving from individual use cases to broader adoption.",
      cta: "Scale",
    },
  ] as EngagementModel[],
};

/* ---------------------------------------------------------------- */
/* PRISM packaged offers: what happens when we start?               */
/* Engagement offers derived from the methodology: no prices,       */
/* durations or contractual terms.                                  */
/* ---------------------------------------------------------------- */

export interface PrismOffer {
  number: string;
  phase: string;
  offer: string;
  outcome: string;
  deliverables: string[];
}

export const PRISM_OFFERS = {
  label: "PRISM",
  heading: "From methodology to action.",
  lead: "PRISM gives enterprises a structured way to move from ai possibility to practical business value.",
  cta: "Explore PRISM",
  offers: [
    {
      number: "01",
      phase: "Orient",
      offer: "ai Opportunity Assessment",
      outcome: "Understand the business, priorities, current processes, systems, data and success measures.",
      deliverables: [
        "Business goals",
        "Key challenges",
        "Stakeholder inputs",
        "Success measures",
        "Process map",
        "System overview",
        "Data sources",
        "Current gaps",
      ],
    },
    {
      number: "02",
      phase: "Disperse",
      offer: "ai Opportunity & Readiness Sprint",
      outcome: "Identify where ai can help and determine whether the enterprise is ready to move forward.",
      deliverables: [
        "ai opportunities",
        "Priority use cases",
        "Process improvement areas",
        "Data sources",
        "Knowledge sources",
        "Data gaps",
        "Technology readiness",
        "Security requirements",
        "People and skill gaps",
      ],
    },
    {
      number: "03",
      phase: "Spectrum",
      offer: "ai Value & Prioritisation Blueprint",
      outcome: "Determine which opportunities should move forward first.",
      deliverables: [
        "Opportunity list",
        "Use-case list",
        "Business impact",
        "Priority areas",
        "Business case",
        "Value assessment",
        "Investment roadmap",
      ],
    },
    {
      number: "04",
      phase: "Refract",
      offer: "ai Solution Architecture",
      outcome: "Translate the selected opportunity into a practical solution design.",
      deliverables: [
        "Solution requirements",
        "User needs",
        "Process changes",
        "ai requirements",
        "Solution design",
        "System integration plan",
        "Data flow",
        "Solution architecture",
        "Technology comparison",
        "Build vs Buy assessment",
      ],
    },
    {
      number: "05",
      phase: "Emerge",
      offer: "ai Prototype to Production",
      outcome: "Build, deploy, measure and improve the selected solution.",
      deliverables: [
        "Working prototype",
        "User feedback",
        "Results & KPIs",
        "Go / No-Go decision",
        "Working solution",
        "System integration",
        "Production deployment",
        "User training",
        "Monitoring",
        "Support",
        "Security",
        "Improvement roadmap",
      ],
    },
  ] as PrismOffer[],
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

/* ---------------------------------------------------------------- */
/* Trust: who / what supports the claim?                            */
/* ---------------------------------------------------------------- */

export interface TrustQuote {
  text: string;
  name: string;
  role: string;
  organisation: string;
}

export interface LeadershipVoice {
  name: string;
  role: string;
  /** Path under /public; omitted until an approved headshot exists. */
  image?: string;
}

export const TRUST = {
  label: "Client proof",
  heading: "Real work. Real systems. Real outcomes.",
  // TODO: say which engagement these operating-scale figures come from once confirmed.
  scale: [
    { value: "8", label: "Branches" },
    { value: "24", label: "Practices" },
    { value: "1,399", label: "Documents" },
    { value: "12", label: "Weeks to go live" },
  ],
  // TODO: client quote, held until the client approves being named and quoted.
  quote: null as TrustQuote | null,
  // TODO: leadership voices, held until names and roles are confirmed in approved source material.
  leadership: [] as LeadershipVoice[],
};
