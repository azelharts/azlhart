"use client";

import { useRef } from "react";

import Image from "next/image";

import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";

import { drukWide } from "@/lib/utils";

const PROCESSES = [
  {
    id: 1,
    number: "[01]",
    title: "DISCOVER",
    description:
      "We dive deep into your brand, goals, and audience to uncover insights that guide meaningful decisions. Every great solution starts with asking the right questions.",
    images: [
      { src: "/images/process-1-1.jpg", label: "curiosity" },
      { src: "/images/process-1-2.jpg", label: "insight" },
      { src: "/images/process-1-3.jpg", label: null },
    ],
  },
  {
    id: 2,
    number: "[02]",
    title: "DESIGN",
    description:
      "We craft elegant solutions that blend aesthetics with functionality. Our designs are purposeful, user-centered, and built to make an impact.",
    images: [
      { src: "/images/process-2-1.jpg", label: "creativity" },
      { src: "/images/process-2-2.jpg", label: "structure" },
      { src: "/images/process-2-3.jpg", label: null },
    ],
  },
  {
    id: 3,
    number: "[03]",
    title: "REVIEW",
    description:
      "We test, refine, and iterate. Feedback drives improvement, ensuring every detail aligns with your vision and exceeds expectations.",
    images: [
      { src: "/images/process-3-1.jpg", label: "focus" },
      { src: "/images/process-3-2.jpg", label: "refinement" },
      { src: "/images/process-3-3.jpg", label: null },
    ],
  },
  {
    id: 4,
    number: "[04]",
    title: "DELIVER",
    description:
      "We launch your project with confidence and provide ongoing support. Your success is our success, and we're here for the long haul.",
    images: [
      { src: "/images/process-4-1.jpg", label: "excellence" },
      { src: "/images/process-4-2.jpg", label: "growth" },
      { src: "/images/process-4-3.jpg", label: null },
    ],
  },
];

const PROGRESS_BARS = 20;

/** Timeline units: each step holds for STEP, and hands over across TRANSITION. */
const STEP = 1;
const TRANSITION = 0.75;
const TOTAL = PROCESSES.length * STEP;

/**
 * Height of the scroll runway behind the sticky panel — this is what gives the
 * section its scroll duration. Four steps over five viewports.
 */
const RUNWAY_VH = 500;

const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const SHOWN_CLIP = "inset(0% 0% 0% 0%)";

/**
 * Renders one image column; every step's image is stacked in place and wiped in
 * turn. Declared at module scope, not inside ProcessSection — a component
 * defined during render is a new type on every render, which would unmount and
 * refetch all twelve images.
 */
const ImageStack = ({
  slot,
  heightClass,
  sizes,
  labelClass,
}: {
  slot: number;
  heightClass: string;
  sizes: string;
  labelClass?: string;
}) => (
  <>
    <div className={`relative w-full ${heightClass}`}>
      {PROCESSES.map((process, idx) => (
        <Image
          key={process.id}
          src={process.images[slot].src}
          fill
          alt=""
          loading="lazy"
          sizes={sizes}
          className={`process_images_${idx} object-cover`}
          style={{ clipPath: idx === 0 ? SHOWN_CLIP : HIDDEN_CLIP }}
        />
      ))}
    </div>
    {labelClass !== undefined && (
      <div className="relative">
        {PROCESSES.map((process, idx) => (
          <span
            key={process.id}
            className={`process_images_label_${idx} absolute top-0 left-0 text-sm text-white capitalize ${labelClass} ${
              idx > 0 ? "opacity-0" : ""
            }`}
          >
            {process.images[slot].label}
          </span>
        ))}
      </div>
    )}
  </>
);

const ProcessSection = () => {
  const runwayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      // Hide every step but the first straight away — before the browser
      // paints, and before the fonts gate below. Otherwise all four titles and
      // numbers stack on top of each other until the webfonts resolve.
      PROCESSES.slice(1).forEach((p) => {
        gsap.set(`#process_number_${p.id}`, { autoAlpha: 0 });
        gsap.set(`#process_title_${p.id}`, { yPercent: 100 });
      });

      if (!fontsReady) return;

      // Scoped to this component: useGSAP's `scope` only covers selectors
      // resolved synchronously in its callback, and matchMedia handlers run
      // later — without this they'd resolve against the whole document.
      const mm = gsap.matchMedia(containerRef);

      // No pinning, no scrub — show the first step and let the section scroll
      // past normally. A 7-viewport pinned scroll-jack is precisely the kind of
      // thing prefers-reduced-motion exists to opt out of.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Collapse the runway too, otherwise it leaves five viewports of dead
        // scroll behind a panel that no longer animates.
        gsap.set(runwayRef.current, { height: "auto" });
        gsap.set(".process_images_0", { clipPath: SHOWN_CLIP });
        gsap.set("#process_number_1, #process_title_1", { autoAlpha: 1, y: 0 });
        gsap.set(".process_progress", { opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splits = PROCESSES.map((p) =>
          SplitText.create(`#process_description_${p.id}`, {
            type: "lines",
            mask: "lines",
          }),
        );

        // Explicit start state for every step but the first. Previously this
        // lived half in Tailwind classes and half in inline styles, which made
        // the timeline's reverse direction land on different values than the
        // forward one.
        splits.slice(1).forEach((s) => gsap.set(s.lines, { yPercent: 100 }));
        gsap.set(".process_images_0", { clipPath: SHOWN_CLIP });

        /**
         * Steps hand over as discrete animations fired when scroll crosses a
         * threshold — they play at their own speed rather than being scrubbed
         * by the scrollbar. Only the progress bars are tied to scroll position.
         */
        const step = (from: number, to: number) => {
          const dir = to > from ? 1 : -1;

          // Outgoing lines exit the way the user is travelling; incoming lines
          // arrive from the opposite edge.
          gsap.to(splits[from].lines, {
            yPercent: -100 * dir,
            stagger: 0.075,
            duration: TRANSITION,
          });
          gsap.to(splits[to].lines, {
            yPercent: 0,
            stagger: 0.075,
            duration: TRANSITION,
          });

          gsap.to(`#process_number_${PROCESSES[from].id}`, {
            autoAlpha: 0,
            duration: TRANSITION,
          });
          gsap.to(`#process_number_${PROCESSES[to].id}`, {
            autoAlpha: 1,
            duration: TRANSITION,
          });

          gsap.to(`#process_title_${PROCESSES[from].id}`, {
            yPercent: -100 * dir,
            duration: TRANSITION,
          });
          gsap.to(`#process_title_${PROCESSES[to].id}`, {
            yPercent: 0,
            duration: TRANSITION,
          });

          gsap.to(`.process_images_${from}`, {
            clipPath: HIDDEN_CLIP,
            duration: TRANSITION,
          });
          gsap.to(`.process_images_${to}`, {
            clipPath: SHOWN_CLIP,
            stagger: 0.075,
            duration: TRANSITION,
          });

          gsap.to(`.process_images_label_${from}`, {
            autoAlpha: 0,
            duration: TRANSITION,
          });
          gsap.to(`.process_images_label_${to}`, {
            autoAlpha: 1,
            duration: TRANSITION,
          });
        };

        let active = 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            // The runway <div> supplies the scroll distance and the panel is
            // pinned inside it with pinSpacing off.
            //
            // ScrollTrigger's automatic pin spacing does not work in this app —
            // it writes `padding: 0` onto its pin-spacer instead of reserving
            // the pinned distance, so everything below the section gets laid
            // out inside the pinned range. Before this fix the page hit maximum
            // scroll with the panel still stuck on step four and the FAQ,
            // frame and testimonial sections were unreachable. (The original
            // code papered over the same problem with a hand-written
            // `h-[800vh]` wrapper in page.tsx.) CSS `position: sticky` is not
            // an alternative here: it has no effect inside ScrollSmoother's
            // transformed #smooth-content, which blanks the panel entirely.
            trigger: runwayRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: containerRef.current,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Derive the active step from progress instead of tracking a
              // parallel array of booleans. Same thresholds, but a fast flick
              // that jumps two steps at once can't desync the state.
              const next = Math.min(
                PROCESSES.length - 1,
                Math.floor(self.progress / (1 / PROCESSES.length)),
              );

              if (next === active) return;
              step(active, next);
              active = next;
            },
          },
        });

        // Progress bars are the one thing tied to scroll position.
        tl.to(
          ".process_progress",
          {
            opacity: 1,
            duration: TOTAL / PROGRESS_BARS,
            stagger: { amount: TOTAL - TOTAL / PROGRESS_BARS },
          },
          0,
        );

        return () => splits.forEach((s) => s.revert());
      });
    },
    { dependencies: [fontsReady], scope: containerRef, revertOnUpdate: true },
  );

  return (
    <div ref={runwayRef} style={{ height: `${RUNWAY_VH}vh` }}>
      <section className="flex h-[100svh] flex-col" ref={containerRef}>
        {/* Container */}
        <div className="max-w-container px-container desktop:!pb-0 relative z-10 mx-auto h-full w-full">
          <div className="custom-grid desktop:grid-rows-[auto_auto_auto] h-full gap-x-4 gap-y-12 py-16">
            {/* Process Numbers */}
            <div className="tablet:col-start-3 desktop:col-start-5 tablet:h-[32px] desktop:h-[44px] relative col-start-1 h-[22px] self-center">
              {PROCESSES.map((process) => (
                <span
                  key={process.id}
                  id={`process_number_${process.id}`}
                  className="p-responsive absolute top-0 left-0 text-white/50"
                >
                  {process.number}
                </span>
              ))}
            </div>

            {/* Process Titles */}
            <div className="tablet:col-end-9 tablet:justify-self-start tablet:col-span-4 desktop:col-end-13 desktop:col-start-7 desktop:h-[44px] tablet:h-[32px] relative col-span-3 col-end-5 h-[22px] w-full self-center justify-self-end overflow-hidden">
              {PROCESSES.map((process) => (
                <h3
                  key={process.id}
                  id={`process_title_${process.id}`}
                  // No `translate-y-full` on the inactive steps: Tailwind writes
                  // the `translate` property, GSAP writes `transform`, and the
                  // two compose rather than override. Inactive titles ended up
                  // displaced 200%, and once GSAP moved the outgoing title to
                  // -100% Tailwind's +100% cancelled it straight back into
                  // view — so every step rendered the *previous* step's title.
                  // The start state is set in the effect above instead.
                  className={`h3-responsive tablet:left-0 absolute top-0 right-0 ${drukWide.className}`}
                >
                  {process.title}
                </h3>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="tablet:col-span-6 tablet:col-start-3 desktop:col-start-1 desktop:row-start-3 desktop:self-start col-span-4 flex justify-between">
              {Array.from({ length: PROGRESS_BARS }, (_, idx) => (
                <div
                  key={idx}
                  className="process_progress h-5 w-[2px] bg-white opacity-25"
                />
              ))}
            </div>

            {/* Image column 1 */}
            <div className="tablet:col-span-5 desktop:col-span-3 relative col-span-4 flex h-full flex-col gap-y-4">
              <ImageStack
                slot={0}
                heightClass="tablet:h-[300px] h-[160px]"
                sizes="(max-width: 833px) 100vw, (max-width: 1255px) 60vw, 25vw"
                labelClass="tablet:inline hidden"
              />
            </div>

            {/* Image column 2 — tablet and up */}
            <div className="tablet:flex relative col-span-3 hidden h-full flex-col gap-y-4">
              <ImageStack
                slot={1}
                heightClass="tablet:h-[300px] h-[160px]"
                sizes="(max-width: 1255px) 37vw, 25vw"
                labelClass=""
              />
            </div>

            {/* Image column 3 — desktop only */}
            <div className="desktop:flex desktop:col-span-6 relative col-span-3 hidden h-full flex-col gap-y-4">
              <ImageStack
                slot={2}
                heightClass="tablet:h-[300px] desktop:h-[400px] h-[160px]"
                sizes="50vw"
              />
            </div>

            <div className="desktop:col-start-7 tablet:col-span-7 desktop:col-span-6 relative col-span-4 h-full self-start">
              {PROCESSES.map((process) => (
                <p
                  key={process.id}
                  id={`process_description_${process.id}`}
                  className="p-service-responsive desktop:!text-2xl absolute top-0 left-0 !leading-[125%] text-white/50"
                >
                  {process.description}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProcessSection;
