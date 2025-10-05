"use client";

import { useRef } from "react";

import Link from "next/link";

import gsap from "gsap";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import CustomEase from "gsap/dist/CustomEase";
import { useGSAP } from "@gsap/react";

import LogoSVG from "./LogoSVG";

import CTA from "./CTA";
import ScrambleText from "./ScrambleText";

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);

  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(DrawSVGPlugin, CustomEase);

    gsap.from([logoPathRef.current, "#logo-link"], {
      scrollTrigger: {
        trigger: "#hero-header",
        start: "bottom top",
        toggleActions: "play none none reverse",
      },
      duration: 0.75,
      ease: "power4.inOut",
      drawSVG: 0,
      autoAlpha: 0,
    });
  }, {});

  const handleLogoMouseEnter = contextSafe(() => {
    gsap.to(logoRef.current, {
      duration: 0.5,
      ease: "power2.inOut",
      fill: "#FFFFFF",
      fillOpacity: 1,
    });
  });

  const handleLogoMouseLeave = contextSafe(() => {
    gsap.to(logoRef.current, {
      duration: 0.5,
      ease: "power2.inOut",
      fillOpacity: 0,
    });
  });

  return (
    <nav
      className="max-w-container desktop:top-9 tablet:px-9 custom-grid p-responsive invisible fixed top-[20px] left-1/2 z-50 w-full -translate-x-1/2 px-[20px] mix-blend-difference"
      ref={navRef}
      id="navbar"
    >
      {/* Logo */}
      <Link
        href="/"
        onMouseEnter={handleLogoMouseEnter}
        onMouseLeave={handleLogoMouseLeave}
        id="logo-link"
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

      {/* Nav Links */}
      <div className="tablet:flex desktop:col-start-7 desktop:col-end-auto desktop:justify-self-start col-span-3 col-end-8 hidden justify-end gap-x-11 self-start">
        <div className="fade-up-2 flex items-center gap-x-6">
          <span>01</span>
          <Link href="/about">
            <ScrambleText text="studio" />
          </Link>
        </div>
        <div className="fade-up-2 flex items-center gap-x-6">
          <span>02</span>
          <Link href="/works">
            <ScrambleText text="works" />
          </Link>
        </div>
        <div className="fade-up-2 flex items-center gap-x-6">
          <span>03</span>
          <Link href="/archive">
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
