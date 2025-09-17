"use client";

import { useRef } from "react";

import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/dist/CustomEase";

import { getInitialDimensions } from "@/lib/utils";

import LogoSVG from "@/components/LogoSVG";
import ScrambleText from "@/components/ScrambleText";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const slideUpTextRefs = useRef<HTMLElement[]>([]);

  const addToSlideupTextRefs = (element: HTMLElement | null) => {
    if (element && !slideUpTextRefs.current.includes(element)) {
      slideUpTextRefs.current.push(element);
    }
  };

  useGSAP(() => {
    gsap.registerPlugin(DrawSVGPlugin, SplitText);

    document.fonts.ready.then(() => {
      const {
        width: initialWidth,
        height: initialHeight,
        widthAfter,
        heightAfter,
        bottom,
        x,
      } = getInitialDimensions();

      const headingSplit = SplitText.create(slideUpTextRefs.current, {
        type: "lines",
        mask: "lines",
      });

      gsap.set(logoRef.current, {
        position: "absolute",
        left: "50%",
        bottom: "40%",
        xPercent: -50,
        yPercent: -50,
        width: initialWidth,
        height: initialHeight,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        },
        onComplete: () => {
          document.querySelector(".sub-sections")?.classList.remove("hidden");
          document.querySelector(".sub-sections")?.classList.add("flex");
        },
      });

      tl.from(heroRef.current, { autoAlpha: 0 })
        .from(logoPathRef.current, {
          drawSVG: 0,
          duration: 3.75,
          ease: "power3.inOut",
        })
        .to(logoRef.current, {
          duration: 1.5,
          fill: "FFF",
          width: widthAfter ? widthAfter : 650,
          height: heightAfter ? heightAfter : 350,
          translateX: x,
          yPercent: 0,
          bottom: bottom,
        })
        .from(
          ".fade-up",
          {
            y: "35%",
            opacity: 0,
            stagger: 0.075,
            ease: "power2.inOut",
          },
          "-=1"
        )
        .from(".fill-width", {
          width: 0,
          stagger: { amount: 0.075 },
        })
        .from(
          ".fade-up-2",
          {
            y: "35%",
            opacity: 0,
            stagger: 0.075,
            ease: "power2.inOut",
          },
          "-=1.5"
        )
        .from(
          headingSplit.lines,
          {
            y: "100%",
            stagger: 0.075,
          },
          "-=1"
        );
    });
  }, {});

  return (
    <section className="h-[100svh] flex flex-col invisible" ref={heroRef}>
      {/* Container */}
      <div className="max-w-container relative h-full p-container w-full mx-auto">
        <div className="custom-grid gap-y-8 h-full">
          {/* Header */}
          <header className="relative text-xs tablet:text-base col-span-full z-20">
            <div
              className="flex flex-col desktop:flex-row gap-y-4 gap-x-11"
              id="hero-header"
            >
              <p className="fade-up">Studio of Mario Daruranto</p>
              <div className="flex flex-col gap-y-1 fade-up">
                <span>Designer</span>
                <span>Developer</span>
              </div>
              <div className="flex flex-col gap-y-1 fade-up">
                <p>Kupang, East Nusa Tenggara</p>
                <Link href="mailto:hello@azlhart.com">
                  <ScrambleText text="hello@azlhart.com"></ScrambleText>
                </Link>
              </div>
            </div>
          </header>

          <h2
            ref={addToSlideupTextRefs}
            className="hero-sub-heading col-span-full tablet:col-start-4 desktop:col-start-7 z-10 tablet:-translate-y-20 desktop:-translate-y-0"
            data-lag="0.15"
          >
            “Turning brand <br />
            into tab everyone <br />
            keeps open”
          </h2>

          <div className="flex flex-col items-end gap-y-4 tablet:gap-y-8 justify-end col-span-full z-10">
            <div className="grid grid-cols-4 tablet:grid-cols-8 desktop:grid-cols-12 w-full tablet:text-lg">
              <div className="flex justify-end gap-x-3 tablet:gap-x-7 tablet:text-lg desktop:text-xl col-span-3 tablet:col-span-4 col-end-5 tablet:col-end-8">
                <span ref={addToSlideupTextRefs} data-lag="0.2">
                  Independent
                </span>
                <span ref={addToSlideupTextRefs} data-lag="0.25">
                  Creative
                </span>
                <span ref={addToSlideupTextRefs} data-lag="0.3">
                  Studio
                </span>
              </div>
            </div>

            <h1
              ref={addToSlideupTextRefs}
              className="text-7xl tablet:text-[9rem] desktop:text-[16rem] font-[DrukWide] cursor-default"
              data-lag="0.45"
            >
              azlhart
            </h1>
          </div>
        </div>

        <LogoSVG refs={[logoRef, logoPathRef]} />
      </div>
    </section>
  );
};

export default HeroSection;
