/**
 * Site-wide navigation and footer copy. The header and the footer's "Navigate" column share
 * PRIMARY_NAV, so the two can never drift apart.
 */

export interface NavLink {
  label: string;
  /** In-page anchor. Null means no destination exists yet: the label renders as plain text. */
  href: `#${string}` | `https://${string}` | null;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Who We Are", href: "#journey" },
  { label: "What We Do", href: "#prism" },
  { label: "What We Think", href: "#insights" },
  { label: "Work With Us", href: "#capabilities" },
  { label: "Connect With Us", href: "#contact" },
];

export const FOOTER = {
  tagline: "Intelligence for Efficient Results",
  description: "ai engineering for enterprises — from identifying the opportunity to taking intelligence into production.",
  // TODO: destinations for VAYUZ Technologies, Careers, Security, Privacy and Terms. Until
  // they exist those entries render as plain text, never as dead links.
  company: [
    { label: "About Pragyan ai", href: "#journey" },
    { label: "VAYUZ Technologies", href: null },
    { label: "Careers", href: null },
    { label: "Security", href: null },
    { label: "Privacy", href: null },
    { label: "Terms", href: null },
  ] as NavLink[],
  legal: [
    { label: "Privacy", href: null },
    { label: "Terms", href: null },
    { label: "Contact", href: "#contact" },
  ] as NavLink[],
  copyright: "© 2026 Pragyan ai. All rights reserved.",
};

/**
 * One newsletter proposition, used word for word in the footer and the Insights section.
 * No publishing cadence is promised: none has been established.
 */
export const NEWSLETTER = {
  label: "Stay in the loop",
  heading: "Practical thinking on enterprise ai.",
  body: "Receive occasional insights on where ai can create business value, how enterprises can prepare for adoption, and what it takes to move from prototype to production.",
  placeholder: "Enter your email",
};
