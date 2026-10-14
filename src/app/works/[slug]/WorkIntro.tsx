"use client";

import { useRef } from "react";

import { gsap, useGSAP, SplitText, EASE } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { revealInstantly } from "@/lib/animations";
import { drukWide } from "@/lib/utils";
import { pad, type Work } from "@/lib/works";

import Header from "@/components/Header";

/**
 * The article's opening: title and meta. This is the
 * only part of a work page that moves on load. The body stays still so it
 * reads like a page, not a reel.
 */
const WorkIntro = ({ work }: { work: Work }) => {
  const introRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      gsap.set(".intro-fade", { autoAlpha: 0 });
      gsap.set(titleRef.current, { autoAlpha: 0 });
      if (!fontsReady) return;

      const mm = gsap.matchMedia(introRef);

      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([".intro-fade", ".article-title"]),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(titleRef.current, {
          type: "lines",
          mask: "lines",
        });

        gsap.set(titleRef.current, { autoAlpha: 1 });

        gsap
          .timeline({ defaults: { ease: EASE } })
          .from(split.lines, { yPercent: 100, duration: 1.1, stagger: 0.075 })
          .to(
            ".intro-fade",
            { autoAlpha: 1, duration: 0.75, stagger: 0.05 },
            "-=0.6",
          );

        return () => split.revert();
      });
    },
    { dependencies: [fontsReady], scope: introRef, revertOnUpdate: true },
  );

  return (
    <header
      ref={introRef}
      className="desktop:pt-48 tablet:pt-40 flex flex-col gap-y-14 pt-32"
    >
      <div className="intro-fade">
        <Header
          headline={`work-${pad(work.index)}`}
          number={work.index}
          subText={work.readingTime}
        />
      </div>

      <div className="custom-grid gap-y-10">
        <h1
          ref={titleRef}
          className={`article-title tablet:text-5xl desktop:text-7xl desktop:col-span-10 col-span-full text-[2rem] !leading-[110%] uppercase ${drukWide.className}`}
        >
          {work.title}
        </h1>

        <p className="intro-fade tablet:col-span-6 desktop:col-span-6 desktop:col-start-4 tablet:text-2xl desktop:text-[1.75rem] col-span-full text-xl !leading-[140%] font-light">
          {work.summary}
        </p>

        {/* "In short": the ten-second version for a reader who skims. */}
        {work.highlights && (
          <ol className="intro-fade tablet:col-span-6 desktop:col-span-9 desktop:col-start-4 tablet:grid-cols-3 col-span-full grid gap-px border border-white/15 bg-white/15">
            {work.highlights.map((h, i) => (
              <li
                key={h}
                className="flex flex-col gap-y-4 bg-[var(--background)] p-5"
              >
                <span className="article-label">
                  &#91;{["PROBLEM", "APPROACH", "OUTCOME"][i] ?? pad(i + 1)}
                  &#93;
                </span>
                <p className="text-sm !leading-[155%] text-white/85">{h}</p>
              </li>
            ))}
          </ol>
        )}

        <dl className="tablet:grid-cols-4 desktop:col-span-9 desktop:col-start-4 col-span-full grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/25 pt-6">
          <div className="intro-fade flex flex-col gap-y-3">
            <dt className="article-label">CONTEXT</dt>
            <dd className="p-responsive !leading-[150%]">{work.context}</dd>
          </div>
          <div className="intro-fade flex flex-col gap-y-3">
            <dt className="article-label">ROLE</dt>
            <dd className="p-responsive !leading-[150%]">{work.role}</dd>
          </div>
          <div className="intro-fade flex flex-col gap-y-3">
            <dt className="article-label">YEAR</dt>
            <dd className="p-responsive !leading-[150%]">{work.year}</dd>
          </div>
          <div className="intro-fade flex flex-col gap-y-3">
            <dt className="article-label">AUTHOR</dt>
            <dd className="p-responsive !leading-[150%]">Mario Daruranto</dd>
          </div>
          <div className="intro-fade col-span-full flex flex-col gap-y-3">
            <dt className="article-label">STACK</dt>
            <dd className="flex flex-wrap gap-2">
              {work.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/25 px-3 py-1.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
};

export default WorkIntro;
