"use client";

import { useRef } from "react";

import Link from "next/link";

import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

import LogoSVG from "./LogoSVG";
import CTA from "./CTA";
import ScrambleText from "./ScrambleText";

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      // The navbar's entrance (#navbar, .fade-up-2, .fill-width) is sequenced
      // by the hero's intro timeline, not here — those elements are supposed
      // to arrive at a specific beat of that sequence.
      const mm = gsap.matchMedia(navRef);

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // No draw-on, but the wordmark still swaps in on scroll: while the hero
        // is on screen it would sit directly on top of the hero's own header.
        const wordmark = [logoPathRef.current, "#logo-link"];

        ScrollTrigger.create({
          trigger: "#hero-header",
          start: "bottom top",
          refreshPriority: -1,
          onEnter: () => gsap.set(wordmark, { autoAlpha: 1, drawSVG: "100%" }),
          onLeaveBack: () => gsap.set(wordmark, { autoAlpha: 0, drawSVG: 0 }),
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from([logoPathRef.current, "#logo-link"], {
          scrollTrigger: {
            trigger: "#hero-header",
            start: "bottom top",
            toggleActions: "play none none reverse",
            // The navbar mounts above the hero it points at, so without an
            // explicit priority ScrollTrigger refreshes it out of page order.
            refreshPriority: -1,
          },
          duration: 0.75,
          ease: "power4.inOut",
          drawSVG: 0,
          autoAlpha: 0,
        });
      });
    },
    { scope: navRef },
  );

  const handleLogoMouseEnter = contextSafe(() => {
    gsap.to(logoRef.current, {
      duration: 0.5,
      ease: "power2.inOut",
      fill: "#FFFFFF",
      fillOpacity: 1,
      overwrite: true,
    });
  });

  const handleLogoMouseLeave = contextSafe(() => {
    gsap.to(logoRef.current, {
      duration: 0.5,
      ease: "power2.inOut",
      fillOpacity: 0,
      overwrite: true,
    });
  });

  return (
    <nav
      className="max-w-container desktop:top-8 tablet:px-6 custom-grid p-responsive invisible fixed top-[20px] left-1/2 z-50 w-full -translate-x-1/2 px-[20px] mix-blend-difference"
      ref={navRef}
      id="navbar"
    >
      {/* Logo */}
      <Link
        href="/"
        onMouseEnter={handleLogoMouseEnter}
        onMouseLeave={handleLogoMouseLeave}
        id="logo-link"
        aria-label="Azlhart home"
        className="invisible"
      >
        <LogoSVG
          refs={[logoRef, logoPathRef]}
          strokeColor="#FFFFFF"
          className="tablet:max-h-[48px] desktop:max-h-[64px] col-start-1 max-h-[32px]"
        />
      </Link>

      {/* CTA */}
      <div className="fade-up-2 tablet:col-end-13 tablet:order-last col-end-4 -translate-0.5 self-start">
        <CTA text="let's talk" className="p-responsive" />
      </div>

      {/* Nav Links. prefetch is off because these routes do not exist yet —
          Next was firing three 404 RSC requests on every page load. Drop the
          prop once the pages are built. */}
      <div className="tablet:flex desktop:col-start-7 desktop:col-end-auto desktop:justify-self-start col-span-3 col-end-8 hidden justify-end gap-x-11 self-start">
        <div className="fade-up-2 flex items-center gap-x-6">
          <span>01</span>
          <Link href="/about" prefetch={false}>
            <ScrambleText text="studio" />
          </Link>
        </div>
        <div className="fade-up-2 flex items-center gap-x-6">
          <span>02</span>
          <Link href="/works" prefetch={false}>
            <ScrambleText text="works" />
          </Link>
        </div>
        <div className="fade-up-2 flex items-center gap-x-6">
          <span>03</span>
          <Link href="/archive" prefetch={false}>
            <ScrambleText text="archive" />
          </Link>
        </div>
      </div>

      {/* Menu */}
      <div className="tablet:hidden col-end-5 flex flex-col items-end gap-y-[6px] self-start">
        <div className="fill-width h-[2px] w-6 rounded-full bg-white" />
        <div className="fill-width h-[2px] w-6 rounded-full bg-white" />
        <div className="fill-width h-[2px] w-6 rounded-full bg-white" />
      </div>
    </nav>
  );
};

export default Navbar;
