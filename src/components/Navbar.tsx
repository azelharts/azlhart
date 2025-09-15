"use client";

import { useRef } from "react";

import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import CustomEase from "gsap/dist/CustomEase";

import RollingText from "./RollingText";
import LogoSVG from "./LogoSVG";

import { ArrowRight } from "lucide-react";
import ScrambleText from "./ScrambleText";

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);

  const { contextSafe } = useGSAP(() => {
    gsap.registerPlugin(DrawSVGPlugin, CustomEase);

    gsap.from(navRef.current, { autoAlpha: 0 });

    gsap.from(logoPathRef.current, {
      scrollTrigger: {
        trigger: "#hero-header",
        start: "bottom top",
        toggleActions: "play none none reverse",
      },
      duration: 0.75,
      ease: "power4.inOut",
      drawSVG: 0,
    });
  }, {});

  const handleLogoMouseEnter = contextSafe(() => {
    gsap.to(logoRef.current, {
      duration: 0.5,
      ease: "power3.inOut",
      fill: "#2C2C2C",
      fillOpacity: 1,
    });
  });

  const handleLogoMouseLeave = contextSafe(() => {
    gsap.to(logoRef.current, {
      duration: 0.5,
      ease: "power3.inOut",
      fillOpacity: 0,
    });
  });

  return (
    <nav
      className="fixed max-w-[1580px] top-[20px] desktop:top-9 px-[20px] tablet:px-9 left-1/2 -translate-x-1/2 grid grid-cols-4 tablet:grid-cols-8 w-full z-50 invisible"
      ref={navRef}
    >
      {/* Logo */}

      <Link
        href="/"
        onMouseEnter={handleLogoMouseEnter}
        onMouseLeave={handleLogoMouseLeave}
      >
        <LogoSVG
          refs={[logoRef, logoPathRef]}
          strokeWidth={8}
          className="col-start-1 max-h-[32px] tablet:max-h-[48px] desktop:max-h-[64px]"
        />
      </Link>

      {/* CTA */}
      <div className="flex items-start justify-end self-start gap-x-2 cursor-pointer col-span-2 col-end-4 text-xs tablet:hidden fade-up-2">
        <ArrowRight width={18} height={18} strokeWidth={1} />
        <RollingText as="button" className="font-[BricolageGrotesqueBold]">
          let&apos;s talk
        </RollingText>
      </div>

      {/* Nav Links */}
      <div className="hidden tablet:flex justify-end self-start gap-x-11 col-span-3 col-end-7">
        <div className="flex items-center gap-x-6 fade-up-2">
          <span>01</span>
          <Link href="/work">
            <ScrambleText text="work" />
          </Link>
        </div>
        <div className="flex items-center gap-x-6 fade-up-2">
          <span>02</span>
          <Link href="/about">
            <ScrambleText text="about" />
          </Link>
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col items-end gap-y-[6px] self-start tablet:hidden col-end-5">
        <div className="w-6 h-[2px] rounded-full bg-black fill-width" />
        <div className="w-6 h-[2px] rounded-full bg-black fill-width" />
        <div className="w-6 h-[2px] rounded-full bg-black fill-width" />
      </div>

      <div className="hidden tablet:flex justify-end col-span-2 self-start col-end-9">
        <div className="flex items-center gap-x-6 cursor-pointer fade-up-2">
          <ArrowRight width={20} height={20} strokeWidth={1} />
          <Link href="/work">
            <ScrambleText text="let's talk" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
