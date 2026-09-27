/**
 * Frame 09 — Sovereign ai. The four layers keep their approved card copy word for word; the
 * order runs from the data down to the compute it all stands on.
 */

export interface SovereignLayer {
  number: string;
  title: string;
  text: string;
  /** Optional marker shown beside the title. */
  tag?: string;
  /** A second labelled line under the text. */
  note?: { label: string; text: string };
}

export const SOVEREIGN = {
  heading: ["Your Data.", "Your Infrastructure.", "Your ai."],
  subheading: "Sovereign ai as a Service",
  body: "Controlled ai environments engineered around your jurisdiction, private data and governance requirements.",
  tagline: "Intelligence stays where you control it.",
  layers: [
    {
      number: "01",
      title: "Data Ingestion & Knowledge Core",
      text: "Strict jurisdictional data residency with private enterprise memory and controlled data pipelines.",
    },
    {
      number: "02",
      title: "Proprietary Model Training",
      text: "Isolated model training and sovereign fine-tuning. Model weights remain your intellectual property.",
    },
    {
      number: "03",
      title: "Secure Model Serving & Apps",
      text: "Localized inference and secure APIs with controlled model and data access.",
    },
    {
      number: "04",
      title: "Dedicated Compute Fabric",
      text: "Single-tenant compute and dedicated infrastructure isolated from shared environments.",
      tag: "Foundation",
    },
    {
      number: "05",
      title: "Built for",
      text: "BFSI · Government · Healthcare · Regulated enterprises",
      // TODO: owner to confirm the deployment options before launch.
      note: { label: "Deploy on", text: "On-premise · Private cloud · In-country data centre" },
    },
  ] as SovereignLayer[],
  /** Shared by the two signature capabilities; shown once, at the end of this section. */
  cta: "Talk to us about Droplets or Sovereign ai",
};

/** Gate glow per active layer: it brightens as the stack is built up. */
export const SOVEREIGN_GLOW = [0.35, 0.5, 0.65, 0.8, 1] as const;
