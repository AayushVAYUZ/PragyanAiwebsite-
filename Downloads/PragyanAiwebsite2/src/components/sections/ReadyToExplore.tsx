"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navigateToHash } from "@/lib/navigation";
import { keepAiLowercase } from "@/lib/brandText";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 14 — Ready to Explore. Composition from the approved Stitch reference: a full-bleed
 * horizon arc, the closing question on the left seven columns and the brand tagline,
 * right-aligned with a cyan/violet underline, on the right five.
 *
 * The opening half of the merged final block (#contact, see FinalContact): the closing question,
 * then the contact form directly below it. The "Talk to Pragyan ai" pill leads to the form.
 */
export default function ReadyToExplore() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Every case needs one matching condition: matchMedia only runs the setup when one matches.
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        if (context.conditions?.reduceMotion) return;

        // Text only: the horizon stays static and is never hidden by animation.
        gsap.fromTo(
          "[data-explore-copy]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 78%", toggleActions: "play none none none" },
          },
        );
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <div
      id="ready-to-explore"
      ref={sectionRef}
      className="relative isolate min-h-[36rem] overflow-hidden lg:min-h-[42rem]"
    >
      {/* Decorative horizon: full-bleed, scoped to this section */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/images/ready-to-explore-horizon.jpg"
          alt=""
          fill
          loading="eager"
          quality={90}
          sizes="100vw"
          className="explore-image object-cover object-[60%_50%] lg:object-center"
        />
        <div className="explore-scrims absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col justify-center px-[var(--gutter-x)] pt-28 pb-12">
        <div className="mx-auto grid w-full max-w-[1152px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Closing question */}
          <div className="flex flex-col items-start lg:col-span-7">
            <h2
              id="ready-to-explore-heading"
              data-explore-copy
              className="mb-6 text-[clamp(2.5rem,12.3vw,3rem)] leading-[1.08] font-light tracking-tight text-[#F5F7FF] sm:text-6xl xl:text-7xl"
            >
              What needs
              <br />
              <span className="font-normal text-white">to work better?</span>
            </h2>
            <p data-explore-copy className="mb-9 max-w-md text-base leading-relaxed font-light tracking-wide text-[#A2A8BC] sm:text-lg">
              Let&apos;s build what&apos;s next. Together.
            </p>
            {/* The reveal animates the wrapper, so its inline transform never cancels the pill's hover lift. */}
            <div data-explore-copy>
              <a
                href="#contact-form"
                onClick={(event) => navigateToHash(event, "#contact-form")}
                className="explore-pill inline-flex items-center gap-3 rounded-full px-6 py-3 text-xs font-medium tracking-widest whitespace-nowrap uppercase"
              >
                <span>{keepAiLowercase("Talk to Pragyan ai")}</span>
                <span aria-hidden="true" className="text-[var(--neon-cyan)]">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Brand tagline */}
          <div data-explore-copy className="flex flex-col items-start lg:col-span-5 lg:items-end lg:text-right">
            <p className="explore-tagline text-[13px] leading-relaxed font-light tracking-[0.32em] text-[#D8DEEE] uppercase sm:text-sm">
              Intelligence
              <br />
              <span className="font-medium text-white/95">For Efficient Results</span>
            </p>
            <div aria-hidden="true" className="explore-underline mt-4 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
