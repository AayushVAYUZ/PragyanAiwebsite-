"use client";

import type { MouseEvent } from "react";
import { navigateToHash } from "@/lib/navigation";
import { BELIEF_COPY, BELIEF_QUESTIONS, type QuestionTone } from "./beliefContent";

type ElementBinding<T extends Element> = (element: T | null) => void;

export interface BeliefFrameBindings {
  text: ElementBinding<HTMLElement>;
  nodeAnchor: ElementBinding<HTMLElement>;
  node: ElementBinding<HTMLElement>;
  line: (index: number) => ElementBinding<SVGLineElement>;
  card: (index: number) => ElementBinding<HTMLElement>;
}

/**
 * Card placement around the intelligence node (approved Stitch Frame 05), as
 * percentages of the network area. Each connection line runs from the node
 * (58%, 50%) to the corner of its card that faces the node.
 */
const NETWORK_LAYOUT = [
  { card: "left-[8%] top-[12%] max-w-[220px]", line: { x: "28%", y: "18%" }, dash: "3 3" },
  { card: "right-[4%] top-[14%] max-w-[240px]", line: { x: "84%", y: "20%" }, dash: "4 2" },
  { card: "left-[3%] top-[42%] max-w-[230px]", line: { x: "22%", y: "48%" }, dash: "2 3" },
  { card: "right-[1%] top-[46%] max-w-[250px]", line: { x: "88%", y: "52%" }, dash: "3 3" },
  { card: "left-[16%] bottom-[12%] max-w-[220px]", line: { x: "34%", y: "82%" }, dash: "4 3" },
  { card: "right-[8%] bottom-[10%] max-w-[220px]", line: { x: "80%", y: "84%" }, dash: "2 4" },
] as const;

export function QuestionCard({ label, question, tone }: { label: string; question: string; tone: QuestionTone }) {
  return (
    <div className="belief-card rounded-xl px-4 py-3">
      <div
        className={`mb-1.5 flex items-center justify-between gap-4 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider ${
          tone === "cyan" ? "text-[var(--neon-cyan)]/80" : "text-[#b58cff]/85"
        }`}
      >
        <span>{label}</span>
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${
            tone === "cyan"
              ? "bg-[var(--neon-cyan)] shadow-[0_0_6px_var(--neon-cyan)]"
              : "bg-[#b58cff] shadow-[0_0_6px_var(--electric-violet)]"
          }`}
        />
      </div>
      <p className="text-xs font-medium leading-snug text-[var(--text-primary)]">{question}</p>
    </div>
  );
}

/**
 * Frame 05 — The Belief. The resting state of the cinematic arrival: it lives in
 * the scene viewport, its elements are revealed by the master timeline (no pin of
 * its own), and it scrolls away into Frame 06 as normal document flow.
 */
export default function BeliefFrame({ bind }: { bind: BeliefFrameBindings }) {
  return (
    <section
      id="belief"
      data-scroll-target="scene-end"
      aria-labelledby="belief-heading"
      className="pointer-events-none absolute inset-0"
    >
      {/* Editorial column */}
      <div ref={(element) => bind.text(element)} className="invisible absolute inset-0 opacity-0">
        <div className="mx-auto grid h-full w-full max-w-[1720px] grid-cols-12 items-end px-[var(--gutter-x)] pt-28 pb-24 lg:items-center lg:pb-16">
          <div className="col-span-12 max-w-[34rem] lg:col-span-5 lg:max-w-none lg:pr-4">
            <h2
              id="belief-heading"
              className="mb-6 text-4xl leading-[1.08] font-light tracking-tight text-[var(--text-primary)] sm:text-5xl xl:text-6xl"
            >
              {BELIEF_COPY.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block bg-gradient-to-r from-[#a78bfa] via-[#d8b4fe] to-[var(--neon-cyan)] bg-clip-text font-normal text-transparent">
                {BELIEF_COPY.headingAccent}
              </span>
            </h2>

            <p className="mb-9 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">{BELIEF_COPY.body}</p>

            <div className="flex items-center gap-4">
              <a
                href={BELIEF_COPY.cta.href}
                onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, BELIEF_COPY.cta.href)}
                className="group pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[var(--border-active)] bg-[#0A0F23]/70 px-6 py-3 text-xs font-medium tracking-wider text-[var(--text-primary)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[var(--neon-cyan)]/50 hover:bg-[#121A3B]/80 hover:shadow-[0_0_24px_rgba(38,198,255,0.25)]"
              >
                <span>{BELIEF_COPY.cta.label}</span>
                <span aria-hidden="true" className="text-[var(--neon-cyan)] transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <span className="hidden font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--text-muted)] sm:block">
                {BELIEF_COPY.methodologyNote}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Distributed inquiry network: node, filaments and the six questions (large screens) */}
      <div className="absolute inset-0 hidden lg:block">
        <div className="mx-auto grid h-full w-full max-w-[1720px] grid-cols-12 items-center px-[var(--gutter-x)] pt-28 pb-16">
          <div className="relative col-span-7 col-start-6 h-[min(560px,calc(var(--svh)*100-13rem))]">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id="belief-cyan-violet" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#26C6FF" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#8B2DFF" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#26C6FF" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="belief-violet-cyan" x1="100%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B2DFF" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#26C6FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B2DFF" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {NETWORK_LAYOUT.map((layout, index) => (
                <line
                  key={layout.card}
                  ref={bind.line(index)}
                  className="belief-filament"
                  x1="58%"
                  y1="50%"
                  x2={layout.line.x}
                  y2={layout.line.y}
                  stroke={index % 2 === 0 ? "url(#belief-cyan-violet)" : "url(#belief-violet-cyan)"}
                  strokeDasharray={layout.dash}
                  strokeWidth="1"
                  style={{ opacity: 0, visibility: "hidden" }}
                />
              ))}
            </svg>

            {/* The constellation node settles exactly under this anchor */}
            <div ref={(element) => bind.nodeAnchor(element)} aria-hidden="true" className="absolute top-1/2 left-[58%] h-0 w-0">
              <div ref={(element) => bind.node(element)} className="invisible opacity-0">
                <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-cyan-200/80 blur-[1px]" />
                <span className="belief-node-ring absolute -top-5 -left-5 h-10 w-10 rounded-full border border-[var(--neon-cyan)]/20" />
                <span className="absolute -top-11 -left-11 h-22 w-22 rounded-full border border-[var(--electric-violet)]/15" />
              </div>
            </div>

            <ul aria-label="The questions that come first" className="absolute inset-0">
              {BELIEF_QUESTIONS.map((question, index) => (
                <li
                  key={question.label}
                  ref={bind.card(index)}
                  className={`invisible absolute opacity-0 ${NETWORK_LAYOUT[index].card}`}
                >
                  <div className={index % 2 === 0 ? "belief-float" : "belief-float-delayed"}>
                    <QuestionCard {...question} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
