"use client";

import { useRef } from "react";

import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/dist/CustomEase";

import { drukWide, getInitialLogoDimensions } from "@/lib/utils";

import LogoSVG from "@/components/LogoSVG";
import ScrambleText from "@/components/ScrambleText";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const slideUpTextRefs = useRef<HTMLElement[]>([]);

  const addToSlideupTextRefs = (element: HTMLElement | null) => {
    if (element && !slideUpTextRefs.current.includes(element)) {
      slideUpTextRefs.current.push(element);
    }
  };

  useGSAP(() => {
    gsap.registerPlugin(DrawSVGPlugin, SplitText, ScrollTrigger);

    document.fonts.ready.then(() => {
      const {
        width: initialWidth,
        height: initialHeight,
        widthAfter,
        heightAfter,
        bottom,
        x,
      } = getInitialLogoDimensions();

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
          ScrollTrigger.create({
            trigger: "#sticktop",
            pin: true,
            start: "top top",
            end: "bottom bottom",
            endTrigger: "#end-trigger",
            toggleActions: "play pause reverse pause",
          });
        },
      });

      tl.from(heroRef.current, { autoAlpha: 0 })
        .from("#navbar", { autoAlpha: 0 })
        .from(logoPathRef.current, {
          drawSVG: 0,
          duration: 3.75,
          ease: "power3.inOut",
        })
        .to(logoRef.current, {
          duration: 1.5,
          width: widthAfter ? widthAfter : 650,
          height: heightAfter ? heightAfter : 350,
          translateX: x,
          yPercent: 0,
          bottom: bottom,
        })
        .from(
          heroVideoRef.current,
          {
            duration: 1.5,
            opacity: 0,
            onStart: () => {
              heroVideoRef.current?.play();
            },
          },
          "<",
        )
        .from(
          ".fade-up",
          {
            y: "35%",
            opacity: 0,
            stagger: 0.075,
            ease: "power2.inOut",
          },
          "-=1",
        )
        .from(
          ".fade-up-2",
          {
            y: "35%",
            opacity: 0,
            stagger: 0.075,
            ease: "power2.inOut",
          },
          "-=0.75",
        )
        .from(".fill-width", {
          width: 0,
          stagger: { amount: 0.075 },
        })
        .from(
          headingSplit.lines,
          {
            y: "100%",
            stagger: 0.075,
          },
          "-=1",
        );
    });
  }, {});

  return (
    <section
      className="invisible relative flex h-[100svh] flex-col overflow-clip"
      ref={heroRef}
    >
      {/* Container */}
      <div className="max-w-container px-container desktop:!pb-0 relative z-10 mx-auto h-full w-full">
        <div className="custom-grid h-full gap-y-8">
          {/* Header */}
          <header className="p-responsive relative z-20 col-span-full">
            <div
              className="desktop:flex-row flex flex-col gap-x-11 gap-y-4"
              id="hero-header"
            >
              <p className="fade-up">Studio of Mario Daruranto</p>
              <div className="fade-up flex flex-col gap-y-2">
                <span>Designer</span>
                <span>Developer</span>
              </div>
              <div className="fade-up flex flex-col gap-y-2">
                <p>Kupang, East Nusa Tenggara</p>
                <Link href="mailto:hello@azlhart.com">
                  <ScrambleText text="hello@azlhart.com"></ScrambleText>
                </Link>
              </div>
            </div>
          </header>

          <h2
            ref={addToSlideupTextRefs}
            className={`hero-sub-heading tablet:col-start-4 desktop:col-start-7 tablet:-translate-y-20 desktop:-translate-y-0 tablet:col-span-5 z-10 col-span-4 ${drukWide.className}`}
          >
            “Turning brand <br />
            into tab everyone <br />
            keeps open”
          </h2>

          <div className="tablet:gap-y-8 z-10 col-span-full flex flex-col items-end justify-end gap-y-4">
            <div className="tablet:grid-cols-8 desktop:grid-cols-12 tablet:text-lg grid w-full grid-cols-4">
              <div className="tablet:gap-x-7 tablet:text-lg desktop:text-xl tablet:col-span-4 tablet:col-end-8 col-span-3 col-end-5 flex justify-end gap-x-3 text-base">
                <span ref={addToSlideupTextRefs}>Independent</span>
                <span ref={addToSlideupTextRefs}>Creative</span>
                <span ref={addToSlideupTextRefs}>Studio</span>
              </div>
            </div>

            <h1
              ref={addToSlideupTextRefs}
              className={`h1-responsive cursor-default ${drukWide.className}`}
            >
              azlhart
            </h1>
          </div>
        </div>

        <LogoSVG refs={[logoRef, logoPathRef]} className="opacity-50" />
      </div>

      <video
        ref={heroVideoRef}
        poster="/images/hero-thumbnail.png"
        className="absolute-center h-full w-full object-cover brightness-50"
        loop
        muted
        playsInline
      >
        <source src="/videos/hero-compressed.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default HeroSection;
