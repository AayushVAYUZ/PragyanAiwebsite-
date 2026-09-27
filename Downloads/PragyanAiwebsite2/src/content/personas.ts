/**
 * Persona routing: navigation only. Each role is pointed at the existing section that answers
 * its questions first; nothing here claims what a persona will achieve. `focus` and `routes`
 * record the brief's intent for each path and are not rendered.
 */

export interface Persona {
  number: string;
  name: string;
  roles: string;
  focus: string[];
  /** The existing section the card opens. */
  href: `#${string}`;
  /** Plain-language name of that destination, for the link's accessible name. */
  destination: string;
}

export const PERSONAS = {
  heading: "Where do you sit in the business?",
  lead: "Start with the questions closest to your role.",
  paths: [
    {
      number: "01",
      name: "Technology leaders",
      roles: "CTOs, CIOs and Digital Leaders",
      focus: ["ai strategy", "Enterprise architecture", "Modernization", "Data and ai engineering", "Enterprise ai adoption"],
      href: "#prism",
      destination: "PRISM, our approach",
    },
    {
      number: "02",
      name: "Business & operations leaders",
      roles: "COOs, business heads and transformation leaders",
      focus: ["Workflow intelligence", "Decision intelligence", "Automation", "Process improvement", "Operational visibility"],
      href: "#capabilities",
      destination: "our services",
    },
    {
      number: "03",
      name: "Finance & risk leaders",
      roles: "CFOs, finance and risk leaders",
      focus: ["Forecasting", "Risk intelligence", "Finance automation", "Decision support", "Operational control"],
      href: "#case-studies",
      destination: "the case studies",
    },
    {
      number: "04",
      name: "People & talent leaders",
      roles: "CHROs and HR leaders",
      focus: ["Talent intelligence", "ai interviewing", "Recruitment intelligence", "Workforce analytics", "HR workflow automation"],
      href: "#products",
      destination: "ReX, our recruitment product",
    },
  ] as Persona[],
};
