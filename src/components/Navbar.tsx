"use client";

import { useRef } from "react";

import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import CustomEase from "gsap/dist/CustomEase";

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
      ease: "power3.inOut",
      fill: "#FFFFFF",
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
      className="fixed max-w-container top-[20px] desktop:top-9 px-[20px] tablet:px-9 left-1/2 -translate-x-1/2 custom-grid w-full z-50 invisible mix-blend-difference text-white"
      ref={navRef}
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
          strokeWidth={8}
          strokeColor="#FFFFFF"
          className="col-start-1 max-h-[32px] tablet:max-h-[48px] desktop:max-h-[64px]"
        />
      </Link>

      {/* CTA */}
      <div className="flex items-start justify-end self-start gap-x-2 cursor-pointer col-span-2 col-end-4 text-xs tablet:hidden fade-up-2">
        <ArrowRight width={18} height={18} strokeWidth={1} />
        <button>
          <ScrambleText text="let's talk" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="hidden tablet:flex justify-end self-start gap-x-11 col-span-3 col-end-8 desktop:col-start-9 desktop:col-end-auto">
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
        <div className="w-6 h-[2px] rounded-full bg-white fill-width" />
        <div className="w-6 h-[2px] rounded-full bg-white fill-width" />
        <div className="w-6 h-[2px] rounded-full bg-white fill-width" />
      </div>

      {/* CTA */}
      <div className="hidden tablet:flex justify-end col-span-2 self-start col-end-13">
        <div className="flex items-center gap-x-6 cursor-pointer fade-up-2">
          <ArrowRight width={20} height={20} strokeWidth={1} />
          <button>
            <ScrambleText text="let's talk" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
