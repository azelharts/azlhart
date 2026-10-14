"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP, SplitText, EASE } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { cn, drukWide } from "@/lib/utils";
import { pad } from "@/lib/works";

import LogoSVG from "@/components/LogoSVG";
import ScrambleText from "@/components/ScrambleText";
import TransitionLink from "@/components/TransitionLink";

import HeroCanvas from "./HeroCanvas";

export interface HeroWork {
  slug: string;
  index: number;
  title: string;
}

/**
 * The logo-drawing intro is the site's opening, not something to sit through
 * on every visit to the index: once it has played in this tab, coming back
 * shows the hero in its finished state straight away.
 */
let introPlayed = false;

/**
 * The header line waits for the logo like the rest of the copy, but starts
 * at opacity 0.001 rather than 0. That is invisible, yet still counts as the
 * page's largest contentful paint: Chrome skips only opacity-0 elements, and
 * with everything at 0 the index reported no LCP at all.
 */
const META_START = { opacity: 0.001 };

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

const HeroSection = ({
  works,
  total,
}: {
  works: HeroWork[];
  total: number;
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const logoPathRef = useRef<SVGPathElement>(null);
  const slideUpTextRefs = useRef<HTMLElement[]>([]);

  const fontsReady = useFontsReady();

  const [hoveredWork, setHoveredWork] = useState<string | null>(null);

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
      // too (#navbar, .fade-up-2), and those live outside
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

          // Reduced motion, or a return visit: show the finished state and
          // skip the choreography. The navbar is `invisible` in CSS and
          // revealed by the timeline below, so it has to be switched on here.
          if (reduced || introPlayed) {
            gsap.set([...copy, "#navbar", ".fade-up-2"], { autoAlpha: 1 });
            gsap.set(".hero-meta", { opacity: 1 });
            gsap.set(mediaRef.current, { opacity: 1 });
            gsap.set(logoRef.current, endGeometry);
            return;
          }
          introPlayed = true;

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
          tl.from("#navbar", { autoAlpha: 0 })
            .from(logoPathRef.current, {
              drawSVG: 0,
              duration: 3.75,
              ease: "power3.inOut",
            })
            .to(logoRef.current, { duration: 1.5, ...endGeometry })
            .fromTo(
              mediaRef.current,
              { opacity: 0 },
              { duration: 1.5, opacity: 1 },
              "<",
            )
            .fromTo(
              ".hero-meta",
              { y: "35%", opacity: 0.001 },
              { y: 0, opacity: 1, stagger: 0.075, ease: "power2.inOut" },
              "-=1",
            )
            .from(
              ".fade-up",
              { y: "35%", opacity: 0, stagger: 0.075, ease: "power2.inOut" },
              "<",
            )
            .from(
              ".fade-up-2",
              { y: "35%", opacity: 0, stagger: 0.075, ease: "power2.inOut" },
              "-=0.75",
            )
            .from(headingSplit.lines, { y: "100%", stagger: 0.075 }, "-=0.75");

          return () => headingSplit.revert();
        },
      );
    },
    { dependencies: [fontsReady], revertOnUpdate: true },
  );

  return (
    <section
      // Not \`invisible\`: a hidden section leaves the page with no paint that
      // counts as its largest contentful paint. It still opens on black,
      // because the media and every line of copy start transparent.
      className="relative flex h-[100svh] flex-col overflow-clip"
      ref={heroRef}
    >
      <div ref={mediaRef} className="absolute inset-0 opacity-0">
        <HeroCanvas highlight={hoveredWork !== null} />
        {/* Scrims under the header and the bottom copy, so text stays legible
            over bright patches of the metal. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* The wordmark lives in the footer now; the page still needs an h1. */}
      <h1 className="sr-only">azlhart, studio of Mario Daruranto</h1>

      {/* Container */}
      <div className="max-w-container px-container relative z-10 mx-auto h-full w-full">
        <div className="custom-grid h-full gap-y-8">
          {/* Header */}
          {/* On phones the navbar shares the top row, so the header starts below it. */}
          <header className="p-responsive tablet:mt-0 relative z-20 col-span-full mt-12">
            <div
              className="desktop:flex-row flex flex-col gap-x-11 gap-y-4"
              id="hero-header"
            >
              <p className="hero-meta" style={META_START}>
                Studio of Mario Daruranto
              </p>
              <div
                className="hero-meta flex flex-col gap-y-2"
                style={META_START}
              >
                <span>Designer</span>
                <span>Developer</span>
              </div>
              <div
                className="hero-meta flex flex-col gap-y-2"
                style={META_START}
              >
                <p>Kupang, East Nusa Tenggara</p>
                <a href="mailto:mariodaruranto68@gmail.com">
                  <ScrambleText text="mariodaruranto68@gmail.com" />
                </a>
              </div>
            </div>
          </header>

          <h2
            ref={addToSlideupTextRefs}
            className={`hero-sub-heading tablet:col-start-4 desktop:col-start-7 tablet:-translate-y-20 desktop:translate-y-40 tablet:col-span-5 desktop:col-span-6 z-10 col-span-4 ${drukWide.className}`}
          >
            “Turning brand <br />
            into tab everyone <br />
            keeps open”
          </h2>

          <div className="tablet:gap-y-8 z-10 col-span-full flex flex-col items-end justify-end gap-y-4">
            <div className="tablet:grid-cols-8 desktop:grid-cols-12 tablet:text-lg tablet:mb-[9.5rem] desktop:mb-[16rem] mb-16 grid w-full grid-cols-4 items-end gap-y-6">
              {/* Selected works, bottom left: the hero is the whole landing
                  page, so this is its way further in. */}
              <nav
                aria-label="Selected works"
                className="fade-up p-responsive tablet:col-span-3 tablet:row-start-1 col-span-full flex flex-col gap-y-3"
                onMouseLeave={() => setHoveredWork(null)}
              >
                <span className="text-white/50">
                  SELECTED WORKS ({pad(total)})
                </span>
                <ol className="flex flex-col border-t border-white/20">
                  {works.map((w, i) => (
                    <li
                      key={w.slug}
                      className={cn(
                        "border-b border-white/20",
                        i >= 4 && "tablet:block hidden",
                      )}
                    >
                      <TransitionLink
                        href={`/works/${w.slug}`}
                        onMouseEnter={() => setHoveredWork(w.slug)}
                        onFocus={() => setHoveredWork(w.slug)}
                        onBlur={() => setHoveredWork(null)}
                        className={cn(
                          "flex items-baseline gap-x-4 py-2 font-normal transition-opacity duration-300",
                          hoveredWork && hoveredWork !== w.slug && "opacity-40",
                        )}
                      >
                        <span className="text-white/40">
                          <ScrambleText
                            text={pad(w.index)}
                            active={hoveredWork === w.slug}
                            className="font-normal"
                          />
                        </span>
                        {/* Clipped rather than ellipsised: the scramble needs
                            the title as one unbroken line. */}
                        <span className="min-w-0 overflow-hidden">
                          <ScrambleText
                            text={w.title}
                            active={hoveredWork === w.slug}
                            className="font-normal"
                          />
                        </span>
                      </TransitionLink>
                    </li>
                  ))}
                </ol>
                <TransitionLink href="/works" className="w-fit">
                  <ScrambleText text="view all works →" />
                </TransitionLink>
              </nav>
            </div>
          </div>
        </div>

        <LogoSVG
          refs={[logoRef, logoPathRef]}
          className="opacity-50"
          interactive
        />
      </div>
    </section>
  );
};

export default HeroSection;
