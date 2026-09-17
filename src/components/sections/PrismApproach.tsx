"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";
import SectionContinuum from "./SectionContinuum";

gsap.registerPlugin(ScrollTrigger);

/** Frame 07 — PRISM / Our Approach. Copy from the approved Stitch reference and DESIGN.md §22. */
const STAGES = [
  {
    number: "01",
    name: "Orient",
    description: "Understand the business, existing bottlenecks, and core strategic intent.",
    tone: "cyan",
  },
  {
    number: "02",
    name: "Disperse",
    description: "Explore possibilities across autonomous cognition, generative workflows, and intelligence depth.",
    tone: "violet",
  },
  {
    number: "03",
    name: "Spectrum",
    description: "Evaluate what matters. Filter noise, assess feasibility, and measure tangible enterprise return.",
    tone: "focus",
  },
  {
    number: "04",
    name: "Refract",
    description: "Design the right solution architecture, governance frameworks, and precision data pipelines.",
    tone: "violet",
  },
  {
    number: "05",
    name: "Emerge",
    description: "Build. Deploy. Improve. Continuous feedback loops amplifying real-world operational impact.",
    tone: "cyan",
  },
] as const;

export default function PrismApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-prism-parallax]",
        { yPercent: -2 },
        { yPercent: 2, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.fromTo(
        "[data-prism-copy]",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 78%", end: "top 30%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        "[data-prism-stage]",
        { autoAlpha: 0, x: 28 },
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 70%", end: "top 12%", scrub: 0.7 },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="prism"
      ref={sectionRef}
      aria-labelledby="prism-heading"
      className="relative isolate min-h-[max(calc(var(--svh)*100),52rem)] overflow-hidden bg-[var(--void-black)]"
    >
      {/* Crystalline prism: the dominant visual (subtle parallax) */}
      <div data-prism-parallax className="absolute inset-x-0 -top-[3%] -bottom-[3%]">
        <Image
          src="/images/prism-background.png"
          alt="A crystalline prism refracting a beam of light into violet and cyan rays"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-[36%_50%] lg:object-center"
        />
      </div>

      {/* Grading: Stitch directional vignettes plus a moderate darkening (the approved asset is brighter) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.22)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--void-black)]/95 via-[var(--void-black)]/40 to-[var(--void-black)]/85" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--void-black)] via-transparent to-[var(--void-black)]/80" />
      <div aria-hidden="true" className="prism-core-glow pointer-events-none absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto grid min-h-[inherit] w-full max-w-[1720px] grid-cols-12 items-center gap-8 px-[var(--gutter-x)] pt-28 pb-24">
        {/* Editorial column */}
        <div className="col-span-12 flex flex-col justify-center gap-6 lg:col-span-4 lg:pr-4">
          <p
            data-prism-copy
            className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[var(--neon-cyan)]/30 bg-[var(--midnight-blue)]/60 px-3 py-1 text-[10px] font-medium tracking-[0.24em] text-[var(--neon-cyan)] uppercase"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--neon-cyan)]" />
            <span>07 — PRISM // Our Approach</span>
          </p>

          <h2
            id="prism-heading"
            data-prism-copy
            className="text-4xl leading-[1.12] font-light tracking-tight text-[var(--text-primary)] xl:text-5xl"
          >
            From AI possibility
            <br />
            <span className="bg-gradient-to-r from-[var(--text-soft)] via-[var(--electric-violet)] to-[var(--neon-cyan)] bg-clip-text font-normal text-transparent">
              to business value.
            </span>
          </h2>

          <div data-prism-copy className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-soft)] uppercase">
              Pragyan Responsible Intelligence &amp; Solution Methodology
            </h3>
            <p className="max-w-[420px] text-sm leading-relaxed text-[var(--text-secondary)]">
              Enterprise AI cannot remain an abstract experiment. PRISM acts as an optical engine of clarity—taking
              high-entropy raw intelligence potential, refracting it through rigorous business context, and projecting
              targeted, measurable enterprise execution.
            </p>
          </div>

          <p
            data-prism-copy
            className="w-fit rounded-r border-l border-[var(--electric-violet)]/50 bg-[var(--midnight-blue)]/40 px-4 py-2.5 font-[family-name:var(--font-mono)] text-[11px] tracking-wider text-[var(--text-secondary)]"
          >
            Possibility <span className="text-[var(--electric-violet)]">→</span> Cognitive perspective{" "}
            <span className="text-[var(--neon-cyan)]">→</span> Practical value
          </p>

          <div data-prism-copy className="pt-2">
            <a
              href="#prism-stages"
              onClick={(event: MouseEvent<HTMLAnchorElement>) => navigateToHash(event, "#prism-stages")}
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--border-active)] bg-[#0A0F23]/80 px-6 py-3 text-xs font-medium tracking-[0.16em] text-[var(--text-primary)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--electric-violet)] hover:bg-[var(--electric-violet)]/15 hover:shadow-[0_0_24px_-4px_rgba(139,45,255,0.4)]"
            >
              <span>Explore PRISM</span>
              <span aria-hidden="true" className="text-[var(--neon-cyan)] transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Negative space for the crystalline prism */}
        <div aria-hidden="true" className="pointer-events-none relative hidden items-center justify-center lg:col-span-4 lg:flex">
          <div className="prism-ring h-[340px] w-[340px] rounded-full border border-dashed border-[rgba(160,175,220,0.1)] opacity-30" />
          <div className="absolute h-[460px] w-[460px] rounded-full border border-[var(--electric-violet)]/10 opacity-20" />
        </div>

        {/* The five methodology stages, connected to the prism by light threads */}
        <ol
          id="prism-stages"
          aria-label="PRISM methodology stages"
          className="col-span-12 flex flex-col justify-center gap-3.5 lg:col-span-4 lg:pl-2"
        >
          {STAGES.map((stage) => (
            <li key={stage.number} data-prism-stage className="relative flex items-center">
              <span
                aria-hidden="true"
                className={`mr-2 -ml-8 hidden h-px w-8 bg-gradient-to-r from-transparent lg:block ${
                  stage.tone === "violet"
                    ? "to-[var(--electric-violet)]/40"
                    : stage.tone === "focus"
                      ? "to-[var(--neon-cyan)]/70"
                      : "to-[var(--neon-cyan)]/40"
                }`}
              />
              <div
                className={`prism-stage flex-1 rounded-xl p-4 ${
                  stage.tone === "focus"
                    ? "border border-[var(--electric-violet)]/40 bg-[var(--midnight-blue)]/60"
                    : "border border-[rgba(160,175,220,0.15)] bg-[var(--void-black)]/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-[family-name:var(--font-mono)] text-xs font-medium tracking-wider ${
                      stage.tone === "violet"
                        ? "text-[var(--electric-violet)]"
                        : stage.tone === "focus"
                          ? "text-[var(--text-soft)]"
                          : "text-[var(--neon-cyan)]"
                    }`}
                  >
                    {stage.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-3 w-1 rounded-full ${
                      stage.tone === "violet"
                        ? "bg-[var(--electric-violet)]/60"
                        : stage.tone === "focus"
                          ? "bg-gradient-to-b from-[var(--electric-violet)] to-[var(--neon-cyan)]"
                          : "bg-[var(--neon-cyan)]/60"
                    }`}
                  />
                  <h3 className="text-xs font-semibold tracking-[0.2em] text-[var(--text-primary)] uppercase">{stage.name}</h3>
                </div>
                <p
                  className={`mt-1.5 pl-7 text-xs leading-relaxed ${
                    stage.tone === "focus" ? "text-[var(--text-soft)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {stage.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <SectionContinuum index="07" title="PRISM (Our Approach)" next={{ href: "#capabilities", label: "Proceed to 08 — Capabilities" }} />
    </section>
  );
}
