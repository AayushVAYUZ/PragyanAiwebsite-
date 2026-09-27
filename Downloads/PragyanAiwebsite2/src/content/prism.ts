/**
 * PRISM — Pragyan Responsible Intelligence & Solution Methodology. One method: five stages,
 * each packaged as an engagement offer (no prices, durations or contractual terms), and each
 * mapped to the engagement model it sits in. Stage copy is from the approved Stitch reference
 * and DESIGN.md §22; offers are the approved P1 packaging as unified in the restructure brief.
 */

export type EngagementName = "Explore" | "Prove" | "Build" | "Scale";

export interface PrismStage {
  number: string;
  name: string;
  statement: string;
  description: string;
  tone: "cyan" | "violet" | "focus";
  offer: string;
  outcome: string;
  /** Deduplicated across stages: each deliverable belongs to exactly one stage. */
  deliverables: string[];
  /** The engagement model(s) this stage belongs to, in order. */
  engagement: EngagementName[];
}

export const PRISM_INTRO = {
  title: "PRISM",
  subtitle: "Pragyan Responsible Intelligence & Solution Methodology",
  lead: "Our approach to turning ai possibilities into measurable business value.",
  body: "Enterprise ai cannot remain an abstract experiment. PRISM brings structure to the journey — from understanding the business and exploring possibilities to identifying the right opportunities, designing the solution, and delivering measurable impact.",
};

export const PRISM_STAGES: PrismStage[] = [
  {
    number: "01",
    name: "Orient",
    statement: "Understand the problem.",
    description: "Understand the business, existing bottlenecks, and core strategic intent.",
    tone: "cyan",
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
    engagement: ["Explore"],
  },
  {
    number: "02",
    name: "Disperse",
    statement: "Explore the possibilities.",
    description: "Explore possibilities across autonomous cognition, generative workflows, and intelligent depth.",
    tone: "violet",
    offer: "ai Opportunity & Readiness Sprint",
    outcome: "Identify where ai can help and determine whether the enterprise is ready to move forward.",
    deliverables: [
      "ai opportunities",
      "Priority use cases",
      "Process improvement areas",
      "Knowledge sources",
      "Data gaps",
      "Technology readiness",
      "Security requirements",
      "People and skill gaps",
    ],
    engagement: ["Explore"],
  },
  {
    number: "03",
    name: "Spectrum",
    statement: "Find what matters.",
    description: "Evaluate what matters. Filter noise, assess feasibility, and measure tangible enterprise return.",
    tone: "focus",
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
    engagement: ["Prove"],
  },
  {
    number: "04",
    name: "Refract",
    statement: "Design the right solution.",
    description: "Design the right solution architecture, governance frameworks, and precision data pipelines.",
    tone: "violet",
    offer: "ai Solution Architecture & Prototype",
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
      "Working prototype",
      "User feedback",
      "Results & KPIs",
      "Go / No-Go decision",
    ],
    engagement: ["Prove"],
  },
  {
    number: "05",
    name: "Emerge",
    statement: "Deliver and improve.",
    description: "Continuous feedback loops amplifying real-world operational impact.",
    tone: "cyan",
    offer: "ai Production & Scale",
    outcome: "Deploy the validated solution, measure it, and extend it across the enterprise.",
    deliverables: [
      "Working solution",
      "System integration",
      "Production deployment",
      "User training",
      "Monitoring",
      "Support",
      "Security",
      "Improvement roadmap",
    ],
    engagement: ["Build", "Scale"],
  },
];
