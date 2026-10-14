"use client";

import { useRef } from "react";

import Link from "next/link";

import { gsap, useGSAP, SplitText, EASE } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { drukWide } from "@/lib/utils";

import LogoSVG from "@/components/LogoSVG";
import ScrambleText from "@/components/ScrambleText";

/**
 * Logo start/end geometry per breakpoint. Driven through gsap.matchMedia() so
 * crossing a breakpoint reverts the old timeline and rebuilds it — the previous
 * one-shot `window.innerWidth` read left the logo stuck at the wrong size after
 * any resize.
 */
const LOGO_SIZES = {
  desktop: { width: 235, height: 126, widthAfter: 1700, heightAfter: 915 },
  tablet: { width: 186, height: 100, widthAfter: 940, heightAfter: 505 },
  mobile: { width: 128, height: 70, widthAfter: 650, heightAfter: 350 },
} as const;

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const slideUpTextRefs = useRef<HTMLElement[]>([]);

  const fontsReady = useFontsReady();

  const addToSlideupTextRefs = (element: HTMLElement | null) => {
    if (element && !slideUpTextRefs.current.includes(element)) {
      slideUpTextRefs.current.push(element);
    }
  };

  useGSAP(
    () => {
      // Runs in useLayoutEffect, so the copy is hidden before the browser
      // paints — the `.from()` steps below would otherwise flash it at full
      // opacity for a frame between hydration and the timeline being built.
      const copy = [".fade-up", ...slideUpTextRefs.current];
      gsap.set(copy, { autoAlpha: 0 });
      gsap.set(logoRef.current, { autoAlpha: 0 });

      // SplitText needs real glyph metrics, so the reveal waits on webfonts.
      // Returning early keeps everything inside the context for cleanup.
      if (!fontsReady) return;

      // Deliberately unscoped. The intro timeline below sequences the navbar
      // too (#navbar, .fade-up-2, .fill-width), and those live outside
      // heroRef — scoping this to the hero silently stops them resolving, so
      // the navbar never gets revealed. None of these selectors collide with
      // anything else on the page.
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1256px)",
          isTablet: "(min-width: 834px) and (max-width: 1255px)",
          isMobile: "(max-width: 833px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isTablet, reduced } = context.conditions as Record<
            string,
            boolean
          >;

          const size = isDesktop
            ? LOGO_SIZES.desktop
            : isTablet
              ? LOGO_SIZES.tablet
              : LOGO_SIZES.mobile;

          const endGeometry = {
            width: size.widthAfter,
            height: size.heightAfter,
            translateX: isDesktop ? 96 : isTablet ? 64 : 32,
            yPercent: 0,
            bottom: isDesktop || isTablet ? "-12.5%" : "10%",
          };

          gsap.set(logoRef.current, {
            autoAlpha: 1,
            position: "absolute",
            left: "50%",
            bottom: "40%",
            xPercent: -50,
            yPercent: -50,
            width: size.width,
            height: size.height,
          });

          // Reduced motion: show the finished state, skip the choreography.
          // The navbar is `invisible` in CSS and revealed by the timeline
          // below, so it has to be switched on explicitly here.
          if (reduced) {
            gsap.set([...copy, "#navbar", ".fade-up-2"], { autoAlpha: 1 });
            gsap.set(heroRef.current, { autoAlpha: 1 });
            gsap.set(logoRef.current, endGeometry);
            return;
          }

          const headingSplit = SplitText.create(slideUpTextRefs.current, {
            type: "lines",
            mask: "lines",
          });

          gsap.set(copy, { autoAlpha: 1 });

          // Note: the previous onComplete here created a ScrollTrigger pinned
          // to "#sticktop" with endTrigger "#end-trigger". Neither element
          // exists anywhere in the app, so it pinned nothing and just added a
          // dead trigger to the refresh cycle on every load. Removed.
          const tl = gsap.timeline({
            defaults: { ease: EASE },
          });

          // The hero owns the whole intro, navbar included — the navbar's
          // items are meant to arrive late in this sequence, not on their own
          // clock.
          tl.from(heroRef.current, { autoAlpha: 0 })
            .from("#navbar", { autoAlpha: 0 })
            .from(logoPathRef.current, {
              drawSVG: 0,
              duration: 3.75,
              ease: "power3.inOut",
            })
            .to(logoRef.current, { duration: 1.5, ...endGeometry })
            .from(
              heroVideoRef.current,
              {
                duration: 1.5,
                opacity: 0,
                onStart: () => {
                  // Autoplay can be blocked by policy; the rejected promise is
                  // otherwise unhandled and surfaces as a console error.
                  heroVideoRef.current?.play().catch(() => {});
                },
              },
              "<",
            )
            .from(
              ".fade-up",
              { y: "35%", opacity: 0, stagger: 0.075, ease: "power2.inOut" },
              "-=1",
            )
            .from(
              ".fade-up-2",
              { y: "35%", opacity: 0, stagger: 0.075, ease: "power2.inOut" },
              "-=0.75",
            )
            .from(".fill-width", { width: 0, stagger: { amount: 0.075 } })
            .from(headingSplit.lines, { y: "100%", stagger: 0.075 }, "-=1");

          return () => headingSplit.revert();
        },
      );
    },
    { dependencies: [fontsReady], revertOnUpdate: true },
  );

  return (
    <section
      // Starts hidden so the page opens on flat black. The intro timeline
      // fades the section in, and the video fades in later on its own step —
      // the poster must not be on screen before then.
      className="invisible relative flex h-[100svh] flex-col overflow-clip"
      ref={heroRef}
    >
      <video
        ref={heroVideoRef}
        poster="/images/hero-thumbnail.webp"
        // metadata, not none: the timeline calls play() ~4s in, and preload
        //="none" makes that first frame arrive visibly late.
        preload="metadata"
        className="absolute-center h-full w-full object-cover brightness-50"
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/videos/hero-compressed.mp4" type="video/mp4" />
      </video>

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
                  <ScrambleText text="hello@azlhart.com" />
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
    </section>
  );
};

export default HeroSection;
