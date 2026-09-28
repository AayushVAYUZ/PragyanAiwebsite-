/**
 * Ask P.ai — the site assistant's knowledge. Static and scripted: every answer is drawn from
 * content already published on this page (and reuses the same content modules where it can),
 * so the assistant never says anything the site does not. Topics are matched on keywords.
 */

import { CONTACT_DETAILS } from "./contact";
import { ENGAGEMENT } from "./story";
import { INDUSTRIES } from "./industries";
import { PRISM_STAGES } from "./prism";
import { SERVICES } from "./services";
import { SOVEREIGN } from "./sovereign";

export interface AssistantLink {
  label: string;
  href: `#${string}`;
}

export interface AssistantTopic {
  id: string;
  /** Lowercase words or phrases; the topic with the most hits answers. */
  keywords: string[];
  /** Paragraphs; a line starting "• " renders as a bullet. */
  answer: string[];
  links?: AssistantLink[];
  /** Quick replies offered after this answer. */
  next?: string[];
}

export const ASSISTANT_NAME = "P.ai";

export const ASSISTANT_GREETING = [
  "Hi, I'm P.ai, Pragyan ai's assistant.",
  "I can tell you about Pragyan ai and VAYUZ, what we build and how we work, or book a discovery call for you.",
];

/** Shown under the greeting and whenever the assistant is unsure. */
export const QUICK_REPLIES = [
  "Book a discovery call",
  "What is Pragyan ai?",
  "About VAYUZ",
  "Services",
  "How do you work?",
  "Contact details",
];

/** Phrases that start the booking flow rather than answering a topic. */
export const BOOKING_KEYWORDS = [
  "book",
  "booking",
  "appointment",
  "schedule",
  "call",
  "demo",
  "discovery",
  "consultation",
  "talk to",
  "speak to",
];

const phones = CONTACT_DETAILS.phones.filter(Boolean).join(" or ");
const address = CONTACT_DETAILS.address.filter(Boolean).join(" ");
const industries = INDUSTRIES.filter((industry) => industry.visible).map((industry) => industry.name);

export const ASSISTANT_TOPICS: AssistantTopic[] = [
  {
    id: "pragyan",
    keywords: ["pragyan", "who are you", "about you", "about pragyan", "company", "innovations", "pai", "p.ai"],
    answer: [
      "Pragyan ai INNOVATIONS is the dedicated artificial intelligence company of VAYUZ Technologies, focused on helping enterprises adopt ai with confidence.",
      "We combine research, engineering and innovation to create intelligent products, modernize enterprise platforms, integrate ai across digital ecosystems and build the foundation for a trusted Sovereign ai ecosystem.",
      "Our belief: ai doesn't start with a model. It starts with the right questions.",
    ],
    links: [{ label: "Our journey", href: "#journey" }],
    next: ["About VAYUZ", "Services", "Book a discovery call"],
  },
  {
    id: "vayuz",
    keywords: ["vayuz", "parent", "history", "journey", "founded", "since", "background", "experience", "established"],
    answer: [
      "VAYUZ Technologies was established in 2015 to lay a foundation of digital engineering. Along the way:",
      "• 2016: work starts on the BITOVN product stack",
      "• 2019–2021: first chatbots deployed, later for healthcare and fintech clients",
      "• 2023: grid intelligence, ai revenue forecasting and a water forecasting system for a State Government",
      "• 2024: the ai mission is coined inside VAYUZ as Pragyan (Pai)",
      "• 2025: ai solutions for a leading wealth management firm, and RAPYD Exchange, an ai-based ATS",
      "• 2026: Pragyan ai INNOVATIONS spins off from VAYUZ as an independent ai organization",
    ],
    links: [{ label: "See the full journey", href: "#journey" }],
    next: ["What is Pragyan ai?", "Products", "Contact details"],
  },
  {
    id: "services",
    keywords: ["service", "services", "offer", "offering", "capabilities", "what do you do", "help with", "solutions", "expertise"],
    answer: ["Our services:", ...SERVICES.map((service) => `• ${service.title}`)],
    links: [{ label: "Explore our services", href: "#capabilities" }],
    next: ["ai Droplets", "Sovereign ai", "Book a discovery call"],
  },
  {
    id: "prism",
    keywords: ["prism", "method", "methodology", "approach", "process", "how do you work", "how you work", "framework", "stages"],
    answer: [
      "PRISM (Pragyan Responsible Intelligence & Solution Methodology) is how we turn ai possibilities into measurable business value, in five stages:",
      ...PRISM_STAGES.map((stage) => `• ${stage.number} ${stage.name}: ${stage.statement}`),
    ],
    links: [{ label: "Explore PRISM", href: "#prism" }],
    next: ["Engagement models", "Book a discovery call"],
  },
  {
    id: "engagement",
    keywords: ["engage", "engagement", "work together", "work with", "start", "pilot", "poc", "proof of concept", "pricing", "cost", "price"],
    answer: [
      ENGAGEMENT.lead,
      ...ENGAGEMENT.models.map((model) => `• ${model.name}: ${model.summary}`),
      "Pricing depends on scope, so we agree it after a discovery call.",
    ],
    links: [{ label: "Engagement models", href: "#engagement" }],
    next: ["Book a discovery call", "How do you work?"],
  },
  {
    id: "droplets",
    keywords: ["droplet", "droplets", "embedded", "legacy", "existing systems", "bitovn", "modernize", "modernise"],
    answer: [
      "ai Droplets make legacy intelligent: modular ai capabilities embedded directly into the products, platforms and systems you already run, with no architecture overhaul and no operational downtime.",
      "They include meeting and document intelligence, intelligent search, recommendations, an ai copilot, predictive insights, data and invoice intelligence, automation and predictive maintenance.",
      "Don't rebuild what already works. Make it intelligent.",
    ],
    links: [{ label: "See ai Droplets", href: "#ai-droplets" }],
    next: ["Sovereign ai", "Book a discovery call"],
  },
  {
    id: "sovereign",
    keywords: ["sovereign", "on-prem", "on premise", "on-premise", "private cloud", "data residency", "governance", "security", "compliance", "regulated"],
    answer: [
      `Sovereign ai as a Service: ${SOVEREIGN.body} ${SOVEREIGN.tagline}`,
      ...SOVEREIGN.layers.filter((layer) => layer.number !== "05").map((layer) => `• ${layer.title}: ${layer.text}`),
      `Built for ${SOVEREIGN.layers.find((layer) => layer.number === "05")?.text ?? "regulated enterprises"}.`,
    ],
    links: [{ label: "See Sovereign ai", href: "#sovereign-ai" }],
    next: ["ai Droplets", "Book a discovery call"],
  },
  {
    id: "products",
    keywords: ["product", "products", "rex", "rapyd", "minuta", "recruitment", "hiring", "ats", "meeting notes", "mom", "transcription"],
    answer: [
      "We build ai internally, put it into real workflows, and use it ourselves:",
      "• ReX (RAPYD Exchange), ai for recruitment: JD generation, candidate scoring and benchmarking, ai-powered interview assessment",
      "• BITOVN Minuta, ai for meetings and collaboration: live captions and transcription, decision and action item tracking, ready-to-send MoM",
    ],
    links: [{ label: "See our products", href: "#products" }],
    next: ["Request a product demo", "Services"],
  },
  {
    id: "cases",
    keywords: ["case", "case study", "case studies", "results", "clients", "proof", "examples", "portfolio"],
    answer: [
      "Two examples from our case studies:",
      "• ai-powered credit risk prediction: decision turnaround cut from 5 days to 3 seconds",
      "• An ai-backed legacy talent advisory platform: 90% fewer billing errors",
    ],
    links: [{ label: "Read the case studies", href: "#case-studies" }],
    next: ["Industries", "Book a discovery call"],
  },
  {
    id: "industries",
    keywords: ["industry", "industries", "sector", "sectors", "bfsi", "bank", "healthcare", "government", "retail", "manufacturing", "agriculture", "energy", "education", "logistics"],
    answer: [`We have delivered ai use cases across ${industries.join(", ")}.`],
    links: [{ label: "Browse use cases", href: "#use-cases" }],
    next: ["Case studies", "Book a discovery call"],
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "number", "address", "office", "location", "where", "reach"],
    answer: [
      `Email: ${CONTACT_DETAILS.email}`,
      `Phone: ${phones}`,
      `Office: ${address}`,
      "Or I can book a discovery call for you right here.",
    ],
    links: [{ label: "Contact form", href: "#contact" }],
    next: ["Book a discovery call"],
  },
];

export const ASSISTANT_FALLBACK = [
  "I'm a simple assistant, so I only know what's on this site. Try one of these, or I can book a call so the team can answer you directly.",
];

/** Topic ids the quick replies map to directly, so a tap always gets the intended answer. */
export const QUICK_REPLY_TOPICS: Record<string, string> = {
  "What is Pragyan ai?": "pragyan",
  "About VAYUZ": "vayuz",
  Services: "services",
  "How do you work?": "prism",
  "Engagement models": "engagement",
  "ai Droplets": "droplets",
  "Sovereign ai": "sovereign",
  Products: "products",
  "Case studies": "cases",
  Industries: "industries",
  "Contact details": "contact",
};
