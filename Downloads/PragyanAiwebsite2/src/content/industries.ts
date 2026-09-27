/**
 * Frame 11 — the industries, in the order supplied, with the use cases actually delivered in
 * each. An industry with no documented use cases yet is kept here with `visible: false` so it
 * can be switched back on once there is content for it.
 */

export type IndustryIcon = "bank" | "sprout" | "stethoscope" | "cart" | "truck" | "civic" | "factory" | "bolt" | "cap" | "home";

export interface Industry {
  id: string;
  name: string;
  icon: IndustryIcon;
  cases: string[];
  image: string;
  alt: string;
  visible: boolean;
}

export const INDUSTRIES: Industry[] = [
  {
    id: "bfsi",
    name: "BFSI",
    icon: "bank",
    cases: ["Credit Covenant Intelligence", "Loan Risk Prediction", "RM Copilot"],
    image: "/images/usecase-bfsi.png",
    alt: "A banking headquarters at night with curved analytics screens",
    visible: true,
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "sprout",
    cases: [],
    image: "/images/usecase-agriculture.jpg",
    alt: "An autonomous tractor working a field at night under guidance lighting",
    visible: false,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "stethoscope",
    cases: ["Diagnostic Capacity Forecasting", "Provider Fraud Detection"],
    image: "/images/usecase-healthcare.png",
    alt: "A clinical control centre at night with diagnostic telemetry",
    visible: true,
  },
  {
    id: "retail-fmcg",
    name: "Retail & FMCG",
    icon: "cart",
    cases: ["Inventory Intelligence", "Demand Forecasting", "Dynamic Pricing"],
    image: "/images/usecase-retail.png",
    alt: "A connected retail flagship at night with ambient display fixtures",
    visible: true,
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    icon: "truck",
    cases: [],
    image: "/images/usecase-logistics.png",
    alt: "An automated distribution hub at night with guided vehicles and conveyor tracks",
    visible: false,
  },
  {
    id: "government",
    name: "Government",
    icon: "civic",
    cases: ["Water Forecasting System (State Govt.)", "Predictive Resource Planning"],
    image: "/images/usecase-government.jpg",
    alt: "An operations control room at night overlooking a lit city",
    visible: true,
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "factory",
    cases: ["Predictive Maintenance", "Quality Inspection", "Production Planning"],
    image: "/images/case-study-02-manufacturing.png",
    alt: "An automated manufacturing facility at night with precision robotics",
    visible: true,
  },
  {
    id: "energy-utilities",
    name: "Energy & Utilities",
    icon: "bolt",
    cases: ["Grid Intelligence", "ai Revenue Forecasting"],
    image: "/images/usecase-energy-utilities.jpg",
    alt: "An electrical substation at night with transmission lines and wind turbines beyond",
    visible: true,
  },
  {
    id: "education",
    name: "Education",
    icon: "cap",
    cases: [],
    image: "/images/usecase-education.jpg",
    alt: "A dark hall of tall illuminated panels in drifting mist",
    visible: false,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "home",
    cases: [],
    image: "/images/usecase-real-estate.jpg",
    alt: "An illuminated high-rise tower at night seen from the street",
    visible: false,
  },
];

export const USE_CASES_CLOSING = {
  text: "40+ ready-to-demo ai accelerators across industries.",
} as const;
