"use client";

import { useMemo, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { revealInstantly, revealLines } from "@/lib/animations";
import { cn, drukWide } from "@/lib/utils";
import { pad, type Work } from "@/lib/works";

import Header from "@/components/Header";
import ScrambleText from "@/components/ScrambleText";
import TransitionLink from "@/components/TransitionLink";

const ALL = "All";

const WorksIndex = ({ works }: { works: Work[] }) => {
  const indexRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const filtering = useRef(false);

  const [filter, setFilter] = useState(ALL);
  const [hovered, setHovered] = useState<string | null>(null);

  const fontsReady = useFontsReady();

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of works)
      counts.set(w.context, (counts.get(w.context) ?? 0) + 1);
    return [{ label: ALL, count: works.length }].concat(
      [...counts].map(([label, count]) => ({ label, count })),
    );
  }, [works]);

  const shown = works.filter((w) => filter === ALL || w.context === filter);

  // Intro: heading lines, then the rows stagger in.
  useGSAP(
    () => {
      if (!fontsReady) return;

      const mm = gsap.matchMedia(indexRef);

      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([".work-row", ".works-intro", ".works-filter"]),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealLines(headingRef.current);
        gsap.from([".works-intro", ".works-filter"], {
          autoAlpha: 0,
          y: 16,
          duration: 0.75,
          stagger: 0.1,
          delay: 0.3,
        });
        gsap.from(".work-row", {
          autoAlpha: 0,
          yPercent: 30,
          duration: 0.8,
          stagger: 0.06,
          delay: 0.45,
        });
      });
    },
    { dependencies: [fontsReady], scope: indexRef, revertOnUpdate: true },
  );

  // Filtering is a crossfade: the old list fades out completely, the list
  // swaps, then the new rows come in. (A Flip of rows changing position
  // briefly drew entering rows at the top of the list before they settled.)
  useGSAP(
    () => {
      if (!filtering.current) return;
      filtering.current = false;
      gsap.fromTo(
        ".work-row",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [filter], scope: listRef },
  );

  const { contextSafe: filterSafe } = useGSAP({ scope: listRef });

  const choose = filterSafe((label: string) => {
    if (label === filter || filtering.current) return;
    filtering.current = true;
    gsap.to(".work-row", {
      autoAlpha: 0,
      y: -8,
      duration: 0.25,
      stagger: 0.02,
      ease: "power2.in",
      onComplete: () => setFilter(label),
    });
  });

  return (
    <section
      ref={indexRef}
      className="max-w-container px-container mx-auto w-full"
    >
      {/* Top padding lives on an inner wrapper: .px-container sets its own
          vertical padding, and as unlayered CSS it beats any pt-* utility. */}
      <div className="desktop:pt-48 tablet:pt-40 flex flex-col gap-y-16 pt-32">
        <Header
          headline="selected-works"
          number={3}
          subText={`${works.length} write-ups`}
        />

        <div className="custom-grid gap-y-10">
          <div className="tablet:col-span-6 desktop:col-span-8 col-span-full flex items-start gap-x-4">
            <h1
              ref={headingRef}
              className={`tablet:text-8xl desktop:text-[7.5rem] text-[2.5rem] !leading-[90%] uppercase ${drukWide.className}`}
            >
              Selected works
            </h1>
            <span className="works-intro tablet:text-2xl desktop:text-3xl text-lg font-bold text-white/50">
              ({pad(works.length)})
            </span>
          </div>
          <p className="works-intro tablet:col-span-4 tablet:col-start-5 desktop:col-span-4 desktop:col-start-9 tablet:text-lg col-span-full self-end text-base !leading-[150%] font-light text-white/70">
            Features I&apos;ve built for production products, written up the way
            I&apos;d explain them to another engineer: the problem, the
            constraints, and the decisions behind the code. Client and employer
            names are left out on purpose.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter by product"
          className="works-filter p-responsive flex flex-wrap gap-2"
        >
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              aria-pressed={filter === f.label}
              onClick={() => choose(f.label)}
              className={cn(
                "rounded-full border px-4 py-2 font-normal transition-colors duration-300",
                filter === f.label
                  ? "border-accent bg-accent text-black"
                  : "border-white/25 text-white/70 hover:border-white hover:text-white",
              )}
            >
              <ScrambleText text={f.label} className="font-normal" />
              <span className="ml-2 opacity-90">{pad(f.count)}</span>
            </button>
          ))}
        </div>

        {/* Hovering one row dims the rest, so the list reads as an index.
            Only single-line labels scramble: a wrapped title would reflow. */}
        <ol
          ref={listRef}
          className="group/list flex flex-col border-t border-white/25"
          onMouseLeave={() => setHovered(null)}
        >
          {shown.map((work) => {
            const active = hovered === work.slug;
            return (
              <li
                key={work.slug}
                // GSAP animates the row itself; the hover dim lives on the
                // link inside, so a CSS opacity transition never fights it.
                className="work-row"
              >
                <TransitionLink
                  href={`/works/${work.slug}`}
                  onMouseEnter={() => setHovered(work.slug)}
                  onFocus={() => setHovered(work.slug)}
                  onBlur={() => setHovered(null)}
                  className="custom-grid gap-y-4 border-b border-white/25 py-8 font-normal transition-opacity duration-500 group-hover/list:opacity-40 hover:!opacity-100"
                >
                  <span className="article-label col-span-1 pt-1">
                    &#91;
                    <ScrambleText
                      text={pad(work.index)}
                      active={active}
                      className="font-light"
                    />
                    &#93;
                  </span>
                  <span className="tablet:col-span-5 desktop:col-span-7 col-span-3 flex flex-col gap-y-4">
                    <span
                      className={`tablet:text-3xl desktop:text-4xl text-xl !leading-[115%] uppercase ${drukWide.className}`}
                    >
                      {work.title}
                    </span>
                    <span className="p-responsive desktop:max-w-[60ch] !leading-[150%] text-white/60">
                      {work.summary}
                    </span>
                  </span>
                  <span className="article-label tablet:col-span-2 desktop:col-span-4 tablet:col-start-7 desktop:col-start-9 tablet:items-end tablet:text-right col-span-3 col-start-2 flex flex-col gap-y-2">
                    <span className="text-white">
                      <ScrambleText
                        text={work.context}
                        active={active}
                        className="font-normal"
                      />
                    </span>
                    <span>{work.stack.slice(0, 3).join(" · ")}</span>
                    <span>
                      {work.year} / {work.readingTime}
                    </span>
                  </span>
                </TransitionLink>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default WorksIndex;
