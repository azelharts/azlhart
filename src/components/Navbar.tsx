"use client";

import { useRef } from "react";

import { usePathname } from "next/navigation";

import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

import LogoSVG from "./LogoSVG";
import CTA from "./CTA";
import ScrambleText from "./ScrambleText";
import TransitionLink from "./TransitionLink";
import { useContactPanel } from "./ContactPanel";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "index" },
  { href: "/about", label: "about" },
  { href: "/works", label: "works" },
];

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);

  const pathname = usePathname();
  const openContact = useContactPanel();
  const isHome = pathname === "/";

  useGSAP(
    () => {
      const mm = gsap.matchMedia(navRef);
      const wordmark = [logoPathRef.current, "#logo-link"];

      // Off the landing page there is no hero intro to reveal the navbar, and
      // no giant hero logo competing with the wordmark — show both directly.
      if (!isHome) {
        gsap.set([navRef.current, ".fade-up-2"], { autoAlpha: 1 });

        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(wordmark, { autoAlpha: 1, drawSVG: "100%" });
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            wordmark,
            { autoAlpha: 0, drawSVG: 0 },
            {
              autoAlpha: 1,
              drawSVG: "100%",
              duration: 1.25,
              ease: "power3.inOut",
            },
          );

          // On a long read the links sit right over the text column. Tuck
          // them away while scrolling down, bring them back on the way up.
          const hide = gsap.to(".nav-tuck", {
            autoAlpha: 0,
            yPercent: -50,
            duration: 0.4,
            paused: true,
          });
          ScrollTrigger.create({
            start: 200,
            end: "max",
            // Guarded on the actual scroll: on a page too short to scroll,
            // the trigger still updates once on refresh and would hide the
            // links for good.
            onUpdate: (self) =>
              self.direction === 1 && self.scroll() > 200
                ? hide.play()
                : hide.reverse(),
            onLeaveBack: () => hide.reverse(),
          });
        });
        return;
      }

      // On the landing page the navbar's entrance (#navbar, .fade-up-2) is
      // sequenced by the hero's intro timeline, and the wordmark stays hidden:
      // the index doesn't scroll, and the hero's own logo is right there.
    },
    { scope: navRef, dependencies: [isHome], revertOnUpdate: true },
  );

  return (
    <nav
      className="max-w-container desktop:top-8 tablet:px-6 custom-grid p-responsive invisible fixed top-[20px] left-1/2 z-50 w-full -translate-x-1/2 px-[20px] mix-blend-difference"
      ref={navRef}
      id="navbar"
    >
      {/* Logo */}
      <TransitionLink
        href="/"
        id="logo-link"
        aria-label="Azlhart home"
        className="group invisible"
      >
        <LogoSVG
          refs={[logoRef, logoPathRef]}
          strokeColor="#FFFFFF"
          // Fill on hover in CSS, not a tween: a CSS :hover can't get stuck
          // "on" when a mouseleave is missed (the transition overlay, a tap).
          className="tablet:max-h-[48px] desktop:max-h-[64px] col-start-1 max-h-[32px] fill-white/0 transition-[fill] duration-500 [@media(hover:hover)]:group-hover:fill-white"
        />
      </TransitionLink>

      {/* CTA */}
      <div className="nav-tuck fade-up-2 tablet:col-end-13 tablet:order-last col-end-5 -translate-0.5 self-start justify-self-end">
        <CTA text="let's talk" onClick={openContact} className="p-responsive" />
      </div>

      {/* Nav Links */}
      <div className="nav-tuck desktop:col-start-7 desktop:col-end-auto desktop:justify-self-start tablet:col-span-3 tablet:col-end-8 tablet:gap-x-11 tablet:col-start-auto col-span-2 col-start-2 row-start-1 flex justify-end gap-x-6 self-start">
        {NAV_LINKS.map((link, i) => (
          <div
            key={link.href}
            // The wordmark already links home on small screens, and the row
            // has no room for both links next to the CTA.
            className={cn(
              "fade-up-2 items-center gap-x-6",
              i === 0 ? "tablet:flex hidden" : "flex",
            )}
          >
            <span className="tablet:inline hidden">0{i + 1}</span>
            <TransitionLink href={link.href}>
              <ScrambleText text={link.label} />
            </TransitionLink>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
